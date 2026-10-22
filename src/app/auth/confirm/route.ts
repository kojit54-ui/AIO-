// ログイン用メールのリンク先。2つの形を受け付ける（docs/SUPABASE_SETUP.md）。
// - code：Supabase 標準のメール文面。メールを送ったのと同じブラウザで開いたときだけログインできる
// - token_hash：独自SMTPの設定後に文面を差し替えた場合。別の端末で開いてもログインできる

import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { safeNextPath } from "@/lib/auth/token";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;
  const next = safeNextPath(params.get("next"));

  const code = params.get("code");

  if (code || (tokenHash && type)) {
    const supabase = await createServerSupabase();
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ type: type!, token_hash: tokenHash! });
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/login?error=link", request.url));
}
