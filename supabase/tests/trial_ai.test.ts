// 30秒でためすのAIの受付（start_trial_run）のテスト。実際の PostgreSQL（PGlite）に全マイグレーションを流して確認する。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");
const V = "v".repeat(64);
const W = "w".repeat(64);

let db: PGlite;

async function asRole<T>(role: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`);
    return (await tx.query<T>(query, params)).rows;
  });
}
const start = (visitor = V, role = "service_role") => asRole<{ id: string }>(role, "select public.start_trial_run($1, 100) as id", [visitor]).then((r) => r[0].id);
const finish = (id: string, cost = 0) => asRole("service_role", "select public.finish_trial_run($1, 'succeeded', $2, null)", [id, cost]);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  // 何度流しても同じ結果になる
  await db.exec(sql(new URL("20261103120000_trial_ai.sql", dir)));
}, 60_000);

beforeEach(async () => {
  await db.exec(`delete from public.trial_runs; delete from public.generation_runs;
    update public.app_settings set trial_ai_enabled = true, trial_daily_per_visitor = 3, trial_daily_total = 100, trial_monthly_budget_yen = 3000, monthly_budget_yen = 10000`);
});

describe("30秒でためすのAIの受付", () => {
  it("サーバー（service role）からだけ呼べる", async () => {
    expect(await start()).toMatch(/[0-9a-f-]{36}/);
    await expect(start(V, "anon")).rejects.toThrow();
    await expect(start(V, "authenticated")).rejects.toThrow();
    await expect(asRole("anon", "select count(*) from public.trial_runs")).rejects.toThrow();
  });

  it("1人1日の回数を超えたら受け付けない。ほかの人は使える", async () => {
    for (let i = 0; i < 3; i++) await start();
    await expect(start()).rejects.toThrow("visitor_limit");
    expect(await start(W)).toBeTruthy();
  });

  it("全体の1日の回数を超えたら受け付けない", async () => {
    await db.exec("update public.app_settings set trial_daily_total = 2");
    await start(V);
    await start(W);
    await expect(start("x".repeat(64))).rejects.toThrow("daily_limit");
  });

  it("ためす用の月の予算を超えたら受け付けない", async () => {
    await db.exec("update public.app_settings set trial_monthly_budget_yen = 10");
    await finish(await start(), 10);
    await expect(start(W)).rejects.toThrow("budget_exceeded");
  });

  it("全体の月の予算（記事の生成の分も合わせて）を超えたら受け付けない", async () => {
    await db.exec("update public.app_settings set monthly_budget_yen = 5");
    await finish(await start(), 5);
    await expect(start(W)).rejects.toThrow("budget_exceeded");
  });

  it("止めるスイッチで受け付けない", async () => {
    await db.exec("update public.app_settings set trial_ai_enabled = false");
    await expect(start()).rejects.toThrow("disabled");
  });

  it("目印が短すぎるものは受け付けない", async () => {
    await expect(start("short")).rejects.toThrow("invalid_input");
  });
});
