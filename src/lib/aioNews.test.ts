import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AIO_POINTS } from "./aio";
import { AIO_NEWS, AIO_NEWS_UPDATED, aioNewsFor, aioReviewerRules, aioWriterRules, latestAioNews } from "./aioNews";
import { REVIEW_SYSTEM_PROMPT, SYSTEM_PROMPT } from "./ai/prompt";

describe("AIOの知識表", () => {
  it("1件ずつ、日付・出典・URLがそろっている", () => {
    const ids = new Set<string>();
    for (const n of AIO_NEWS) {
      expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(n.date <= AIO_NEWS_UPDATED).toBe(true);
      expect(n.url).toMatch(/^https:\/\//);
      expect(n.sourceName.length).toBeGreaterThan(0);
      expect(n.title.length).toBeGreaterThan(0);
      expect(n.forClient.length).toBeGreaterThan(0);
      if (n.point) expect(AIO_POINTS[n.point]).toBeDefined();
      // 「だから〇〇を聞いています」は材料と一緒に書く
      expect(Boolean(n.soWeAsk)).toBe(Boolean(n.point));
      expect(ids.has(n.id)).toBe(false);
      ids.add(n.id);
    }
  });

  it("報道・調査だけのものは、AIへの指示に入れない", () => {
    for (const n of AIO_NEWS.filter((x) => x.source === "report")) {
      expect(n.forWriter).toBeUndefined();
      expect(n.forReviewer).toBeUndefined();
    }
  });

  it("公式の決まりを、書き手と点検役の指示に差し込む", () => {
    expect(SYSTEM_PROMPT).toContain(aioWriterRules());
    expect(REVIEW_SYSTEM_PROMPT).toContain(aioReviewerRules());
    for (const n of AIO_NEWS.filter((x) => x.source === "official")) {
      if (n.forWriter) expect(SYSTEM_PROMPT).toContain(n.forWriter);
      if (n.forReviewer) expect(REVIEW_SYSTEM_PROMPT).toContain(n.forReviewer);
    }
  });

  it("新しい順に並び、材料ごとに公式を優先して1件を選ぶ", () => {
    const list = latestAioNews(AIO_NEWS.length);
    for (let i = 1; i < list.length; i++) expect(list[i - 1].date >= list[i].date).toBe(true);
    // 公式の発表を、新しい報道より優先する
    expect(aioNewsFor("experience")?.source).toBe("official");
    expect(aioNewsFor("comparison")).toBeUndefined();
  });

  it("docs/AIO.md の最終更新と同じ日に見直している（説明書と表を一緒に直す）", () => {
    const doc = readFileSync(join(process.cwd(), "docs/AIO.md"), "utf8");
    expect(doc).toMatch(new RegExp(`最終更新：${AIO_NEWS_UPDATED}`));
  });
});
