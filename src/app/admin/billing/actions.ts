"use server";

import { revalidatePath } from "next/cache";
import { siteOrigin } from "@/lib/auth/origin";
import { ensureWebhookEndpoint, syncSubscriptionById } from "@/lib/billing/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

async function requireAdmin(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  return !!data;
}

/** Stripe に Webhook の届け先を登録する（何度押しても1つだけ） */
export async function registerWebhook(): Promise<void> {
  if (!(await requireAdmin())) return;
  await ensureWebhookEndpoint(await siteOrigin()).catch(() => undefined);
  revalidatePath("/admin/billing");
}

/** すべての会社の状態を Stripe から読み直す */
export async function resyncAll(): Promise<void> {
  if (!(await requireAdmin())) return;
  const admin = createAdminSupabase();
  const { data } = await admin.from("org_billing").select("stripe_subscription_id").not("stripe_subscription_id", "is", null);
  for (const r of data ?? []) await syncSubscriptionById(admin, r.stripe_subscription_id as string).catch(() => undefined);
  revalidatePath("/admin/billing");
}
