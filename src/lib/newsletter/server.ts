// 毎月のしおり通信を、会社の担当の方へ送る（サーバー側だけ。/api/cron/newsletter から呼ぶ）。
// 会社ごとに記録を読んで MockDb の形にそろえ、画面の見本と同じ中身（content.ts）を作る。
// 受け取らないと決めた人・その月にもう送った人には送らない。送る設定（SMTP）が無ければ、数えるだけで送らない。

import type { SupabaseClient } from "@supabase/supabase-js";
import type { MockDb } from "@/mock/store";
import { answerFromDb, type HearingAnswerRow } from "@/prototype/remote";
import type { ScSnapshot } from "@/types/domain";
import { newsletterInput, renderNewsletter } from "./content";
import { sendMail, smtpConfig, unsubscribeSig, type Mail } from "./send";

type Row = Record<string, unknown>;

/** 前の月（日本時間）。1日の朝に、前の月のまとめを送る */
export function previousMonthJst(now = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 3600_000);
  const d = new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth() - 1, 1));
  return d.toISOString().slice(0, 7);
}

/** 1社分の記録を読んで、しおり通信の計算に要る分だけ MockDb の形にする */
export async function loadOrgDb(admin: SupabaseClient, orgId: string): Promise<MockDb> {
  const q = (table: string, cols = "*") => admin.from(table).select(cols).eq("organization_id", orgId);
  const [org, articles, versions, checks, notes, refs, sc, mentions, hearing] = await Promise.all([
    admin.from("organizations").select("id, name").eq("id", orgId).maybeSingle(),
    q("articles", "id, organization_id, status, current_version_id, published_at, theme_id"),
    q("article_versions", "id, article_id, created_at, body"),
    q("aio_checks", "organization_id, status, items, answers, created_at"),
    q("knowledge_notes", "organization_id, created_at"),
    q("reference_articles", "organization_id"),
    admin.from("search_console").select("*").eq("organization_id", orgId).maybeSingle(),
    q("aio_mentions", "organization_id, mentioned, created_at"),
    q("hearing_answers"),
  ]);
  const rows = (r: { data: unknown }) => ((r.data ?? []) as Row[]);
  return {
    organizations: org.data ? [{ id: orgId, name: (org.data as Row).name as string } as MockDb["organizations"][number]] : [],
    articles: rows(articles).map((a) => ({ id: a.id, organizationId: a.organization_id, status: a.status, currentVersionId: a.current_version_id, publishedAt: a.published_at, themeId: a.theme_id }) as unknown as MockDb["articles"][number]),
    versions: rows(versions).map((v) => ({ id: v.id, articleId: v.article_id, createdAt: v.created_at, body: Array.isArray(v.body) ? v.body : [] }) as unknown as MockDb["versions"][number]),
    aioChecks: checks.error ? [] : rows(checks).map((c) => ({ organizationId: c.organization_id, status: c.status, items: c.items ?? [], answers: c.answers ?? [], createdAt: c.created_at }) as unknown as MockDb["aioChecks"][number]),
    knowledgeNotes: notes.error ? [] : rows(notes).map((n) => ({ organizationId: n.organization_id, createdAt: n.created_at }) as unknown as NonNullable<MockDb["knowledgeNotes"]>[number]),
    referenceArticles: rows(refs).map((r) => ({ organizationId: r.organization_id }) as unknown as MockDb["referenceArticles"][number]),
    searchConsole:
      !sc.error && sc.data
        ? [{ organizationId: orgId, siteUrl: (sc.data as Row).site_url as string, verifiedAt: ((sc.data as Row).verified_at as string) ?? null, lastError: null, snapshot: ((sc.data as Row).snapshot as ScSnapshot) ?? null, fetchedAt: null, isSample: false }]
        : [],
    aioMentions: mentions.error ? [] : rows(mentions).map((m) => ({ organizationId: m.organization_id, mentioned: !!m.mentioned, createdAt: m.created_at }) as unknown as NonNullable<MockDb["aioMentions"]>[number]),
    hearing: hearing.error ? {} : Object.fromEntries(rows(hearing).map((r) => [r.question_id as string, answerFromDb(r as unknown as HearingAnswerRow)])),
    coachingNotes: [],
    internalNotes: [],
    themes: [],
    factChecks: [],
    reviews: [],
    draftAnswers: {},
  };
}

export interface NewsletterResult {
  month: string;
  configured: boolean;
  sent: number;
  skipped: number;
  failed: number;
}

/** 前の月のしおり通信を送る。dryRun なら数えるだけ */
export async function runNewsletter(deps: { admin: SupabaseClient; appUrl: string; dryRun?: boolean; now?: Date; env?: Record<string, string | undefined> }): Promise<NewsletterResult> {
  const env = deps.env ?? process.env;
  const month = previousMonthJst(deps.now);
  const configured = !!smtpConfig(env);
  const send = configured && !deps.dryRun;
  const result: NewsletterResult = { month, configured, sent: 0, skipped: 0, failed: 0 };

  const [{ data: members }, { data: optouts }, { data: sends }] = await Promise.all([
    deps.admin.from("memberships").select("user_id, organization_id").eq("role", "client_member").is("revoked_at", null),
    deps.admin.from("newsletter_optouts").select("user_id"),
    deps.admin.from("newsletter_sends").select("organization_id, user_id, month, stamp_ids"),
  ]);
  const out = new Set(((optouts ?? []) as Row[]).map((r) => r.user_id as string));
  const sentRows = (sends ?? []) as Row[];
  const byOrg = new Map<string, string[]>();
  for (const m of (members ?? []) as Row[]) byOrg.set(m.organization_id as string, [...(byOrg.get(m.organization_id as string) ?? []), m.user_id as string]);

  for (const [orgId, users] of byOrg) {
    const targets = users.filter((u) => !out.has(u) && !sentRows.some((s) => s.organization_id === orgId && s.user_id === u && s.month === month));
    result.skipped += users.length - targets.length;
    if (!targets.length) continue;
    const db = await loadOrgDb(deps.admin, orgId);
    // 前に送ったときのスタンプ（新しく取ったものを出すため）
    const prev = sentRows.filter((s) => s.organization_id === orgId && (s.month as string) < month).sort((a, b) => String(b.month).localeCompare(String(a.month)))[0];
    const input = newsletterInput(db, orgId, month, prev ? (prev.stamp_ids as string[]) : undefined);
    for (const userId of targets) {
      if (!send) {
        result.skipped++;
        continue;
      }
      try {
        const { data: u } = await deps.admin.auth.admin.getUserById(userId);
        const to = u.user?.email;
        if (!to) {
          result.skipped++;
          continue;
        }
        const unsubscribeUrl = `${deps.appUrl}/api/newsletter/unsubscribe?u=${encodeURIComponent(userId)}&s=${unsubscribeSig(userId, env)}`;
        const mail: Mail = { to, ...renderNewsletter(input, { appUrl: deps.appUrl, unsubscribeUrl }) };
        await sendMail(mail, env);
        await deps.admin.from("newsletter_sends").insert({ organization_id: orgId, user_id: userId, month, stamp_ids: input.stampIds });
        result.sent++;
      } catch (e) {
        // 宛先や本文はログに出さない
        console.error("newsletter send failed", { orgId, reason: e instanceof Error ? e.name : "other" });
        result.failed++;
      }
    }
  }
  return result;
}
