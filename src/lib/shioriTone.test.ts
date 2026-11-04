import { describe, expect, it } from "vitest";
import { ALL_HOME_LINES, TONES, homeCase, homeLines, isTone, referenceTime } from "./shioriTone";

const base = { publishedThisMonth: 0, workedThisMonth: 0, inProgress: false, totalArticles: 3, daysSinceLastWork: 3 };

describe("しおりの話し方", () => {
  it("場面を選ぶ", () => {
    expect(homeCase({ ...base, totalArticles: 0, daysSinceLastWork: null })).toBe("first");
    expect(homeCase({ ...base, publishedThisMonth: 1, inProgress: true })).toBe("published");
    expect(homeCase({ ...base, inProgress: true })).toBe("inProgress");
    expect(homeCase({ ...base, inProgress: true, daysSinceLastWork: 8 })).toBe("inProgressStale");
    expect(homeCase({ ...base, daysSinceLastWork: 40 })).toBe("away");
    expect(homeCase(base)).toBe("notYet");
  });

  it("厳しさで言い方が変わる", () => {
    expect(homeLines("gentle", base)).not.toEqual(homeLines("strict", base));
    expect(homeLines("normal", base)[0]).toContain("まだ");
  });

  it("どの言い方でも、責める・脅す・約束する言葉を使わない", () => {
    const all = [...Object.values(ALL_HOME_LINES).flatMap((c) => Object.values(c).flat()), ...TONES.map((t) => t.sample)];
    for (const line of all) expect(line).not.toMatch(/ダメ|だめ|怠け|なまけ|サボ|失格|最悪|必ず売|絶対|倒産|潰れ|バカ/);
  });

  it("保存された値を確かめる", () => {
    expect(isTone("strict")).toBe(true);
    expect(isTone("hard")).toBe(false);
    expect(TONES.map((t) => t.id)).toEqual(["gentle", "normal", "strict"]);
  });
});

describe("今の時刻", () => {
  const now = Date.parse("2026-11-04T07:00:00Z");
  it("今月ならそのまま、前の月ならその月の終わり", () => {
    expect(referenceTime("2026-11", now)).toBe(now);
    expect(new Date(referenceTime("2026-10", now)).toISOString()).toBe("2026-10-31T14:59:59.999Z");
  });
});
