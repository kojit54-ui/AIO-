// 「利用金額と利用頻度」に使うデータを読む（サーバーだけで使う）。/admin/usage と担当のトップの「声をかけたい会社」で共有する。
import { createAdminSupabase } from "@/lib/supabase/admin";
import { lastMonthStart, summarizeUsage, type UsageActivity, type UsageSummary } from "@/lib/admin/usage";

type Admin = ReturnType<typeof createAdminSupabase>;

/** Supabase は1回に1,000行までなので、ページを分けて読む（最大2万行） */
async function readAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < 20; i++) {
    const { data, error } = await page(i * 1000, i * 1000 + 999);
    if (error || !data) break;
    out.push(...data);
    if (data.length < 1000) break;
  }
  return out;
}

async function listSignIns(admin: Admin): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data) break;
    for (const u of data.users) if (u.last_sign_in_at) map.set(u.id, u.last_sign_in_at);
    if (data.users.length < 1000) break;
  }
  return map;
}

/** 集計まで済ませて返す。会社の一覧を読めなかったときは null */
export async function loadUsageSummary(now: Date): Promise<UsageSummary | null> {
  const admin = createAdminSupabase();
  const since = lastMonthStart(now).toISOString();
  const since30 = new Date(now.getTime() - 31 * 24 * 3600_000).toISOString();
  const [orgsRes, members, runs, trialRuns, settingsRes, articles, hearing, logs, signIns] = await Promise.all([
    admin.from("organizations").select("id, name").order("name"),
    readAll<{ user_id: string; organization_id: string }>((a, b) =>
      admin.from("memberships").select("user_id, organization_id").eq("role", "client_member").is("revoked_at", null).range(a, b),
    ),
    readAll<{ organization_id: string; kind: string; status: string; cost_yen: number; created_at: string; requested_by: string | null }>((a, b) =>
      admin.from("generation_runs").select("organization_id, kind, status, cost_yen, created_at, requested_by").gte("created_at", since).order("created_at").range(a, b),
    ),
    readAll<{ cost_yen: number; created_at: string }>((a, b) => admin.from("trial_runs").select("cost_yen, created_at").gte("created_at", since).order("created_at").range(a, b)),
    admin.from("app_settings").select("monthly_budget_yen").eq("id", true).maybeSingle(),
    readAll<{ organization_id: string; status: string; created_by: string | null; updated_at: string }>((a, b) =>
      admin.from("articles").select("organization_id, status, created_by, updated_at").order("created_at").range(a, b),
    ),
    readAll<{ organization_id: string; is_draft: boolean; updated_by: string | null; updated_at: string }>((a, b) =>
      admin.from("hearing_answers").select("organization_id, is_draft, updated_by, updated_at").order("updated_at").range(a, b),
    ),
    readAll<{ actor_id: string | null; organization_id: string | null; created_at: string }>((a, b) =>
      admin.from("audit_logs").select("actor_id, organization_id, created_at").gte("created_at", since30).not("organization_id", "is", null).order("created_at").range(a, b),
    ),
    listSignIns(admin),
  ]);

  if (orgsRes.error || !orgsRes.data) return null;

  // 顧客担当者がしたことだけを「使った」に数える（コタムの人の作業は数えない）
  const clientOf = new Set(members.map((m) => `${m.organization_id}:${m.user_id}`));
  const byClient = (org: string, user: string | null | undefined) => !!user && clientOf.has(`${org}:${user}`);
  const activity: UsageActivity[] = [
    ...members.flatMap((m) => {
      const at = signIns.get(m.user_id);
      return at ? [{ organization_id: m.organization_id, at }] : [];
    }),
    ...runs.filter((r) => byClient(r.organization_id, r.requested_by)).map((r) => ({ organization_id: r.organization_id, at: r.created_at })),
    ...articles.filter((r) => byClient(r.organization_id, r.created_by)).map((r) => ({ organization_id: r.organization_id, at: r.updated_at })),
    ...hearing.filter((r) => byClient(r.organization_id, r.updated_by)).map((r) => ({ organization_id: r.organization_id, at: r.updated_at })),
    ...logs.filter((r) => byClient(r.organization_id!, r.actor_id)).map((r) => ({ organization_id: r.organization_id!, at: r.created_at })),
  ];

  return summarizeUsage({
    now,
    orgs: orgsRes.data,
    runs,
    trialRuns,
    activity,
    articles,
    hearing,
    budgetYen: Number(settingsRes.data?.monthly_budget_yen ?? 0),
  });
}
