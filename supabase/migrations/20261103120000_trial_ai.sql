-- 30秒でためす（/try）のAI（docs/DECISIONS.md 2026-11-03）。ログインしていない人も使うので、行き過ぎないようにする。
-- - 呼ぶのはサーバー（service role）だけ。画面（anon・authenticated）からは呼べない
-- - 1人1日の回数、全体の1日の回数、ためす用の月の予算、全体の月の予算、止めるスイッチ（trial_ai_enabled）
-- - 入力は保存しない。残すのは回数・費用・元に戻せない目印（visitor：IPなどをサーバーの秘密でハッシュしたもの）だけ
-- 何度流しても同じ結果になる。

alter table public.app_settings add column if not exists trial_ai_enabled boolean not null default true;
alter table public.app_settings add column if not exists trial_daily_per_visitor int not null default 3 check (trial_daily_per_visitor >= 0);
alter table public.app_settings add column if not exists trial_daily_total int not null default 100 check (trial_daily_total >= 0);
alter table public.app_settings add column if not exists trial_monthly_budget_yen int not null default 3000 check (trial_monthly_budget_yen >= 0);

create table if not exists public.trial_runs (
  id uuid primary key default gen_random_uuid(),
  visitor text not null check (length(visitor) between 16 and 128),
  status text not null default 'running' check (status in ('running', 'succeeded', 'failed', 'rejected')),
  input_chars int not null check (input_chars between 0 and 2000),
  cost_yen numeric(10, 2) not null default 0 check (cost_yen >= 0),
  error_code text check (error_code is null or length(error_code) <= 40),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists trial_runs_created_idx on public.trial_runs (created_at);
create index if not exists trial_runs_visitor_idx on public.trial_runs (visitor, created_at);
alter table public.trial_runs enable row level security;
revoke all on public.trial_runs from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.trial_runs from %I', r);
    end if;
  end loop;
end $$;

-- 受付。失敗は例外で返し、メッセージをエラーコードにする：disabled / invalid_input / visitor_limit / daily_limit / budget_exceeded
create or replace function public.start_trial_run(p_visitor text, p_input_chars int)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s public.app_settings;
  day_start timestamptz := date_trunc('day', now() at time zone 'Asia/Tokyo') at time zone 'Asia/Tokyo';
  mine int;
  total int;
  trial_spent numeric;
  all_spent numeric;
  new_id uuid;
begin
  select * into s from app_settings where id for update;
  if not s.trial_ai_enabled then
    raise exception 'disabled' using errcode = 'P0001';
  end if;
  if coalesce(length(p_visitor), 0) not between 16 and 128 or p_input_chars is null or p_input_chars not between 0 and 2000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  select count(*) into mine from trial_runs where visitor = p_visitor and created_at >= day_start;
  if mine >= s.trial_daily_per_visitor then
    raise exception 'visitor_limit' using errcode = 'P0001';
  end if;
  select count(*) into total from trial_runs where created_at >= day_start;
  if total >= s.trial_daily_total then
    raise exception 'daily_limit' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into trial_spent from trial_runs where created_at >= app.month_start();
  select coalesce(sum(cost_yen), 0) into all_spent from generation_runs where created_at >= app.month_start();
  if trial_spent >= s.trial_monthly_budget_yen or trial_spent + all_spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  insert into trial_runs (visitor, input_chars) values (p_visitor, p_input_chars) returning id into new_id;
  return new_id;
end;
$$;

-- 結果の記録。入力も出力も残さない
create or replace function public.finish_trial_run(p_id uuid, p_status text, p_cost_yen numeric, p_error_code text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('succeeded', 'failed', 'rejected') then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;
  update trial_runs
  set status = p_status, cost_yen = greatest(coalesce(p_cost_yen, 0), 0), error_code = left(p_error_code, 40), finished_at = now()
  where id = p_id and status = 'running';
end;
$$;

revoke execute on function public.start_trial_run(text, int) from public;
revoke execute on function public.finish_trial_run(uuid, text, numeric, text) from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke execute on function public.start_trial_run(text, int) from %I', r);
      execute format('revoke execute on function public.finish_trial_run(uuid, text, numeric, text) from %I', r);
    end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.start_trial_run(text, int) to service_role';
    execute 'grant execute on function public.finish_trial_run(uuid, text, numeric, text) to service_role';
  end if;
end $$;
