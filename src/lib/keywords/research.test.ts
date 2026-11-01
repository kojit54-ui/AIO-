import { describe, expect, it } from "vitest";
import { RakkoError, type RakkoClient, type RakkoKeyword, type RakkoQuestion } from "./rakko";
import { MAX_SEEDS, collectResearch, demandOf, pickSeeds } from "./research";

function fakeClient(opts: { fail?: Record<string, RakkoError["code"]>; failQuestions?: Record<string, RakkoError["code"]> } = {}) {
  const calls: string[] = [];
  const client: RakkoClient = {
    async suggestKeywords(seed) {
      calls.push(`s:${seed}`);
      const code = opts.fail?.[seed];
      if (code) throw new RakkoError(code, "x");
      const items: RakkoKeyword[] = [
        { keyword: `${seed} 費用`, monthlySearches: 2400, seoDifficulty: 30 },
        { keyword: `${seed} diy`, monthlySearches: 50, seoDifficulty: null },
        { keyword: `${seed} 口コミ`, monthlySearches: null, seoDifficulty: null },
      ];
      return { items, totalCount: 3, consumedCredit: 1.5 };
    },
    async questionSearch(seed) {
      calls.push(`q:${seed}`);
      const code = opts.failQuestions?.[seed] ?? opts.fail?.[seed];
      if (code) throw new RakkoError(code, "x");
      const items: RakkoQuestion[] = [{ question: `${seed}はいくら？`, relativeDemand: 100 }];
      return { items, totalCount: 1, consumedCredit: 1.5 };
    },
    async accountInfo() {
      return { planName: "スタンダード", dueDate: "", creditBalance: 100 };
    },
  };
  return { client, calls };
}

describe("書く記事の提案のための下調べ", () => {
  it("検索数は目安に丸める（数字を渡さない）", () => {
    expect([demandOf(1000), demandOf(999), demandOf(100), demandOf(99), demandOf(0), demandOf(null)]).toEqual(["high", "medium", "medium", "low", "low", "unknown"]);
  });

  it("調べる言葉は空・空白違いの重複を除いて3語まで", () => {
    expect(pickSeeds(["内窓", " ", "内 窓", "浴室　断熱", "外壁", "屋根"])).toEqual(["内窓", "浴室 断熱", "外壁"]);
    expect(MAX_SEEDS).toBe(3);
  });

  it("言葉ごとにサジェストと質問を集め、消費クレジットを足す", async () => {
    const { client } = fakeClient();
    const r = await collectResearch(client, ["内窓", "浴室断熱"]);
    expect(r.research).toEqual([
      {
        seed: "内窓",
        searched: [
          { keyword: "内窓 費用", demand: "high" },
          { keyword: "内窓 diy", demand: "low" },
          { keyword: "内窓 口コミ", demand: "unknown" },
        ],
        questions: ["内窓はいくら？"],
      },
      expect.objectContaining({ seed: "浴室断熱" }),
    ]);
    expect(r.consumedCredit).toBe(6);
    expect(r.problems).toEqual([]);
    expect(JSON.stringify(r.research)).not.toMatch(/2400|monthlySearches/);
  });

  it("1語が失敗しても残りは続け、取れた半分は使う", async () => {
    const { client } = fakeClient({ fail: { 内窓: "unavailable" }, failQuestions: { 外壁: "rate_limited" } });
    const r = await collectResearch(client, ["内窓", "外壁", "屋根"]);
    expect(r.research.map((x) => x.seed)).toEqual(["外壁", "屋根"]);
    expect(r.research[0].questions).toEqual([]);
    expect(r.research[0].searched).toHaveLength(3);
    expect(r.problems).toEqual([
      { seed: "内窓", code: "unavailable" },
      { seed: "外壁", code: "rate_limited" },
    ]);
    expect(r.consumedCredit).toBe(1.5 + 3);
  });

  it("クレジット切れとキーの誤りは、そこで止める", async () => {
    for (const code of ["no_credit", "auth"] as const) {
      const { client, calls } = fakeClient({ fail: { 内窓: code } });
      const r = await collectResearch(client, ["内窓", "外壁"]);
      expect(r.research).toEqual([]);
      expect(r.problems).toEqual([{ seed: "内窓", code }]);
      expect(calls.some((c) => c.endsWith("外壁"))).toBe(false);
    }
  });
});
