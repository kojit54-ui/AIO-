import type { ReviewedBodyResult } from "./provider";

/**
 * 本物のAPIで試したとき（npm run test:live）に、途中の役割が黙って失敗していないかを調べる。
 * 本番では点検・書き直し・画像の提案が失敗しても下書きのまま出す作りなので、
 * 試すときはここで1つずつ確かめ、失敗した役割を日本語で返す（空なら全部成功）。
 * 記事本文は返さない。
 */
export function liveStepProblems(result: Pick<ReviewedBodyResult, "steps" | "review" | "imageSuggestions">, expectedReviewer?: string): string[] {
  const problems: string[] = [];
  const step = (name: string) => result.steps.find((s) => s.step === name);
  const label: Record<string, string> = { write: "本文", review: "点検", rewrite: "書き直し", images: "画像の提案" };

  for (const s of result.steps) {
    if (!s.ok) problems.push(`${label[s.step] ?? s.step}（${s.provider}）が失敗しました：${s.error ?? "理由不明"}`);
  }
  if (!step("review")) problems.push("点検が呼ばれていません");
  else if (!result.review) problems.push("点検の結果がありません");
  if (result.review && expectedReviewer && result.review.provider !== expectedReviewer) {
    problems.push(`点検役が ${expectedReviewer} ではなく ${result.review.provider} になっています（キーが無いと書き手が代わりに点検します）`);
  }
  if (result.review?.findings.length && !step("rewrite")) problems.push("点検の指摘があるのに書き直しが呼ばれていません");
  if (!step("images")) problems.push("画像の提案が呼ばれていません");
  else if (step("images")?.ok && result.imageSuggestions.length === 0) problems.push("画像の提案が0件です");
  return problems;
}

/** 本文を出さずに、役割ごとの結果だけを短くまとめる */
export function liveStepSummary(result: Pick<ReviewedBodyResult, "steps" | "review" | "imageSuggestions">): string {
  const lines = result.steps.map((s) => `${s.step}（${s.provider}）：${s.ok ? "成功" : `失敗 ${s.error ?? ""}`}`);
  if (result.review) lines.push(`点検の指摘：${result.review.findings.length}件`);
  lines.push(`画像の提案：${result.imageSuggestions.length}件`);
  return lines.join("\n");
}
