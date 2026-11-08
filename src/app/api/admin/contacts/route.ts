import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 「声をかけた」の記録を残す（担当のトップ）。全社管理者だけ。ひとことは200字まで、ログには出さない。

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** 会社ごとの、最後に声をかけた記録（利用金額と利用頻度の画面で使う）。?org= を付けると、その会社のこれまでの記録（新しい順に20件） */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const org = new URL(request.url).searchParams.get("org") ?? "";
  if (org) {
    if (!UUID.test(org)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
    const { data, error } = await createAdminSupabase().from("org_contacts").select("note, created_at").eq("organization_id", org).order("created_at", { ascending: false }).limit(20);
    if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
    return NextResponse.json({ history: (data ?? []).map((c) => ({ at: c.created_at, note: c.note })) }, { headers: { "cache-control": "no-store" } });
  }
  const { data, error } = await createAdminSupabase().from("org_contacts").select("organization_id, note, created_at").order("created_at", { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const contacts: Record<string, { at: string; note: string }> = {};
  for (const c of data ?? []) if (!contacts[c.organization_id]) contacts[c.organization_id] = { at: c.created_at, note: c.note };
  return NextResponse.json({ contacts }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { organizationId?: unknown; note?: unknown } | null;
  const organizationId = typeof body?.organizationId === "string" ? body.organizationId : "";
  if (!UUID.test(organizationId)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 200) : "";
  const { data, error } = await createAdminSupabase()
    .from("org_contacts")
    .insert({ organization_id: organizationId, contacted_by: auth.user.id, note })
    .select("created_at, note")
    .single();
  if (error || !data) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json({ lastContact: { at: data.created_at, note: data.note } });
}
