import { describe, expect, it } from "vitest";
import { AIO_CHECK_LIST } from "@/lib/aioCheck";
import { articleScore, currentScore, previousScore, scoreLevel } from "@/lib/articleScore";
import type { AioCheck } from "@/types/domain";

function check(okKeys: string[], extra: Partial<AioCheck> = {}): AioCheck {
  return {
    id: "c1",
    articleId: "a1",
    organizationId: "o1",
    versionId: "v1",
    status: "done",
    summary: "",
    items: AIO_CHECK_LIST.map((c) => ({ key: c.key, ok: okKeys.includes(c.key), note: "" })),
    questions: [],
    answers: [],
    resultVersionId: null,
    isSample: true,
    createdAt: "2026-11-09T00:00:00Z",
    ...extra,
  };
}
const all = AIO_CHECK_LIST.map((c) => c.key);

describe("記事の点数", () => {
  it("全部OKなら100点、全部足りなければ0点", () => {
    expect(articleScore(check(all), false).score).toBe(100);
    expect(articleScore(check([]), false).score).toBe(0);
  });

  it("足りない項目ごとに、足すと上がる点数を出す", () => {
    const s = articleScore(check(all.slice(1)), false);
    expect(s.score).toBeLessThan(100);
    expect(s.tips).toHaveLength(1);
    expect(s.tips[0].gain).toBe(100 - s.score);
    expect(s.tips[0].ask).not.toBe("");
  });

  it("AIが聞いている項目を先に出し、答えると上がる点数を見せる", () => {
    const c = check(all.slice(2), { status: "asking", questions: [{ id: "q1", key: all[1], text: "?", example: "" }] });
    const s = articleScore(c, false);
    expect(s.tips[0].key).toBe(all[1]);
    expect(s.tips[0].asked).toBe(true);
    expect(s.potential).toBeGreaterThan(s.score);
    expect(s.tips[0].ask).toBe("?");
  });

  it("答えを書き込んだ項目はOKとして数える。「まだ分からない」は数えない", () => {
    const base = { status: "done" as const, resultVersionId: "v2", questions: [{ id: "q1", key: all[0], text: "?", example: "" }, { id: "q2", key: all[1], text: "?", example: "" }] };
    const c = check(all.slice(2), { ...base, answers: [{ questionId: "q1", text: "答え", unknown: false }, { questionId: "q2", text: "", unknown: true }] });
    expect(articleScore(c, true).score).toBeGreaterThan(articleScore(c, false).score);
    expect(articleScore(c, true).tips.map((t) => t.key)).toEqual([all[1]]);
    expect(currentScore([c], "a1", "v2")?.score).toBe(articleScore(c, true).score);
  });

  it("記事が直されたあとの版には、古い点数を出さない", () => {
    expect(currentScore([check(all)], "a1", "v9")).toBeNull();
    expect(currentScore([check(all)], "a1", "v1")?.score).toBe(100);
  });

  it("前回の点数と比べられる", () => {
    const older = check(all.slice(5), { id: "c0", createdAt: "2026-11-01T00:00:00Z" });
    expect(previousScore([check(all), older], "a1", "c1")).toBe(articleScore(older, false).score);
    expect(previousScore([check(all)], "a1", "c1")).toBeNull();
  });

  it("どの点数でも、載せられないとは言わない", () => {
    for (const n of [0, 30, 55, 75, 90, 100]) expect(scoreLevel(n).message).not.toMatch(/載せられません|できません/);
  });
});
