import { describe, expect, it } from "vitest";
import { trialReason } from "./trialReason";

describe("trialReason（見本に切り替えた理由を人の言葉に）", () => {
  it("状態コード付きは、やることの分かる言葉と、小さな技術的な記録に分ける", () => {
    expect(trialReason("unavailable_400:invalid_request_error")).toEqual({ label: "AIへの頼み方が合わなかった（設定の見直しが要ります）", detail: "技術的な記録：400 invalid_request_error" });
    expect(trialReason("unavailable_503").label).toBe("AIの提供元で不具合が起きていた");
  });
  it("ふつうの理由はそのまま、知らないコードは「そのほか」に", () => {
    expect(trialReason("timeout")).toEqual({ label: "時間切れ", detail: null });
    expect(trialReason("weird_code").label).toBe("そのほかの失敗");
  });
});
