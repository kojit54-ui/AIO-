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

