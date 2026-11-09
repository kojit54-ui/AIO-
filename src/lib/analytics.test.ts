import { describe, expect, it } from "vitest";
import { cleanPageLocation, gaMeasurementId, isTrackedPath } from "./analytics";

describe("Googleアナリティクス", () => {
  it("測定IDは G- で始まる値だけ使う", () => {
    expect(gaMeasurementId("G-ABC123XYZ")).toBe("G-ABC123XYZ");
    expect(gaMeasurementId(" G-ABC123XYZ \n")).toBe("G-ABC123XYZ");
    expect(gaMeasurementId(undefined)).toBeNull();
    expect(gaMeasurementId("")).toBeNull();
    expect(gaMeasurementId("GTM-58KZ7RX3")).toBeNull();
    expect(gaMeasurementId("G-abc');alert(1)//")).toBeNull();
  });

  it("ログインしなくても見られるページだけ数える", () => {
    for (const p of ["/welcome", "/column", "/column/some-article", "/try", "/shiori", "/brand", "/about", "/terms", "/privacy", "/tokushoho"]) {
      expect(isTrackedPath(p), p).toBe(true);
    }
  });

  it("ログイン後・管理画面・ログインや招待の画面は数えない（記事の番号や招待の鍵がアドレスに入るため）", () => {
    for (const p of [null, "/", "/login", "/mypage", "/articles/abc", "/admin", "/admin/waitlist", "/coach", "/invite/secret-token", "/auth/callback", "/prototype", "/search-console", "/welcomeX"]) {
      expect(isTrackedPath(p), String(p)).toBe(false);
    }
  });

  it("送るアドレスは ? 以降を utm_ だけ残す", () => {
    expect(cleanPageLocation("https://aio-erabare.jp", "/welcome", "?utm_source=x&email=a%40b.jp&code=123")).toBe("https://aio-erabare.jp/welcome?utm_source=x");
    expect(cleanPageLocation("https://aio-erabare.jp", "/try", "")).toBe("https://aio-erabare.jp/try");
  });
});
