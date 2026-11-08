import { describe, expect, it } from "vitest";
import { nextStep, publishedLines, shortTitle } from "./nextStep";

describe("ホームの次の1手", () => {
  const a = (id: string, status: "drafting" | "changes_requested" | "published" | "in_review", title = "冬の寒さ対策") => ({ id, title, status });

  it("直してほしい所 ＞ 書きかけ ＞ 今月まだ ＞ 今月済み の順", () => {
    expect(nextStep([a("1", "drafting"), a("2", "changes_requested")], 0)).toMatchObject({ kind: "fix", articleId: "2" });
    expect(nextStep([a("1", "published"), a("2", "drafting")], 1)).toMatchObject({ kind: "continue", articleId: "2" });
    expect(nextStep([a("1", "in_review")], 0)).toMatchObject({ kind: "start" });
    expect(nextStep([a("1", "published")], 1)).toMatchObject({ kind: "more" });
    expect(nextStep([], 0).kind).toBe("start");
  });
  it("今月公開した本数と、月10本までを伝える。10本に着いたら来月の分を案内する", () => {
    expect(nextStep([a("1", "published")], 3).lead).toContain("今月は3本公開できました。記事は毎月10本まで書けます");
    const full = nextStep([a("1", "published")], 10);
    expect(full.lead).toContain("10本まで");
    expect(full.label).toBe("来月の記事の質問に答えておく");
  });

  it("責める言い方をしない", () => {
    const all = [nextStep([a("1", "changes_requested")], 0), nextStep([a("1", "drafting")], 0), nextStep([], 0), nextStep([], 1)];
    for (const s of all) expect(`${s.lead}${s.label}`).not.toMatch(/止まって|遅れ|まだ.*ません|ダメ/);
  });

  it("長い題名は短くする", () => {
    expect(shortTitle("あいうえおかきくけこさしすせそたちつてと", 10)).toBe("あいうえおかきくけこ…");
    expect(shortTitle("短い")).toBe("短い");
  });
});

describe("公開できたときのひとこと", () => {
  it("本文の大見出しから、載せたことを2つまで言う", () => {
    const lines = publishedLines([
      { type: "heading", level: 2, text: "脱衣所が寒い理由" },
      { type: "paragraph", text: "…" },
      { type: "heading", level: 3, text: "小見出し" },
      { type: "heading", level: 2, text: "工事は1日で終わります。" },
      { type: "heading", level: 2, text: "3つ目" },
    ]);
    expect(lines[1]).toContain("「脱衣所が寒い理由」「工事は1日で終わります」のことを載せました");
    expect(lines[1]).not.toContain("3つ目");
  });
  it("見出しが無くても出せる。未確認の成果は言わない", () => {
    const lines = publishedLines([]);
    expect(lines[0]).toBe("公開おめでとうございます！");
    expect(lines.join("")).not.toMatch(/紹介されました|安心しました|売上|問い合わせが/);
  });
});
