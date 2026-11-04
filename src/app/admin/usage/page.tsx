import { redirect } from "next/navigation";
import { UsageView } from "@/components/admin/UsageView";
import { EmptyState, Notice } from "@/components/ui";
import { lastMonthStart, summarizeUsage, type UsageActivity } from "@/lib/admin/usage";
import { sampleUsageInput } from "@/lib/admin/usageSample";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 全社管理者の「利用金額と利用頻度」。?sample=1 で見本（架空の会社）を表示する。

/** 画面を作った時刻（サーバーで1回だけ読む） */
function currentTime(): Date {
  return new Date();
}

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

export default async function AdminUsagePage({ searchParams }: { searchParams: Promise<{ sample?: string }> }) {
  const now = currentTime();
  if (!isSupabaseConfigured()) {
    return <UsageView s={summarizeUsage(sampleUsageInput(now))} sample />;
  }
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin/usage");
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) {
    return (
      <main className="page max-w-3xl">
        <EmptyState mood="sad" title="この画面を表示する権限がありません">全社管理者だけが使えます。</EmptyState>
      </main>
    );
  }
  if ((await searchParams).sample === "1") {
    return <UsageView s={summarizeUsage(sampleUsageInput(now))} sample />;
  }

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

  if (orgsRes.error || !orgsRes.data) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-black">利用金額と利用頻度</h1>
        <Notice tone="warn" title="会社の一覧を読めませんでした">時間をおいて、もう一度開いてください。</Notice>
      </main>
    );
  }

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

  const s = summarizeUsage({
    now,
    orgs: orgsRes.data,
    runs,
    trialRuns,
    activity,
    articles,
    hearing,
    budgetYen: Number(settingsRes.data?.monthly_budget_yen ?? 0),
  });
  return <UsageView s={s} />;
}
