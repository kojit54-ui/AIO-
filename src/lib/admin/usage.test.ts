import { describe, expect, it } from "vitest";
import { lastMonthStart, needsCall, orgNudges, previousMonth, summarizeUsage, type UsageInput } from "./usage";

// 2026-11-04 16:00 日本時間
const now = new Date("2026-11-04T07:00:00Z");
const base: UsageInput = { now, orgs: [], runs: [], trialRuns: [], activity: [], articles: [], hearing: [], budgetYen: 10000 };

describe("summarizeUsage", () => {
  it("今月と先月の費用を日本時間の月で分ける", () => {
    const s = summarizeUsage({
      ...base,
      orgs: [{ id: "a", name: "A社" }],
      runs: [
        { organization_id: "a", kind: "body", status: "succeeded", cost_yen: "120.5", created_at: "2026-11-01T00:00:00Z" },
        // 10/31 23:30 UTC は日本時間で 11/1 → 今月
        { organization_id: "a", kind: "image", status: "failed", cost_yen: 30, created_at: "2026-10-31T23:30:00Z" },
        // 10/31 14:00 UTC は日本時間で 10/31 → 先月
        { organization_id: "a", kind: "body", status: "succeeded", cost_yen: 200, created_at: "2026-10-31T14:00:00Z" },
      ],
      trialRuns: [{ cost_yen: 5, created_at: "2026-11-02T00:00:00Z" }],
    });
    expect(s.monthLabel).toBe("11月");
    expect(s.lastMonthLabel).toBe("10月");
    expect(s.costThisMonth).toBeCloseTo(150.5);
    expect(s.costLastMonth).toBe(200);
    expect(s.trialCostThisMonth).toBe(5);
    expect(s.failedThisMonth).toBe(1);
    expect(s.byKind.map((k) => k.label)).toEqual(["記事を書く", "画像"]);
    expect(s.budgetRatio).toBeCloseTo(0.01505);
    expect(s.orgs[0].costThisMonth).toBeCloseTo(150.5);
    expect(s.orgs[0].aiRunsThisMonth).toBe(2);
  });

  it("長く使っていない会社とまだ始めていない会社を上に出す", () => {
    const s = summarizeUsage({
      ...base,
      orgs: [
        { id: "busy", name: "よく使う社" },
        { id: "new", name: "新しい社" },
        { id: "sleep", name: "お休み社" },
        { id: "slow", name: "ゆっくり社" },
      ],
      activity: [
        { organization_id: "busy", at: "2026-11-04T01:00:00Z" },
        { organization_id: "busy", at: "2026-11-04T02:00:00Z" },
        { organization_id: "busy", at: "2026-11-02T02:00:00Z" },
        { organization_id: "sleep", at: "2026-10-10T02:00:00Z" },
        { organization_id: "slow", at: "2026-10-27T02:00:00Z" },
      ],
    });
    expect(s.orgs.map((o) => [o.name, o.pace])).toEqual([
      ["お休み社", "sleeping"],
      ["新しい社", "never"],
      ["ゆっくり社", "slow"],
      ["よく使う社", "active"],
    ]);
    const busy = s.orgs.find((o) => o.id === "busy")!;
    expect(busy.activeDays7).toBe(2);
    expect(busy.daysSinceActive).toBe(0);
    expect(s.orgs.find((o) => o.id === "sleep")!.daysSinceActive).toBe(25);
    expect(s.perDay).toHaveLength(14);
    expect(s.perDay.at(-1)).toEqual({ day: "2026-11-04", orgs: 1 });
  });

  it("記事と答えた質問を数える。書きかけの答えは数えない", () => {
    const s = summarizeUsage({
      ...base,
      orgs: [{ id: "a", name: "A社" }],
      articles: [
        { organization_id: "a", status: "drafting" },
        { organization_id: "a", status: "published" },
        { organization_id: "b", status: "published" },
      ],
      hearing: [
        { organization_id: "a", is_draft: false },
        { organization_id: "a", is_draft: true },
      ],
    });
    expect(s.orgs[0]).toMatchObject({ articles: 2, published: 1, answered: 1 });
  });

  it("予算0のときは使い切った扱い", () => {
    expect(summarizeUsage({ ...base, budgetYen: 0 }).budgetRatio).toBe(1);
  });
});

describe("月の計算", () => {
  it("1月の前は前の年の12月", () => {
    expect(previousMonth("2027-01")).toBe("2026-12");
    expect(previousMonth("2026-11")).toBe("2026-10");
  });
  it("先月の1日0時（日本時間）から集める", () => {
    expect(lastMonthStart(now).toISOString()).toBe("2026-09-30T15:00:00.000Z");
  });
});

describe("orgNudges / needsCall（よく使っていても止まっている会社を見落とさない）", () => {
  const base = { pace: "active" as const, answered: 8, articles: 2, published: 1 };
  it("会社のことが終わり、記事を載せていれば声かけ不要", () => {
    expect(orgNudges(base, 8)).toEqual([]);
    expect(needsCall(base, 8)).toBe(false);
  });
  it("会社のことが途中・記事を載せていないと、よく使っていても声をかける", () => {
    expect(orgNudges({ ...base, answered: 2, published: 0 }, 8)).toEqual(["会社のことが途中（2/8問）", "記事をまだ1本も載せていない"]);
    expect(needsCall({ ...base, published: 0 }, 8)).toBe(true);
    expect(orgNudges({ ...base, articles: 0, published: 0 }, 8)).toEqual(["まだ記事を作っていない"]);
  });
  it("まだ始めていない・長く使っていない会社は pace で声をかける（わけは重ねない）", () => {
    expect(orgNudges({ ...base, pace: "never", answered: 0, articles: 0, published: 0 }, 8)).toEqual([]);
    expect(needsCall({ ...base, pace: "never" }, 8)).toBe(true);
    expect(needsCall({ ...base, pace: "sleeping" }, 8)).toBe(true);
  });
});
