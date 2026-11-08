import { NextResponse } from "next/server";
import { loadUsageSummary } from "@/lib/admin/loadUsage";
import { needsCall, orgNudges, PACE_LABEL } from "@/lib/admin/usage";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { HEARING_QUESTIONS } from "@/prototype/growth";

// 担当のトップの「声をかけたい会社」。「利用金額と利用頻度」と同じ判定で、全社管理者にだけ返す。
// 返すのは会社名・理由・最後に使った日だけ（記事の本文や答えの中身は返さない）。

export const dynamic = "force-dynamic";

export interface CallListItem {
  id: string;
  name: string;
  reasons: string[];
  daysSinceActive: number | null;
}

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const s = await loadUsageSummary(new Date());
  if (!s) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const total = HEARING_QUESTIONS.length;
  const orgs: CallListItem[] = s.orgs
    .filter((o) => needsCall(o, total))
    .map((o) => ({
      id: o.id,
      name: o.name,
      reasons: [...(o.pace === "sleeping" || o.pace === "never" ? [PACE_LABEL[o.pace]] : []), ...orgNudges(o, total)],
      daysSinceActive: o.daysSinceActive,
    }));
  return NextResponse.json({ orgs }, { headers: { "cache-control": "no-store" } });
}
