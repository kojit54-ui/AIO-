// 無料ご招待の招待状（invitation_letter）のテスト。実際の PostgreSQL（PGlite）に全マイグレーションを流して確認する。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: URL) => readFileSync(f, "utf8");
const ORG = "10000000-0000-0000-0000-00000000000a";

let db: PGlite;
const letter = async (hash: string, role = "service_role") =>
  db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`);
    return (await tx.query<{ recipient_name: string | null; message: string | null; is_free: boolean }>("select * from public.invitation_letter($1)", [hash])).rows;
  });

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  // 何度流しても同じ結果になる
  await db.exec(sql(new URL("20261103130000_invitation_letter.sql", dir)));
  await db.exec(`insert into public.organizations (id, name) values ('${ORG}', 'A社');
    insert into public.invitations (organization_id, email, role, token_hash, recipient_name, message, is_free) values
      ('${ORG}', 'a@example.com', 'client_member', 'h-valid', '山田 太郎', 'ぜひ', true),
      ('${ORG}', 'b@example.com', 'client_member', 'h-old', '鈴木', 'x', true);
    insert into public.invitations (organization_id, email, role, token_hash) values ('${ORG}', 'c@example.com', 'coach', 'h-plain');
    update public.invitations set expires_at = now() - interval '1 day' where token_hash = 'h-old';`);
}, 60_000);

describe("招待状", () => {
  it("有効な招待の宛名・ひとこと・無料の札を返す", async () => {
    expect(await letter("h-valid")).toEqual([{ recipient_name: "山田 太郎", message: "ぜひ", is_free: true }]);
  });
  it("宛名なしの招待は空で、無料の札は既定で付く", async () => {
    expect(await letter("h-plain")).toEqual([{ recipient_name: null, message: null, is_free: true }]);
  });
  it("期限切れ・存在しない招待は何も返さない", async () => {
    expect(await letter("h-old")).toEqual([]);
    expect(await letter("nope")).toEqual([]);
  });
  it("画面（anon・authenticated）からは呼べない", async () => {
    await expect(letter("h-valid", "anon")).rejects.toThrow();
    await expect(letter("h-valid", "authenticated")).rejects.toThrow();
  });
  it("長すぎる宛名は保存できない", async () => {
    await expect(
      db.query(`insert into public.invitations (organization_id, email, role, token_hash, recipient_name) values ('${ORG}', 'd@example.com', 'client_member', 'h-long', $1)`, ["あ".repeat(41)]),
    ).rejects.toThrow();
  });
});
