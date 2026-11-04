import { describe, expect, it } from "vitest";
import { UPDATES, unseenUpdates, updatesInMonth, type AppUpdate } from "./updates";

const list: AppUpdate[] = [
  { id: "c", date: "2026-12-01", title: "C", body: "" },
  { id: "b", date: "2026-11-20", title: "B", body: "" },
  { id: "a", date: "2026-11-01", title: "A", body: "" },
];

describe("新しくなったこと", () => {
  it("最後に見たものより新しいものだけ出す", () => {
    expect(unseenUpdates("b", list).map((u) => u.id)).toEqual(["c"]);
    expect(unseenUpdates("c", list)).toEqual([]);
  });
  it("はじめての人には直近の3つまで、知らない id なら1つだけ", () => {
    expect(unseenUpdates(null, list)).toHaveLength(3);
    expect(unseenUpdates("gone", list).map((u) => u.id)).toEqual(["c"]);
  });
  it("月ごとに選ぶ", () => {
    expect(updatesInMonth("2026-11", list).map((u) => u.id)).toEqual(["b", "a"]);
  });
  it("一覧は新しい順で、id が重ならず、日付の形がそろっている", () => {
    expect(new Set(UPDATES.map((u) => u.id)).size).toBe(UPDATES.length);
    for (const u of UPDATES) expect(u.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const dates = UPDATES.map((u) => u.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
  it("利用者に見せる言葉に、中の仕組みの名前を入れない", () => {
    for (const u of UPDATES) expect(`${u.title}${u.body}`).not.toMatch(/PR|API|SQL|Supabase|DB|#\d/);
  });
});
