-- 記事の本数を毎月10本までにする（2026-11-08 田村さん「最低1本。毎月10本まで」）。
-- 画面・料金・規約の文は src/lib/articleQuota.ts。本数は「その月に初めて本文ができた記事」で数え、作り直しは数えない。
-- 本文の生成回数（monthly_generation_limit）は、10本それぞれを作り直せるよう 30 → 50 に上げる（30のままの会社だけ）。
-- start_generation は 20261102120000_aio_check.sql の定義に本数の判定を足したもの。aio_check の SQL を後から流したら、これをもう一度流す。
-- 何度流しても同じ結果になる。

alter table public.organizations
  add column if not exists monthly_article_limit int not null default 10 check (monthly_article_limit >= 0);

alter table public.organizations alter column monthly_generation_limit set default 50;
update public.organizations set monthly_generation_limit = 50 where monthly_generation_limit = 30;

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
  article_limit int;
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
    -- 記事の本数（毎月10本まで）。初めて本文ができた月で数える。すでに本文がある記事の作り直しは本数に数えない
    if not exists (select 1 from generation_runs
                   where article_id = p_article_id and kind = 'body'
                     and (status = 'succeeded' or (status in ('queued', 'running') and created_at >= cutoff))) then
      select monthly_article_limit into article_limit from organizations where id = a.organization_id;
      select count(*) into used from (
        select r.article_id from generation_runs r
        where r.organization_id = a.organization_id and r.kind = 'body' and r.status = 'succeeded'
        group by r.article_id
        having min(r.created_at) >= app.month_start()
      ) x;
      if used >= article_limit then
        raise exception 'article_limit' using errcode = 'P0001';
      end if;
    end if;
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
