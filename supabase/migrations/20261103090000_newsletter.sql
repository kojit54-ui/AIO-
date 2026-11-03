-- 毎月のしおり通信（メール）（docs/DECISIONS.md 2026-11-03）。何度流しても同じ結果。
-- newsletter_optouts：受け取らないと決めた人。本人だけが見て、足して、消せる（メールの「受け取らない」のリンクはサーバーが足す）。
-- newsletter_sends：送った記録。同じ月に二重に送らないため。取ったスタンプを残し、次の月に「新しく取ったスタンプ」を出す。書くのはサーバーだけ。

create table if not exists public.newsletter_optouts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.newsletter_optouts enable row level security;
drop policy if exists newsletter_optouts_own on public.newsletter_optouts;
create policy newsletter_optouts_own on public.newsletter_optouts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, delete on public.newsletter_optouts to authenticated;

create table if not exists public.newsletter_sends (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  month text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  stamp_ids jsonb not null default '[]',
  sent_at timestamptz not null default now(),
  primary key (organization_id, user_id, month)
);
alter table public.newsletter_sends enable row level security;
drop policy if exists newsletter_sends_select on public.newsletter_sends;
create policy newsletter_sends_select on public.newsletter_sends for select to authenticated using (app.is_member(organization_id));
grant select on public.newsletter_sends to authenticated;
revoke insert, update, delete on public.newsletter_sends from authenticated;
