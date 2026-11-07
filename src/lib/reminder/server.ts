// 「次に書く日」のお知らせメール（サーバー側だけ。/api/cron/writing-reminder から毎朝9時に呼ぶ）。
// 本人が決めた日だけに1通送る。送ったら reminded_on を入れ、同じ日に二度送らない。宛先や本文はログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { SERVICE_NAME } from "@/lib/brand";
import { sendMail, smtpConfig } from "@/lib/newsletter/send";
import { todayJst } from "@/lib/writingDay";

type Row = Record<string, unknown>;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** お知らせメールの中身。責めない・約束しない。1問だけでよいと伝える */
export function renderReminder(orgName: string, appUrl: string) {
  const subject = `今日は、記事を書く日です｜${orgName}さま`;
  const lines = [
    `${orgName}さま`,
    "",
    "しおりです。今日は、前に決めていただいた「記事を書く日」です。",
    "全部やらなくて大丈夫です。今日は1問だけ、5分で答えてみましょう。",
    "答えはそのまま残るので、続きはいつでもできます。",
    "",
    `▶ 今日の1問に答える：${appUrl}`,
    "",
    "書く日は、ホームの「次に書く日」でいつでも変えたり、取り消したりできます。",
    "",
    "――",
    `${SERVICE_NAME}（案内役：しおり）`,
  ];
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;background:#eef4fc;font-family:'Hiragino Maru Gothic ProN','Hiragino Sans','Yu Gothic UI',Meiryo,sans-serif;color:#1e2a3b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4fc"><tr><td align="center" style="padding:16px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
<tr><td style="padding:8px 24px"><p style="margin:0;font-size:12px;color:#5b6b80">${SERVICE_NAME}</p><p style="margin:4px 0 0;font-size:14px">${esc(orgName)}さま</p></td></tr>
<tr><td style="padding:8px 24px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:bottom;padding-right:8px"><img src="${esc(appUrl)}/guide/shiori-face.webp" width="56" height="56" alt="しおり" style="border-radius:50%;background:#cfe2ff;display:block"></td>
<td style="background:#ffffff;border:2px solid #dbe7fb;border-radius:18px;padding:12px 16px;font-size:15px;line-height:1.7">📅 今日は、前に決めていただいた<b>「記事を書く日」</b>です。<br>全部やらなくて大丈夫。今日は<b>1問だけ、5分</b>で答えてみましょう。</td>
</tr></table></td></tr>
<tr><td align="center" style="padding:16px 24px"><a href="${esc(appUrl)}" style="display:inline-block;background:#2f6fdb;color:#ffffff;text-decoration:none;font-weight:900;font-size:17px;padding:14px 28px;border-radius:999px">今日の1問に答える →</a></td></tr>
<tr><td style="padding:4px 24px 16px;font-size:12px;color:#5b6b80;line-height:1.6">答えはそのまま残るので、続きはいつでもできます。<br>書く日は、ホームの「次に書く日」でいつでも変えたり、取り消したりできます。</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text: lines.join("\n"), html };
}

export interface ReminderResult {
  day: string;
  configured: boolean;
  sent: number;
  skipped: number;
  failed: number;
}

/** 今日（日本時間）を「書く日」に決めた人へ、お知らせを送る。dryRun なら数えるだけ */
export async function runWritingReminders(deps: { admin: SupabaseClient; appUrl: string; dryRun?: boolean; now?: Date; env?: Record<string, string | undefined> }): Promise<ReminderResult> {
  const env = deps.env ?? process.env;
  const day = todayJst(deps.now);
  const configured = !!smtpConfig(env);
  const send = configured && !deps.dryRun;
  const result: ReminderResult = { day, configured, sent: 0, skipped: 0, failed: 0 };

  const { data: plans, error } = await deps.admin.from("writing_plans").select("user_id, organization_id").eq("planned_on", day).is("reminded_on", null);
  if (error) return result; // 表をまだ作っていない環境では何もしない
  for (const p of (plans ?? []) as Row[]) {
    const userId = p.user_id as string;
    const orgId = p.organization_id as string;
    if (!send) {
      result.skipped++;
      continue;
    }
    try {
      // 会社から外れた人には送らない
      const { data: m } = await deps.admin.from("memberships").select("user_id").eq("user_id", userId).eq("organization_id", orgId).is("revoked_at", null).limit(1).maybeSingle();
      const { data: u } = await deps.admin.auth.admin.getUserById(userId);
      const to = u.user?.email;
      if (!m || !to) {
        result.skipped++;
        continue;
      }
      const { data: org } = await deps.admin.from("organizations").select("name").eq("id", orgId).maybeSingle();
      const mail = renderReminder(((org as Row | null)?.name as string) || "ご担当", deps.appUrl);
      await sendMail({ to, ...mail }, env);
      await deps.admin.from("writing_plans").update({ reminded_on: day }).eq("user_id", userId).eq("planned_on", day);
      result.sent++;
    } catch (e) {
      console.error("writing reminder failed", { orgId, reason: e instanceof Error ? e.name : "other" });
      result.failed++;
    }
  }
  return result;
}
