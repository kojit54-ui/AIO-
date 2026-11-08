import { redirect } from "next/navigation";
import { UsageView } from "@/components/admin/UsageView";
import { EmptyState, Notice } from "@/components/ui";
import { summarizeUsage } from "@/lib/admin/usage";
import { loadUsageSummary } from "@/lib/admin/loadUsage";
import { sampleUsageInput } from "@/lib/admin/usageSample";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 全社管理者の「利用金額と利用頻度」。?sample=1 で見本（架空の会社）を表示する。

/** 画面を作った時刻（サーバーで1回だけ読む） */
function currentTime(): Date {
  return new Date();
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

  const s = await loadUsageSummary(now);
  if (!s) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-black">利用金額と利用頻度</h1>
        <Notice tone="warn" title="会社の一覧を読めませんでした">時間をおいて、もう一度開いてください。</Notice>
      </main>
    );
  }
  return <UsageView s={s} />;
}
