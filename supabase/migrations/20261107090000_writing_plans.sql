-- 次に書く日（docs/DECISIONS.md 2026-11-07）。何度流しても同じ結果。
-- 本人が決めた「次に書く日」を1人1行で持つ。その日の朝9時（日本時間）に、サーバーがメールで知らせる。
-- reminded_on：知らせた日。同じ日に二度送らないため。日を決め直すと空にもどす。

create table if not exists public.writing_plans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  planned_on date not null,
  reminded_on date,
  updated_at timestamptz not null default now()
);
alter table public.writing_plans enable row level security;
drop policy if exists writing_plans_own on public.writing_plans;
create policy writing_plans_own on public.writing_plans for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and app.is_member(organization_id));
grant select, insert, update, delete on public.writing_plans to authenticated;
create index if not exists writing_plans_planned_on on public.writing_plans (planned_on) where reminded_on is null;
