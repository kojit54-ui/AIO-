"use server";

import { redirect } from "next/navigation";
import { googleRedirectTo, isGoogleLoginEnabled } from "@/lib/auth/google";
import { isLoginCodeEnabled, normalizeLoginCode } from "@/lib/auth/loginCode";
import { siteOrigin } from "@/lib/auth/origin";
import { safeNextPath } from "@/lib/auth/token";
import { createServerSupabase } from "@/lib/supabase/server";

export interface LoginState {
  sent: boolean;
  error?: string;
  /** 送った先（6桁の番号を入れるときに使う） */
  email?: string;
  next?: string;
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
  return { sent: true, email, next };
}

export interface CodeState {
  error?: string;
  /** ログインできたときの行き先。画面側でページごと読み直して移る */
  next?: string;
}

/** メールに書いた6桁の番号でログイン（src/lib/auth/loginCode.ts）。合っていれば行き先へ移る */
export async function verifyLoginCode(_prev: CodeState, form: FormData): Promise<CodeState> {
  if (!isLoginCodeEnabled()) return { error: "番号でのログインは準備中です。メールのリンクを押してください" };
  const email = String(form.get("email") ?? "").trim();
  const code = normalizeLoginCode(String(form.get("code") ?? ""));
  const next = safeNextPath(String(form.get("next") ?? ""));
  if (!code) return { error: "メールに書いてある6桁の数字を入れてください" };
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
  if (error?.status === 429) return { error: "短い時間に何度も試されました。少し待ってからお試しください" };
  if (error) return { error: "番号がちがうか、期限が切れています。新しいメールの番号を入れてください" };
  // redirect() だと画面の中だけで移り、ログイン前に読んだ状態（未ログイン）のまま入口ページへ戻されるため、
  // 行き先を返して画面側でページごと読み直す（docs/LESSONS.md）
  return { next };
}

/** Googleでログイン。Google の画面へ移る。招待されていない人は、戻ってきたあとに断る（src/lib/auth/google.ts） */
export async function signInWithGoogle(form: FormData): Promise<void> {
  if (!isGoogleLoginEnabled()) redirect("/login");
  const next = safeNextPath(String(form.get("next") ?? ""));
  const origin = await siteOrigin();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: googleRedirectTo(origin, next), queryParams: { prompt: "select_account" } },
  });
  if (error || !data.url) redirect("/login?error=google_failed");
  redirect(data.url);
}
