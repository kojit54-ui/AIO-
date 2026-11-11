import { describe, expect, it } from "vitest";
import { writingStreak } from "@/lib/growth/monthly";
import type { MockDb } from "@/mock/store";
import { cleanAnswerText, companyNameVariants, mentionQuestions, questionsToWrite, siteDomain, usableQuestion } from "./mentionQuestions";
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

describe("まだ紹介されていない質問から書く", () => {
  const m = (question: string, mentioned: boolean, createdAt: string, urls: string[] = [], isSample = false) => ({ question, mentioned, createdAt, isSample, sources: urls.map((url) => ({ url })) });

  it("会社名は「株式会社」を外した呼び方でも探す", () => {
    expect(companyNameVariants("株式会社さくら工房")).toContain("さくら工房");
    expect(companyNameVariants("（有）みなと製作所")).toContain("みなと製作所");
    expect(companyNameVariants("株式会社 コタム")).not.toContain("株式会社");
    expect(companyNameVariants("株式会社さくら工房（本社）")).toContain("さくら工房");
  });

  it("AIの答えの Markdown の記号と文中のリンクを取る", () => {
    const raw = "東京なら、**企業全体は「TCD」**がおすすめです。([tcd.jp](https://tcd.jp/tokyo?utm_source=openai)) ###";
    expect(cleanAnswerText(raw)).toBe("東京なら、企業全体は「TCD」がおすすめです。");
    expect(cleanAnswerText("詳しくは[こちら](https://a.jp)を。")).toBe("詳しくはこちらを。");
  });

  it("AIが作った質問は、短すぎ・長すぎ・会社名入り・質問でないものを使わない", () => {
    expect(usableQuestion("東京都中央区で製造業のブランディングを頼むなら、どこがおすすめ？", ["コタム"])).toBe(true);
    expect(usableQuestion("コタムに頼むならどう？", ["コタム"])).toBe(false);
    expect(usableQuestion("ブランディング会社", [])).toBe(false);
    expect(usableQuestion(3, [])).toBe(false);
  });

  it("サイトのアドレスと Search Console の sc-domain: からドメインを取る", () => {
    expect(siteDomain("https://www.sakura.jp/blog/1")).toBe("sakura.jp");
    expect(siteDomain("sc-domain:sakura.jp")).toBe("sakura.jp");
    expect(siteDomain("だめ")).toBeNull();
  });

  it("いちばん新しい結果でまだ出てこない質問だけを、AIが参考にしたサイトと一緒に返す", () => {
    const list = [
      m("A？", false, "2026-11-01T00:00:00Z", ["https://www.rival.jp/a", "https://rival.jp/b", "https://other.jp/"]),
      m("B？", false, "2026-11-01T00:00:00Z"),
      m("B？", true, "2026-11-05T00:00:00Z"),
      m("C？", false, "2026-11-01T00:00:00Z"),
      m("D？", false, "2026-11-01T00:00:00Z", [], true),
    ];
    const out = questionsToWrite(list, ["C？"]);
    expect(out.map((q) => q.question)).toEqual(["A？"]);
    expect(out[0].citedSites).toEqual(["rival.jp", "other.jp"]);
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
