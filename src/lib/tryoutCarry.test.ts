import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearTryCarry, loadTryCarry, saveTryCarry } from "./tryoutCarry";

const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  (globalThis as { window?: unknown }).window = {
    localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) },
  };
});
afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("30秒でためすの内容の引き継ぎ", () => {
  it("覚えて、読み出して、消せる", () => {
    expect(saveTryCarry({ company: "A社", region: "岐阜", job: "加工", story: "うれしかった" })).toBe(true);
    expect(loadTryCarry()?.job).toBe("加工");
    clearTryCarry();
    expect(loadTryCarry()).toBeNull();
  });
  it("7日を過ぎたら使わない", () => {
    saveTryCarry({ company: "A", region: "B", job: "C", story: "D" });
    expect(loadTryCarry(Date.now() + 8 * 24 * 3600_000)).toBeNull();
    expect(store.size).toBe(0);
  });
  it("壊れた中身は使わない", () => {
    store.set("tryout:carry", "{");
    expect(loadTryCarry()).toBeNull();
  });
  it("ブラウザが使えないときは覚えない", () => {
    delete (globalThis as { window?: unknown }).window;
    expect(saveTryCarry({ company: "A", region: "B", job: "C", story: "D" })).toBe(false);
    expect(loadTryCarry()).toBeNull();
  });
});
