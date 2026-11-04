import { describe, expect, it } from "vitest";
import { ORG_NAME_MAX, normalizeOrgName } from "./orgName";

describe("normalizeOrgName", () => {
  it("前後と続く空白を整える", () => {
    expect(normalizeOrgName("  株式会社　山田　 精工 ")).toBe("株式会社 山田 精工");
  });
  it("空・長すぎる・URL・記号の入った名前は使えない", () => {
    expect(normalizeOrgName("   ")).toBeNull();
    expect(normalizeOrgName("あ".repeat(ORG_NAME_MAX + 1))).toBeNull();
    expect(normalizeOrgName("https://example.jp")).toBeNull();
    expect(normalizeOrgName("<b>山田</b>")).toBeNull();
    expect(normalizeOrgName(3)).toBeNull();
  });
  it("60文字までは使える", () => {
    expect(normalizeOrgName("あ".repeat(ORG_NAME_MAX))).toHaveLength(ORG_NAME_MAX);
  });
});
