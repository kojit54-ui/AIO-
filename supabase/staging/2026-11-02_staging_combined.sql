-- 検証環境用（2026-11-02）：書く記事の提案・AIOのチェック・ヒアリングのAIを、1回でまとめて流す。
-- すでに AIOのチェックの記録があるため、提案の SQL の種類の一覧に aio_check と hearing を足してある。

-- 書く記事の提案（コタムからの提案）をAIで作る。T5-4（docs/DECISIONS.md 2026-11-01、作るのは CC、点検は Codex）。
-- 記事に属さない生成なので、generation_runs の article_id を空にできるようにし、種類 keyword_proposal を足す。
-- 受付（二重実行・同時実行・全社の予算・会社ごとの月の回数）は start_keyword_proposal、結果の記録は既存の finish_generation。
-- できた提案は keyword_proposals に残し、同じ会社の人がRLSで読む。書き込みはサーバー（service role）だけ。
-- 検索の下調べ（ラッコキーワード）の生データはここに入れない。AIが選んで言いかえた提案だけを残す。

alter table public.generation_runs alter column article_id drop not null;
alter table public.generation_runs drop constraint generation_runs_kind_check;
alter table public.generation_runs
  add constraint generation_runs_kind_check check (kind in ('outline', 'body', 'rewrite', 'followup_questions', 'image', 'keyword_proposal', 'aio_check', 'hearing'));
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
