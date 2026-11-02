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
  /** 記事の質問（q1〜q5・q2_followup）の記入例。会社に合わせてAIが作る（2026-11-02）。無ければ決まった例を出す */
  questionExamples?: Record<string, string>;
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
  /** 画像の提案（Gemini）。本文を作ったときだけある */
  imageIdeas?: { eyecatch: ImageIdea | null; perHeading: ImageIdea[] };
  /** 公開前の点検（Claude）。指摘があれば書き手が書き直した後の本文が body に入る */
  aiReview?: AiReview | null;
  /** この版を作るときにAIに渡した、会社の知識の見出し（src/lib/growth/knowledge.ts） */
  knowledgeUsed?: string[];
}

export interface ImageIdea {
  /** アイキャッチは空 */
  heading: string;
  photoIdea: string;
  alt: string;
  /** 画像を生成するときの指示（英語） */
  imagePrompt: string;
}

/** 作った画像（ナノバナナ）。記事ごと・枠（eyecatch または見出し）ごとに1枚。URLは期限付き */
export interface ArticleImage {
  slot: string;
  alt: string;
  url: string;
  downloadUrl: string;
  isSample: boolean;
  createdAt: string;
}

export type AiReviewCategory = "originality" | "aio" | "ai_tone" | "facts" | "style";

export interface AiReview {
  provider: string;
  summary: string;
  findings: { category: AiReviewCategory; excerpt: string; advice: string }[];
  rewritten: boolean;
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

// busy：同じ会社で生成を実行中。budget_exceeded：全社の月額予算に達して停止中
export type GenerationErrorCode = "limit_reached" | "timeout" | "provider_error" | "invalid_input" | "busy" | "budget_exceeded";

export interface GenerationRun {
  id: string;
  status: "queued" | "running" | "succeeded" | "failed";
  errorCode?: GenerationErrorCode;
  resultVersionId?: string;
}

/** AIO（AIに紹介されるための工夫）で集めたい材料。docs/AIO.md、src/lib/aio.ts */
export type AioPoint = "experience" | "numbers" | "entity" | "qa" | "comparison" | "expertise" | "action" | "trust";

export interface Question {
  id: string;
  label: string;
  example: string;
  /** 答えやすくするためのコツ */
  tip?: string;
  /** この質問で集めるAIOの材料。画面で「なぜ聞くの？」を出す */
  aio?: AioPoint;
}

/** AIOのチェックで見る項目。AIOの8つの材料に、数字の確かさ・使ってほしくない言葉・AIっぽさを足したもの（src/lib/aioCheck.ts） */
export type AioCheckKey = AioPoint | "facts" | "words" | "ai_tone";

export interface AioCheckItem {
  key: AioCheckKey;
  ok: boolean;
  /** 書けている所、または足りない所をひとことで */
  note: string;
}

/** 足りない所を埋めるために、AIがお客様に聞き返す質問 */
export interface AioCheckQuestion {
  id: string;
  key: AioCheckKey;
  text: string;
  example: string;
}

/**
 * AIOのチェック。人（コタム）の確認の代わりに、AIが記事を点検して足りない所を一問一答で聞き返す（docs/DECISIONS.md 2026-11-02）。
 * asking＝聞き返しの答え待ち、done＝終わり（答えを反映した版は resultVersionId）
 */
export interface AioCheck {
  id: string;
  articleId: string;
  organizationId: string;
  versionId: string;
  status: "asking" | "done";
  summary: string;
  items: AioCheckItem[];
  questions: AioCheckQuestion[];
  answers: Answer[];
  resultVersionId: string | null;
  isSample: boolean;
  createdAt: string;
}

/** お客様が取り込んだ会社の知識（ChatGPT・Claude・Gemini のまとめから選んだもの）。記事を作るたびにAIへ渡す */
export interface KnowledgeNote {
  id: string;
  organizationId: string;
  source: "ai_import" | "manual";
  label: string;
  text: string;
  createdAt: string;
}

/** AIに紹介されたかのチェックの結果（1問ずつ）。src/lib/growth/mentions.ts */
export interface AioMention {
  id: string;
  organizationId: string;
  question: string;
  mentioned: boolean;
  excerpt: string;
  sources: { url: string; title: string }[];
  isSample: boolean;
  createdAt: string;
}
