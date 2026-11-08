"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { createServerSupabase } from "@/lib/supabase/server";

/** 受付開始を知らせた印を付ける（全社管理者だけ）。email が空なら、まだの人全員に付ける */
export async function markNotified(form: FormData): Promise<void> {
  const supabase = await createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  const { data: isAdmin } = await supabase.from("app_admins").select("user_id").eq("user_id", auth.user.id).maybeSingle();
  if (!isAdmin) return;
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const q = createAdminSupabase().from("signup_waitlist").update({ notified_at: new Date().toISOString() }).is("notified_at", null);
  await (email ? q.eq("email", email) : q);
  revalidatePath("/admin/waitlist");
}
