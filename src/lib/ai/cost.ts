// 生成1回の概算費用（円）。月額予算の判定（generation_runs.cost_yen）に使う。
// 単価は各社の公表値（100万トークンあたりのドル、docs/DECISIONS.md）。為替は固定の概算。
// Gemini 4 Argon は 2026-11-30 まで入力 $2／出力 $10 の導入価格だが、予算を少なく見積もらないよう、その後の $4／$20 で計算する。

import type { AiUsage } from "./provider";

export const PRICE_USD_PER_MTOK: Record<string, { input: number; output: number }> = {
  openai: { input: 2, output: 10 },
  anthropic: { input: 2, output: 10 },
  google: { input: 4, output: 20 },
  sample: { input: 0, output: 0 },
};
export const YEN_PER_USD = 150;

/** provider は AiProvider.name。不明な提供元は高い方の単価で見積もる */
export function estimateCostYen(usage: AiUsage, provider = "openai"): number {
  const price = PRICE_USD_PER_MTOK[provider] ?? PRICE_USD_PER_MTOK.google;
  const usd = (usage.inputTokens * price.input + usage.outputTokens * price.output) / 1_000_000;
  // 小数の誤差で1銭多く切り上げないよう、先に丸めてから切り上げる
  return Math.ceil(Number((usd * YEN_PER_USD * 100).toFixed(6))) / 100;
}
