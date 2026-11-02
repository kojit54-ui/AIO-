// ヒアリングのAIの受付（start_hearing_ai）のテスト。実際の PostgreSQL（PGlite）に全マイグレーションを流して確認する。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");
const U = { client: "00000000-0000-0000-0000-00000000000a", other: "00000000-0000-0000-0000-00000000000b" };
const ORG = "10000000-0000-0000-0000-00000000000a";
const ORG_B = "10000000-0000-0000-0000-00000000000b";

let db: PGlite;
let n = 0;
const key = () => `key-${++n}-xxxxxxxx`;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}
const start = (u: string, org: string, k = key()) => as<{ id: string; kind: string; article_id: string | null }>(u, "select * from public.start_hearing_ai($1, $2, 100)", [org, k]).then((r) => r[0]);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  // 何度流しても同じ結果になる
  await db.exec(sql(new URL("20261102130000_hearing_ai.sql", dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values ('${U.client}', '${ORG}', 'client_member'), ('${U.other}', '${ORG_B}', 'client_member');
  `);
}, 60_000);

beforeEach(async () => {
  await db.exec("delete from public.generation_runs; update public.app_settings set monthly_budget_yen = 10000, hearing_ai_limit = 300");
});

describe("ヒアリングのAIの受付", () => {
  it("記事を指さない hearing として受け付ける", async () => {
    const r = await start(U.client, ORG);
    expect(r.kind).toBe("hearing");
    expect(r.article_id).toBeNull();
  });

  it("他社のヒアリングは受け付けない", async () => {
    await expect(start(U.other, ORG)).rejects.toThrow("forbidden");
  });

  it("月の回数を超えたら受け付けない", async () => {
    await db.exec("update public.app_settings set hearing_ai_limit = 1");
    const r = await start(U.client, ORG);
    await db.query("select * from public.finish_generation($1, 'succeeded', '{}', 0)", [r.id]);
    await expect(start(U.client, ORG)).rejects.toThrow("limit_reached");
  });

  it("ヒアリングの答えに deep_dive_done を保存できる", async () => {
    await as(U.client, "insert into public.hearing_answers (organization_id, question_id, text, deep_dive_done) values ($1, 'business', 'x', true)", [ORG]);
    const r = await as<{ deep_dive_done: boolean }>(U.client, "select deep_dive_done from public.hearing_answers where organization_id = $1", [ORG]);
    expect(r[0].deep_dive_done).toBe(true);
  });
});
