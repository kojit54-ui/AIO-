// 招待リンクの確認と受諾（サーバー側だけで使う）。
// 受諾の流れ：利用者が無ければ作る → DBで期限・使用済みを検査して所属を作る → ログイン用のメールを送る。

import { createAdminSupabase } from "@/lib/supabase/admin";
import { hashInviteToken, isWellFormedToken } from "./token";

export type InvitationStatus = "valid" | "expired" | "used" | "invalid";

export interface InvitationView {
  status: InvitationStatus;
  organizationName?: string;
  /** 本人の確認用。一部を伏せて表示する */
  maskedEmail?: string;
}

export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!domain) return "***";
  return `${name.slice(0, 2)}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

export async function getInvitation(token: string): Promise<InvitationView> {
  if (!isWellFormedToken(token)) return { status: "invalid" };
  const { data, error } = await createAdminSupabase().rpc("invitation_status", { p_token_hash: hashInviteToken(token) }).single<{
    status: InvitationStatus;
    organization_name: string | null;
    email: string | null;
  }>();
  if (error || !data) return { status: "invalid" };
  return {
    status: data.status,
    organizationName: data.organization_name ?? undefined,
    maskedEmail: data.email ? maskEmail(data.email) : undefined,
  };
}

export type AcceptResult = { ok: true } | { ok: false; reason: InvitationStatus | "error" };

export async function acceptInvitation(token: string, origin: string): Promise<AcceptResult> {
  if (!isWellFormedToken(token)) return { ok: false, reason: "invalid" };
  const admin = createAdminSupabase();
  const hash = hashInviteToken(token);

  const { data: inv } = await admin.rpc("invitation_status", { p_token_hash: hash }).single<{ status: InvitationStatus; email: string | null }>();
  if (!inv || inv.status !== "valid" || !inv.email) return { ok: false, reason: inv?.status ?? "invalid" };

  // 招待されたメールアドレスで利用者を作る。すでにいる場合（別の会社に所属済み・退会後の再招待）はそのまま使う
  const created = await admin.auth.admin.createUser({ email: inv.email, email_confirm: true });
  if (created.error && created.error.code !== "email_exists") return { ok: false, reason: "error" };

  const { error } = await admin.rpc("accept_invitation", { p_token_hash: hash });
  if (error) {
    const reason = (["invalid", "expired", "used"] as const).find((r) => error.message.includes(r));
    return { ok: false, reason: reason ?? "error" };
  }

  // 本人のメールに届くリンクでログインしてもらう（招待リンクを知っているだけではログインできない）
  const sent = await admin.auth.signInWithOtp({
    email: inv.email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/confirm?next=/` },
  });
  if (sent.error) return { ok: false, reason: "error" };
  return { ok: true };
}
