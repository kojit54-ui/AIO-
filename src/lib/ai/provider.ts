// AIの提供元を差し替えるための境界。文章は OpenAI（Anthropic に切り替え可）、画像は Google（docs/DECISIONS.md）。
// 提供元ごとの実装はこの interface を満たし、サーバー側（APIキーを持つ側）でだけ使う。

import type { FactCheckKind } from "@/types/domain";
import { buildGenerationInput, type GenerationContext } from "./input";
import {
  buildUserPrompt,
  parseBodyResult,
  parseOutlineResult,
  SYSTEM_PROMPT,
  type BodyResult,
  type GenerationKind,
  type OutlineResult,
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
