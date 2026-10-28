import { describe, expect, it } from "vitest";
import { pickTitle } from "./server";

describe("版のタイトル", () => {
  const theme = "タイトル「冬の結露を防ぐ3つのポイント」、読者の悩み「冬になると窓が濡れる」";
  const candidates = ["冬の結露を防ぐ3つのポイント", "窓の結露はなぜ起きる？"];

  it("まだテーマの文のままなら、AIのタイトル案の1つ目を使う", () => {
    expect(pickTitle(undefined, theme, candidates)).toBe(candidates[0]);
    expect(pickTitle("", theme, candidates)).toBe(candidates[0]);
    expect(pickTitle(theme, theme, candidates)).toBe(candidates[0]);
  });

  it("利用者が直したタイトルは残す", () => {
    expect(pickTitle("結露対策のまとめ", theme, candidates)).toBe("結露対策のまとめ");
  });

  it("タイトル案が無ければ、今のタイトルかテーマの文を使う", () => {
    expect(pickTitle(undefined, theme, [])).toBe(theme);
    expect(pickTitle(theme, theme, [" "])).toBe(theme);
  });
});
