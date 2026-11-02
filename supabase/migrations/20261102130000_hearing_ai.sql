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
