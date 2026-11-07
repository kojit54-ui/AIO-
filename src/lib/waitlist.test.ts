import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizeSource } from "./waitlist";

describe("新規受付の案内", () => {
  it("メールの形を確かめ、小文字にそろえる", () => {
    expect(normalizeEmail(" Taro@Example.co.jp ")).toBe("taro@example.co.jp");
    for (const bad of ["", "taro", "taro@", "@example.com", "taro@example", "a b@example.com", "<x>@example.com", 123, null]) expect(normalizeEmail(bad)).toBeNull();
  });
  it("どこから来たかは決まった値だけ", () => {
    expect(normalizeSource("try")).toBe("try");
    expect(normalizeSource("evil")).toBe("welcome");
  });
});
