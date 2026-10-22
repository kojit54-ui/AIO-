-- テスト専用。Supabase の auth スキーマと authenticated ロールの最小限の代わり。
-- 本番の Supabase には最初から存在するため、マイグレーションには含めない。
create schema if not exists auth;
create table if not exists auth.users (id uuid primary key, email text);
create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;
grant usage on schema public, auth to authenticated;
grant execute on function auth.uid() to authenticated;
