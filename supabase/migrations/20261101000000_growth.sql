-- 育つブログの保存（docs/TASKS.md T5-3、docs/DATA.md「育つブログ」）。
-- 会社のことを教える（ヒアリング）の答え、選んだ記事の組み立て、書く記事リスト、今売りたいものの順番。
-- どの表も organization_id を持ち、RLS で所属会社に絞る。顧客担当者とコタムの両方が読み書きできる。

-- ---------------------------------------------------------------------------
-- テーブル
-- ---------------------------------------------------------------------------

create table public.hearing_answers (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question_id text not null check (question_id ~ '^[a-z0-9_]{1,40}$'),
  text text not null default '' check (char_length(text) <= 4000),
  -- 深掘りの質問と答え [{question, answer}]。飛ばした深掘りは答えを空で残す
  follow_ups jsonb not null default '[]' check (jsonb_typeof(follow_ups) = 'array' and jsonb_array_length(follow_ups) <= 10),
  -- 「次へ」を押すまで書きかけ
  is_draft boolean not null default true,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (organization_id, question_id)
);

create table public.sell_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 60),
  -- 0 が1位
  rank int not null check (rank >= 0),
  updated_at timestamptz not null default now()
);
create index sell_items_org_idx on public.sell_items (organization_id, rank);

create table public.keyword_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- 選んだ提案（柱・周りの記事・ねらい・理由）。src/lib/ai/growthPrompts.ts の ParsedProposal の形
  proposal jsonb not null check (jsonb_typeof(proposal) = 'object'),
  chosen_by uuid references auth.users (id) on delete set null,
  chosen_at timestamptz not null default now(),
  archived_at timestamptz
);
-- 使っている組み立ては1社に1つ
create unique index keyword_plans_active_idx on public.keyword_plans (organization_id) where archived_at is null;

create table public.keyword_rows (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.keyword_plans (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null check (kind in ('pillar', 'cluster')),
  pillar_row_id uuid references public.keyword_rows (id) on delete set null,
  keyword text not null check (char_length(btrim(keyword)) between 1 and 80),
  reader_question text not null default '' check (char_length(reader_question) <= 200),
  status text not null default 'todo' check (status in ('todo', 'writing', 'published')),
  priority int not null default 2 check (priority between 1 and 3),
  reasons text[] not null default '{}' check (reasons <@ array['sales', 'competition', 'aio']::text[]),
  source text not null default 'proposal' check (source in ('proposal', 'customer', 'cotam', 'site', 'search_console', 'semrush', 'rakko', 'keyword_planner')),
  -- キーワードツールの値だけを入れる。利用者とAIには書かせない（app.guard_keyword_row）
  monthly_searches int check (monthly_searches is null or monthly_searches >= 0),
  parked boolean not null default false,
  sell_item_id uuid references public.sell_items (id) on delete set null,
  article_id uuid references public.articles (id) on delete set null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index keyword_rows_plan_idx on public.keyword_rows (plan_id, sort_order);
create index keyword_rows_article_idx on public.keyword_rows (article_id) where article_id is not null;

-- ---------------------------------------------------------------------------
-- 行レベルセキュリティ
-- ---------------------------------------------------------------------------

alter table public.hearing_answers enable row level security;
alter table public.sell_items enable row level security;
alter table public.keyword_plans enable row level security;
alter table public.keyword_rows enable row level security;

create policy hearing_member_all on public.hearing_answers for all
  using (app.is_member(organization_id)) with check (app.is_member(organization_id));
create policy sell_items_member_all on public.sell_items for all
  using (app.is_member(organization_id)) with check (app.is_member(organization_id));
create policy keyword_plans_select on public.keyword_plans for select using (app.is_member(organization_id));
create policy keyword_plans_insert on public.keyword_plans for insert with check (app.is_member(organization_id));
create policy keyword_plans_update on public.keyword_plans for update
  using (app.is_member(organization_id)) with check (app.is_member(organization_id));
create policy keyword_rows_member_all on public.keyword_rows for all
  using (app.is_member(organization_id)) with check (app.is_member(organization_id));

grant select, insert, update, delete on public.hearing_answers, public.sell_items, public.keyword_rows to authenticated;
grant select, insert, update on public.keyword_plans to authenticated;

-- ---------------------------------------------------------------------------
-- 整合性のトリガー
-- ---------------------------------------------------------------------------

-- 書く記事リストの行は、組み立て・柱の行・売りたいもの・記事のどれとも同じ会社でなければならない。
-- 月の検索回数はキーワードツールの値だけ（service role のサーバー処理）が書ける
create or replace function app.guard_keyword_row() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from keyword_plans p where p.id = new.plan_id and p.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  if new.pillar_row_id is not null and not exists (
    select 1 from keyword_rows r where r.id = new.pillar_row_id and r.plan_id = new.plan_id and r.kind = 'pillar'
  ) then
    raise exception 'pillar mismatch' using errcode = '42501';
  end if;
  if new.sell_item_id is not null and not exists (select 1 from sell_items s where s.id = new.sell_item_id and s.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  if new.article_id is not null and not exists (select 1 from articles a where a.id = new.article_id and a.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  if auth.uid() is not null and not app.is_admin() then
    if tg_op = 'INSERT' and new.monthly_searches is not null then
      raise exception 'monthly_searches is tool-only' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and new.monthly_searches is distinct from old.monthly_searches then
      raise exception 'monthly_searches is tool-only' using errcode = '42501';
    end if;
    if tg_op = 'UPDATE' and (new.organization_id <> old.organization_id or new.plan_id <> old.plan_id) then
      raise exception 'immutable column' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger keyword_rows_guard before insert or update on public.keyword_rows
  for each row execute function app.guard_keyword_row();

create or replace function app.guard_keyword_plan() returns trigger
language plpgsql as $$
begin
  if new.organization_id <> old.organization_id or new.proposal is distinct from old.proposal then
    raise exception 'immutable column' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger keyword_plans_guard before update on public.keyword_plans
  for each row execute function app.guard_keyword_plan();

-- 会社をまたぐ移動を防ぐ。複数の会社を担当するコタムでも、行の organization_id は変えられない
-- （売りたいものを他社へ移すと、元の会社の記事リストの行が他社の行を指したまま残るため）
create or replace function app.keep_organization() returns trigger
language plpgsql as $$
begin
  if new.organization_id <> old.organization_id then
    raise exception 'immutable column' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger sell_items_keep_org before update on public.sell_items
  for each row execute function app.keep_organization();
create trigger hearing_answers_keep_org before update on public.hearing_answers
  for each row execute function app.keep_organization();

-- 記事を公開したら、その記事の行を「やった」にする。公開をやめても手で戻せるよう、戻す方向は自動にしない
create or replace function app.mark_keyword_published() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update keyword_rows set status = 'published', updated_at = now()
  where article_id = new.id and status <> 'published';
  return new;
end;
$$;
create trigger articles_mark_keyword_published after update of status on public.articles
  for each row when (new.status = 'published' and old.status is distinct from 'published')
  execute function app.mark_keyword_published();

create trigger hearing_answers_touch before update on public.hearing_answers for each row execute function app.touch_updated_at();
create trigger sell_items_touch before update on public.sell_items for each row execute function app.touch_updated_at();
create trigger keyword_rows_touch before update on public.keyword_rows for each row execute function app.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 関数（利用者の権限で動き、RLS とトリガーはそのまま効く）
-- ---------------------------------------------------------------------------

-- 記事の組み立てを選ぶ。前の組み立てをしまい、新しい組み立てと書く記事リストを1つのトランザクションで作る。
-- p_rows：[{key, kind, pillar_key, keyword, reader_question, priority, reasons, source, sort_order}]
--   key は p_rows の中だけの名前で、周りの記事の pillar_key から柱の行を指す
-- 前の組み立ての行のうち、書き始めた・やった行は新しい組み立てに引き継ぐ（同じキーワードなら新しい行に記事をつなぐ）
create or replace function public.choose_keyword_plan(p_organization_id uuid, p_proposal jsonb, p_rows jsonb) returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  pid uuid;
  old_pid uuid;
  r record;
  ids jsonb := '{}';
  rid uuid;
begin
  if not coalesce(app.is_member(p_organization_id), false) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  -- SQL の NULL は条件式も NULL になり素通りするので、先に断る（素通りすると前の組み立てだけがしまわれる）
  if p_rows is null or p_proposal is null or jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) = 0 or jsonb_array_length(p_rows) > 30 then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  select id into old_pid from keyword_plans where organization_id = p_organization_id and archived_at is null for update;
  if old_pid is not null then
    update keyword_plans set archived_at = now() where id = old_pid;
  end if;

  insert into keyword_plans (organization_id, proposal, chosen_by) values (p_organization_id, p_proposal, auth.uid()) returning id into pid;

  -- 柱を先に入れ、周りの記事から柱の行を指せるようにする
  for r in
    select x.*, t.ord from jsonb_array_elements(p_rows) with ordinality as t(elem, ord) cross join lateral
      jsonb_to_record(t.elem) as x(key text, kind text, pillar_key text, keyword text, reader_question text, priority int, reasons text[], source text, sort_order int)
    order by (x.kind = 'pillar') desc, t.ord
  loop
    insert into keyword_rows (plan_id, organization_id, kind, pillar_row_id, keyword, reader_question, priority, reasons, source, sort_order, status, article_id)
    values (
      pid, p_organization_id, r.kind,
      case when r.pillar_key is null then null else (ids->>r.pillar_key)::uuid end,
      btrim(r.keyword), coalesce(r.reader_question, ''), coalesce(r.priority, 2), coalesce(r.reasons, '{}'), coalesce(r.source, 'proposal'), coalesce(r.sort_order, r.ord::int),
      coalesce((select o.status from keyword_rows o where o.plan_id = old_pid and o.keyword = btrim(r.keyword) and o.status <> 'todo' limit 1), 'todo'),
      (select o.article_id from keyword_rows o where o.plan_id = old_pid and o.keyword = btrim(r.keyword) and o.article_id is not null limit 1)
    )
    returning id into rid;
    if r.key is not null then
      ids := ids || jsonb_build_object(r.key, rid);
    end if;
  end loop;
  return pid;
end;
$$;

-- 今売りたいものを、渡した順番で置きかえる。p_items：[{id?, name}]。id があれば同じ行を残し（記事の札が外れないように）、無い行は消す
create or replace function public.save_sell_items(p_organization_id uuid, p_items jsonb) returns void
language plpgsql security invoker set search_path = public as $$
declare
  keep uuid[];
begin
  if not coalesce(app.is_member(p_organization_id), false) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  -- NULL を素通りさせると全件消えるので断る。全部消すときは空の配列を渡す
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 10 then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  select coalesce(array_agg((x->>'id')::uuid), '{}') into keep
  from jsonb_array_elements(p_items) x where nullif(x->>'id', '') is not null;
  delete from sell_items where organization_id = p_organization_id and not (id = any (keep));
  insert into sell_items (id, organization_id, name, rank)
  select coalesce(nullif(x->>'id', '')::uuid, gen_random_uuid()), p_organization_id, btrim(x->>'name'), (ord - 1)::int
  from jsonb_array_elements(p_items) with ordinality as t(x, ord)
  on conflict (id) do update set name = excluded.name, rank = excluded.rank
    where sell_items.organization_id = excluded.organization_id;
end;
$$;

revoke execute on function public.choose_keyword_plan(uuid, jsonb, jsonb) from public;
revoke execute on function public.save_sell_items(uuid, jsonb) from public;
grant execute on function public.choose_keyword_plan(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.save_sell_items(uuid, jsonb) to authenticated;
grant execute on function app.guard_keyword_row() to authenticated;
grant execute on function app.guard_keyword_plan() to authenticated;
grant execute on function app.mark_keyword_published() to authenticated;
grant execute on function app.keep_organization() to authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.choose_keyword_plan(uuid, jsonb, jsonb) from anon';
    execute 'revoke execute on function public.save_sell_items(uuid, jsonb) from anon';
  end if;
end $$;
