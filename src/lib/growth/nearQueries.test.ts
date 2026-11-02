import { describe, expect, it } from "vitest";
import { nearQueries } from "./nearQueries";

const q = (query: string, impressions: number, position: number) => ({ query, clicks: 0, impressions, position });
const snap = (queries: ReturnType<typeof q>[]) => ({ range: { start: "", end: "" }, totals: { clicks: 0, impressions: 0, ctr: 0, position: 0 }, queries, pages: [] });

describe("伸びしろのある言葉", () => {
  it("上位すぎる・遠すぎる・表示が少ない言葉は外し、表示の多い順に3つまで", () => {
    const s = snap([q("上位", 900, 3), q("遠い", 900, 45), q("少ない", 2, 15), q("内窓 札幌", 300, 15.2), q("内窓 費用", 120, 9.4), q("断熱 補助金", 80, 22), q("浴室 寒い", 60, 12)]);
    expect(nearQueries(s).map((x) => x.query)).toEqual(["内窓 札幌", "内窓 費用", "断熱 補助金"]);
  });

  it("会社名の言葉は外す（空白の違いも見る）", () => {
    const s = snap([q("株式会社 コタム", 300, 12), q("内窓 札幌", 100, 15)]);
    expect(nearQueries(s, { exclude: ["株式会社コタム"] }).map((x) => x.query)).toEqual(["内窓 札幌"]);
  });

  it("つながっていなければ空", () => {
    expect(nearQueries(null)).toEqual([]);
  });
});
