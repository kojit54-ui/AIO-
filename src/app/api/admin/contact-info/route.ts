import { NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 会社ごとの連絡先（担当者名・電話番号）を残す。全社管理者だけ。ログには出さない。
// 表は supabase/migrations/20261108170000_org_contact_followup.sql

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { organizationId?: unknown; name?: unknown; phone?: unknown } | null;
  const organizationId = typeof body?.organizationId === "string" ? body.organizationId : "";
  if (!UUID.test(organizationId)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 40) : "";
  // 電話番号は数字・ハイフン・括弧・+・空白だけ残す
  const phone = typeof body?.phone === "string" ? body.phone.normalize("NFKC").replace(/[^\d\-()+ ]/g, "").trim().slice(0, 30) : "";
  const { error } = await createAdminSupabase()
    .from("org_contact_info")
    .upsert({ organization_id: organizationId, contact_name: name, phone, updated_by: auth.user.id, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json({ info: { name, phone } });
}
