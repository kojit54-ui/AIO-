"use server";

import { revalidatePath } from "next/cache";
import { siteOrigin } from "@/lib/auth/origin";
import { newInviteToken } from "@/lib/auth/token";
import { createServerSupabase } from "@/lib/supabase/server";

export interface InviteState {
  link?: string;
  email?: string;
  error?: string;
}

const PATH = "/admin/invitations";

/** 招待リンクを作る。リンクはこの1回だけ表示し、DBにはハッシュだけを残す。全社管理者だけが作れる（RLS） */
export async function createInvitation(_prev: InviteState, form: FormData): Promise<InviteState> {
  const organizationId = String(form.get("organizationId") ?? "");
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const role = String(form.get("role") ?? "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "メールアドレスの形を確認してください" };
  if (role !== "client_member" && role !== "coach") return { error: "役割を選んでください" };
  // 招待状の宛名とひとこと（任意）。無料の札は、顧客担当者への招待だけに付ける
  const recipientName = String(form.get("recipientName") ?? "").trim().slice(0, 40) || null;
  const message = String(form.get("message") ?? "").trim().slice(0, 400) || null;
  const isFree = role === "client_member" && form.get("isFree") === "on";

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const { token, hash } = newInviteToken();
  const base = { organization_id: organizationId, email, role, token_hash: hash, created_by: auth.user?.id };
  let { error } = await supabase.from("invitations").insert({ ...base, recipient_name: recipientName, message, is_free: isFree });
  // 招待状の SQL（20261103130000_invitation_letter.sql）を流す前は、宛名とひとことなしで作る
  if (error && /recipient_name|is_free|message|column/i.test(error.message)) {
    ({ error } = await supabase.from("invitations").insert(base));
  }
  if (error) return { error: "招待を作れませんでした。全社管理者でログインしているか確認してください" };
  revalidatePath(PATH);
  return { link: `${await siteOrigin()}/invite/${token}`, email };
}

export async function revokeMember(form: FormData): Promise<void> {
  const supabase = await createServerSupabase();
  await supabase.rpc("revoke_membership", { p_membership_id: String(form.get("membershipId") ?? "") });
  revalidatePath(PATH);
}

export async function createOrganization(form: FormData): Promise<void> {
  const name = String(form.get("name") ?? "").trim();
  if (!name) return;
  const supabase = await createServerSupabase();
  await supabase.from("organizations").insert({ name });
  revalidatePath(PATH);
}
