-- 生成の受付（docs/TASKS.md T2-8）。
-- 二重クリック防止、同時実行は1社1件、本文生成の月の上限、全社の月額予算での停止をDBの中で判定する。
-- 判定と受付記録を1つの関数にまとめ、行ロックで順番に処理するため、同時に押されても上限を超えない。
-- 月の区切りは日本時間。

alter table public.generation_runs
  add column cost_yen numeric(10, 2) not null default 0 check (cost_yen >= 0);

-- 全社共通の設定（1行だけ）。利用者からは読み書きできない
create table public.app_settings (
  id boolean primary key default true check (id),
  monthly_budget_yen int not null default 10000 check (monthly_budget_yen >= 0),
  budget_notify_ratio numeric(3, 2) not null default 0.80 check (budget_notify_ratio > 0 and budget_notify_ratio <= 1),
  budget_notified_month date,
  article_body_limit int not null default 10 check (article_body_limit >= 0),
  generation_timeout_seconds int not null default 600 check (generation_timeout_seconds > 0),
  updated_at timestamptz not null default now()
);
insert into public.app_settings default values;
alter table public.app_settings enable row level security;
revoke all on public.app_settings from authenticated;

-- 日本時間で今月1日0時
create or replace function app.month_start() returns timestamptz
language sql stable as $$
  select date_trunc('month', now() at time zone 'Asia/Tokyo') at time zone 'Asia/Tokyo';
$$;

-- 生成を受け付ける。画面からの依頼を受けたサーバーが、利用者のセッションで呼ぶ。
-- 失敗は例外で返し、メッセージをエラーコードにする：
--   forbidden / invalid_input / busy（同じ会社で実行中）/ limit_reached / budget_exceeded
create or replace function public.start_generation(
  p_article_id uuid,
  p_kind text,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  a public.articles;
  s public.app_settings;
  run public.generation_runs;
  org_limit int;
  used int;
  spent numeric;
begin
  select * into a from articles where id = p_article_id;
  if not found or coalesce(app.role_in(a.organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('outline', 'body', 'rewrite', 'followup_questions')
     or coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- 全社の受付を順番に処理する
  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    if run.article_id <> p_article_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  -- 応答が無いまま時間が過ぎた受付は失敗にする（入力は記事側に残っている）
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = a.organization_id and status in ('queued', 'running')
    and created_at < now() - make_interval(secs => s.generation_timeout_seconds);

  if exists (select 1 from generation_runs
             where organization_id = a.organization_id and status in ('queued', 'running')) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 上限に数えるのは本文の生成だけ。失敗した回は数えない
  if p_kind = 'body' then
    select monthly_generation_limit into org_limit from organizations where id = a.organization_id;
    select count(*) into used from generation_runs
    where organization_id = a.organization_id and kind = 'body' and status <> 'failed'
      and created_at >= app.month_start();
    if used >= org_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'body' and status <> 'failed';
    if used >= s.article_body_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (a.organization_id, p_article_id, p_kind, p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;

-- 生成の結果を記録する。サーバー（service role）だけが呼ぶ。
-- 時間切れで失敗にした後に結果が届いた場合も、費用だけは足す（実際に払っているため）
create or replace function public.finish_generation(
  p_run_id uuid,
  p_status text,
  p_usage jsonb default '{}',
  p_cost_yen numeric default 0,
  p_error_code text default null,
  p_result_version_id uuid default null
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  run public.generation_runs;
begin
  if p_status not in ('running', 'succeeded', 'failed') then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;
  select * into run from generation_runs where id = p_run_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if run.status in ('succeeded', 'failed') or (run.status = 'running' and p_status = 'running') then
    update generation_runs set cost_yen = cost_yen + coalesce(p_cost_yen, 0)
    where id = p_run_id returning * into run;
    return run;
  end if;
  update generation_runs set
    status = p_status,
    usage = coalesce(p_usage, '{}'),
    cost_yen = cost_yen + coalesce(p_cost_yen, 0),
    error_code = case when p_status = 'failed' then coalesce(p_error_code, 'provider_error') end,
    result_version_id = case when p_status = 'succeeded' then p_result_version_id end,
    finished_at = case when p_status = 'running' then null else now() end
  where id = p_run_id returning * into run;
  return run;
end;
$$;

-- 今月の予算の使用状況。should_notify は通知の割合を超え、今月まだ通知していないとき true。
-- 通知を送ったら mark_budget_notified() を呼ぶ。サーバー（service role）だけが呼ぶ
create or replace function public.budget_status()
returns table (spent_yen numeric, budget_yen int, ratio numeric, should_notify boolean, stopped boolean)
language sql stable security definer set search_path = public as $$
  select x.spent, s.monthly_budget_yen,
    case when s.monthly_budget_yen = 0 then 1 else round(x.spent / s.monthly_budget_yen, 4) end,
    x.spent >= s.monthly_budget_yen * s.budget_notify_ratio
      and s.budget_notified_month is distinct from (app.month_start() at time zone 'Asia/Tokyo')::date,
    x.spent >= s.monthly_budget_yen
  from app_settings s,
    (select coalesce(sum(cost_yen), 0) as spent from generation_runs where created_at >= app.month_start()) x;
$$;

create or replace function public.mark_budget_notified() returns void
language sql security definer set search_path = public as $$
  update app_settings set budget_notified_month = (app.month_start() at time zone 'Asia/Tokyo')::date, updated_at = now();
$$;

-- 関数は作成時に誰でも実行できるため、呼べる役割を絞る
revoke execute on function public.start_generation(uuid, text, text, int) from public;
revoke execute on function public.finish_generation(uuid, text, jsonb, numeric, text, uuid) from public;
revoke execute on function public.budget_status() from public;
revoke execute on function public.mark_budget_notified() from public;
revoke execute on function app.month_start() from public;
grant execute on function public.start_generation(uuid, text, text, int) to authenticated;
do $$
declare r text;
begin
  -- Supabase は public の関数を anon・authenticated に自動で付与するため、明示的に外す
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke execute on function public.finish_generation(uuid, text, jsonb, numeric, text, uuid) from %I', r);
      execute format('revoke execute on function public.budget_status() from %I', r);
      execute format('revoke execute on function public.mark_budget_notified() from %I', r);
    end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.start_generation(uuid, text, text, int) from anon';
    execute 'revoke all on public.app_settings from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.finish_generation(uuid, text, jsonb, numeric, text, uuid) to service_role';
    execute 'grant execute on function public.budget_status() to service_role';
    execute 'grant execute on function public.mark_budget_notified() to service_role';
  end if;
end $$;
