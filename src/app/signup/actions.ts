"use server";

import { redirect } from "next/navigation";
import { siteOrigin } from "@/lib/auth/origin";
import { normalizeOrgName } from "@/lib/orgName";
import { normalizePersonName } from "@/lib/personName";
import { CONFIRM_PATH } from "@/lib/billing/plan";
import { createSignupOrg, getOrgBilling, signupGate, startCheckout } from "@/lib/billing/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

export interface SignupState {
  sent: boolean;
  error?: string;
  email?: string;
  orgName?: string;
  personName?: string;
}


/**
 * 申し込みの1歩目：会社名・お名前・メールアドレスを受け取り、ログイン用の6桁の番号を送る。
 * 利用者はここで作る（招待のときと同じく、確認済みとして作り、本人のメールに届く番号でだけ入れる）。
 * 会社は、番号でログインできたあと（最終確認の画面）で作る
 */
export async function sendSignupCode(_prev: SignupState, form: FormData): Promise<SignupState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const orgName = normalizeOrgName(String(form.get("orgName") ?? "")) ?? "";
  const personName = normalizePersonName(String(form.get("personName") ?? "")) ?? "";
  const keep = { email, orgName, personName };
  if (!orgName) return { sent: false, ...keep, error: "会社名（屋号）を入れてください" };
  if (!personName) return { sent: false, ...keep, error: "お名前を入れてください" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { sent: false, ...keep, error: "メールアドレスの形を確認してください" };
  const gate = signupGate(email);
  if (gate === "closed") return { sent: false, ...keep, error: "いまは新しいお申し込みを受け付けていません。受付を始めたら、入口のページでお知らせします" };
  if (gate === "test_only") return { sent: false, ...keep, error: "いまは試験中のため、コタムのメールアドレスだけ申し込めます" };

  const admin = createAdminSupabase();
  const meta = { name: personName, signup_org_name: orgName };
  const created = await admin.auth.admin.createUser({ email, email_confirm: true, user_metadata: meta });
  if (created.error && created.error.code !== "email_exists") return { sent: false, ...keep, error: "受け付けられませんでした。少し待ってから、もう一度お試しください" };

  const origin = await siteOrigin();
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(CONFIRM_PATH)}` },
  });
  if (error?.status === 429) return { sent: false, ...keep, error: "続けて送ったため、少し休んでいます。1分ほど待ってから、もう一度押してください" };
  if (error) return { sent: false, ...keep, error: "メールを送れませんでした。少し待ってから、もう一度お試しください" };
  // すでに登録のある人（前に途中までしか進まなかった人）は、ログインのあとで会社名を使えるよう覚えておく
  if (created.error) await rememberSignupNames(admin, email, meta);
  return { sent: true, ...keep };
}

async function rememberSignupNames(admin: ReturnType<typeof createAdminSupabase>, email: string, meta: { name: string; signup_org_name: string }) {
  // メールアドレスから利用者を探す（件数が少ない前提。1ページ目に無ければあきらめ、確認画面で会社名を聞き直す）
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const u = data?.users.find((x) => x.email?.toLowerCase() === email);
  if (!u) return;
  const { data: m } = await admin.from("memberships").select("id").eq("user_id", u.id).is("revoked_at", null).limit(1);
  if (m?.length) return;
  await admin.auth.admin.updateUserById(u.id, { user_metadata: { ...u.user_metadata, signup_org_name: meta.signup_org_name, name: u.user_metadata?.name || meta.name } });
}

/** 最終確認のあと、規約への同意を確かめて Stripe のカード登録の画面へ移る */
export async function goToCheckout(form: FormData): Promise<void> {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user?.email) redirect("/signup");
  if (form.get("agree") !== "on") redirect(`${CONFIRM_PATH}&error=agree`);
  if (signupGate(auth.user.email) !== "ok") redirect(`${CONFIRM_PATH}&error=closed`);

  const admin = createAdminSupabase();
  const orgName = normalizeOrgName(String(form.get("orgName") ?? "")) || normalizeOrgName(auth.user.user_metadata?.signup_org_name ?? "");

  if (!orgName) redirect(`${CONFIRM_PATH}&error=org`);
  const { orgId, invited } = await createSignupOrg(admin, { userId: auth.user.id, orgName, personName: String(auth.user.user_metadata?.name ?? "") });
  if (invited) redirect("/");
  const billing = await getOrgBilling(admin, orgId);
  if (billing && ["trialing", "active", "past_due"].includes(billing.status)) redirect("/");

  let url: string;
  try {
    const { data: org } = await admin.from("organizations").select("name").eq("id", orgId).single();
    ({ url } = await startCheckout(admin, { orgId, orgName: org?.name ?? orgName, userId: auth.user.id, email: auth.user.email, origin: await siteOrigin() }));
  } catch {
    redirect(`${CONFIRM_PATH}&error=stripe`);
  }
  redirect(url);
}
