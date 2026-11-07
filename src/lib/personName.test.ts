import { describe, expect, it } from "vitest";
import { normalizePersonName } from "./personName";

describe("担当者の名前", () => {
  it("空白をまとめ、最後の「さん」を取る", () => {
    expect(normalizePersonName("  田村　 巧次 ")).toBe("田村 巧次");
    expect(normalizePersonName("田村さん")).toBe("田村");
  });
  it("空・長すぎ・メールアドレスやURLは受けない", () => {
    expect(normalizePersonName("")).toBeNull();
    expect(normalizePersonName("あ".repeat(31))).toBeNull();
    expect(normalizePersonName("a@b.jp")).toBeNull();
    expect(normalizePersonName("https://x.jp")).toBeNull();
    expect(normalizePersonName(1)).toBeNull();
  });
});
