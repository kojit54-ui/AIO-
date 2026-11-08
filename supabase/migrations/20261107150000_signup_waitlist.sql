-- 新規受付の案内を受け取る人（入口ページ /welcome・/try。docs/DECISIONS.md 2026-11-07）。
-- いまは招待制で新規は登録できないので、受付を始めるときに知らせる相手のメールだけを残す。
-- - 書くのはサーバー（service role、/api/waitlist）だけ。画面（anon・authenticated）からは読めない・書けない
-- - 残すのはメール・どこから来たか・日時だけ。同じメールは1行
-- 何度流しても同じ結果になる。

create table if not exists public.signup_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (length(email) between 6 and 254 and email = lower(email)),
  source text not null default 'welcome' check (source in ('welcome', 'try', 'price', 'final')),
  created_at timestamptz not null default now(),
  notified_at timestamptz
);
create unique index if not exists signup_waitlist_email_idx on public.signup_waitlist (email);
create index if not exists signup_waitlist_created_idx on public.signup_waitlist (created_at);
alter table public.signup_waitlist enable row level security;
revoke all on public.signup_waitlist from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.signup_waitlist from %I', r);
    end if;
  end loop;
end $$;
