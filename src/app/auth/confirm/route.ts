// ログイン用メールのリンク先。メールのテンプレートで
// {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=... を指す（docs/SUPABASE_SETUP.md）。
// 別の端末・ブラウザでメールを開いてもログインできるよう、コードの交換ではなく token_hash で確認する。

import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { safeNextPath } from "@/lib/auth/token";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const next = safeNextPath(params.get("next"));

  if (tokenHash && type) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/login?error=link", request.url));
}
