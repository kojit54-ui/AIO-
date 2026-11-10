-- サイトの自動作業（/api/cron/*）を Supabase の pg_cron から呼ぶ。
-- 2026-11-09 Vercel の Cron（vercel.json）が本番で呼ばれていないと分かったため（docs/DECISIONS.md）。
-- 鍵は Vault の scheduler_secret から読む（Vercel の環境変数 SCHEDULER_SECRET と同じ値）。鍵そのものはこのファイルに書かない。
-- 何度流しても同じ結果になる（cron.schedule は同じ名前なら上書き）。時刻は UTC（vercel.json と同じ）。
-- pg_cron・pg_net の無いデータベース（単体テストの PGlite など）では何もしない。

do $outer$
begin
  if not exists (select 1 from pg_available_extensions where name = 'pg_cron')
     or not exists (select 1 from pg_available_extensions where name = 'pg_net') then
    raise notice 'pg_cron / pg_net が無いので、自動作業の登録を飛ばします';
    return;
  end if;

  create extension if not exists pg_cron;
  create extension if not exists pg_net;

  create or replace function public.call_site_job(job_path text)
  returns bigint
  language plpgsql
  security definer
  set search_path = public, extensions
  as $fn$
  declare
    secret text;
  begin
    select decrypted_secret into secret from vault.decrypted_secrets where name = 'scheduler_secret' limit 1;
    if secret is null then
      raise warning 'call_site_job: scheduler_secret is not set';
      return null;
    end if;
    return net.http_get(
      url := 'https://aio-erabare.jp' || job_path,
      headers := jsonb_build_object('Authorization', 'Bearer ' || secret, 'User-Agent', 'supabase-pg-cron'),
      timeout_milliseconds := 300000
    );
  end;
  $fn$;

  revoke all on function public.call_site_job(text) from public, anon, authenticated;

  perform cron.schedule('site-indexing',         '15 22 * * *', $job$select public.call_site_job('/api/cron/indexing')$job$);
  perform cron.schedule('site-writing-reminder', '0 0 * * *',   $job$select public.call_site_job('/api/cron/writing-reminder')$job$);
  perform cron.schedule('site-billing-reminder', '5 0 * * *',   $job$select public.call_site_job('/api/cron/billing-reminder')$job$);
  perform cron.schedule('site-newsletter',       '0 0 1 * *',   $job$select public.call_site_job('/api/cron/newsletter')$job$);
end
$outer$;
