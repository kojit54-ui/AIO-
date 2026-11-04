import { describe, expect, it } from "vitest";
import { MFG_ITEMS, articleIdeasFor, detectIndustries, isManufacturing, mfgCounts, mfgTipOfDay, mfgWriterRules, readerQuestionsFor } from "./index";

describe("製造業の知識表", () => {
  it("形・長さ・出典がそろっている", () => {
    expect(MFG_ITEMS.length).toBeGreaterThan(150);
    expect(new Set(MFG_ITEMS.map((x) => x.id)).size).toBe(MFG_ITEMS.length);
    for (const x of MFG_ITEMS) {
      expect(x.title.length, x.id).toBeLessThanOrEqual(40);
      expect(x.summary.length, x.id).toBeLessThanOrEqual(130);
      expect(x.source.url, x.id).toMatch(/^https?:\/\/[^\s]+\.[^\s]+/);
      expect(x.industries.length, x.id).toBeGreaterThan(0);
      if (x.source.date) expect(x.source.date, x.id).toMatch(/^\d{4}(-\d{2})?$/);
    }
  });

  it("5つの種類がそろっている", () => {
    const c = mfgCounts();
    for (const k of Object.keys(c) as (keyof typeof c)[]) expect(c[k], k).toBeGreaterThan(20);
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
  });
});
