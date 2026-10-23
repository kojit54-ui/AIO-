import { describe, expect, it } from "vitest";
import { carriedSettings, countBodyRunsThisMonth, currentMonthJst, fromArticle, fromMonth, toArticle, toMonth, toVersion } from "./mapping";

describe("DBの行と画面の型", () => {
  it("月の形を変換し、今月は日本時間で決める", () => {
    expect(toMonth("2026-10-01")).toBe("2026-10");
    expect(fromMonth("2026-10")).toBe("2026-10-01");
    expect(currentMonthJst(new Date("2026-10-31T15:30:00Z"))).toBe("2026-11"); // 日本時間では11月1日
  });

  it("記事の更新では organization_id と theme_id を送らない", () => {
    const a = toArticle({ id: "a", organization_id: "o", theme_id: "t", status: "drafting", published_without_approval: false, lock_version: 3, updated_at: "x" });
    const row = fromArticle(a);
    expect(row).not.toHaveProperty("organization_id");
    expect(row).not.toHaveProperty("theme_id");
    expect(row.lock_version).toBe(3);
  });

  it("サンプルで作った版を見分ける", () => {
    expect(toVersion({ id: "v", generation_settings: { sample: true }, frozen: false }).isSample).toBe(true);
    expect(toVersion({ id: "v", generation_settings: {}, frozen: false }).isSample).toBe(false);
  });

  it("画像の提案と点検の結果を読み、手で直した版にも引き継ぐ", () => {
    const img = { heading: "h", photoIdea: "p", alt: "a", imagePrompt: "i" };
    const review = { provider: "anthropic", summary: "s", findings: [], rewritten: false };
    const v = toVersion({ id: "v", generation_settings: { eyecatch: img, image_suggestions: [img], review }, frozen: false });
    expect(v.imageIdeas).toEqual({ eyecatch: img, perHeading: [img] });
    expect(v.aiReview).toEqual(review);
    expect(toVersion({ id: "v", generation_settings: carriedSettings(v), frozen: false })).toMatchObject({ imageIdeas: v.imageIdeas, aiReview: review });
    expect(toVersion({ id: "v", generation_settings: {}, frozen: false }).imageIdeas).toBeUndefined();
  });

  it("今月の本文生成の回数は、失敗を除いて会社ごとに数える", () => {
    const runs = [
      { organization_id: "o", kind: "body", status: "succeeded", created_at: "2026-10-05T00:00:00Z" },
      { organization_id: "o", kind: "body", status: "failed", created_at: "2026-10-05T00:00:00Z" },
      { organization_id: "o", kind: "outline", status: "succeeded", created_at: "2026-10-05T00:00:00Z" },
      { organization_id: "o", kind: "body", status: "succeeded", created_at: "2026-09-29T00:00:00Z" },
      { organization_id: "x", kind: "body", status: "succeeded", created_at: "2026-10-05T00:00:00Z" },
    ];
    expect(countBodyRunsThisMonth(runs, "o", "2026-10")).toBe(1);
  });
});
