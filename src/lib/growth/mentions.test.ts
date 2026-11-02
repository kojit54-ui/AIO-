import { describe, expect, it } from "vitest";
import { writingStreak } from "@/components/MonthlyGrowth";
import type { MockDb } from "@/mock/store";
import { mentionQuestions } from "./mentionQuestions";
import { findMention } from "./mentions";

const ans = (questionId: string, text: string) => ({ questionId, text, followUps: [] });

describe("AIに紹介されたかのチェック", () => {
  it("地域と売りたいものから、お客様がAIに聞きそうな質問を作る（3つまで）", () => {
    const qs = mentionQuestions({ area: ans("area", "さくら市と南町"), services: ans("services", "内窓の取り付け、浴室の断熱\n手すり"), business: ans("business", "戸建てのリフォーム") });
    expect(qs[0]).toBe("さくら市で内窓の取り付けを頼むなら、どこがおすすめ？");
    expect(qs).toHaveLength(3);
    expect(mentionQuestions({})).toEqual([]);
  });

  it("答えに会社名、または出典に公開記事のサイトがあれば「紹介された」", () => {
    expect(findMention("さくら市なら、さくら住まい工房が評判です。", [], ["さくら住まい工房"], []).mentioned).toBe(true);
    expect(findMention("いくつかの会社があります。", [{ url: "https://sakura-reform.jp/blog/1", title: "t" }], ["X社"], ["sakura-reform.jp"]).mentioned).toBe(true);
    expect(findMention("いくつかの会社があります。", [], ["さくら住まい工房"], ["sakura-reform.jp"]).mentioned).toBe(false);
  });
});

describe("続けた月の記録", () => {
  const db = (months: string[]) =>
    ({
      articles: months.map((_, i) => ({ id: `a${i}`, organizationId: "o" })),
      versions: months.map((m, i) => ({ articleId: `a${i}`, body: [{ type: "paragraph", text: "x" }], createdAt: `${m}-10T00:00:00Z` })),
    }) as unknown as MockDb;

  it("今月から続いている月を数える。今月まだなら先月から数える", () => {
    const now = new Date("2026-11-20T00:00:00Z");
    expect(writingStreak(db(["2026-11", "2026-10", "2026-09"]), "o", now)).toBe(3);
    expect(writingStreak(db(["2026-10", "2026-09", "2026-07"]), "o", now)).toBe(2);
    expect(writingStreak(db(["2026-08"]), "o", now)).toBe(0);
  });
});
