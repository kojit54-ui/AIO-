"use server";

import { siteOrigin } from "@/lib/auth/origin";
import { safeNextPath } from "@/lib/auth/token";
import { createServerSupabase } from "@/lib/supabase/server";

export interface LoginState {
  sent: boolean;
  error?: string;
}

/** 招待済みの人にだけ、ログイン用のメールを送る。招待されていないかどうかは画面に出さない */
export async function sendLoginLink(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { sent: false, error: "メールアドレスの形を確認してください" };
  const next = safeNextPath(String(form.get("next") ?? ""));
  const origin = await siteOrigin();

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
  });
  // 送信回数の制限だけは利用者に伝える。それ以外（未登録など）は送れたときと同じ表示にする
  if (error?.status === 429) return { sent: false, error: "短い時間に何度も送信されました。少し待ってからお試しください" };
  return { sent: true };
}
