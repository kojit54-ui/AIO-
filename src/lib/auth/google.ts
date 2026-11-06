// Googleでログイン（docs/TASKS.md T6-7）。招待制のまま。
// - Supabase の「Allow new users to sign up」はオフ（docs/SUPABASE_SETUP.md）なので、招待されていないアドレスの Google アカウントは作られない
// - 招待済みの人は、同じメールアドレスの Google アカウントで入ると、Supabase が今のアカウントにつなぐ
// - 念のため、ログイン後に所属（memberships）か全社管理者（app_admins）があるかを確かめ、無ければログアウトさせる
// ボタンは NEXT_PUBLIC_GOOGLE_LOGIN=on のときだけ出す（Supabase で Google を有効にするまで押せないボタンを出さない）

/** ボタンを出すか。NEXT_PUBLIC_ はビルド時に置き換わるので名前を直接書く */
export function isGoogleLoginEnabled(value: string | undefined = process.env.NEXT_PUBLIC_GOOGLE_LOGIN): boolean {
  return value?.trim().toLowerCase() === "on";
}

/** ログインのあと戻る先（/auth/confirm）に、Google から来たしるしを付ける */
export function googleRedirectTo(origin: string, next: string): string {
  return `${origin}/auth/confirm?via=google&next=${encodeURIComponent(next)}`;
}

/** Google から戻ったときのエラーを、ログイン画面に出す種類に変える */
export type GoogleLoginError = "google_not_invited" | "google_failed";

export function googleErrorFrom(params: URLSearchParams): GoogleLoginError | null {
  const err = params.get("error");
  if (!err) return null;
  const desc = `${params.get("error_code") ?? ""} ${params.get("error_description") ?? ""}`.toLowerCase();
  // 招待されていない（新しい登録がオフ）
  if (desc.includes("signup") || desc.includes("sign up") || desc.includes("not allowed")) return "google_not_invited";
  return "google_failed";
}
