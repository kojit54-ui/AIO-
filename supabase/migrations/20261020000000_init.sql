-- 初期スキーマ。docs/DATA.md の正本実装。
-- 会社単位のデータはすべて organization_id を持ち、行レベルセキュリティ（RLS）で所属会社に限定する。
-- 記事の状態遷移はトリガーでも検査する（src/lib/workflow.ts と同じ規則）。

create schema if not exists app;

-- ---------------------------------------------------------------------------
-- テーブル
-- ---------------------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  profile jsonb,
  profile_approved_at timestamptz,
  review_policy text not null default 'optional' check (review_policy in ('optional', 'required')),
  monthly_generation_limit int not null default 30 check (monthly_generation_limit >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role text not null check (role in ('client_member', 'coach')),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, organization_id)
);
create index memberships_user_idx on public.memberships (user_id) where revoked_at is null;

-- 全社管理者は会社単位の役割と分けて持つ
create table public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null check (role in ('client_member', 'coach')),
  token_hash text not null unique,
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.coaching_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  target_month date not null check (extract(day from target_month) = 1),
  focus text not null default '',
  audience text not null default '',
  purpose text not null default '',
  avoid text not null default '',
  client_visible_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, target_month)
);

-- 内部メモは顧客に見せない・AIに渡さないため、別テーブルにしてRLSで分ける
create table public.coaching_internal_notes (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  target_month date not null,
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (organization_id, target_month)
);

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  target_month date not null,
  title text not null,
  reader_problem text not null default '',
  message text not null default '',
  sort_order int not null default 0,
  source text not null check (source in ('coach', 'client')),
  created_at timestamptz not null default now()
);

create table public.reference_articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  body text not null,
  url text check (url is null or url ~ '^https?://'),
  published_on date,
  usable_for_ai boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  theme_id uuid not null references public.themes (id),
  status text not null default 'drafting'
    check (status in ('drafting', 'in_review', 'changes_requested', 'approved', 'published')),
  current_version_id uuid,
  approved_version_id uuid,
  review_requested_version_id uuid,
  published_url text check (published_url is null or published_url ~ '^https?://'),
  published_at timestamptz,
  published_without_approval boolean not null default false,
  lock_version int not null default 0,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index articles_org_idx on public.articles (organization_id, updated_at desc);

create table public.article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  version_no int not null,
  answers jsonb not null default '[]',
  outline jsonb not null default '[]',
  title text not null default '',
  title_candidates jsonb not null default '[]',
  body jsonb not null default '[]',
  generation_settings jsonb not null default '{}',
  parent_version_id uuid references public.article_versions (id),
  frozen boolean not null default false,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (article_id, version_no)
);

alter table public.articles
  add constraint articles_current_version_fk foreign key (current_version_id) references public.article_versions (id),
  add constraint articles_approved_version_fk foreign key (approved_version_id) references public.article_versions (id),
  add constraint articles_review_version_fk foreign key (review_requested_version_id) references public.article_versions (id);

create table public.fact_checks (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.article_versions (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location jsonb,
  excerpt text not null,
  kind text not null check (kind in ('number', 'achievement', 'price', 'customer_name', 'other')),
  status text not null default 'unchecked' check (status in ('unchecked', 'confirmed', 'fixed', 'removed')),
  checked_by uuid references auth.users (id),
  checked_at timestamptz
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles (id) on delete cascade,
  version_id uuid not null references public.article_versions (id),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  reviewer_id uuid not null references auth.users (id),
  comment text not null default '',
  decision text not null check (decision in ('comment', 'changes_requested', 'approved')),
  created_at timestamptz not null default now()
);

create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  article_id uuid not null references public.articles (id) on delete cascade,
  kind text not null check (kind in ('outline', 'body', 'rewrite', 'followup_questions')),
  status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed')),
  idempotency_key text not null unique,
  input_chars int not null default 0 check (input_chars <= 8000),
  usage jsonb not null default '{}',
  error_code text,
  result_version_id uuid references public.article_versions (id),
  requested_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create index generation_runs_org_month_idx on public.generation_runs (organization_id, created_at);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid,
  organization_id uuid,
  action text not null,
  target jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 権限判定の関数。RLS内で memberships を引くと再帰するため security definer にする
-- ---------------------------------------------------------------------------

create or replace function app.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.app_admins where user_id = auth.uid());
$$;

create or replace function app.role_in(org uuid) returns text
language sql stable security definer set search_path = public as $$
  select role from public.memberships
  where user_id = auth.uid() and organization_id = org and revoked_at is null;
$$;

create or replace function app.is_member(org uuid) returns boolean
language sql stable as $$
  select app.role_in(org) is not null or app.is_admin();
$$;

create or replace function app.is_coach(org uuid) returns boolean
language sql stable as $$
  select app.role_in(org) = 'coach' or app.is_admin();
$$;

create or replace function app.is_client(org uuid) returns boolean
language sql stable as $$
  select app.role_in(org) = 'client_member';
$$;

-- ---------------------------------------------------------------------------
-- 行レベルセキュリティ
-- ---------------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.app_admins enable row level security;
alter table public.invitations enable row level security;
alter table public.coaching_notes enable row level security;
alter table public.coaching_internal_notes enable row level security;
alter table public.themes enable row level security;
alter table public.reference_articles enable row level security;
alter table public.articles enable row level security;
alter table public.article_versions enable row level security;
alter table public.fact_checks enable row level security;
alter table public.reviews enable row level security;
alter table public.generation_runs enable row level security;
alter table public.audit_logs enable row level security;

create policy org_select on public.organizations for select using (app.is_member(id));
create policy org_update on public.organizations for update using (app.is_coach(id)) with check (app.is_coach(id));
create policy org_admin_insert on public.organizations for insert with check (app.is_admin());

create policy membership_select on public.memberships for select
  using (user_id = auth.uid() or app.is_coach(organization_id));
create policy membership_admin_all on public.memberships for all using (app.is_admin()) with check (app.is_admin());

create policy admins_self on public.app_admins for select using (user_id = auth.uid());

-- 招待の発行・受諾はサーバー（service role）か管理者だけ
create policy invitations_admin on public.invitations for all using (app.is_admin()) with check (app.is_admin());

create policy notes_select on public.coaching_notes for select using (app.is_member(organization_id));
create policy notes_write on public.coaching_notes for all
  using (app.is_coach(organization_id)) with check (app.is_coach(organization_id));

create policy internal_notes_coach on public.coaching_internal_notes for all
  using (app.is_coach(organization_id)) with check (app.is_coach(organization_id));

create policy themes_select on public.themes for select using (app.is_member(organization_id));
create policy themes_coach_write on public.themes for all
  using (app.is_coach(organization_id)) with check (app.is_coach(organization_id));
create policy themes_client_insert on public.themes for insert
  with check (app.is_client(organization_id) and source = 'client');

create policy refs_select on public.reference_articles for select using (app.is_member(organization_id));
create policy refs_write on public.reference_articles for all
  using (app.is_coach(organization_id)) with check (app.is_coach(organization_id));

create policy articles_select on public.articles for select using (app.is_member(organization_id));
create policy articles_client_insert on public.articles for insert
  with check (app.is_client(organization_id) and status = 'drafting');
create policy articles_update on public.articles for update
  using (app.is_member(organization_id)) with check (app.is_member(organization_id));

create policy versions_select on public.article_versions for select using (app.is_member(organization_id));
create policy versions_client_insert on public.article_versions for insert
  with check (app.is_client(organization_id));

create policy facts_select on public.fact_checks for select using (app.is_member(organization_id));
create policy facts_client_write on public.fact_checks for all
  using (app.is_client(organization_id)) with check (app.is_client(organization_id));

create policy reviews_select on public.reviews for select using (app.is_member(organization_id));
create policy reviews_coach_insert on public.reviews for insert
  with check (app.is_coach(organization_id) and reviewer_id = auth.uid());

-- 生成の記録はサーバーが service role で書く。利用者は自社分を読むだけ
create policy runs_select on public.generation_runs for select using (app.is_member(organization_id));

create policy audit_admin_select on public.audit_logs for select using (app.is_admin());

-- ---------------------------------------------------------------------------
-- 整合性のトリガー
-- ---------------------------------------------------------------------------

-- 子テーブルの organization_id が親の記事と一致することを保証する（他社の記事に版を足せないように）
create or replace function app.check_article_org() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.articles a where a.id = new.article_id and a.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger article_versions_org before insert or update on public.article_versions
  for each row execute function app.check_article_org();
create trigger reviews_org before insert or update on public.reviews
  for each row execute function app.check_article_org();
create trigger generation_runs_org before insert or update on public.generation_runs
  for each row execute function app.check_article_org();

create or replace function app.check_fact_org() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.article_versions v where v.id = new.version_id and v.organization_id = new.organization_id) then
    raise exception 'organization mismatch' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger fact_checks_org before insert or update on public.fact_checks
  for each row execute function app.check_fact_org();

-- 確認依頼中・承認済みで固定された版は変更できない
create or replace function app.protect_frozen_version() returns trigger
language plpgsql as $$
begin
  if old.frozen then
    raise exception 'version is frozen' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger article_versions_frozen before update on public.article_versions
  for each row execute function app.protect_frozen_version();

-- 記事の状態遷移を検査する。service role（auth.uid() が null）はサーバー処理として通す
create or replace function app.guard_article_transition() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r text := app.role_in(new.organization_id);
  policy text;
begin
  if auth.uid() is null or app.is_admin() then
    return new;
  end if;
  if new.organization_id <> old.organization_id or new.theme_id <> old.theme_id then
    raise exception 'immutable column' using errcode = '42501';
  end if;
  if new.lock_version <> old.lock_version + 1 then
    raise exception 'lock_version conflict' using errcode = '40001';
  end if;
  select review_policy into policy from public.organizations where id = new.organization_id;

  -- 顧客は承認版を自分で設定できない
  if r = 'client_member' and new.approved_version_id is not null
     and new.approved_version_id is distinct from old.approved_version_id then
    raise exception 'clients cannot approve' using errcode = '42501';
  end if;

  if new.status = old.status then
    if new.status = 'drafting' and r = 'client_member' then
      return new;
    elsif new.status <> 'in_review' then
      -- 承認済み・公開済み・修正依頼のまま本文の版を差し替えることはできない（作成中に戻す）
      if new.current_version_id is distinct from old.current_version_id then
        raise exception 'edit must reset status' using errcode = '42501';
      end if;
      return new;
    end if;
  end if;

  if r = 'client_member' then
    if new.status = 'drafting' and old.status in ('drafting', 'changes_requested', 'approved', 'published') then
      if new.approved_version_id is not null and old.status = 'approved' then
        raise exception 'approval must be cleared on edit' using errcode = '42501';
      end if;
      return new;
    elsif new.status = 'in_review' and old.status = 'in_review' then
      -- 確認待ち中の編集：確認対象の版は変えない
      if new.review_requested_version_id is distinct from old.review_requested_version_id then
        raise exception 'review version is fixed' using errcode = '42501';
      end if;
      return new;
    elsif new.status = 'in_review' and old.status in ('drafting', 'changes_requested') then
      if new.review_requested_version_id is null then
        raise exception 'review version required' using errcode = '42501';
      end if;
      return new;
    elsif new.status = 'published' then
      if old.status = 'approved' then
        new.published_without_approval := false;
        return new;
      elsif policy = 'optional' and old.status = 'drafting' then
        new.published_without_approval := true;
        return new;
      end if;
      raise exception 'approval required' using errcode = '42501';
    end if;
  elsif r = 'coach' then
    if old.status = 'in_review' and new.status in ('approved', 'changes_requested') then
      if new.status = 'approved' and new.approved_version_id is distinct from old.review_requested_version_id then
        raise exception 'must approve the requested version' using errcode = '42501';
      end if;
      return new;
    end if;
  end if;
  raise exception 'invalid transition % -> % by %', old.status, new.status, coalesce(r, 'none') using errcode = '42501';
end;
$$;

create trigger articles_transition before update on public.articles
  for each row execute function app.guard_article_transition();

create or replace function app.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger organizations_touch before update on public.organizations for each row execute function app.touch_updated_at();
create trigger articles_touch before update on public.articles for each row execute function app.touch_updated_at();
create trigger coaching_notes_touch before update on public.coaching_notes for each row execute function app.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 付与。Supabase の authenticated ロールにだけテーブル操作を許し、RLSで絞る
-- ---------------------------------------------------------------------------

grant usage on schema app to authenticated;
grant execute on all functions in schema app to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke insert, update, delete on public.generation_runs, public.audit_logs from authenticated;
