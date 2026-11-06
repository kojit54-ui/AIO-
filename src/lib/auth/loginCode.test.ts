import { describe, expect, it } from "vitest";
import { isLoginCodeEnabled, normalizeLoginCode } from "./loginCode";

describe("メールの6桁の番号でログイン", () => {
  it("on のときだけ入力欄を出す", () => {
    expect(isLoginCodeEnabled("on")).toBe(true);
    expect(isLoginCodeEnabled(undefined)).toBe(false);
    expect(isLoginCodeEnabled("1")).toBe(false);
  });

  it("全角・すきま・ハイフンを直す", () => {
    expect(normalizeLoginCode("１２３４５６")).toBe("123456");
    expect(normalizeLoginCode(" 123 456 ")).toBe("123456");
    expect(normalizeLoginCode("123-456")).toBe("123456");
  });

  it("数字でないものや、桁が足りないものは受けない", () => {
    expect(normalizeLoginCode("12345")).toBeNull();
    expect(normalizeLoginCode("abcdef")).toBeNull();
    expect(normalizeLoginCode("")).toBeNull();
  });
});
