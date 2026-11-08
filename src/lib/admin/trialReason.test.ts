import { describe, expect, it } from "vitest";
import { groupTrialReasons, trialReason } from "./trialReason";

describe("trialReason（見本に切り替えた理由を人の言葉に）", () => {
  it("状態コード付きは、やることの分かる言葉と、小さな技術的な記録に分ける", () => {
    expect(trialReason("unavailable_400:invalid_request_error")).toMatchObject({ label: "AIへの頼み方が合わなかった（設定の見直しが要ります）", detail: "技術的な記録：400 invalid_request_error" });
    expect(trialReason("unavailable_400:invalid_request_error").next).toContain("開発の担当");
    expect(trialReason("unavailable_503").label).toBe("AIの提供元で不具合が起きていた");
  });
  it("ふつうの理由はそのまま、知らないコードは「そのほか」に", () => {
    expect(trialReason("timeout")).toMatchObject({ label: "時間切れ", detail: null });
    expect(trialReason("billing").next).toContain("残高");
    expect(trialReason("disabled").next).toBeNull();
    expect(trialReason("weird_code").label).toBe("そのほかの失敗");
  });
  it("同じ見出しの理由は合算し、技術的な記録は並べて残す", () => {
    const g = groupTrialReasons([["unavailable_400:invalid_request_error", 1], ["unavailable_400:invalid_value", 2], ["timeout", 1]]);
    expect(g).toHaveLength(2);
    expect(g[0]).toMatchObject({ label: "AIへの頼み方が合わなかった（設定の見直しが要ります）", count: 3 });
    expect(g[0].details).toHaveLength(2);
  });
});
