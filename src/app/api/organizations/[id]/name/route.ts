// 社名を直す（マイページから）。会社の表は顧客担当者が直接書き換えられないので、
// 所属を確かめてから、サーバーが社名だけを書き換える。

import { type NextRequest, NextResponse } from "next/server";
import { normalizeOrgName } from "@/lib/orgName";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  const name = normalizeOrgName(body?.name);
  if (!UUID.test(id)) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  if (!name) return NextResponse.json({ code: "invalid_input", message: "社名は1〜60文字で入れてください（URLや記号の < > は使えません）" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ code: "session_expired", message: "ログインし直してください" }, { status: 401 });
  const { data: member } = await supabase
    .from("memberships")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("organization_id", id)
    .is("revoked_at", null)
    .maybeSingle();
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!member && !isAdmin) return NextResponse.json({ code: "forbidden", message: "この会社の社名は直せません" }, { status: 403 });

  const admin = createAdminSupabase();
  const { error } = await admin.from("organizations").update({ name, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ code: "save_failed", message: "保存できませんでした。少し待ってからもう一度お試しください" }, { status: 500 });
  // 誰がいつ直したかだけを残す（社名そのものは残さない）
  await admin.from("audit_logs").insert({ actor_id: auth.user.id, organization_id: id, action: "organization.renamed", target: {} });
  return NextResponse.json({ name });
}
