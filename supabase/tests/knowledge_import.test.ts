// 取り込んだ会社の知識（knowledge_notes）と、お客様が足す過去記事の権限のテスト。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");
const U = { client: "00000000-0000-0000-0000-00000000000a", other: "00000000-0000-0000-0000-00000000000b", coach: "00000000-0000-0000-0000-0000000000ca" };
const ORG = "10000000-0000-0000-0000-00000000000a";
const ORG_B = "10000000-0000-0000-0000-00000000000b";
let db: PGlite;

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
  await db.exec(sql(new URL("20261102140000_knowledge_import.sql", dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}'), ('${U.coach}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values
      ('${U.client}', '${ORG}', 'client_member'), ('${U.coach}', '${ORG}', 'coach'), ('${U.other}', '${ORG_B}', 'client_member');
  `);
}, 60_000);

describe("取り込んだ会社の知識", () => {
  it("お客様は自社に足せて、コタムは読める。他社からは見えない・足せない", async () => {
    await as(U.client, "insert into public.knowledge_notes (organization_id, label, text, created_by) values ($1, '強み', '一級建築士', $2)", [ORG, U.client]);
    expect(await as(U.coach, "select id from public.knowledge_notes")).toHaveLength(1);
    expect(await as(U.other, "select id from public.knowledge_notes")).toHaveLength(0);
    await expect(as(U.other, "insert into public.knowledge_notes (organization_id, label, text, created_by) values ($1, 'x', 'y', $2)", [ORG, U.other])).rejects.toThrow();
    await expect(as(U.coach, "insert into public.knowledge_notes (organization_id, label, text, created_by) values ($1, 'x', 'y', $2)", [ORG, U.coach])).rejects.toThrow();
  });

  it("お客様は自社の過去記事を足せる。他社には足せない", async () => {
    await as(U.client, "insert into public.reference_articles (organization_id, title, body) values ($1, 't', 'b')", [ORG]);
    await expect(as(U.other, "insert into public.reference_articles (organization_id, title, body) values ($1, 't', 'b')", [ORG])).rejects.toThrow();
  });
});

describe("AIに紹介されたかのチェックの記録", () => {
  it("自社の記録だけ読め、お客様は書けない（書くのはサーバー）", async () => {
    await db.exec(`insert into public.aio_mentions (organization_id, question) values ('${ORG}', 'q')`);
    expect(await as(U.client, "select id from public.aio_mentions")).toHaveLength(1);
    expect(await as(U.other, "select id from public.aio_mentions")).toHaveLength(0);
    await expect(as(U.client, "insert into public.aio_mentions (organization_id, question) values ($1, 'q')", [ORG])).rejects.toThrow();
  });
});
