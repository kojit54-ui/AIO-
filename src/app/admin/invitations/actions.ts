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

  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  const { token, hash } = newInviteToken();
  const { error } = await supabase
    .from("invitations")
    .insert({ organization_id: organizationId, email, role, token_hash: hash, created_by: auth.user?.id });
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
