import { describe, expect, it } from "vitest";
import { maskEmail } from "./invitations";
import { hashInviteToken, isWellFormedToken, newInviteToken, safeNextPath } from "./token";

describe("招待トークン", () => {
  it("毎回ちがう値を作り、保存するのはハッシュ", () => {
    const a = newInviteToken();
    const b = newInviteToken();
    expect(a.token).not.toBe(b.token);
    expect(a.hash).toBe(hashInviteToken(a.token));
    expect(a.hash).not.toContain(a.token);
    expect(a.hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("形の合わない値は無効", () => {
    expect(isWellFormedToken(newInviteToken().token)).toBe(true);
    expect(isWellFormedToken("demo-hanamaru")).toBe(false);
    expect(isWellFormedToken("x".repeat(42) + "/")).toBe(false);
  });
});

describe("戻り先", () => {
  it("同じサイト内のパスだけを受け付ける", () => {
    expect(safeNextPath("/articles/1")).toBe("/articles/1");
    expect(safeNextPath("//evil.example")).toBe("/");
    expect(safeNextPath("/\\evil.example")).toBe("/");
    expect(safeNextPath("https://evil.example")).toBe("/");
    expect(safeNextPath(null, "/coach")).toBe("/coach");
  });
});

describe("メールアドレスの表示", () => {
  it("一部を伏せる", () => {
    expect(maskEmail("sato@example.com")).toBe("sa**@example.com");
    expect(maskEmail("a@example.com")).toBe("a*@example.com");
    expect(maskEmail("broken")).toBe("***");
  });
});
