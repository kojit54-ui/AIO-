-- ChatGPT・Claude・Gemini やこれまでのブログからの取り込み（docs/DECISIONS.md 2026-11-02）。
-- 1. knowledge_notes：お客様が取り込んだ会社の知識（AIとの会話のまとめから、お客様が選んだもの）。記事を作るたびにAIへ渡す
-- 2. これまでのブログ記事：お客様も過去記事（reference_articles）を足せるようにする（今まではコタムだけ）
-- 何度流しても同じ結果になる。

create table if not exists public.knowledge_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- ai_import＝ChatGPT などのまとめから取り込んだ、manual＝自分で書いた
  source text not null default 'ai_import' check (source in ('ai_import', 'manual')),
  label text not null check (char_length(label) between 1 and 80),
  text text not null check (char_length(text) between 1 and 2000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists knowledge_notes_org_idx on public.knowledge_notes (organization_id, created_at desc);
alter table public.knowledge_notes enable row level security;

drop policy if exists knowledge_notes_select on public.knowledge_notes;
create policy knowledge_notes_select on public.knowledge_notes for select to authenticated using (app.is_member(organization_id));
-- 足す・消すのは、その会社のお客様（コタムは読むだけ）
drop policy if exists knowledge_notes_client_insert on public.knowledge_notes;
create policy knowledge_notes_client_insert on public.knowledge_notes for insert to authenticated
  with check (app.is_client(organization_id) and created_by = auth.uid());
drop policy if exists knowledge_notes_client_delete on public.knowledge_notes;
create policy knowledge_notes_client_delete on public.knowledge_notes for delete to authenticated using (app.is_client(organization_id));
grant select, insert, delete on public.knowledge_notes to authenticated;

-- 1社あたりの数を止める（AIに渡すのは大事な順に一部だけ。ためすぎを防ぐ）
create or replace function app.limit_knowledge_notes() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.knowledge_notes where organization_id = new.organization_id) >= 200 then
    raise exception 'limit_reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
drop trigger if exists knowledge_notes_limit on public.knowledge_notes;
create trigger knowledge_notes_limit before insert on public.knowledge_notes
  for each row execute function app.limit_knowledge_notes();

-- これまでのブログ記事は、お客様も足せる（自社の分だけ）
drop policy if exists refs_client_insert on public.reference_articles;
create policy refs_client_insert on public.reference_articles for insert to authenticated
  with check (app.is_client(organization_id));
