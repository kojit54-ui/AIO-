import { describe, expect, it } from "vitest";
import { MFG_ITEMS, articleIdeasFor, detectIndustries, isManufacturing, mfgCounts, mfgTipOfDay, mfgWriterRules, readerQuestionsFor, readerTermsFor } from "./index";

describe("製造業の知識表", () => {
  it("形・長さ・出典がそろっている", () => {
    expect(MFG_ITEMS.length).toBeGreaterThan(1400);
    expect(new Set(MFG_ITEMS.map((x) => x.id)).size).toBe(MFG_ITEMS.length);
    for (const x of MFG_ITEMS) {
      expect(x.title.length, x.id).toBeLessThanOrEqual(40);
      expect(x.summary.length, x.id).toBeLessThanOrEqual(130);
      expect(x.source.url, x.id).toMatch(/^https?:\/\/[^\s]+\.[^\s]+/);
      expect(x.industries.length, x.id).toBeGreaterThan(0);
      if (x.source.date) expect(x.source.date, x.id).toMatch(/^\d{4}(-\d{2})?$/);
    }
  });

  it("6つの種類がそろっている", () => {
    const c = mfgCounts();
    expect(Object.keys(c).length).toBe(6);
    for (const k of Object.keys(c) as (keyof typeof c)[]) expect(c[k], k).toBeGreaterThan(40);
  });

  it("同じ見出しが重ならない", () => {
    const titles = MFG_ITEMS.map((x) => x.title.replace(/[\s　？?！!。、「」]/g, ""));
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("業種ごとに、読む人の疑問と言葉の説明が集まっている", () => {
    for (const ind of ["切削加工", "板金", "溶接", "樹脂成形", "金型", "表面処理", "食品製造", "印刷", "基板実装", "装置"]) {
      const n = MFG_ITEMS.filter((x) => x.industries.includes(ind)).length;
      expect(n, ind).toBeGreaterThan(15);
    }
    expect(readerTermsFor("ステンレスの精密板金", 3).length).toBe(3);
  });

  it("会社の説明から業種を当てる", () => {
    expect(detectIndustries("アルミのNC旋盤とマシニングによる部品加工")).toEqual(expect.arrayContaining(["切削加工", "金属加工"]));
    expect(detectIndustries("住宅のリフォーム")).toEqual([]);
    expect(isManufacturing("食品の製造とOEM")).toBe(true);
    expect(isManufacturing("税理士事務所")).toBe(false);
  });

  it("業種に合う疑問を先に出す", () => {
    const qs = readerQuestionsFor("精密板金と溶接", 5);
    expect(qs.length).toBe(5);
    expect(qs[0].industries.some((i) => i === "板金" || i === "溶接")).toBe(true);
    expect(articleIdeasFor("射出成形").length).toBeGreaterThan(0);
  });

  it("製造業でない会社には、製造業のコツを足さない", () => {
    expect(mfgWriterRules("住宅のリフォーム")).toBe("");
    expect(mfgWriterRules("金属の切削加工")).toContain("製造業");
  });

  it("その日のひとことは、同じ日なら同じ", () => {
    expect(mfgTipOfDay("2026-11-04")?.id).toBe(mfgTipOfDay("2026-11-04")?.id);
    const own = Array.from({ length: 30 }, (_, i) => mfgTipOfDay(`2026-11-${i}`, "精密板金と溶接")!).filter((x) => x.industries.some((i) => i === "板金" || i === "溶接"));
    expect(own.length).toBeGreaterThan(12);
  });
});
