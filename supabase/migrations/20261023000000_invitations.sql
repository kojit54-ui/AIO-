-- 招待制ログイン（docs/TASKS.md T2-3）。
-- 招待リンクのトークンはサーバーで作り、DBにはハッシュだけを保存する。期限は発行から7日（invitations.expires_at）。
-- 受諾と状態の確認はサーバー（service role）だけが呼ぶ。所属を外す（退会）と memberships.revoked_at が入り、RLSで何も見えなくなる。

-- 招待の状態を返す。valid / expired / used / invalid
create or replace function public.invitation_status(p_token_hash text)
returns table (status text, organization_name text, email text, role text)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
declare
  inv public.invitations;
begin
  select * into inv from invitations where token_hash = p_token_hash;
  if not found then
    return query select 'invalid'::text, null::text, null::text, null::text;
    return;
  end if;
  return query
  select
    case
      when inv.accepted_at is not null then 'used'
      when inv.expires_at <= now() then 'expired'
      else 'valid'
    end,
    o.name, inv.email, inv.role
  from organizations o where o.id = inv.organization_id;
end;
$$;

-- 招待を受け付ける。auth.users に同じメールアドレスの利用者がいる前提（サーバーが先に作る）。
-- 失敗は例外で返し、メッセージをエラーコードにする：invalid / expired / used / no_user
create or replace function public.accept_invitation(p_token_hash text)
returns table (user_id uuid, organization_id uuid, role text)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  inv public.invitations;
  uid uuid;
begin
  select * into inv from invitations where token_hash = p_token_hash for update;
  if not found then
    raise exception 'invalid' using errcode = 'P0001';
  end if;
  if inv.accepted_at is not null then
    raise exception 'used' using errcode = 'P0001';
  end if;
  if inv.expires_at <= now() then
    raise exception 'expired' using errcode = 'P0001';
  end if;
  select u.id into uid from auth.users u where lower(u.email) = lower(inv.email);
  if uid is null then
    raise exception 'no_user' using errcode = 'P0001';
  end if;

  -- 以前に外された人を招待し直したときは、所属を戻す
  insert into memberships (user_id, organization_id, role)
  values (uid, inv.organization_id, inv.role)
  on conflict on constraint memberships_user_id_organization_id_key
    do update set role = excluded.role, revoked_at = null;
  update invitations set accepted_at = now() where id = inv.id;

  insert into audit_logs (actor_id, organization_id, action, target)
  values (uid, inv.organization_id, 'invitation.accepted', jsonb_build_object('invitation_id', inv.id, 'role', inv.role));
  return query select uid, inv.organization_id, inv.role;
end;
$$;

-- 所属を外す（退会・担当外れ）。全社管理者だけが呼ぶ。未使用の招待も無効にする
create or replace function public.revoke_membership(p_membership_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  m public.memberships;
begin
  if not app.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update memberships set revoked_at = now() where id = p_membership_id and revoked_at is null returning * into m;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  update invitations set expires_at = now()
  where organization_id = m.organization_id and accepted_at is null and expires_at > now()
    and lower(email) = (select lower(email) from auth.users where id = m.user_id);
  insert into audit_logs (actor_id, organization_id, action, target)
  values (auth.uid(), m.organization_id, 'membership.revoked', jsonb_build_object('membership_id', m.id));
end;
$$;

-- 全社管理者が会社の所属者を一覧する（メールアドレスは auth.users にあるため関数で返す）
create or replace function public.list_members(p_organization_id uuid)
returns table (membership_id uuid, user_id uuid, email text, role text, revoked_at timestamptz, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
#variable_conflict use_column
begin
  if not app.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
  select m.id, m.user_id, u.email::text, m.role, m.revoked_at, m.created_at
  from memberships m join auth.users u on u.id = m.user_id
  where m.organization_id = p_organization_id
  order by m.revoked_at nulls first, m.created_at;
end;
$$;

revoke execute on function public.invitation_status(text) from public;
revoke execute on function public.accept_invitation(text) from public;
revoke execute on function public.revoke_membership(uuid) from public;
revoke execute on function public.list_members(uuid) from public;
grant execute on function public.revoke_membership(uuid) to authenticated;
grant execute on function public.list_members(uuid) to authenticated;
do $$
declare r text;
begin
  -- Supabase は public の関数を anon・authenticated に自動で付与するため、明示的に外す
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke execute on function public.invitation_status(text) from %I', r);
      execute format('revoke execute on function public.accept_invitation(text) from %I', r);
    end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke execute on function public.revoke_membership(uuid) from anon';
    execute 'revoke execute on function public.list_members(uuid) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.invitation_status(text) to service_role';
    execute 'grant execute on function public.accept_invitation(text) to service_role';
  end if;
end $$;
