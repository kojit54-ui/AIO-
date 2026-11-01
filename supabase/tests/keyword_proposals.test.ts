// 書く記事の提案（コタムからの提案）の受付と保存のテスト。T5-4。
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

type Run = { id: string; status: string; kind: string; article_id: string | null; organization_id: string };

let db: PGlite;
let n = 0;
const key = () => `kp-${++n}-xxxxxxxx`;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}

const start = (userId: string, org: string, k = key(), chars = 100) =>
  as<Run>(userId, "select * from public.start_keyword_proposal($1, $2, $3)", [org, k, chars]).then((r) => r[0]);
const finish = async (runId: string, status: string, cost = 0) => (await db.query<Run>("select * from public.finish_generation($1, $2, '{}', $3)", [runId, status, cost])).rows[0];
const PROPOSALS = JSON.stringify([{ pillar: { keyword: "内窓", question: "内窓とは" }, clusters: [], reasons: ["sales"], why: "売上" }]);

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
      ('20000000-0000-0000-0000-00000000000a', '${ORG}', '2026-11-01', 'A', 'coach');
    insert into public.articles (id, organization_id, theme_id) values ('${ART}', '${ORG}', '20000000-0000-0000-0000-00000000000a');
  `);
}, 60_000);

beforeEach(async () => {
  await db.exec("delete from public.keyword_proposals; delete from public.generation_runs; update public.app_settings set monthly_budget_yen = 10000, keyword_proposal_limit = 10");
});

describe("提案の受付", () => {
  it("顧客もコタムも受け付け、記事を指さない受付になる。同じキーは同じ受付を返す", async () => {
    const k = key();
    const a = await start(U.client, ORG, k);
    expect(a).toMatchObject({ kind: "keyword_proposal", status: "queued", article_id: null, organization_id: ORG });
    expect((await start(U.client, ORG, k)).id).toBe(a.id);
    await finish(a.id, "succeeded");
    expect((await start(U.coach, ORG)).status).toBe("queued");
  });

  it("他社・所属なし・ほかの会社のキーは受け付けない", async () => {
    await expect(start(U.other, ORG)).rejects.toThrow("forbidden");
    await expect(start("00000000-0000-0000-0000-0000000000ff", ORG)).rejects.toThrow("forbidden");
    const k = key();
    await start(U.other, ORG_B, k);
    await expect(start(U.client, ORG, k)).rejects.toThrow("invalid_input");
  });

  it("記事の生成の受付は、提案の受付のキーでそれを返さない", async () => {
    const k = key();
    const run = await start(U.client, ORG, k);
    await finish(run.id, "succeeded");
    await expect(as(U.client, "select * from public.start_generation($1, 'outline', $2, 10)", [ART, k])).rejects.toThrow("invalid_input");
  });

  it("同じ会社で生成の途中なら受け付けず、全社の予算を超えたら止める", async () => {
    await as(U.client, "select * from public.start_generation($1, 'outline', $2, 10)", [ART, key()]);
    await expect(start(U.client, ORG)).rejects.toThrow("busy");
    await db.exec("delete from public.generation_runs; update public.app_settings set monthly_budget_yen = 0");
    await expect(start(U.client, ORG)).rejects.toThrow("budget_exceeded");
  });

  it("1社の月の回数で止まり、失敗した回は数えない", async () => {
    await db.exec("update public.app_settings set keyword_proposal_limit = 2");
    await finish((await start(U.client, ORG)).id, "failed");
    await finish((await start(U.client, ORG)).id, "succeeded");
    await finish((await start(U.client, ORG)).id, "succeeded");
    await expect(start(U.client, ORG)).rejects.toThrow("limit_reached");
    expect((await start(U.other, ORG_B)).status).toBe("queued");
  });

  it("入力が長すぎる・キーが短いときは受け付けない", async () => {
    await expect(start(U.client, ORG, key(), 8001)).rejects.toThrow("invalid_input");
    await expect(start(U.client, ORG, "short")).rejects.toThrow("invalid_input");
  });

  it("記事の生成は記事を指し、提案は記事を指さない", async () => {
    await expect(db.query("insert into public.generation_runs (organization_id, kind, idempotency_key) values ($1, 'body', 'k-direct-1')", [ORG])).rejects.toThrow();
    await expect(db.query("insert into public.generation_runs (organization_id, article_id, kind, idempotency_key) values ($1, $2, 'keyword_proposal', 'k-direct-2')", [ORG, ART])).rejects.toThrow();
  });
});

describe("できた提案", () => {
  it("同じ会社の人だけが読め、利用者は書けない", async () => {
    const run = await start(U.client, ORG);
    await db.query("insert into public.keyword_proposals (organization_id, run_id, proposals, requested_by) values ($1, $2, $3, $4)", [ORG, run.id, PROPOSALS, U.client]);
    expect(await as(U.coach, "select organization_id from public.keyword_proposals")).toEqual([{ organization_id: ORG }]);
    expect(await as(U.other, "select * from public.keyword_proposals")).toEqual([]);
    await expect(as(U.client, "insert into public.keyword_proposals (organization_id, run_id, proposals) values ($1, $2, $3)", [ORG, run.id, PROPOSALS])).rejects.toThrow();
    await expect(as(U.client, "update public.keyword_proposals set is_sample = true")).rejects.toThrow();
  });

  it("提案の形を検査する", async () => {
    const run = await start(U.client, ORG);
    await expect(db.query("insert into public.keyword_proposals (organization_id, run_id, proposals) values ($1, $2, '{}')", [ORG, run.id])).rejects.toThrow();
    await expect(db.query("insert into public.keyword_proposals (organization_id, run_id, proposals) values ($1, $2, '[]')", [ORG, run.id])).rejects.toThrow();
  });
});
