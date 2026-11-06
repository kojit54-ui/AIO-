// ログイン用メールのリンク先。2つの形を受け付ける（docs/SUPABASE_SETUP.md）。
// - code：Supabase 標準のメール文面。メールを送ったのと同じブラウザで開いたときだけログインできる
// - token_hash：独自SMTPの設定後に文面を差し替えた場合。別の端末で開いてもログインできる
// - via=google：Googleでログインから戻ったとき（code）。招待されていない人はログアウトさせる（src/lib/auth/google.ts）

import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { googleErrorFrom } from "@/lib/auth/google";
import { safeNextPath } from "@/lib/auth/token";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const next = safeNextPath(params.get("next"));

  const code = params.get("code");
  const viaGoogle = params.get("via") === "google";
  if (viaGoogle) {
    const err = googleErrorFrom(params);
    if (err) return NextResponse.redirect(new URL(`/login?error=${err}`, request.url));
  }

  if (code || (tokenHash && type)) {
    const supabase = await createServerSupabase();
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ type: type!, token_hash: tokenHash! });
    if (!error && viaGoogle && !(await isInvited(supabase))) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=google_not_invited", request.url));
    }
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL(viaGoogle ? "/login?error=google_failed" : "/login?error=link", request.url));
}

/** 会社に所属しているか、全社管理者か。Google で入った人だけ確かめる */
async function isInvited(supabase: Awaited<ReturnType<typeof createServerSupabase>>): Promise<boolean> {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) return false;
  const admin = createAdminSupabase();
  const [m, a] = await Promise.all([
    admin.from("memberships").select("user_id", { count: "exact", head: true }).eq("user_id", id).is("revoked_at", null),
    admin.from("app_admins").select("user_id", { count: "exact", head: true }).eq("user_id", id),
  ]);
  return (m.count ?? 0) > 0 || (a.count ?? 0) > 0;
}
