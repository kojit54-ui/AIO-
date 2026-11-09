// ログイン中のお客様の会社の、お支払いの状態。招待の会社（行が無い）は plan: invited。?refresh=1 で Stripe から読み直す。

import { type NextRequest, NextResponse } from "next/server";
import { billingView, isEntitled } from "@/lib/billing/plan";
import { getOrgBilling, refreshOrgBilling } from "@/lib/billing/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ plan: "invited", entitled: true });
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ code: "session_expired" }, { status: 401 });
  const { data: member } = await supabase.from("memberships").select("organization_id, role").eq("user_id", auth.user.id).is("revoked_at", null).eq("role", "client_member").limit(1).maybeSingle();
  if (!member) return NextResponse.json({ plan: "invited", entitled: true });
  if (request.nextUrl.searchParams.get("refresh") === "1") await refreshOrgBilling(createAdminSupabase(), member.organization_id).catch(() => undefined);
  // 読むのは本人の権限で（RLS で自分の会社の行だけ）
  const billing = await getOrgBilling(supabase, member.organization_id);
  if (!billing) return NextResponse.json({ plan: "invited", entitled: true });
  return NextResponse.json({ plan: "stripe", status: billing.status, entitled: isEntitled(billing.status), view: billingView(billing), canPortal: billing.hasCustomer && !!billing.subscriptionId });
}
