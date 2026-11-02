-- AIOのチェック（docs/DECISIONS.md 2026-11-02、田村さん「コタムの人の確認は完全になくす」）。
-- 公開前のコタムの確認をやめ、AIが記事を点検して足りない所をお客様に一問一答で聞き返す。
-- コタムはチェックの結果とやり取りを読み、コメント（reviews の comment）を残せる。
-- 書く記事の提案（20261102000000_keyword_proposals.sql）の後に流す。生成の種類と start_generation は、提案の変更を含めて定義し直す。

-- 1. チェックの記録。作るのと結果を書くのはサーバー（service role）。お客様は答え（answers）だけを書ける
create table public.aio_checks (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_id uuid not null references public.article_versions (id) on delete cascade,
  status text not null default 'asking' check (status in ('asking', 'done')),
  summary text not null default '',
  -- [{key, ok, note}]
  items jsonb not null default '[]',
  -- [{id, key, text, example}]
  questions jsonb not null default '[]',
  -- [{questionId, text, unknown}]
  answers jsonb not null default '[]' check (jsonb_typeof(answers) = 'array' and length(answers::text) <= 8000),
  result_version_id uuid references public.article_versions (id) on delete set null,
  is_sample boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index aio_checks_article_idx on public.aio_checks (article_id, created_at);
create index aio_checks_org_idx on public.aio_checks (organization_id, created_at);
alter table public.aio_checks enable row level security;

create policy aio_checks_select on public.aio_checks for select to authenticated using (app.is_member(organization_id));
create policy aio_checks_client_answer on public.aio_checks for update to authenticated
  using (app.is_client(organization_id)) with check (app.is_client(organization_id));
grant select, update on public.aio_checks to authenticated;
revoke insert, delete on public.aio_checks from authenticated;

-- お客様が書き換えられるのは答えだけ。結果や状態はサーバーだけが書く
create or replace function app.guard_aio_check_answer() returns trigger
language plpgsql as $$
begin
  if auth.uid() is null or app.is_admin() then
    new.updated_at := now();
    return new;
  end if;
  if new.id <> old.id or new.article_id <> old.article_id or new.organization_id <> old.organization_id
     or new.version_id <> old.version_id or new.status <> old.status or new.summary <> old.summary
     or new.items <> old.items or new.questions <> old.questions
     or new.result_version_id is distinct from old.result_version_id or new.is_sample <> old.is_sample
     or new.created_by is distinct from old.created_by or new.created_at <> old.created_at then
    raise exception 'only answers can be changed' using errcode = '42501';
  end if;
  if old.status <> 'asking' then
    raise exception 'check is closed' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
create trigger aio_checks_answer before update on public.aio_checks
  for each row execute function app.guard_aio_check_answer();
create trigger aio_checks_org before insert or update on public.aio_checks
  for each row execute function app.check_article_org();

-- 2. 公開前のコタムの確認をなくす。どの会社も、作成中の記事をそのまま「ブログに載せた」にできる
update public.organizations set review_policy = 'optional' where review_policy <> 'optional';
alter table public.organizations alter column review_policy set default 'optional';

-- 3. 生成の受付に「AIOのチェック」（aio_check）を足す。チェックと答えの反映の両方で使う
alter table public.generation_runs drop constraint generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'keyword_proposal', 'aio_check'));

alter table public.app_settings
  add column article_aio_check_limit int not null default 20 check (article_aio_check_limit >= 0);

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
  cutoff timestamptz;
begin
  select * into a from articles where id = p_article_id;
  if not found or coalesce(app.role_in(a.organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'aio_check')
     or coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- 全社の受付を順番に処理する
  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    -- 記事を指さない受付（書く記事の提案）と同じキーを渡されても、それを返さない
    if run.article_id is distinct from p_article_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  -- 応答が無いまま時間が過ぎた受付は失敗にする（入力は記事側に残っている）。
  -- この後の判定で例外になるとこの更新も取り消されるため、判定そのものは cutoff で行う
  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = a.organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = a.organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 上限に数えるのは本文の生成だけ。失敗した回と時間切れの回は数えない
  if p_kind = 'body' then
    select monthly_generation_limit into org_limit from organizations where id = a.organization_id;
    select count(*) into used from generation_runs
    where organization_id = a.organization_id and kind = 'body' and created_at >= app.month_start()
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= org_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'body'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_body_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- 画像は1記事あたりの回数で止める（1回でアイキャッチと見出しごとの画像をまとめて作る）
  if p_kind = 'image' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'image'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_image_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- AIOのチェック（チェックと答えの反映）も1記事あたりの回数で止める
  if p_kind = 'aio_check' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'aio_check'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_aio_check_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (a.organization_id, p_article_id, p_kind, p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;
