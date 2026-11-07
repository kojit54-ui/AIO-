-- 強みの帳面（docs/DECISIONS.md 2026-11-07、docs/AIO.md「強みの帳面」）。
-- 会社ごとに1冊。誰に・強み（根拠と数字）・選ばれた決め手・分野ごとの実績・書き方をまとめ、
-- お客様が確かめた（confirmed_at が入った）ものだけを、記事・点検・AIOのチェック・キーワードの提案のAIに毎回渡す。
-- 何度流しても同じ結果になる。

create table if not exists public.strength_books (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  book jsonb not null default '{}'::jsonb check (jsonb_typeof(book) = 'object' and char_length(book::text) <= 30000),
  -- お客様が「これでAIに使ってよい」と確かめた日時。空なら下書き（AIには渡さない）
  confirmed_at timestamptz,
  -- AIが下書きを作った日時
  drafted_at timestamptz,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);
alter table public.strength_books enable row level security;

drop policy if exists strength_books_select on public.strength_books;
create policy strength_books_select on public.strength_books for select to authenticated using (app.is_member(organization_id));
-- 書く・直すのは、その会社のお客様（コタムは読むだけ）。AIの下書きはサーバー（service role）が書く
drop policy if exists strength_books_client_insert on public.strength_books;
create policy strength_books_client_insert on public.strength_books for insert to authenticated
  with check (app.is_client(organization_id) and updated_by = auth.uid());
drop policy if exists strength_books_client_update on public.strength_books;
create policy strength_books_client_update on public.strength_books for update to authenticated
  using (app.is_client(organization_id)) with check (app.is_client(organization_id) and updated_by = auth.uid());
grant select, insert, update on public.strength_books to authenticated;
