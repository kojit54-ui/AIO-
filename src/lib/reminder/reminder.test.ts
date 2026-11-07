import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { renderReminder, runWritingReminders } from "./server";

describe("次に書く日のお知らせ", () => {
  it("会社名はエスケープし、責める言葉や約束を入れない", () => {
    const m = renderReminder("さくら<住まい>工房", "https://app.example");
    expect(m.subject).toBe("今日は、記事を書く日です｜さくら<住まい>工房さま");
    expect(m.html).toContain("さくら&lt;住まい&gt;工房");
    expect(m.html).not.toContain("さくら<住まい>");
    expect(m.text).toContain("https://app.example");
    for (const t of [m.text, m.html]) expect(t).not.toMatch(/ダメ|サボ|必ず|絶対|上位に|紹介されます/);
  });

  it("今日（日本時間）の人だけを数え、送る設定が無ければ送らない", async () => {
    const calls: unknown[][] = [];
    const admin = {
      from: (table: string) => {
        const q = {
          select: () => q,
          eq: (...a: unknown[]) => (calls.push([table, ...a]), q),
          is: async () => ({ data: [{ user_id: "u1", organization_id: "o1" }], error: null }),
        };
        return q;
      },
    } as unknown as SupabaseClient;
    const r = await runWritingReminders({ admin, appUrl: "", now: new Date("2026-11-07T00:00:00Z"), env: {} });
    expect(r).toEqual({ day: "2026-11-07", configured: false, sent: 0, skipped: 1, failed: 0 });
    expect(calls).toContainEqual(["writing_plans", "planned_on", "2026-11-07"]);
  });

  it("表がまだ無い環境では、何もしない", async () => {
    const admin = { from: () => ({ select: () => ({ eq: () => ({ is: async () => ({ data: null, error: { message: "missing" } }) }) }) }) } as unknown as SupabaseClient;
    expect(await runWritingReminders({ admin, appUrl: "", env: {} })).toMatchObject({ sent: 0, skipped: 0 });
  });
});
