import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 「声をかけた」の記録を残す（担当のトップ）。全社管理者だけ。ひとことは200字まで、ログには出さない。

const DAY = /^\d{4}-\d{2}-\d{2}$/;
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
    const { data, error } = await createAdminSupabase().from("org_contacts").select("note, created_at, next_contact_on").eq("organization_id", org).order("created_at", { ascending: false }).limit(20);
    if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
    return NextResponse.json({ history: (data ?? []).map((c) => ({ at: c.created_at, note: c.note, nextOn: c.next_contact_on ?? null })) }, { headers: { "cache-control": "no-store" } });
  }
  const { data, error } = await createAdminSupabase().from("org_contacts").select("organization_id, note, created_at, next_contact_on").order("created_at", { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  const contacts: Record<string, { at: string; note: string; nextOn: string | null }> = {};
  for (const c of data ?? []) if (!contacts[c.organization_id]) contacts[c.organization_id] = { at: c.created_at, note: c.note, nextOn: c.next_contact_on ?? null };
  // 会社ごとの連絡先（担当者名・電話・お客様のメール）。利用金額と利用頻度の会社カードに出す
  const admin = createAdminSupabase();
  const people: Record<string, { name: string; phone: string; emails: string[] }> = {};
  const [{ data: infos }, { data: ms }] = await Promise.all([
    admin.from("org_contact_info").select("organization_id, contact_name, phone"),
    admin.from("memberships").select("user_id, organization_id").eq("role", "client_member").is("revoked_at", null).limit(300),
  ]);
  for (const i of infos ?? []) people[i.organization_id] = { name: i.contact_name, phone: i.phone, emails: [] };
  const ids = [...new Set((ms ?? []).map((m) => m.user_id))].slice(0, 100);
  const emailOf = new Map<string, string>();
  await Promise.all(
    ids.map(async (id) => {
      const { data: u } = await admin.auth.admin.getUserById(id);
      if (u?.user?.email) emailOf.set(id, u.user.email);
    }),
  );
  for (const m of ms ?? []) {
    const e = emailOf.get(m.user_id);
    if (!e) continue;
    people[m.organization_id] ??= { name: "", phone: "", emails: [] };
    if (people[m.organization_id].emails.length < 3) people[m.organization_id].emails.push(e);
  }
  return NextResponse.json({ contacts, people }, { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { organizationId?: unknown; note?: unknown; nextOn?: unknown } | null;
  const organizationId = typeof body?.organizationId === "string" ? body.organizationId : "";
  if (!UUID.test(organizationId)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 200) : "";
  // 次に連絡する日（任意）。今日から1年先まで
  const nextOn = typeof body?.nextOn === "string" && DAY.test(body.nextOn) && !Number.isNaN(Date.parse(body.nextOn)) ? body.nextOn : null;
  const { data, error } = await createAdminSupabase()
    .from("org_contacts")
    .insert({ organization_id: organizationId, contacted_by: auth.user.id, note, next_contact_on: nextOn })
    .select("created_at, note, next_contact_on")
    .single();
  if (error || !data) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json({ lastContact: { at: data.created_at, note: data.note, nextOn: data.next_contact_on ?? null } });
}
