import { describe, expect, it } from "vitest";
import { estimateCostYen } from "./cost";

describe("概算費用", () => {
  it("入力と出力のトークン数から円で出し、1銭単位で切り上げる", () => {
    // 入力1万・出力5千トークン：(10000*2 + 5000*10)/1e6 = $0.07 → 10.5円
    expect(estimateCostYen({ inputTokens: 10_000, outputTokens: 5_000 })).toBe(10.5);
    expect(estimateCostYen({ inputTokens: 0, outputTokens: 0 })).toBe(0);
    expect(estimateCostYen({ inputTokens: 1, outputTokens: 0 })).toBe(0.01);
  });
});
