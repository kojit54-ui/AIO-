// Search Console のつながり（search_console）の権限のテスト。

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
  // 何度流しても同じ結果
  await db.exec(sql(new URL("20261102160000_search_console.sql", dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}'), ('${U.coach}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values
      ('${U.client}', '${ORG}', 'client_member'), ('${U.coach}', '${ORG}', 'coach'), ('${U.other}', '${ORG_B}', 'client_member');
    insert into public.search_console (organization_id, site_url, verified_at, snapshot) values ('${ORG}', 'https://a.example.jp/', now(), '{"totals":{"clicks":1}}');
  `);
}, 60_000);

describe("Search Console のつながり", () => {
  it("自社とコタムだけ読めて、他社からは見えない", async () => {
    expect(await as(U.client, "select site_url from public.search_console")).toHaveLength(1);
    expect(await as(U.coach, "select site_url from public.search_console")).toHaveLength(1);
    expect(await as(U.other, "select site_url from public.search_console")).toHaveLength(0);
  });

  it("画面からは書けない（書くのはサーバー）", async () => {
    await expect(as(U.other, "insert into public.search_console (organization_id, site_url) values ($1, 'https://b.example.jp/')", [ORG_B])).rejects.toThrow();
    await expect(as(U.client, "update public.search_console set site_url = 'https://x.example.jp/'")).rejects.toThrow();
  });
});
