// しおり通信（newsletter_optouts・newsletter_sends）の権限のテスト。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");
const U = { client: "00000000-0000-0000-0000-00000000000a", other: "00000000-0000-0000-0000-00000000000b" };
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
  // 何度流しても同じ結果
  await db.exec(sql(new URL("20261103090000_newsletter.sql", dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values ('${U.client}', '${ORG}', 'client_member'), ('${U.other}', '${ORG_B}', 'client_member');
    insert into public.newsletter_sends (organization_id, user_id, month) values ('${ORG}', '${U.client}', '2026-10');
  `);
}, 60_000);

describe("しおり通信", () => {
  it("受け取らないは本人だけが足せて、消せる。ほかの人の分は見えない", async () => {
    await as(U.client, "insert into public.newsletter_optouts (user_id) values ($1)", [U.client]);
    await expect(as(U.client, "insert into public.newsletter_optouts (user_id) values ($1)", [U.other])).rejects.toThrow();
    expect(await as(U.other, "select user_id from public.newsletter_optouts")).toHaveLength(0);
    await as(U.client, "delete from public.newsletter_optouts where user_id = $1", [U.client]);
    expect(await as(U.client, "select user_id from public.newsletter_optouts")).toHaveLength(0);
  });

  it("送った記録は同じ会社の人だけ読め、画面からは書けない", async () => {
    expect(await as(U.client, "select month from public.newsletter_sends")).toHaveLength(1);
    expect(await as(U.other, "select month from public.newsletter_sends")).toHaveLength(0);
    await expect(as(U.client, "insert into public.newsletter_sends (organization_id, user_id, month) values ($1, $2, '2026-11')", [ORG, U.client])).rejects.toThrow();
  });
});
