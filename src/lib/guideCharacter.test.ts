import { describe, expect, it } from "vitest";
import { AUTO_OUTFIT, guideFile, guideOf, resolveOutfit, seasonalOutfit, withGuideName } from "./guideCharacter";
import { GUIDE_WIDTHS } from "./guideWidths";

const MOODS = ["angry", "ask", "joy", "sad", "right", "welldone", "think", "surprise", "cheer", "idea", "coffee", "point", "bow", "jersey-cheer", "jersey-stretch", "jersey-done"];

describe("案内役の服", () => {
  const shiori = guideOf("shiori");
  const gen = guideOf("gen");
  const koyuki = guideOf("koyuki");

  it("未選択や知らない服は、ふだんの服", () => {
    expect(resolveOutfit(shiori, undefined, 5)?.id).toBe("suit");
    expect(resolveOutfit(shiori, "kimono", 5)?.id).toBe("suit");
    expect(resolveOutfit(gen, undefined, 5)?.id).toBe("work");
    expect(resolveOutfit(koyuki, "work", 5)).toBeUndefined();
  });

  it("おまかせは季節で着がえる（夏の服・冬の服がなければふだんの服）", () => {
    expect(seasonalOutfit(shiori, 7)?.id).toBe("summer");
    expect(seasonalOutfit(shiori, 1)?.id).toBe("winter");
    expect(seasonalOutfit(shiori, 12)?.id).toBe("winter");
    expect(seasonalOutfit(shiori, 11)?.id).toBe("suit");
    expect(resolveOutfit(gen, AUTO_OUTFIT, 7)?.id).toBe("work");
  });

  it("ジャージの表情は服に関係なく、案内役のふだんの絵", () => {
    const work = resolveOutfit(shiori, "work", 5);
    expect(guideFile(shiori, work, "joy")).toBe("shiori-work");
    expect(guideFile(shiori, work, "jersey-done")).toBe("shiori");
  });

  it("どの案内役・服でも、15の表情の絵がそろっている", () => {
    for (const g of [shiori, gen, koyuki]) {
      const files = g.outfits.length ? g.outfits.map((o) => o.file) : [g.file];
      for (const file of files) {
        for (const mood of MOODS) {
          const f = mood.startsWith("jersey") ? g.file : file;
          expect(GUIDE_WIDTHS[f]?.[mood], `${f}-${mood}`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("画面の言葉の名前", () => {
  it("しおりを選んだ案内役の名前にする。しおり通信はそのまま", () => {
    expect(withGuideName("はじめまして、しおりです。しおり通信も届きます", "源さん")).toBe("はじめまして、源さんです。しおり通信も届きます");
    expect(withGuideName("しおりのメモ帳", "こゆき")).toBe("こゆきのメモ帳");
    expect(withGuideName("しおりです", "しおり")).toBe("しおりです");
  });
});
