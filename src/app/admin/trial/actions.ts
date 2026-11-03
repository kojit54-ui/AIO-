"use server";

// 30秒でためすのAIの設定を変える。全社管理者だけ（docs/DECISIONS.md 2026-11-03）。
// app_settings は画面の鍵では読み書きできないので、管理者だと確かめてから service role で書く。

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";
import { TRIAL_RANGES } from "./ranges";

const PATH = "/admin/trial";

async function requireAdmin(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  return !!data;
}


export async function setTrialEnabled(form: FormData): Promise<void> {
  if (!(await requireAdmin())) return;
  await createAdminSupabase().from("app_settings").update({ trial_ai_enabled: form.get("enabled") === "true", updated_at: new Date().toISOString() }).eq("id", true);
  revalidatePath(PATH);
}

export async function setTrialLimits(form: FormData): Promise<void> {
  if (!(await requireAdmin())) return;
  const patch: Record<string, number | string> = { updated_at: new Date().toISOString() };
  for (const [key, r] of Object.entries(TRIAL_RANGES)) {
    const n = Math.round(Number(form.get(key)));
    if (Number.isFinite(n)) patch[key] = Math.min(r.max, Math.max(r.min, n));
  }
  await createAdminSupabase().from("app_settings").update(patch).eq("id", true);
  revalidatePath(PATH);
}
