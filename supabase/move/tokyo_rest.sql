-- 東京の場所（qzmoasfypcjkyfiwqjan）用：20261025 以降のマイグレーションをまとめたもの。init〜app_data は適用済み

-- ===== 20261025000000_article_images.sql
-- 記事の画像（docs/TASKS.md T4-1、docs/DECISIONS.md 2026-10-23）。
-- ナノバナナ（Gemini の画像モデル）で作ったアイキャッチと見出しごとの画像を、記事ごと・枠ごとに1枚ずつ残す。
-- 画像のファイルは Supabase Storage の非公開バケット article-images に置き、サーバー（service role）だけが書く。
-- 画面には、この表をRLSで読めた行についてだけ、サーバーが期限付きのURLを渡す。

alter table public.generation_runs drop constraint generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image'));

alter table public.app_settings
  add column article_image_limit int not null default 10 check (article_image_limit >= 0);

create table public.article_images (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  -- eyecatch、または見出しの文字列
  slot text not null check (length(slot) between 1 and 200),
  alt text not null default '',
  storage_path text not null,
  mime_type text not null,
  is_sample boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (article_id, slot)
);
create index article_images_org_idx on public.article_images (organization_id);
alter table public.article_images enable row level security;
create policy article_images_select on public.article_images for select to authenticated using (app.is_member(organization_id));
-- 書き込みは service role（サーバー）だけ
grant select on public.article_images to authenticated;
revoke insert, update, delete on public.article_images from authenticated;

create or replace function public.start_generation(
  p_article_id uuid,
  p_kind text,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  a public.articles;
  s public.app_settings;
  run public.generation_runs;
  org_limit int;
  used int;
  spent numeric;
  cutoff timestamptz;
begin
  select * into a from articles where id = p_article_id;
  if not found or coalesce(app.role_in(a.organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('outline', 'body', 'rewrite', 'followup_questions', 'image')
     or coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- 全社の受付を順番に処理する
  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    if run.article_id <> p_article_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  -- 応答が無いまま時間が過ぎた受付は失敗にする（入力は記事側に残っている）。
  -- この後の判定で例外になるとこの更新も取り消されるため、判定そのものは cutoff で行う
  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = a.organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = a.organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 上限に数えるのは本文の生成だけ。失敗した回と時間切れの回は数えない
  if p_kind = 'body' then
    select monthly_generation_limit into org_limit from organizations where id = a.organization_id;
    select count(*) into used from generation_runs
    where organization_id = a.organization_id and kind = 'body' and created_at >= app.month_start()
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= org_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'body'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_body_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- 画像は1記事あたりの回数で止める（1回でアイキャッチと見出しごとの画像をまとめて作る）
  if p_kind = 'image' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'image'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_image_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (a.organization_id, p_article_id, p_kind, p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;


-- ===== 20261101000000_growth.sql
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

-- ===== 20261102000000_keyword_proposals.sql
-- 書く記事の提案（コタムからの提案）をAIで作る。T5-4（docs/DECISIONS.md 2026-11-01、作るのは CC、点検は Codex）。
-- 記事に属さない生成なので、generation_runs の article_id を空にできるようにし、種類 keyword_proposal を足す。
-- 受付（二重実行・同時実行・全社の予算・会社ごとの月の回数）は start_keyword_proposal、結果の記録は既存の finish_generation。
-- できた提案は keyword_proposals に残し、同じ会社の人がRLSで読む。書き込みはサーバー（service role）だけ。
-- 検索の下調べ（ラッコキーワード）の生データはここに入れない。AIが選んで言いかえた提案だけを残す。

alter table public.generation_runs alter column article_id drop not null;
alter table public.generation_runs drop constraint generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'keyword_proposal'));
-- 記事の生成は記事を必ず指し、提案は記事を指さない
alter table public.generation_runs
  add constraint generation_runs_article_check check ((kind = 'keyword_proposal') = (article_id is null));

-- 記事を指さない受付は、記事との会社の一致を調べない（会社の確認は start_keyword_proposal が行う）
create or replace function app.check_run_org() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.article_id is null then
    return new;
  end if;
  if not exists (select 1 from public.articles a where a.id = new.article_id and a.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  return new;
end;
$$;
drop trigger generation_runs_org on public.generation_runs;
create trigger generation_runs_org before insert or update on public.generation_runs
  for each row execute function app.check_run_org();

-- 1社が1か月に作れる提案の回数（ラッコのクレジットとAIの費用を守る）
alter table public.app_settings
  add column keyword_proposal_limit int not null default 10 check (keyword_proposal_limit >= 0);

create table public.keyword_proposals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  run_id uuid not null unique references public.generation_runs (id) on delete cascade,
  -- [{pillar: {keyword, question}, clusters: [{keyword, question}], reasons: text[], why}]（src/lib/ai/growthPrompts.ts の ParsedProposal）
  proposals jsonb not null check (jsonb_typeof(proposals) = 'array' and jsonb_array_length(proposals) between 1 and 6),
  -- AIのキーが無いときのサンプル。画面に「サンプル（AIは未接続）」と出す
  is_sample boolean not null default false,
  -- 検索の下調べを使えたか（生データは残さない）
  used_research boolean not null default false,
  requested_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);
create index keyword_proposals_org_idx on public.keyword_proposals (organization_id, created_at desc);
alter table public.keyword_proposals enable row level security;
create policy keyword_proposals_select on public.keyword_proposals for select to authenticated using (app.is_member(organization_id));
grant select on public.keyword_proposals to authenticated;
revoke insert, update, delete on public.keyword_proposals from authenticated;

-- 提案の受付。画面からの依頼を受けたサーバーが、利用者のセッションで呼ぶ。
-- 失敗は例外で返し、メッセージをエラーコードにする（start_generation と同じ）：
--   forbidden / invalid_input / busy / limit_reached / budget_exceeded
create or replace function public.start_keyword_proposal(
  p_organization_id uuid,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  s public.app_settings;
  run public.generation_runs;
  used int;
  spent numeric;
  cutoff timestamptz;
begin
  if p_organization_id is null or coalesce(app.role_in(p_organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す（ほかの会社・ほかの種類の受付は返さない）
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    if run.kind <> 'keyword_proposal' or run.organization_id <> p_organization_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = p_organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = p_organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 失敗した回と時間切れの回は数えない
  select count(*) into used from generation_runs
  where organization_id = p_organization_id and kind = 'keyword_proposal' and created_at >= app.month_start()
    and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
  if used >= s.keyword_proposal_limit then
    raise exception 'limit_reached' using errcode = 'P0001';
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (p_organization_id, null, 'keyword_proposal', p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;

-- 記事の生成の受付は、提案の受付（記事を指さない）と同じキーを渡されても、それを返さない
create or replace function public.start_generation(
  p_article_id uuid,
  p_kind text,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  a public.articles;
  s public.app_settings;
  run public.generation_runs;
  org_limit int;
  used int;
  spent numeric;
  cutoff timestamptz;
begin
  select * into a from articles where id = p_article_id;
  if not found or coalesce(app.role_in(a.organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('outline', 'body', 'rewrite', 'followup_questions', 'image')
     or coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- 全社の受付を順番に処理する
  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    if run.article_id is distinct from p_article_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  -- 応答が無いまま時間が過ぎた受付は失敗にする（入力は記事側に残っている）。
  -- この後の判定で例外になるとこの更新も取り消されるため、判定そのものは cutoff で行う
  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = a.organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = a.organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 上限に数えるのは本文の生成だけ。失敗した回と時間切れの回は数えない
  if p_kind = 'body' then
    select monthly_generation_limit into org_limit from organizations where id = a.organization_id;
    select count(*) into used from generation_runs
    where organization_id = a.organization_id and kind = 'body' and created_at >= app.month_start()
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= org_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'body'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_body_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- 画像は1記事あたりの回数で止める（1回でアイキャッチと見出しごとの画像をまとめて作る）
  if p_kind = 'image' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'image'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_image_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (a.organization_id, p_article_id, p_kind, p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;

revoke execute on function public.start_keyword_proposal(uuid, text, int) from public;
grant execute on function public.start_keyword_proposal(uuid, text, int) to authenticated;
revoke execute on function app.check_run_org() from public;
grant execute on function app.check_run_org() to authenticated;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.start_keyword_proposal(uuid, text, int) from anon';
    execute 'revoke all on public.keyword_proposals from anon';
  end if;
end $$;

-- ===== 20261102120000_aio_check.sql
-- AIOのチェック（docs/DECISIONS.md 2026-11-02、田村さん「コタムの人の確認は完全になくす」）。
-- 公開前のコタムの確認をやめ、AIが記事を点検して足りない所をお客様に一問一答で聞き返す。
-- コタムはチェックの結果とやり取りを読み、コメント（reviews の comment）を残せる。
-- 書く記事の提案（20261102000000_keyword_proposals.sql）の後に流す。何度流しても同じ結果になるように書いてある（先に流した後で提案の SQL を流したら、もう一度流す）。生成の種類と start_generation は、提案の変更を含めて定義し直す。

-- 1. チェックの記録。作るのと結果を書くのはサーバー（service role）。お客様は答え（answers）だけを書ける
create table if not exists public.aio_checks (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_id uuid not null references public.article_versions (id) on delete cascade,
  status text not null default 'asking' check (status in ('asking', 'done')),
  summary text not null default '',
  -- [{key, ok, note}]
  items jsonb not null default '[]',
  -- [{id, key, text, example}]
  questions jsonb not null default '[]',
  -- [{questionId, text, unknown}]
  answers jsonb not null default '[]' check (jsonb_typeof(answers) = 'array' and length(answers::text) <= 8000),
  result_version_id uuid references public.article_versions (id) on delete set null,
  is_sample boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aio_checks_article_idx on public.aio_checks (article_id, created_at);
create index if not exists aio_checks_org_idx on public.aio_checks (organization_id, created_at);
alter table public.aio_checks enable row level security;

drop policy if exists aio_checks_select on public.aio_checks;
create policy aio_checks_select on public.aio_checks for select to authenticated using (app.is_member(organization_id));
drop policy if exists aio_checks_client_answer on public.aio_checks;
create policy aio_checks_client_answer on public.aio_checks for update to authenticated
  using (app.is_client(organization_id)) with check (app.is_client(organization_id));
grant select, update on public.aio_checks to authenticated;
revoke insert, delete on public.aio_checks from authenticated;

-- お客様が書き換えられるのは答えだけ。結果や状態はサーバーだけが書く
create or replace function app.guard_aio_check_answer() returns trigger
language plpgsql as $$
begin
  if auth.uid() is null or app.is_admin() then
    new.updated_at := now();
    return new;
  end if;
  if new.id <> old.id or new.article_id <> old.article_id or new.organization_id <> old.organization_id
     or new.version_id <> old.version_id or new.status <> old.status or new.summary <> old.summary
     or new.items <> old.items or new.questions <> old.questions
     or new.result_version_id is distinct from old.result_version_id or new.is_sample <> old.is_sample
     or new.created_by is distinct from old.created_by or new.created_at <> old.created_at then
    raise exception 'only answers can be changed' using errcode = '42501';
  end if;
  if old.status <> 'asking' then
    raise exception 'check is closed' using errcode = '42501';
  end if;
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists aio_checks_answer on public.aio_checks;
create trigger aio_checks_answer before update on public.aio_checks
  for each row execute function app.guard_aio_check_answer();
drop trigger if exists aio_checks_org on public.aio_checks;
create trigger aio_checks_org before insert or update on public.aio_checks
  for each row execute function app.check_article_org();

-- 2. 公開前のコタムの確認をなくす。どの会社も、作成中の記事をそのまま「ブログに載せた」にできる
update public.organizations set review_policy = 'optional' where review_policy <> 'optional';
alter table public.organizations alter column review_policy set default 'optional';

-- 3. 生成の受付に「AIOのチェック」（aio_check）を足す。チェックと答えの反映の両方で使う
alter table public.generation_runs drop constraint if exists generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'keyword_proposal', 'aio_check'));

alter table public.app_settings
  add column if not exists article_aio_check_limit int not null default 20 check (article_aio_check_limit >= 0);

create or replace function public.start_generation(
  p_article_id uuid,
  p_kind text,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  a public.articles;
  s public.app_settings;
  run public.generation_runs;
  org_limit int;
  used int;
  spent numeric;
  cutoff timestamptz;
begin
  select * into a from articles where id = p_article_id;
  if not found or coalesce(app.role_in(a.organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_kind not in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'aio_check')
     or coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- 全社の受付を順番に処理する
  select * into s from app_settings where id for update;

  -- 同じキーでの再送は、最初の受付をそのまま返す
  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    -- 記事を指さない受付（書く記事の提案）と同じキーを渡されても、それを返さない
    if run.article_id is distinct from p_article_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  -- 応答が無いまま時間が過ぎた受付は失敗にする（入力は記事側に残っている）。
  -- この後の判定で例外になるとこの更新も取り消されるため、判定そのものは cutoff で行う
  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = a.organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = a.organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  -- 上限に数えるのは本文の生成だけ。失敗した回と時間切れの回は数えない
  if p_kind = 'body' then
    select monthly_generation_limit into org_limit from organizations where id = a.organization_id;
    select count(*) into used from generation_runs
    where organization_id = a.organization_id and kind = 'body' and created_at >= app.month_start()
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= org_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'body'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_body_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- 画像は1記事あたりの回数で止める（1回でアイキャッチと見出しごとの画像をまとめて作る）
  if p_kind = 'image' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'image'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_image_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  -- AIOのチェック（チェックと答えの反映）も1記事あたりの回数で止める
  if p_kind = 'aio_check' then
    select count(*) into used from generation_runs
    where article_id = p_article_id and kind = 'aio_check'
      and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
    if used >= s.article_aio_check_limit then
      raise exception 'limit_reached' using errcode = 'P0001';
    end if;
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (a.organization_id, p_article_id, p_kind, p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;

-- ===== 20261102130000_hearing_ai.sql
-- ヒアリングのAI（docs/DECISIONS.md 2026-11-02「コタムを待たずに書き始める」）。
-- 1. 深掘りの質問：お客様の答えを読み、聞く理由を添えて、かなり深いところまで聞き返す
-- 2. 会社の情報：ヒアリングの答えから会社プロフィールを作る（お客様が確かめる）
-- どちらも記事に属さない生成なので、受付は会社単位（start_hearing_ai）。種類は hearing。
-- 20261102000000_keyword_proposals.sql と 20261102120000_aio_check.sql の後に流す。何度流しても同じ結果になる。

alter table public.generation_runs drop constraint if exists generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check
  check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'keyword_proposal', 'aio_check', 'hearing'));
-- 記事を指さないのは、書く記事の提案とヒアリングだけ
alter table public.generation_runs drop constraint if exists generation_runs_article_check;
alter table public.generation_runs
  add constraint generation_runs_article_check check ((kind in ('keyword_proposal', 'hearing')) = (article_id is null));

-- 1社が1か月に使えるヒアリングのAIの回数（深掘り1回・会社の情報1回をそれぞれ1回と数える）
alter table public.app_settings
  add column if not exists hearing_ai_limit int not null default 300 check (hearing_ai_limit >= 0);

-- 受付。画面からの依頼を受けたサーバーが、利用者のセッションで呼ぶ。
-- 失敗は例外で返し、メッセージをエラーコードにする：forbidden / invalid_input / busy / limit_reached / budget_exceeded
create or replace function public.start_hearing_ai(
  p_organization_id uuid,
  p_idempotency_key text,
  p_input_chars int
) returns public.generation_runs
language plpgsql security definer set search_path = public as $$
declare
  s public.app_settings;
  run public.generation_runs;
  used int;
  spent numeric;
  cutoff timestamptz;
begin
  -- ヒアリングに答えるのはお客様（コタムが代わりに入力するときも使えるよう、コタムも許す）
  if p_organization_id is null or coalesce(app.role_in(p_organization_id), '') not in ('client_member', 'coach') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if coalesce(length(p_idempotency_key), 0) not between 8 and 200
     or p_input_chars is null or p_input_chars not between 0 and 8000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  select * into s from app_settings where id for update;

  select * into run from generation_runs where idempotency_key = p_idempotency_key;
  if found then
    if run.kind <> 'hearing' or run.organization_id <> p_organization_id then
      raise exception 'invalid_input' using errcode = 'P0001';
    end if;
    return run;
  end if;

  cutoff := now() - make_interval(secs => s.generation_timeout_seconds);
  update generation_runs set status = 'failed', error_code = 'timeout', finished_at = now()
  where organization_id = p_organization_id and status in ('queued', 'running') and created_at < cutoff;

  if exists (select 1 from generation_runs
             where organization_id = p_organization_id and status in ('queued', 'running') and created_at >= cutoff) then
    raise exception 'busy' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into spent from generation_runs where created_at >= app.month_start();
  if spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  select count(*) into used from generation_runs
  where organization_id = p_organization_id and kind = 'hearing' and created_at >= app.month_start()
    and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff));
  if used >= s.hearing_ai_limit then
    raise exception 'limit_reached' using errcode = 'P0001';
  end if;

  insert into generation_runs (organization_id, article_id, kind, idempotency_key, input_chars, requested_by)
  values (p_organization_id, null, 'hearing', p_idempotency_key, p_input_chars, auth.uid())
  returning * into run;
  return run;
end;
$$;

revoke execute on function public.start_hearing_ai(uuid, text, int) from public;
grant execute on function public.start_hearing_ai(uuid, text, int) to authenticated;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.start_hearing_ai(uuid, text, int) from anon';
  end if;
end $$;

-- AIが「もう深掘りは要らない」と決めた答え（または深掘りを飛ばした答え）。答えを書き直したら画面が false に戻す
alter table public.hearing_answers add column if not exists deep_dive_done boolean not null default false;

-- ===== 20261102140000_knowledge_import.sql
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

-- ===== 20261102150000_aio_mentions.sql
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

-- ===== 20261102160000_search_console.sql
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

-- ===== 20261103090000_newsletter.sql
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

-- ===== 20261103120000_trial_ai.sql
-- 30秒でためす（/try）のAI（docs/DECISIONS.md 2026-11-03）。ログインしていない人も使うので、行き過ぎないようにする。
-- - 呼ぶのはサーバー（service role）だけ。画面（anon・authenticated）からは呼べない
-- - 1人1日の回数、全体の1日の回数、ためす用の月の予算、全体の月の予算、止めるスイッチ（trial_ai_enabled）
-- - 入力は保存しない。残すのは回数・費用・元に戻せない目印（visitor：IPなどをサーバーの秘密でハッシュしたもの）だけ
-- 何度流しても同じ結果になる。

alter table public.app_settings add column if not exists trial_ai_enabled boolean not null default true;
alter table public.app_settings add column if not exists trial_daily_per_visitor int not null default 3 check (trial_daily_per_visitor >= 0);
alter table public.app_settings add column if not exists trial_daily_total int not null default 100 check (trial_daily_total >= 0);
alter table public.app_settings add column if not exists trial_monthly_budget_yen int not null default 3000 check (trial_monthly_budget_yen >= 0);

create table if not exists public.trial_runs (
  id uuid primary key default gen_random_uuid(),
  visitor text not null check (length(visitor) between 16 and 128),
  status text not null default 'running' check (status in ('running', 'succeeded', 'failed', 'rejected')),
  input_chars int not null check (input_chars between 0 and 2000),
  cost_yen numeric(10, 2) not null default 0 check (cost_yen >= 0),
  error_code text check (error_code is null or length(error_code) <= 40),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index if not exists trial_runs_created_idx on public.trial_runs (created_at);
create index if not exists trial_runs_visitor_idx on public.trial_runs (visitor, created_at);
alter table public.trial_runs enable row level security;
revoke all on public.trial_runs from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.trial_runs from %I', r);
    end if;
  end loop;
end $$;

-- 受付。失敗は例外で返し、メッセージをエラーコードにする：disabled / invalid_input / visitor_limit / daily_limit / budget_exceeded
create or replace function public.start_trial_run(p_visitor text, p_input_chars int)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  s public.app_settings;
  day_start timestamptz := date_trunc('day', now() at time zone 'Asia/Tokyo') at time zone 'Asia/Tokyo';
  mine int;
  total int;
  trial_spent numeric;
  all_spent numeric;
  new_id uuid;
begin
  select * into s from app_settings where id for update;
  if not s.trial_ai_enabled then
    raise exception 'disabled' using errcode = 'P0001';
  end if;
  if coalesce(length(p_visitor), 0) not between 16 and 128 or p_input_chars is null or p_input_chars not between 0 and 2000 then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  select count(*) into mine from trial_runs where visitor = p_visitor and created_at >= day_start;
  if mine >= s.trial_daily_per_visitor then
    raise exception 'visitor_limit' using errcode = 'P0001';
  end if;
  select count(*) into total from trial_runs where created_at >= day_start;
  if total >= s.trial_daily_total then
    raise exception 'daily_limit' using errcode = 'P0001';
  end if;

  select coalesce(sum(cost_yen), 0) into trial_spent from trial_runs where created_at >= app.month_start();
  select coalesce(sum(cost_yen), 0) into all_spent from generation_runs where created_at >= app.month_start();
  if trial_spent >= s.trial_monthly_budget_yen or trial_spent + all_spent >= s.monthly_budget_yen then
    raise exception 'budget_exceeded' using errcode = 'P0001';
  end if;

  insert into trial_runs (visitor, input_chars) values (p_visitor, p_input_chars) returning id into new_id;
  return new_id;
end;
$$;

-- 結果の記録。入力も出力も残さない
create or replace function public.finish_trial_run(p_id uuid, p_status text, p_cost_yen numeric, p_error_code text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_status not in ('succeeded', 'failed', 'rejected') then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;
  update trial_runs
  set status = p_status, cost_yen = greatest(coalesce(p_cost_yen, 0), 0), error_code = left(p_error_code, 40), finished_at = now()
  where id = p_id and status = 'running';
end;
$$;

revoke execute on function public.start_trial_run(text, int) from public;
revoke execute on function public.finish_trial_run(uuid, text, numeric, text) from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke execute on function public.start_trial_run(text, int) from %I', r);
      execute format('revoke execute on function public.finish_trial_run(uuid, text, numeric, text) from %I', r);
    end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.start_trial_run(text, int) to service_role';
    execute 'grant execute on function public.finish_trial_run(uuid, text, numeric, text) to service_role';
  end if;
end $$;

-- ===== 20261103130000_invitation_letter.sql
-- 無料ご招待の招待状（docs/DECISIONS.md 2026-11-03）。全社管理者が招待を作るときに、宛名とひとことを書ける。
-- 招待状のページ（/invite/[token]）は、有効な招待のときだけ、サーバー（service role）が invitation_letter で読む。
-- 何度流しても同じ結果になる。

alter table public.invitations add column if not exists recipient_name text;
alter table public.invitations add column if not exists message text;
alter table public.invitations add column if not exists is_free boolean not null default true;
alter table public.invitations drop constraint if exists invitations_recipient_name_check;
alter table public.invitations add constraint invitations_recipient_name_check check (recipient_name is null or length(recipient_name) <= 40);
alter table public.invitations drop constraint if exists invitations_message_check;
alter table public.invitations add constraint invitations_message_check check (message is null or length(message) <= 400);

-- 招待状の中身。有効な招待のときだけ返す（期限切れ・使用済み・存在しないときは何も返さない）
create or replace function public.invitation_letter(p_token_hash text)
returns table (recipient_name text, message text, is_free boolean)
language sql stable security definer set search_path = public as $$
  select i.recipient_name, i.message, i.is_free
  from invitations i
  where i.token_hash = p_token_hash and i.accepted_at is null and i.expires_at > now();
$$;

revoke execute on function public.invitation_letter(text) from public;
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke execute on function public.invitation_letter(text) from %I', r);
    end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.invitation_letter(text) to service_role';
  end if;
end $$;

-- ===== 20261107090000_writing_plans.sql
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

select 'done' as result;
