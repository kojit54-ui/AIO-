// 画面から本物のデータを使うときの操作（下書きの回答、確認依頼での版の固定、プロフィールの確認）のテスト。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: URL) => readFileSync(f, "utf8");

const CLIENT = "00000000-0000-0000-0000-00000000000a";
const COACH = "00000000-0000-0000-0000-0000000000ca";
const OTHER = "00000000-0000-0000-0000-00000000000b";
const ORG = "10000000-0000-0000-0000-00000000000a";
const ORG_B = "10000000-0000-0000-0000-00000000000b";
const ART = "30000000-0000-0000-0000-00000000000a";
const V1 = "40000000-0000-0000-0000-0000000000a1";

let db: PGlite;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}
const lock = async () => (await db.query<{ lock_version: number }>("select lock_version from public.articles where id = $1", [ART])).rows[0].lock_version;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  await db.exec(`
    insert into auth.users (id) values ('${CLIENT}'), ('${COACH}'), ('${OTHER}');
    insert into public.organizations (id, name, profile) values ('${ORG}', 'A社', '{"contact":"A"}'), ('${ORG_B}', 'B社', '{"contact":"B"}');
    insert into public.memberships (user_id, organization_id, role) values
      ('${CLIENT}', '${ORG}', 'client_member'), ('${COACH}', '${ORG}', 'coach'), ('${OTHER}', '${ORG_B}', 'client_member');
    insert into public.themes (id, organization_id, target_month, title, source) values ('20000000-0000-0000-0000-00000000000a', '${ORG}', '2026-10-01', 'A', 'coach');
    insert into public.articles (id, organization_id, theme_id) values ('${ART}', '${ORG}', '20000000-0000-0000-0000-00000000000a');
    insert into public.article_versions (id, article_id, organization_id, version_no, title) values ('${V1}', '${ART}', '${ORG}', 1, 'v1');
    update public.articles set current_version_id = '${V1}' where id = '${ART}';
  `);
}, 60_000);

describe("下書きの回答", () => {
  it("顧客は lock_version を1つ進めて保存でき、古い lock_version では保存できない", async () => {
    const l = await lock();
    const ok = await as(CLIENT, `update public.articles set draft_answers = '[{"questionId":"q1","text":"a","unknown":false}]', draft_step = 1, lock_version = $2 where id = $1 and lock_version = $3 returning id`, [ART, l + 1, l]);
    expect(ok).toHaveLength(1);
    const stale = await as(CLIENT, `update public.articles set draft_step = 2, lock_version = $2 where id = $1 and lock_version = $3 returning id`, [ART, l + 1, l]);
    expect(stale).toHaveLength(0);
  });

  it("他社の利用者は保存できない", async () => {
    const l = await lock();
    expect(await as(OTHER, `update public.articles set draft_step = 3, lock_version = $2 where id = $1 returning id`, [ART, l + 1])).toHaveLength(0);
  });
});

describe("確認依頼と承認での版の固定", () => {
  it("確認依頼すると、その版は固定されて変更できない", async () => {
    const l = await lock();
    await as(CLIENT, `update public.articles set status = 'in_review', review_requested_version_id = $2, lock_version = $3 where id = $1`, [ART, V1, l + 1]);
    expect((await db.query<{ frozen: boolean }>("select frozen from public.article_versions where id = $1", [V1])).rows[0].frozen).toBe(true);
    await expect(db.query("update public.article_versions set title = 'x' where id = $1", [V1])).rejects.toThrow("frozen");
  });

  it("コタムが承認し、名前つきのレビューを残せる", async () => {
    const l = await lock();
    await as(COACH, `update public.articles set status = 'approved', approved_version_id = $2, current_version_id = $2, review_requested_version_id = null, lock_version = $3 where id = $1`, [ART, V1, l + 1]);
    const r = await as(COACH, `insert into public.reviews (article_id, version_id, organization_id, reviewer_id, reviewer_name, decision) values ($1, $2, $3, $4, 'コタム担当者A', 'approved') returning reviewer_name`, [ART, V1, ORG, COACH]);
    expect(r).toEqual([{ reviewer_name: "コタム担当者A" }]);
  });
});

describe("プロフィールの確認", () => {
  it("顧客は自社のプロフィールを確認済みにできる。コタム・他社はできない", async () => {
    await expect(as(COACH, "select public.approve_profile($1)", [ORG])).rejects.toThrow("forbidden");
    await expect(as(OTHER, "select public.approve_profile($1)", [ORG])).rejects.toThrow("forbidden");
    await as(CLIENT, "select public.approve_profile($1)", [ORG]);
    const r = (await db.query<{ ok: boolean }>("select profile_approved_at is not null as ok from public.organizations where id = $1", [ORG])).rows[0];
    expect(r.ok).toBe(true);
  });
});
