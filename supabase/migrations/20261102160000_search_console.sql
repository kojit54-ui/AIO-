-- Search Console をつなぐ（docs/DECISIONS.md 2026-11-02、つなぎ方A）。
-- お客様が自分の Search Console に、コタムのサービス用アカウントを閲覧のみで足す。コタムのサーバーがそのアカウントで読む。
-- 1社1行。サイトのURL・つながったか・最後に読んだデータ（28日分のまとめ）を残す。書くのはサーバー（service role）だけ。何度流しても同じ結果。

create table if not exists public.search_console (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  -- Search Console のプロパティ（https://example.jp/ か sc-domain:example.jp）
  site_url text not null check (char_length(site_url) between 4 and 300),
  verified_at timestamptz,
  last_error text,
  -- {range:{start,end}, totals:{clicks,impressions,ctr,position}, queries:[...], pages:[...]}
  snapshot jsonb,
  fetched_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.search_console enable row level security;
drop policy if exists search_console_select on public.search_console;
create policy search_console_select on public.search_console for select to authenticated using (app.is_member(organization_id));
grant select on public.search_console to authenticated;
revoke insert, update, delete on public.search_console from authenticated;
