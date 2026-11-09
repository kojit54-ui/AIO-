// 初めての請求の前の日のお知らせ（規約 第3条「初めての請求の前の日に、メールでお知らせします」）。
// 毎朝9時（日本時間）の定期作業から呼ぶ。お試しが24時間以内に終わり、まだ送っていない会社へ1回だけ送る。

import type { SupabaseClient } from "@supabase/supabase-js";
import { SERVICE_NAME } from "@/lib/brand";
import { CONTACT_EMAIL } from "@/lib/legal";
import { type Mail, sendMail } from "@/lib/newsletter/send";
import { PRICE_YEN_TAX_INCLUDED, jstDate, jstDateTime, yen } from "./plan";

export function renderTrialReminder(input: { orgName: string; trialEndMs: number; appUrl: string }): Omit<Mail, "to"> {
  const charge = jstDate(input.trialEndMs);
  const cancelBy = jstDateTime(input.trialEndMs - 60_000);
  const lines = [
    `${input.orgName} さま`,
    "",
    `いつも${SERVICE_NAME}をお使いいただき、ありがとうございます。案内役のしおりです。`,
    `7日間のお試しは、明日で終わります。${charge}に、初めての月額 ${yen(PRICE_YEN_TAX_INCLUDED)}（税込）を、ご登録のカードに請求します。`,
    "",
    "このまま続ける場合は、何もしなくて大丈夫です。",
    `やめる場合は、${cancelBy}（日本時間）までに、マイページの「お支払い」から解約してください。料金はかかりません。`,
    `${input.appUrl}/mypage`,
    "",
    "有料になったあとも、マイページからいつでも解約できます（とちゅうで解約したときの日割りの返金はありません）。",
    `わからないことは ${CONTACT_EMAIL} までお知らせください。`,
  ];
  const text = lines.join("\n");
  const html = `<div style="font-family:sans-serif;line-height:1.8;color:#1f2937">${lines
    .map((l) => (l.startsWith("http") ? `<p><a href="${l}">マイページを開く</a></p>` : l ? `<p style="margin:0 0 4px">${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>` : "<br>"))
    .join("")}</div>`;
  return { subject: `【${SERVICE_NAME}】お試しは明日まで。${charge}に初回の請求をします`, text, html };
}

export interface ReminderResult {
  due: number;
  sent: number;
  failed: number;
}

export async function runTrialReminders(deps: { admin: SupabaseClient; appUrl: string; dryRun?: boolean; now?: Date; env?: Record<string, string | undefined> }): Promise<ReminderResult> {
  const now = deps.now ?? new Date();
  const until = new Date(now.getTime() + 24 * 3600_000);
  const { data: rows } = await deps.admin
    .from("org_billing")
    .select("organization_id, trial_end, organizations(name)")
    .eq("status", "trialing")
    .eq("cancel_at_period_end", false)
    .is("trial_reminder_sent_at", null)
    .gt("trial_end", now.toISOString())
    .lte("trial_end", until.toISOString());
  const due = rows ?? [];
  const result: ReminderResult = { due: due.length, sent: 0, failed: 0 };
  if (deps.dryRun) return result;
  for (const r of due) {
    const orgName = (r.organizations as unknown as { name: string } | null)?.name ?? "お客様";
    const mail = renderTrialReminder({ orgName, trialEndMs: new Date(r.trial_end as string).getTime(), appUrl: deps.appUrl });
    const { data: members } = await deps.admin.from("memberships").select("user_id").eq("organization_id", r.organization_id).eq("role", "client_member").is("revoked_at", null);
    let ok = false;
    for (const m of members ?? []) {
      const { data: u } = await deps.admin.auth.admin.getUserById(m.user_id as string);
      if (!u.user?.email) continue;
      try {
        if (await sendMail({ to: u.user.email, ...mail }, deps.env)) ok = true;
      } catch {
        // 1人に送れなくても、ほかの人には送る
      }
    }
    if (ok) {
      await deps.admin.from("org_billing").update({ trial_reminder_sent_at: now.toISOString() }).eq("organization_id", r.organization_id);
      result.sent++;
    } else result.failed++;
  }
  return result;
}
