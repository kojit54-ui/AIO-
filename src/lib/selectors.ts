// 架空データ（本番ではAPIの応答）から画面用の形を作る関数

import type { MockDb } from "@/mock/store";
import type { ArticleSummary } from "@/types/domain";

export function articleSummaries(db: MockDb, orgId: string): ArticleSummary[] {
  return db.articles
    .filter((a) => a.organizationId === orgId)
    .map((a) => {
      const theme = db.themes.find((t) => t.id === a.themeId);
      const version = db.versions.find((v) => v.id === a.currentVersionId);
      return {
        id: a.id,
        title: version?.title ?? theme?.title ?? "（無題）",
        themeTitle: theme?.title ?? "",
        status: a.status,
        updatedAt: a.updatedAt,
        hasCoachComment: db.reviews.some((r) => r.articleId === a.id),
      };
    })
    .sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
}

/** 記事を開いたときの行き先。本文がまだなら質問画面へ */
export function articleHref(db: MockDb, articleId: string): string {
  const a = db.articles.find((x) => x.id === articleId);
  return a?.currentVersionId ? `/articles/${articleId}` : `/articles/${articleId}/questions`;
}

export function isOrgReady(db: MockDb, orgId: string, month: string): boolean {
  const org = db.organizations.find((o) => o.id === orgId);
  return !!org?.profile && !!org.profileApprovedAt && db.coachingNotes.some((n) => n.organizationId === orgId && n.targetMonth === month);
}
