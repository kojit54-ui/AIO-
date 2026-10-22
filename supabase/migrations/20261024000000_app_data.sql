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
