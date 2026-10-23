// AIの提供元を差し替えるための境界。役割ごとに提供元を選ぶ：書き手は OpenAI、点検は Anthropic、画像の提案と生成は Google（docs/DECISIONS.md）。
// 提供元ごとの実装はこの interface を満たし、サーバー側（APIキーを持つ側）でだけ使う。

import type { FactCheckKind } from "@/types/domain";
import { buildGenerationInput, type GenerationContext } from "./input";
import {
  buildUserPrompt,
  IMAGE_SYSTEM_PROMPT,
  parseBodyResult,
  parseImageIdeas,
  parseOutlineResult,
  parseReviewResult,
  REVIEW_SYSTEM_PROMPT,
  SYSTEM_PROMPT,
  type BodyResult,
  type GenerationKind,
  type ImageIdeas,
  type OutlineResult,
  type ReviewResult,
} from "./prompt";

export interface AiUsage {
  inputTokens: number;
  outputTokens: number;
}

/** draft＝普段の生成（速く安い）、finish＝仕上げ（上位モデル） */
export type AiQuality = "draft" | "finish";

export interface AiCompletionRequest {
  kind: GenerationKind;
  system: string;
  user: string;
  maxOutputTokens: number;
  quality?: AiQuality;
  signal?: AbortSignal;
}

export interface AiProvider {
  readonly name: string;
  complete(req: AiCompletionRequest): Promise<{ text: string; usage: AiUsage }>;
}

/** 提供元の失敗を、画面で出し分けられる種類にまとめる */
export class AiProviderError extends Error {
  constructor(
    public readonly code: "auth" | "rate_limited" | "refused" | "truncated" | "unavailable",
    message: string,
  ) {
    super(message);
  }
}

export async function generateOutline(provider: AiProvider, ctx: GenerationContext, signal?: AbortSignal): Promise<OutlineResult & { usage: AiUsage }> {
  const input = buildGenerationInput(ctx);
  const res = await provider.complete({ kind: "outline", system: SYSTEM_PROMPT, user: buildUserPrompt("outline", input), maxOutputTokens: 4000, signal });
  return { ...parseOutlineResult(res.text), usage: res.usage };
}

export async function generateBody(
  provider: AiProvider,
  ctx: GenerationContext,
  headings: string[],
  opts: { quality?: AiQuality; signal?: AbortSignal } = {},
): Promise<BodyResult & { usage: AiUsage }> {
  const input = buildGenerationInput(ctx);
  const res = await provider.complete({
    kind: "body",
    system: SYSTEM_PROMPT,
    user: buildUserPrompt("body", input, headings),
    maxOutputTokens: 16000,
    quality: opts.quality,
    signal: opts.signal,
  });
  const result = parseBodyResult(res.text);
  return { ...result, factChecks: mergeFactChecks(result), usage: res.usage };
}

/** 本文の工程の役割。見出し案は書き手だけで作る */
export interface BodyRoles {
  writer: AiProvider;
  reviewer: AiProvider;
  imageIdeas: AiProvider;
}

/** 工程ごとの使用量。提供元で単価が違うため、費用は工程ごとに計算する */
export interface StepUsage {
  step: "write" | "review" | "rewrite" | "images";
  provider: string;
  usage: AiUsage;
  ok: boolean;
}

export interface ReviewedBodyResult extends BodyResult, ImageIdeas {
  /** 点検の結果。点検に失敗したときは null（下書きのまま出す） */
  review: (ReviewResult & { provider: string; rewritten: boolean }) | null;
  steps: StepUsage[];
}

/**
 * 本文を作る：書き手が書く → 点検役が指摘する（同時に画像の提案役が画像を考える）→ 指摘があれば書き手が1回だけ書き直す。
 * 書き手の最初の1回が失敗したときだけ全体を失敗にする。点検・書き直し・画像の提案が失敗・時間切れになっても、
 * それまでにできた本文で返す。optionalSignal は点検以降に使い、保存の時間を残して打ち切るためのもの。
 */
export async function generateReviewedBody(
  roles: BodyRoles,
  ctx: GenerationContext,
  headings: string[],
  opts: { signal?: AbortSignal; optionalSignal?: AbortSignal } = {},
): Promise<ReviewedBodyResult> {
  const input = buildGenerationInput(ctx);
  const steps: StepUsage[] = [];
  const draftRes = await generateBody(roles.writer, ctx, headings, { signal: opts.signal });
  steps.push({ step: "write", provider: roles.writer.name, usage: draftRes.usage, ok: true });
  const draft = { title: draftRes.titleCandidates[0] ?? "", body: draftRes.body };
  const signal = opts.optionalSignal ?? opts.signal;

  // 呼び出しが成功して返答が読めなかったときも、使った分は費用に数える
  const optional = async <T>(step: StepUsage["step"], provider: AiProvider, req: Omit<AiCompletionRequest, "signal">, parse: (t: string) => T): Promise<T | null> => {
    let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
    try {
      const res = await provider.complete({ ...req, signal });
      usage = res.usage;
      const parsed = parse(res.text);
      steps.push({ step, provider: provider.name, usage, ok: true });
      return parsed;
    } catch {
      steps.push({ step, provider: provider.name, usage, ok: false });
      return null;
    }
  };

  const [review, images] = await Promise.all([
    optional("review", roles.reviewer, { kind: "review", system: REVIEW_SYSTEM_PROMPT, user: buildUserPrompt("review", input, headings, { draft }), maxOutputTokens: 6000 }, parseReviewResult),
    optional("images", roles.imageIdeas, { kind: "images", system: IMAGE_SYSTEM_PROMPT, user: buildUserPrompt("images", input, headings, { draft }), maxOutputTokens: 6000 }, parseImageIdeas),
  ]);

  let final: BodyResult = draftRes;
  if (review?.findings.length) {
    const rewritten = await optional(
      "rewrite",
      roles.writer,
      { kind: "rewrite", system: SYSTEM_PROMPT, user: buildUserPrompt("rewrite", input, headings, { draft, findings: review.findings }), maxOutputTokens: 16000 },
      parseBodyResult,
    );
    if (rewritten) final = rewritten;
  }
  return {
    ...final,
    factChecks: mergeFactChecks(final),
    eyecatch: images?.eyecatch ?? null,
    imageSuggestions: images?.imageSuggestions ?? [],
    review: review ? { ...review, provider: roles.reviewer.name, rewritten: final !== draftRes } : null,
    steps,
  };
}

// AIが挙げ漏らした数値などは、機械的な抽出で補う
const NUMBER_RE = /[0-9０-９]+(?:[.,][0-9]+)?\s*(?:%|％|万円|円|度|年|日間|日|か月|ヶ月|件|社|人|名|倍|回|歳|代)/g;

function mergeFactChecks(result: BodyResult): { excerpt: string; kind: FactCheckKind }[] {
  const out = [...result.factChecks];
  const texts = result.body.flatMap((b) => (b.type === "list" ? b.items : [b.text]));
  for (const t of texts) {
    for (const m of t.matchAll(NUMBER_RE)) {
      if (!out.some((f) => f.excerpt.includes(m[0]))) out.push({ excerpt: m[0], kind: m[0].includes("円") ? "price" : "number" });
    }
  }
  return out;
}
