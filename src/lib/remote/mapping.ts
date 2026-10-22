// DBの行（snake_case）と画面の型（src/types/domain.ts）の変換。権限はDBのRLSで絞られた行だけが来る前提。

import type {
  Answer,
  Article,
  ArticleVersion,
  Block,
  CoachingInternalNote,
  CoachingNote,
  CompanyProfile,
  FactCheck,
  Organization,
  ReferenceArticle,
  Review,
  Theme,
} from "@/types/domain";

/* eslint-disable @typescript-eslint/no-explicit-any -- DBの行は supabase-js から型なしで受け取る */
type Row = Record<string, any>;

/** DBの月（YYYY-MM-01）と画面の月（YYYY-MM） */
export const toMonth = (date: string) => date.slice(0, 7);
export const fromMonth = (month: string) => `${month}-01`;

/** 日本時間の今月（YYYY-MM） */
export function currentMonthJst(now = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit" }).format(now).slice(0, 7);
}

export function toOrganization(r: Row, generationsUsedThisMonth: number): Organization {
  return {
    id: r.id,
    name: r.name,
    profile: (r.profile as CompanyProfile | null) ?? null,
    profileApprovedAt: r.profile_approved_at ?? null,
    reviewPolicy: r.review_policy,
    monthlyGenerationLimit: r.monthly_generation_limit,
    generationsUsedThisMonth,
  };
}

export const toCoachingNote = (r: Row): CoachingNote => ({
  id: r.id,
  organizationId: r.organization_id,
  targetMonth: toMonth(r.target_month),
  focus: r.focus,
  audience: r.audience,
  purpose: r.purpose,
  avoid: r.avoid,
  clientVisibleNote: r.client_visible_note,
});

export const toInternalNote = (r: Row): CoachingInternalNote => ({
  organizationId: r.organization_id,
  targetMonth: toMonth(r.target_month),
  note: r.note,
});

export const toTheme = (r: Row): Theme => ({
  id: r.id,
  organizationId: r.organization_id,
  targetMonth: toMonth(r.target_month),
  title: r.title,
  readerProblem: r.reader_problem,
  message: r.message,
  sortOrder: r.sort_order,
  source: r.source,
});

export const toReferenceArticle = (r: Row): ReferenceArticle => ({
  id: r.id,
  organizationId: r.organization_id,
  title: r.title,
  body: r.body,
  url: r.url ?? null,
  publishedOn: r.published_on ?? null,
  usableForAi: r.usable_for_ai,
});

export const toArticle = (r: Row): Article => ({
  id: r.id,
  organizationId: r.organization_id,
  themeId: r.theme_id,
  status: r.status,
  currentVersionId: r.current_version_id ?? null,
  approvedVersionId: r.approved_version_id ?? null,
  reviewRequestedVersionId: r.review_requested_version_id ?? null,
  publishedUrl: r.published_url ?? null,
  publishedAt: r.published_at ?? null,
  publishedWithoutApproval: r.published_without_approval,
  lockVersion: r.lock_version,
  updatedAt: r.updated_at,
});

/** 画面の記事から、利用者が更新してよい列だけを取り出す（organization_id・theme_id は変えない） */
export const fromArticle = (a: Article) => ({
  status: a.status,
  current_version_id: a.currentVersionId,
  approved_version_id: a.approvedVersionId,
  review_requested_version_id: a.reviewRequestedVersionId,
  published_url: a.publishedUrl,
  published_at: a.publishedAt,
  published_without_approval: a.publishedWithoutApproval,
  lock_version: a.lockVersion,
});

export const toVersion = (r: Row): ArticleVersion => ({
  id: r.id,
  articleId: r.article_id,
  versionNo: r.version_no,
  title: r.title,
  titleCandidates: (r.title_candidates as string[]) ?? [],
  outline: (r.outline as { heading: string }[]) ?? [],
  body: (r.body as Block[]) ?? [],
  answers: (r.answers as Answer[]) ?? [],
  frozen: r.frozen,
  createdAt: r.created_at,
  createdBy: r.created_by ?? "",
  isSample: r.generation_settings?.sample === true,
});

export const toFactCheck = (r: Row): FactCheck => ({
  id: r.id,
  versionId: r.version_id,
  excerpt: r.excerpt,
  kind: r.kind,
  status: r.status,
});

export const toReview = (r: Row): Review => ({
  id: r.id,
  articleId: r.article_id,
  versionId: r.version_id,
  reviewerName: r.reviewer_name || "コタム",
  comment: r.comment,
  decision: r.decision,
  createdAt: r.created_at,
});

/** 本文の生成として今月の上限に数える回（成功・実行中）。DBの start_generation と同じ数え方 */
export function countBodyRunsThisMonth(runs: Row[], orgId: string, month: string): number {
  return runs.filter(
    (r) => r.organization_id === orgId && r.kind === "body" && r.status !== "failed" && currentMonthJst(new Date(r.created_at)) === month,
  ).length;
}
