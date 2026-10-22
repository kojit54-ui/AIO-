-- 画面を本物のデータにつなぐための追加（docs/TASKS.md T2-9）。

-- 質問への回答の下書き。版を作る前の回答はここに置く
alter table public.articles
  add column draft_answers jsonb not null default '[]',
  add column draft_step int not null default 0 check (draft_step >= 0);

-- レビューに表示する名前（auth.users は利用者から読めないため、書いた時点の名前を残す）
alter table public.reviews add column reviewer_name text not null default '';

-- 確認依頼した版と承認した版は固定する（版の変更は protect_frozen_version が拒否する）。
-- 利用者は版を更新できないため、記事の更新に合わせてDBの中で固定する
create or replace function app.freeze_requested_version() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update article_versions set frozen = true
  where id in (new.review_requested_version_id, new.approved_version_id) and not frozen;
  return new;
end;
$$;
create trigger articles_freeze_versions after insert or update of review_requested_version_id, approved_version_id on public.articles
  for each row execute function app.freeze_requested_version();

-- 顧客がプロフィールの内容を確認した。会社の行は顧客から更新できないため関数で行う
create or replace function public.approve_profile(p_organization_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not coalesce(app.is_client(p_organization_id), false) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update organizations set profile_approved_at = now() where id = p_organization_id and profile is not null;
end;
$$;

revoke execute on function public.approve_profile(uuid) from public;
grant execute on function public.approve_profile(uuid) to authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.approve_profile(uuid) from anon';
  end if;
end $$;

-- 記事の変更と、それに伴う版・要確認箇所・レビューの追加を1つのトランザクションで行う。
-- 利用者の権限で動き（security invoker）、RLSと状態遷移のトリガーはそのまま効く。
-- 版番号はDBの中で決めるため、別の画面が先に版を作っても番号はぶつからない。
-- p_article：記事の新しい値（src/lib/remote/mapping.ts fromArticle の形）。null なら記事は変えない。
--   版を作るときは current_version_id を新しい版の id に置き換える。
-- 失敗は例外で返す：not_found / conflict（lock_version が違う）
create or replace function public.save_article_change(
  p_article_id uuid,
  p_expected_lock int,
  p_article jsonb,
  p_version jsonb default null,
  p_fact_checks jsonb default '[]',
  p_review jsonb default null
) returns uuid
language plpgsql security invoker set search_path = public as $$
declare
  a public.articles;
  art jsonb := p_article;
  vid uuid;
begin
  select * into a from articles where id = p_article_id for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if art is not null and a.lock_version <> p_expected_lock then
    raise exception 'conflict' using errcode = '40001';
  end if;

  if p_version is not null then
    insert into article_versions (article_id, organization_id, version_no, title, title_candidates, outline, body, answers, parent_version_id, generation_settings, created_by)
    values (
      a.id,
      a.organization_id,
      coalesce((select max(version_no) from article_versions where article_id = a.id), 0) + 1,
      coalesce(p_version->>'title', ''),
      coalesce(p_version->'title_candidates', '[]'),
      coalesce(p_version->'outline', '[]'),
      coalesce(p_version->'body', '[]'),
      coalesce(p_version->'answers', '[]'),
      nullif(p_version->>'parent_version_id', '')::uuid,
      coalesce(p_version->'generation_settings', '{}'),
      auth.uid()
    )
    returning id into vid;
    insert into fact_checks (version_id, organization_id, excerpt, kind, status)
    select vid, a.organization_id, x.excerpt, x.kind, coalesce(x.status, 'unchecked')
    from jsonb_to_recordset(coalesce(p_fact_checks, '[]')) as x(excerpt text, kind text, status text);
    if art is not null then
      art := art || jsonb_build_object('current_version_id', vid);
    end if;
  end if;

  if art is not null then
    update articles set
      (status, current_version_id, approved_version_id, review_requested_version_id, published_url, published_at, published_without_approval)
      = (select r.status, r.current_version_id, r.approved_version_id, r.review_requested_version_id, r.published_url, r.published_at, r.published_without_approval
         from jsonb_populate_record(a, art) r),
      lock_version = p_expected_lock + 1
    where id = a.id;
  end if;

  if p_review is not null then
    insert into reviews (article_id, version_id, organization_id, reviewer_id, reviewer_name, comment, decision)
    values (
      a.id,
      (p_review->>'version_id')::uuid,
      a.organization_id,
      auth.uid(),
      coalesce(p_review->>'reviewer_name', ''),
      coalesce(p_review->>'comment', ''),
      p_review->>'decision'
    );
  end if;
  return vid;
end;
$$;

revoke execute on function public.save_article_change(uuid, int, jsonb, jsonb, jsonb, jsonb) from public;
grant execute on function public.save_article_change(uuid, int, jsonb, jsonb, jsonb, jsonb) to authenticated;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.save_article_change(uuid, int, jsonb, jsonb, jsonb, jsonb) from anon';
  end if;
end $$;
