// 画面とAPIの受け渡しに使うドメイン型。docs/DATA.md と対応させる。
// 画面試作では src/mock/ の架空データがこの型を満たし、API接続時に差し替える。

export type ArticleStatus = "drafting" | "in_review" | "changes_requested" | "approved" | "published";
export type Role = "client_member" | "coach";
export type ReviewPolicy = "optional" | "required";

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
  /** client_member は所属1社、coach は担当企業（複数） */
  organizationIds: string[];
}

export interface CompanyProfile {
  business: string;
  targetCustomers: string;
  strengths: string;
  tone: string;
  bannedExpressions: string;
  contact: string;
}

export interface Organization {
  id: string;
  name: string;
  profile: CompanyProfile | null;
  profileApprovedAt: string | null;
  reviewPolicy: ReviewPolicy;
  monthlyGenerationLimit: number;
  generationsUsedThisMonth: number;
}

export interface CoachingNote {
  id: string;
  organizationId: string;
  targetMonth: string; // YYYY-MM
  focus: string;
  audience: string;
  purpose: string;
  avoid: string;
  clientVisibleNote: string;
}

/** コタム内部メモ。顧客には見せず、AIにも渡さない */
export interface CoachingInternalNote {
  organizationId: string;
  targetMonth: string;
  note: string;
}

export interface Theme {
  id: string;
  organizationId: string;
  targetMonth: string;
  title: string;
  readerProblem: string;
  message: string;
  sortOrder: number;
  source: "coach" | "client";
}

export interface ReferenceArticle {
  id: string;
  organizationId: string;
  title: string;
  body: string;
  url: string | null;
  publishedOn: string | null;
  usableForAi: boolean;
}

export type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export interface Answer {
  questionId: string;
  text: string;
  /** 「まだ分からない」を選んだ */
  unknown: boolean;
}

export interface ArticleVersion {
  id: string;
  articleId: string;
  versionNo: number;
  title: string;
  titleCandidates: string[];
  outline: { heading: string }[];
  body: Block[];
  answers: Answer[];
  frozen: boolean;
  createdAt: string;
  createdBy: string;
  /** 画面試作で作ったサンプルかどうか（AI未接続の表示に使う） */
  isSample: boolean;
}

export type FactCheckKind = "number" | "achievement" | "price" | "customer_name" | "other";
export type FactCheckStatus = "unchecked" | "confirmed" | "fixed" | "removed";

export interface FactCheck {
  id: string;
  versionId: string;
  excerpt: string;
  kind: FactCheckKind;
  status: FactCheckStatus;
}

export type ReviewDecision = "comment" | "changes_requested" | "approved";

export interface Review {
  id: string;
  articleId: string;
  versionId: string;
  reviewerName: string;
  comment: string;
  decision: ReviewDecision;
  createdAt: string;
}

export interface Article {
  id: string;
  organizationId: string;
  themeId: string;
  status: ArticleStatus;
  currentVersionId: string | null;
  approvedVersionId: string | null;
  reviewRequestedVersionId: string | null;
  publishedUrl: string | null;
  publishedAt: string | null;
  publishedWithoutApproval: boolean;
  lockVersion: number;
  updatedAt: string;
}

export interface ArticleSummary {
  id: string;
  title: string;
  themeTitle: string;
  status: ArticleStatus;
  updatedAt: string;
  hasCoachComment: boolean;
}

export type GenerationErrorCode = "limit_reached" | "timeout" | "provider_error" | "invalid_input";

export interface GenerationRun {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  errorCode?: GenerationErrorCode;
  resultVersionId?: string;
}

export interface Question {
  id: string;
  label: string;
  example: string;
}
