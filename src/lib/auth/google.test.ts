import { describe, expect, it } from "vitest";
import { googleErrorFrom, googleRedirectTo, isGoogleLoginEnabled } from "./google";

describe("Googleでログイン", () => {
  it("on のときだけボタンを出す", () => {
    expect(isGoogleLoginEnabled("on")).toBe(true);
    expect(isGoogleLoginEnabled(" ON ")).toBe(true);
    expect(isGoogleLoginEnabled(undefined)).toBe(false);
    expect(isGoogleLoginEnabled("")).toBe(false);
    expect(isGoogleLoginEnabled("off")).toBe(false);
  });

  it("戻り先に Google から来たしるしと、行き先を付ける", () => {
    expect(googleRedirectTo("https://aio-erabare.jp", "/articles/1")).toBe("https://aio-erabare.jp/auth/confirm?via=google&next=%2Farticles%2F1");
  });

  it("新しい登録がオフで断られたら「招待されていない」", () => {
    const p = new URLSearchParams({ error: "access_denied", error_code: "signup_disabled", error_description: "Signups not allowed for this instance" });
    expect(googleErrorFrom(p)).toBe("google_not_invited");
  });

  it("ほかのエラーは「うまくいかなかった」、エラーが無ければ null", () => {
    expect(googleErrorFrom(new URLSearchParams({ error: "server_error" }))).toBe("google_failed");
    expect(googleErrorFrom(new URLSearchParams({ code: "abc" }))).toBeNull();
  });
});
