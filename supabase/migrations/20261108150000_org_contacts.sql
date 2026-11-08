-- コタムの担当者が、お客様に声をかけた記録（担当のトップの「声をかけたい会社」。2026-11-08 管理者役の採点「声をかけた後の状況が分からない」）。
-- - 書く・読むのはサーバー（service role、/api/admin/contacts・/api/admin/call-list）だけ。全社管理者かどうかはサーバーで確かめる
-- - 残すのは会社・誰が・いつ・ひとこと（200字まで）だけ
-- 何度流しても同じ結果になる。

create table if not exists public.org_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contacted_by uuid references auth.users (id) on delete set null,
  note text not null default '' check (length(note) <= 200),
  created_at timestamptz not null default now()
);
create index if not exists org_contacts_org_created_idx on public.org_contacts (organization_id, created_at desc);
alter table public.org_contacts enable row level security;
revoke all on public.org_contacts from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.org_contacts from %I', r);
    end if;
  end loop;
end $$;
