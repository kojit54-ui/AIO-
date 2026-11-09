// 自動作業（/api/cron/*）を呼んでよい相手かを確かめる。
// Vercel の Cron は CRON_SECRET、Supabase の pg_cron は SCHEDULER_SECRET を Authorization: Bearer で付けてくる。
// 2026-11-09 Vercel の Cron が本番で呼ばれていないと分かったため、pg_cron からも呼べるようにした（どちらから何回呼ばれても害がない作りにしてある）。

export type CronCaller = "vercel-cron" | "scheduler";

export function cronCaller(authorization: string | null, env: Record<string, string | undefined> = process.env): CronCaller | null {
  if (!authorization) return null;
  const pairs: [CronCaller, string | undefined][] = [
    ["vercel-cron", env.CRON_SECRET],
    ["scheduler", env.SCHEDULER_SECRET],
  ];
  for (const [caller, raw] of pairs) {
    const secret = raw?.trim();
    if (secret && authorization === `Bearer ${secret}`) return caller;
  }
  return null;
}
