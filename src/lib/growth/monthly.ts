// 月のまとめと、続けた月の数（画面・メールのしおり通信・コタムの画面で使う。サーバーでも使えるように画面の部品から分けた）。

import type { MockDb } from "@/mock/store";

const ym = (iso: string) => iso.slice(0, 7);

/** 記事の本文を作った月が、今月（または先月）から何か月続いているか */
export function writingStreak(db: MockDb, orgId: string, now = new Date()): number {
  const articleIds = new Set(db.articles.filter((a) => a.organizationId === orgId).map((a) => a.id));
  const months = new Set(db.versions.filter((v) => articleIds.has(v.articleId) && v.body.length > 0).map((v) => ym(v.createdAt)));
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  // 今月まだ書いていなければ、先月から数える（月の初めに0にならないように）
  if (!months.has(d.toISOString().slice(0, 7))) d.setUTCMonth(d.getUTCMonth() - 1);
  let n = 0;
  while (months.has(d.toISOString().slice(0, 7))) {
    n++;
    d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return n;
}

export function monthlySummary(db: MockDb, orgId: string, month: string) {
  const articles = db.articles.filter((a) => a.organizationId === orgId);
  const ids = new Set(articles.map((a) => a.id));
  const written = new Set(db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0 && ym(v.createdAt) === month).map((v) => v.articleId)).size;
  const published = articles.filter((a) => a.status === "published" && a.publishedAt && ym(a.publishedAt) === month).length;
  const checks = db.aioChecks.filter((c) => c.organizationId === orgId && ym(c.createdAt) === month);
  const score = checks.length ? Math.round((checks.reduce((n, c) => n + c.items.filter((i) => i.ok).length / Math.max(1, c.items.length), 0) / checks.length) * 100) : null;
  const learned = (db.knowledgeNotes ?? []).filter((n) => n.organizationId === orgId && ym(n.createdAt) === month).length + checks.reduce((n, c) => n + c.answers.filter((a) => !a.unknown && a.text.trim()).length, 0);
  return { written, published, score, learned };
}
