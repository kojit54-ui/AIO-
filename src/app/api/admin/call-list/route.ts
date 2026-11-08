import { NextResponse } from "next/server";
import { loadUsageSummary } from "@/lib/admin/loadUsage";
import { createAdminSupabase } from "@/lib/supabase/admin";
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
  /** 最後に声をかけた日時とひとこと（記録の表が無いときは出さない） */
  lastContact?: { at: string; note: string } | null;
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
  // 声をかけた記録（supabase/migrations/20261108150000_org_contacts.sql）。表がまだ無ければ記録の欄を出さない
  const { data: contacts, error } = await createAdminSupabase()
    .from("org_contacts")
    .select("organization_id, note, created_at")
    .in("organization_id", orgs.length ? orgs.map((o) => o.id) : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(500);
  const contactsEnabled = !error;
  if (contactsEnabled) {
    for (const o of orgs) {
      const c = contacts?.find((x) => x.organization_id === o.id);
      o.lastContact = c ? { at: c.created_at, note: c.note } : null;
    }
  }
  return NextResponse.json({ orgs, contactsEnabled }, { headers: { "cache-control": "no-store" } });
}
