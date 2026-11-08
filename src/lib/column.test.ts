import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { COLUMNS, findColumn, jpDate } from "./column";
import { FAQ } from "./faq";
import { isMarketingPath } from "./publicPages";

// 不特定多数が読むページ。紹介や売上を約束しない（docs/AIO.md）。
// 料金は 2026-11-07 から入口ページとよくある質問に出す（docs/DECISIONS.md）。読みものには出さず、出す所は利用規約と同じ金額にする
const PROMISES = [/必ず(紹介|選ばれ|上が)/, /売上が上がります/, /保証します/];
const PRICE = /[0-9０-９,]+円/g;
const allText = (o: unknown) => JSON.stringify(o);

describe("AIOの読みもの", () => {
  it("記事ごとに、答え・見出し（問い）・日付がそろっている", () => {
    const slugs = new Set<string>();
    for (const c of COLUMNS) {
      expect(slugs.has(c.slug)).toBe(false);
      slugs.add(c.slug);
      expect(c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(c.summary.length).toBeGreaterThan(0);
      expect(c.published <= c.updated).toBe(true);
      for (const s of c.sections) {
        expect(s.h).toMatch(/？$/);
        expect(s.answer.length).toBeGreaterThan(0);
      }
    }
    expect(findColumn(COLUMNS[0].slug)).toBe(COLUMNS[0]);
    expect(jpDate("2026-11-07")).toBe("2026年11月7日");
  });

  it("読みものと よくある質問 は、紹介・売上を約束しない。料金は利用規約と同じ金額だけ", () => {
    // 「必ずAIに紹介されますか？」という質問そのものは良い。答えの側を調べる
    const text = allText(COLUMNS) + allText(FAQ.map((f) => f.a));
    for (const p of PROMISES) expect(text).not.toMatch(p);
    expect(allText(COLUMNS)).not.toMatch(PRICE);
    for (const yen of allText(FAQ.map((f) => f.a)).match(PRICE) ?? []) expect(["50,000円", "55,000円"]).toContain(yen);
  });

  it("サイトマップに、入口と読みもの全部が載る", () => {
    const urls = sitemap().map((u) => new URL(u.url).pathname);
    expect(urls).toContain("/welcome");
    for (const c of COLUMNS) expect(urls).toContain(`/column/${c.slug}`);
    expect(urls.some((u) => u.startsWith("/admin") || u.startsWith("/articles"))).toBe(false);
  });

  it("入口と読みものはログインの確認をしない。アプリの画面はする", () => {
    expect(isMarketingPath("/column/what-is-aio")).toBe(true);
    expect(isMarketingPath("/welcome")).toBe(true);
    expect(isMarketingPath("/articles/1")).toBe(false);
    expect(isMarketingPath("/columns")).toBe(false);
  });
});
