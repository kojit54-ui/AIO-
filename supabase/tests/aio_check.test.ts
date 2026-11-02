// AIOのチェック（aio_checks）の権限と、生成の受付（aio_check）のテスト。
// 実際の PostgreSQL（PGlite）に全マイグレーションを流して確認する。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");

const U = {
  client: "00000000-0000-0000-0000-00000000000a",
  other: "00000000-0000-0000-0000-00000000000b",
  coach: "00000000-0000-0000-0000-0000000000ca",
};
const ORG = "10000000-0000-0000-0000-00000000000a";
const ORG_B = "10000000-0000-0000-0000-00000000000b";
const ART = "30000000-0000-0000-0000-00000000000a";
const VER = "40000000-0000-0000-0000-00000000000a";
const CHECK = "50000000-0000-0000-0000-00000000000a";

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

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}'), ('${U.coach}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values
      ('${U.client}', '${ORG}', 'client_member'), ('${U.coach}', '${ORG}', 'coach'), ('${U.other}', '${ORG_B}', 'client_member');
    insert into public.themes (id, organization_id, target_month, title, source) values
      ('20000000-0000-0000-0000-00000000000a', '${ORG}', '2026-10-01', 'A', 'coach');
    insert into public.articles (id, organization_id, theme_id) values ('${ART}', '${ORG}', '20000000-0000-0000-0000-00000000000a');
    insert into public.article_versions (id, article_id, organization_id, version_no, title) values ('${VER}', '${ART}', '${ORG}', 1, 't');
  `);
}, 60_000);

beforeEach(async () => {
  await db.exec(`
    delete from public.generation_runs;
    delete from public.aio_checks;
    update public.app_settings set monthly_budget_yen = 10000, article_aio_check_limit = 20;
    insert into public.aio_checks (id, article_id, organization_id, version_id, status, summary, items, questions)
    values ('${CHECK}', '${ART}', '${ORG}', '${VER}', 'asking', 's', '[{"key":"numbers","ok":false,"note":"n"}]', '[{"id":"aq1","key":"numbers","text":"q","example":"e"}]');
  `);
});

describe("AIOのチェックの権限", () => {
  it("お客様とコタムは自社のチェックを読め、他社からは見えない", async () => {
    expect(await as(U.client, "select id from public.aio_checks")).toHaveLength(1);
    expect(await as(U.coach, "select id from public.aio_checks")).toHaveLength(1);
    expect(await as(U.other, "select id from public.aio_checks")).toHaveLength(0);
  });

  it("お客様は答えだけを書ける", async () => {
    await as(U.client, `update public.aio_checks set answers = '[{"questionId":"aq1","text":"45万円","unknown":false}]' where id = $1`, [CHECK]);
    const row = (await db.query<{ answers: unknown[] }>("select answers from public.aio_checks where id = $1", [CHECK])).rows[0];
    expect(row.answers).toHaveLength(1);
    await expect(as(U.client, "update public.aio_checks set status = 'done' where id = $1", [CHECK])).rejects.toThrow("only answers");
    await expect(as(U.client, `update public.aio_checks set items = '[]' where id = $1`, [CHECK])).rejects.toThrow("only answers");
  });

  it("終わったチェックの答えは書き換えられない", async () => {
    await db.query("update public.aio_checks set status = 'done' where id = $1", [CHECK]);
    await expect(as(U.client, `update public.aio_checks set answers = '[]' where id = $1`, [CHECK])).rejects.toThrow("closed");
  });

  it("お客様もコタムも、チェックを作れない（作るのはサーバー）", async () => {
    await expect(
      as(U.client, `insert into public.aio_checks (article_id, organization_id, version_id) values ($1, $2, $3)`, [ART, ORG, VER]),
    ).rejects.toThrow();
  });

  it("コタムと他社の人は答えを書き換えられない", async () => {
    expect(await as(U.coach, `update public.aio_checks set answers = '[]' where id = $1 returning id`, [CHECK])).toHaveLength(0);
    expect(await as(U.other, `update public.aio_checks set answers = '[]' where id = $1 returning id`, [CHECK])).toHaveLength(0);
  });
});

describe("AIOのチェックの受付", () => {
  const start = (k = key()) => as<{ id: string; kind: string }>(U.client, "select * from public.start_generation($1, 'aio_check', $2, 100)", [ART, k]).then((r) => r[0]);

  it("aio_check を受け付ける", async () => {
    expect((await start()).kind).toBe("aio_check");
  });

  it("1記事あたりの回数を超えたら受け付けない", async () => {
    await db.exec("update public.app_settings set article_aio_check_limit = 1");
    const run = await start();
    await db.query("select * from public.finish_generation($1, 'succeeded', '{}', 0)", [run.id]);
    await expect(start()).rejects.toThrow("limit_reached");
  });
});

describe("公開前の確認", () => {
  it("新しい会社は確認なし（optional）で始まる", async () => {
    const r = (await db.query<{ review_policy: string }>("select review_policy from public.organizations where id = $1", [ORG])).rows[0];
    expect(r.review_policy).toBe("optional");
  });
});
