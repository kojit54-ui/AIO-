import { describe, expect, it } from "vitest";
import { cronCaller } from "./auth";

describe("cronCaller", () => {
  const env = { CRON_SECRET: "aaa", SCHEDULER_SECRET: " bbb " };
  it("Vercel の Cron の鍵を受ける", () => expect(cronCaller("Bearer aaa", env)).toBe("vercel-cron"));
  it("pg_cron の鍵を受ける（前後の空白は無視）", () => expect(cronCaller("Bearer bbb", env)).toBe("scheduler"));
  it("違う鍵・鍵なしは断る", () => {
    expect(cronCaller("Bearer ccc", env)).toBeNull();
    expect(cronCaller(null, env)).toBeNull();
  });
  it("鍵が設定されていなければ、空の Bearer も断る", () => {
    expect(cronCaller("Bearer ", {})).toBeNull();
    expect(cronCaller("Bearer undefined", {})).toBeNull();
  });
});
