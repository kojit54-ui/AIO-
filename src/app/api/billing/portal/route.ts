// カードの変更・解約・領収書（Stripe のカスタマーポータル）を開くアドレスを返す。お客様（client_member）だけ。

import { NextResponse } from "next/server";
import { siteOrigin } from "@/lib/auth/origin";
import { openPortal } from "@/lib/billing/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found" }, { status: 404 });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ code: "session_expired" }, { status: 401 });
  const { data: member } = await supabase.from("memberships").select("organization_id").eq("user_id", auth.user.id).is("revoked_at", null).eq("role", "client_member").limit(1).maybeSingle();
  if (!member) return NextResponse.json({ code: "forbidden" }, { status: 403 });
  try {
    return NextResponse.json({ url: await openPortal(createAdminSupabase(), member.organization_id, await siteOrigin()) });
  } catch {
    return NextResponse.json({ code: "portal_failed", message: "お支払いの画面を開けませんでした。少し待ってから、もう一度お試しください" }, { status: 502 });
  }
}
