// AIに渡す情報を組み立てる。渡してよいものだけを型で受け取り、それ以外は入口で落とす。
// 渡すのは：確認済みの会社プロフィール、顧客向け指導メモ、テーマ、今回の回答、AI利用可の過去記事（同じ会社のもの）。
// 渡さないのは：コタム内部メモ、他社のデータ、未確認のプロフィール。

import type { KnowledgeItem } from "@/lib/growth/knowledge";
import { bookToPrompt, type StrengthBook } from "@/lib/strength/book";
import type { Answer, CoachingNote, Organization, Question, ReferenceArticle, Theme } from "@/types/domain";

/** 1回の入力の上限（docs/DECISIONS.md） */
export const MAX_INPUT_CHARS = 8000;

export interface GenerationContext {
  organization: Organization;
  note: CoachingNote | undefined;
  theme: Theme;
  questions: Question[];
  answers: Answer[];
  referenceArticles: ReferenceArticle[];
  /** 会社の知識（これまでに聞いたこと）。src/lib/growth/knowledge.ts で選んだもの */
  knowledge?: KnowledgeItem[];
  /** お客様が確かめた強みの帳面（src/lib/strength/book.ts）。確かめていない下書きは渡さない */
  strengthBook?: StrengthBook | null;
}

export interface GenerationInput {
  profile: Organization["profile"];
  coachingNote: Pick<CoachingNote, "focus" | "audience" | "purpose" | "avoid" | "clientVisibleNote"> | null;
  theme: Pick<Theme, "title" | "readerProblem" | "message">;
  answers: { question: string; answer: string }[];
  /** これまでに聞いた、この会社の知識。今回のテーマに合うものだけを使う */
  companyKnowledge: { label: string; text: string }[];
  referenceArticles: { title: string; body: string }[];
  /** 文字数の上限で削った過去記事の数 */
  droppedReferenceCount: number;
  /**
   * この会社だけの指示（強みの帳面から作る。docs/AIO.md「強みの帳面」）。
   * 素材の上限（8,000字）とは別に数え、上限は MAX_BOOK_PROMPT_CHARS
   */
  companyPrompt?: string;
}

export class InputError extends Error {
  constructor(public readonly code: "invalid_input" | "organization_mismatch", message: string) {
    super(message);
  }
}

function size(input: GenerationInput): number {
  return countedInputChars(input);
}

/** 上限と受付（generation_runs.input_chars は8,000字まで）で数える文字数。この会社だけの指示は別に数える */
export function countedInputChars(input: GenerationInput): number {
  const { companyPrompt: _p, ...rest } = input;
  void _p;
  return JSON.stringify(rest).length;
}

export function buildGenerationInput(ctx: GenerationContext): GenerationInput {
  const orgId = ctx.organization.id;
  if (ctx.theme.organizationId !== orgId || (ctx.note && ctx.note.organizationId !== orgId)) {
    throw new InputError("organization_mismatch", "別の会社のデータが混ざっています");
  }

  const answers = ctx.answers
    .filter((a) => !a.unknown && a.text.trim())
    .map((a) => ({ question: ctx.questions.find((q) => q.id === a.questionId)?.label ?? a.questionId, answer: a.text.trim() }));

  const input: GenerationInput = {
    profile: ctx.organization.profileApprovedAt ? ctx.organization.profile : null,
    coachingNote: ctx.note
      ? {
          focus: ctx.note.focus,
          audience: ctx.note.audience,
          purpose: ctx.note.purpose,
          avoid: ctx.note.avoid,
          clientVisibleNote: ctx.note.clientVisibleNote,
        }
      : null,
    theme: { title: ctx.theme.title, readerProblem: ctx.theme.readerProblem, message: ctx.theme.message },
    answers,
    companyKnowledge: [],
    referenceArticles: [],
    droppedReferenceCount: 0,
  };

  if (size(input) > MAX_INPUT_CHARS) {
    throw new InputError("invalid_input", `回答が長すぎます。合計${MAX_INPUT_CHARS.toLocaleString()}字以内にしてください`);
  }

  // 会社の知識は大事な順に、上限に収まる分だけ入れる（過去記事より先）
  for (const k of ctx.knowledge ?? []) {
    const next = { ...input, companyKnowledge: [...input.companyKnowledge, { label: k.label, text: k.text }] };
    if (size(next) > MAX_INPUT_CHARS) continue;
    input.companyKnowledge = next.companyKnowledge;
  }

  // 過去記事は新しい順に、上限に収まる分だけ入れる
  const refs = ctx.referenceArticles
    .filter((r) => r.organizationId === orgId && r.usableForAi)
    .sort((a, b) => (b.publishedOn ?? "").localeCompare(a.publishedOn ?? ""));
  for (const r of refs) {
    const next = { ...input, referenceArticles: [...input.referenceArticles, { title: r.title, body: r.body }] };
    if (size(next) > MAX_INPUT_CHARS) {
      input.droppedReferenceCount++;
      continue;
    }
    input.referenceArticles = next.referenceArticles;
  }
  const companyPrompt = ctx.strengthBook ? bookToPrompt(ctx.strengthBook) : "";
  return companyPrompt ? { ...input, companyPrompt } : input;
}
