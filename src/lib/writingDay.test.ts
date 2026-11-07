import { describe, expect, it } from "vitest";
import { DAY_CHOICES, addDays, dayLabel, daysUntil, isDay, planState, todayJst } from "./writingDay";

describe("次に書く日", () => {
  it("今日は日本時間で数える", () => {
    expect(todayJst(new Date("2026-11-07T14:59:00Z"))).toBe("2026-11-07");
    expect(todayJst(new Date("2026-11-07T15:00:00Z"))).toBe("2026-11-08");
  });

  it("月や年をまたいで日を足し、曜日つきで出す", () => {
    expect(addDays("2026-11-28", 7)).toBe("2026-12-05");
    expect(addDays("2026-12-25", 14)).toBe("2027-01-08");
    expect(dayLabel("2026-11-14")).toBe("11月14日（土）");
    expect(daysUntil("2026-11-14", "2026-11-07")).toBe(7);
  });

  it("決めた日と今日をくらべる", () => {
    expect(planState(null, "2026-11-07")).toBe("none");
    expect(planState("2026-11-07", "2026-11-07")).toBe("today");
    expect(planState("2026-11-08", "2026-11-07")).toBe("upcoming");
    expect(planState("2026-11-06", "2026-11-07")).toBe("past");
  });

  it("えらぶ札は4つまで。日にちの形を確かめる", () => {
    expect(DAY_CHOICES.length).toBeLessThanOrEqual(4);
    expect(isDay("2026-11-14")).toBe(true);
    expect(isDay("2026/11/14")).toBe(false);
    expect(isDay(null)).toBe(false);
  });
});
