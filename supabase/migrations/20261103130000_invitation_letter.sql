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
