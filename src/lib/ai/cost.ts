// 生成1回の概算費用（円）。月額予算の判定（generation_runs.cost_yen）に使う。
// 単価は文章の提供元の公表値（docs/DECISIONS.md 2026-10-22：入力 $2／出力 $10、100万トークンあたり）。為替は固定の概算。

import type { AiUsage } from "./provider";

export const PRICE_USD_PER_MTOK = { input: 2, output: 10 } as const;
export const YEN_PER_USD = 150;

export function estimateCostYen(usage: AiUsage): number {
  const usd = (usage.inputTokens * PRICE_USD_PER_MTOK.input + usage.outputTokens * PRICE_USD_PER_MTOK.output) / 1_000_000;
  // 小数の誤差で1銭多く切り上げないよう、先に丸めてから切り上げる
  return Math.ceil(Number((usd * YEN_PER_USD * 100).toFixed(6))) / 100;
}
