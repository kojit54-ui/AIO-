import { describe, expect, it } from "vitest";
import { nextOnLabel, sortCalls } from "./callOrder";

describe("sortCalls", () => {
  it("今日までの約束 → まだ → 日なし → 先の約束 の順", () => {
    const today = "2026-11-08";
    const list = [
      { id: "future", reasons: ["a"], lastContact: { at: "2026-11-07T00:00:00Z", nextOn: "2026-11-15" } },
      { id: "none", reasons: ["a"], lastContact: { at: "2026-11-01T00:00:00Z", nextOn: null } },
      { id: "never", reasons: ["a"], lastContact: null },
      { id: "due", reasons: ["a"], lastContact: { at: "2026-11-01T00:00:00Z", nextOn: "2026-11-08" } },
    ];
    expect(sortCalls(list, today).map((x) => x.id)).toEqual(["due", "never", "none", "future"]);
  });
  it("同じ並びなら理由の多い会社から", () => {
    const list = [
      { id: "one", reasons: ["a"], lastContact: null },
      { id: "two", reasons: ["a", "b"], lastContact: null },
    ];
    expect(sortCalls(list, "2026-11-08").map((x) => x.id)).toEqual(["two", "one"]);
  });
});

describe("nextOnLabel", () => {
  it("過ぎた日・今日・先の日", () => {
    expect(nextOnLabel("2026-11-06", "2026-11-08")).toEqual({ text: "次に連絡する日：11/6（2日過ぎています）", due: true });
    expect(nextOnLabel("2026-11-08", "2026-11-08").due).toBe(true);
    expect(nextOnLabel("2026-11-15", "2026-11-08").text).toBe("次に連絡する日：11/15（あと7日）");
  });
});
