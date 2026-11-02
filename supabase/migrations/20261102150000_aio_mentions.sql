-- AIに紹介されたかのチェック（docs/DECISIONS.md 2026-11-02）。
-- 地域とサービスの質問を、検索できるAI（ChatGPT の検索）に聞き、答えや出典にこの会社が出てくるかを記録する。
-- 作るのはサーバー（service role）だけ。同じ会社の人が読む。受付は start_hearing_ai（種類 hearing）を使う。何度流しても同じ結果。

create table if not exists public.aio_mentions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question text not null check (char_length(question) between 1 and 200),
  mentioned boolean not null default false,
  -- 答えの中で会社に触れた部分（無ければ答えの冒頭）
  excerpt text not null default '' check (char_length(excerpt) <= 600),
  -- 答えの出典 [{title, url}]
  sources jsonb not null default '[]' check (jsonb_typeof(sources) = 'array'),
  provider text not null default '',
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists aio_mentions_org_idx on public.aio_mentions (organization_id, created_at desc);
alter table public.aio_mentions enable row level security;
drop policy if exists aio_mentions_select on public.aio_mentions;
create policy aio_mentions_select on public.aio_mentions for select to authenticated using (app.is_member(organization_id));
grant select on public.aio_mentions to authenticated;
revoke insert, update, delete on public.aio_mentions from authenticated;
