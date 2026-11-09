import { existsSync } from "node:fs";
import { join } from "node:path";
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
    for (const yen of text.match(PRICE) ?? []) expect(["50,000円", "55,000円"]).toContain(yen);
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

describe("読みものの写真", () => {
  it("使っている写真が public/column/ にあり、説明（alt）がある", async () => {
    const fs = await import("node:fs");
    const photos = COLUMNS.flatMap((c) => [c.hero, ...c.sections.map((s) => s.photo)]).filter((p) => !!p);
    for (const p of photos) {
      expect(p.src.startsWith("/column/")).toBe(true);
      expect(fs.existsSync(`public${p.src}`)).toBe(true);
      expect(p.alt.length).toBeGreaterThanOrEqual(40);
    }
  });

  it("見出しごとに、写真か図が1つある（2026-11-08 田村さん「1見出し1画像を目標」。しおりの絵は写真と混ぜるとAIっぽいので図に置き換え）", () => {
    for (const c of COLUMNS) for (const s of c.sections) expect(s.photo || s.figure, `${c.slug}「${s.h}」に写真も図もない`).toBeTruthy();
  });

  it("しおりのイラストは使わず、しおりの一問一答は見出し4つなら2か所、5つ以上なら3か所、隣り合わせない（2026-11-08 田村さん「写実的なものとしおりがあると違和感」→ 11-09「読むのは製造業の社長。対話は一度だけじゃない方が見やすい」）", () => {
    for (const c of COLUMNS) {
      const photos = [c.hero, ...c.sections.map((s) => s.photo)];
      expect(photos.some((p) => p?.illustration), `${c.slug} にしおりのイラストがある`).toBe(false);
      const at = c.sections.flatMap((s, i) => (s.chat?.length ? [i] : []));
      for (const s of c.sections) expect(s.chat?.length ?? 0, `${c.slug} の1つの見出しに一問一答が2つ以上`).toBeLessThanOrEqual(1);
      expect(at.length, `${c.slug} の一問一答の数`).toBe(c.sections.length >= 5 ? 3 : 2);
      for (let k = 1; k < at.length; k++) expect(at[k] - at[k - 1], `${c.slug} の一問一答が隣り合う見出しにある`).toBeGreaterThan(1);
      expect(c.opening, `${c.slug} に opening（しおりの問いかけ）がある`).toBeUndefined();
      expect(c.shiori, `${c.slug} に shiori（しおりのひとこと）がある`).toBeUndefined();
    }
  });

  it("関連する読みものへの案内は、ある記事を指す", () => {
    const slugs = new Set(COLUMNS.map((c) => c.slug));
    for (const c of COLUMNS) for (const s of c.sections) if (s.see) expect(slugs.has(s.see.slug), `${c.slug} → ${s.see.slug}`).toBe(true);
  });

  it("しおりに聞いてみた は、質問と答えがある", () => {
    for (const c of COLUMNS) for (const s of c.sections) for (const t of s.chat ?? []) {
      expect(t.q.length).toBeGreaterThan(0);
      expect(t.a.length).toBeGreaterThan(0);
    }
  });
  it("出だしはしおりが話す。表情の絵があり、続く記事で同じ顔が並ばない（2026-11-09 田村さん「出だしをしおりにしゃべらせて。いろんな表情を」）", () => {
    for (const c of COLUMNS) {
      expect(c.intro, `${c.slug} に出だし（intro）がない`).toBeTruthy();
      expect(c.introMood, `${c.slug} にしおりの表情（introMood）がない`).toBeTruthy();
      expect(existsSync(join(process.cwd(), "public/guide", `shiori-${c.introMood}.webp`)), `${c.slug} の表情の絵がない`).toBe(true);
    }
    for (let i = 1; i < COLUMNS.length; i++) expect(COLUMNS[i].introMood, `${COLUMNS[i - 1].slug} と ${COLUMNS[i].slug} が同じ顔`).not.toBe(COLUMNS[i - 1].introMood);
  });
});
