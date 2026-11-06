import { describe, expect, it } from "vitest";
import { liveStepProblems, liveStepSummary } from "./liveCheck";

const usage = { inputTokens: 1, outputTokens: 1 };
const ok = (step: "write" | "review" | "rewrite" | "images", provider: string) => ({ step, provider, usage, ok: true });
const finding = { category: "fact", excerpt: "x", problem: "y", suggestion: "z" } as never;
const review = (provider: string, n: number) => ({ findings: Array(n).fill(finding), provider, rewritten: n > 0 }) as never;

describe("本物のAPIで試したときの点検", () => {
  it("全部成功なら問題なし", () => {
    const r = { steps: [ok("write", "openai"), ok("review", "anthropic"), ok("rewrite", "openai"), ok("images", "google")], review: review("anthropic", 2), imageSuggestions: [{}] as never };
    expect(liveStepProblems(r, "anthropic")).toEqual([]);
  });

  it("点検が失敗したら不合格にする（以前は合格になっていた）", () => {
    const r = {
      steps: [ok("write", "openai"), { step: "review" as const, provider: "anthropic", usage, ok: false, error: "auth" }, ok("images", "google")],
      review: null,
      imageSuggestions: [{}] as never,
    };
    const problems = liveStepProblems(r, "anthropic");
    expect(problems.some((p) => p.includes("点検（anthropic）が失敗"))).toBe(true);
    expect(problems).toContain("点検の結果がありません");
  });

  it("Claudeのキーが無く書き手が代わりに点検したら不合格にする", () => {
    const r = { steps: [ok("write", "openai"), ok("review", "openai"), ok("images", "google")], review: review("openai", 0), imageSuggestions: [{}] as never };
    expect(liveStepProblems(r, "anthropic").some((p) => p.includes("点検役が anthropic ではなく openai"))).toBe(true);
  });

  it("指摘があるのに書き直しが無い・画像の提案が0件なら不合格にする", () => {
    const r = { steps: [ok("write", "openai"), ok("review", "anthropic"), ok("images", "google")], review: review("anthropic", 1), imageSuggestions: [] };
    expect(liveStepProblems(r, "anthropic")).toEqual(["点検の指摘があるのに書き直しが呼ばれていません", "画像の提案が0件です"]);
  });

  it("まとめには本文を含めず、成否と件数だけを出す", () => {
    const r = { steps: [ok("write", "openai"), ok("review", "anthropic")], review: review("anthropic", 3), imageSuggestions: [] };
    expect(liveStepSummary(r)).toBe("write（openai）：成功\nreview（anthropic）：成功\n点検の指摘：3件\n画像の提案：0件");
  });
});
