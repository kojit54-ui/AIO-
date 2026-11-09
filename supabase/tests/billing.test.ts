// 有料プラン（org_billing）の権限と、使えない会社でAIを止める仕組みのテスト。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: string | URL) => readFileSync(f, "utf8");
const U = { paid: "00000000-0000-0000-0000-00000000000a", invited: "00000000-0000-0000-0000-00000000000b" };
const PAID = "10000000-0000-0000-0000-00000000000a";
const INVITED = "10000000-0000-0000-0000-00000000000b";
const ART = "30000000-0000-0000-0000-00000000000a";
const ART_I = "30000000-0000-0000-0000-00000000000b";
let db: PGlite;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}

const start = (user: string, article: string, key: string) => as(user, "select id from public.start_generation($1, 'body', $2, 100)", [article, key]);

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  // 何度流しても同じ結果
  await db.exec(sql(new URL("20261109150000_billing.sql", dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.paid}'), ('${U.invited}');
    insert into public.organizations (id, name) values ('${PAID}', 'カード払いの会社'), ('${INVITED}', '招待の会社');
    insert into public.memberships (user_id, organization_id, role) values ('${U.paid}', '${PAID}', 'client_member'), ('${U.invited}', '${INVITED}', 'client_member');
    insert into public.org_billing (organization_id, status) values ('${PAID}', 'trialing');
  `);
  await db.exec(`
    insert into public.themes (id, organization_id, target_month, title, source) values
      ('20000000-0000-0000-0000-00000000000a', '${PAID}', '2026-10-01', 'A', 'coach'),
      ('20000000-0000-0000-0000-00000000000b', '${INVITED}', '2026-10-01', 'B', 'coach');
    insert into public.articles (id, organization_id, theme_id) values
      ('${ART}', '${PAID}', '20000000-0000-0000-0000-00000000000a'),
      ('${ART_I}', '${INVITED}', '20000000-0000-0000-0000-00000000000b');
  `);
}, 60_000);

describe("有料プラン", () => {
  it("お客様は自分の会社の行だけ読めて、書きかえられない", async () => {
    expect(await as(U.paid, "select status from public.org_billing")).toEqual([{ status: "trialing" }]);
    expect(await as(U.invited, "select status from public.org_billing")).toHaveLength(0);
    await expect(as(U.paid, "update public.org_billing set status = 'active'")).rejects.toThrow();
    await expect(as(U.invited, "insert into public.org_billing (organization_id, status) values ($1, 'active')", [INVITED])).rejects.toThrow();
  });

  it("お試し中はAIを使え、契約が終わるとAIの受付が止まる。招待の会社は止まらない", async () => {
    expect(await start(U.paid, ART, "billing-key-1")).toHaveLength(1);
    await db.exec(`update public.generation_runs set status = 'failed' where organization_id = '${PAID}'`);
    await db.exec(`update public.org_billing set status = 'canceled' where organization_id = '${PAID}'`);
    await expect(start(U.paid, ART, "billing-key-2")).rejects.toThrow(/billing_inactive/);
    expect(await start(U.invited, ART_I, "billing-key-3")).toHaveLength(1);
    await db.exec(`update public.org_billing set status = 'past_due' where organization_id = '${PAID}'`);
    expect(await start(U.paid, ART, "billing-key-4")).toHaveLength(1);
  });
});
