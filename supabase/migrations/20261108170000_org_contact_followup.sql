-- 声をかけた記録に「次に連絡する日」を足し、会社ごとの連絡先（担当者名・電話番号）を持つ（2026-11-08 管理者役の採点。田村さんOK済み）。
-- - どちらも書く・読むのはサーバー（service role、/api/admin/*）だけ。全社管理者かどうかはサーバーで確かめる
-- - お客様の画面からは見えない（organizations の権限には触らない）
-- 何度流しても同じ結果になる。

alter table public.org_contacts add column if not exists next_contact_on date;
create index if not exists org_contacts_next_idx on public.org_contacts (next_contact_on) where next_contact_on is not null;

create table if not exists public.org_contact_info (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  contact_name text not null default '' check (length(contact_name) <= 40),
  phone text not null default '' check (length(phone) <= 30),
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.org_contact_info enable row level security;
revoke all on public.org_contact_info from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.org_contact_info from %I', r);
    end if;
  end loop;
end $$;
