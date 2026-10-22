// AIの提供元を差し替えるための境界。提供元はまだ決めていない（docs/DECISIONS.md「未決定」）。
// 提供元ごとの実装はこの interface を満たし、サーバー側（APIキーを持つ側）でだけ使う。

import type { FactCheckKind } from "@/types/domain";
import { buildGenerationInput, type GenerationContext } from "./input";
import { buildUserPrompt, parseBodyResult, parseOutlineResult, SYSTEM_PROMPT, type BodyResult, type OutlineResult } from "./prompt";

export interface AiUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface AiProvider {
  readonly name: string;
  complete(req: { system: string; user: string; maxOutputTokens: number; signal?: AbortSignal }): Promise<{ text: string; usage: AiUsage }>;
}

export async function generateOutline(provider: AiProvider, ctx: GenerationContext, signal?: AbortSignal): Promise<OutlineResult & { usage: AiUsage }> {
  const input = buildGenerationInput(ctx);
  const res = await provider.complete({ system: SYSTEM_PROMPT, user: buildUserPrompt("outline", input), maxOutputTokens: 1500, signal });
  return { ...parseOutlineResult(res.text), usage: res.usage };
}

export async function generateBody(
  provider: AiProvider,
  ctx: GenerationContext,
  headings: string[],
  signal?: AbortSignal,
): Promise<BodyResult & { usage: AiUsage }> {
  const input = buildGenerationInput(ctx);
  const res = await provider.complete({ system: SYSTEM_PROMPT, user: buildUserPrompt("body", input, headings), maxOutputTokens: 6000, signal });
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
