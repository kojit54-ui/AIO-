// 招待制ログイン（期限7日、使用済み、退会での無効化）のテスト。
// 実際の PostgreSQL（PGlite）に全マイグレーションを流して確認する。

import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const dir = new URL("../migrations/", import.meta.url);
const sql = (f: URL) => readFileSync(f, "utf8");

const ADMIN = "00000000-0000-0000-0000-0000000000ad";
const CLIENT = "00000000-0000-0000-0000-00000000000a";
const OTHER = "00000000-0000-0000-0000-00000000000b";
const ORG = "10000000-0000-0000-0000-00000000000a";

let db: PGlite;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}

/** サーバー（service role 相当）として呼ぶ */
const status = async (hash: string) =>
  (await db.query<{ status: string; organization_name: string | null }>("select * from public.invitation_status($1)", [hash])).rows[0];
const accept = (hash: string) => db.query<{ user_id: string; role: string }>("select * from public.accept_invitation($1)", [hash]);

async function invite(hash: string, email: string, expiresAt = "now() + interval '7 days'") {
  await db.query(`insert into public.invitations (organization_id, email, role, token_hash, expires_at) values ($1, $2, 'client_member', $3, ${expiresAt})`, [ORG, email, hash]);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  await db.exec(`
    insert into auth.users (id, email) values ('${ADMIN}', 'admin@example.com'), ('${CLIENT}', 'Sato@Example.com'), ('${OTHER}', 'other@example.com');
    insert into public.app_admins values ('${ADMIN}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社');
  `);
}, 60_000);

describe("招待", () => {
  it("招待の期限は発行から7日", async () => {
    await db.query("insert into public.invitations (organization_id, email, role, token_hash) values ($1, 'x@example.com', 'coach', 'h-default')", [ORG]);
    const r = (await db.query<{ days: number }>("select extract(day from expires_at - created_at)::int as days from public.invitations where token_hash = 'h-default'")).rows[0];
    expect(r.days).toBe(7);
  });

  it("有効な招待を受けると所属ができ、同じリンクは使えなくなる", async () => {
    await invite("h-ok", "sato@example.com");
    expect(await status("h-ok")).toMatchObject({ status: "valid", organization_name: "A社" });
    const r = (await accept("h-ok")).rows[0];
    expect(r).toMatchObject({ user_id: CLIENT, role: "client_member" }); // メールアドレスの大文字小文字は区別しない
    expect(await as(CLIENT, "select id from public.organizations")).toHaveLength(1);
    expect((await status("h-ok")).status).toBe("used");
    await expect(accept("h-ok")).rejects.toThrow("used");
  });

  it("期限切れ・存在しない招待は受け付けない", async () => {
    await invite("h-old", "other@example.com", "now() - interval '1 second'");
    expect((await status("h-old")).status).toBe("expired");
    await expect(accept("h-old")).rejects.toThrow("expired");
    expect((await status("h-none")).status).toBe("invalid");
    await expect(accept("h-none")).rejects.toThrow("invalid");
  });

  it("利用者がまだ作られていなければ受け付けない", async () => {
    await invite("h-nouser", "new@example.com");
    await expect(accept("h-nouser")).rejects.toThrow("no_user");
  });

  it("利用者は招待を読めず、受諾も状態確認も呼べない", async () => {
    expect(await as(CLIENT, "select * from public.invitations")).toHaveLength(0);
    await expect(as(CLIENT, "select * from public.accept_invitation('h-x')")).rejects.toThrow();
    await expect(as(CLIENT, "select * from public.invitation_status('h-x')")).rejects.toThrow();
  });

  it("全社管理者は招待を作れるが、顧客は作れない", async () => {
    const ok = await as(ADMIN, "insert into public.invitations (organization_id, email, role, token_hash) values ($1, 'a@example.com', 'coach', 'h-admin') returning id", [ORG]);
    expect(ok).toHaveLength(1);
    await expect(as(CLIENT, "insert into public.invitations (organization_id, email, role, token_hash) values ($1, 'b@example.com', 'coach', 'h-client')", [ORG])).rejects.toThrow();
  });
});

describe("退会", () => {
  it("所属を外すと何も見えなくなり、未使用の招待も無効になる。招待し直すと戻れる", async () => {
    await invite("h-other1", "other@example.com");
    await accept("h-other1");
    expect(await as(OTHER, "select id from public.organizations")).toHaveLength(1);
    await invite("h-other2", "other@example.com");

    const members = await as<{ membership_id: string; email: string }>(ADMIN, "select * from public.list_members($1)", [ORG]);
    const m = members.find((x) => x.email === "other@example.com")!;
    await as(ADMIN, "select public.revoke_membership($1)", [m.membership_id]);

    expect(await as(OTHER, "select id from public.organizations")).toHaveLength(0);
    expect((await status("h-other2")).status).toBe("expired");

    await invite("h-other3", "other@example.com");
    await accept("h-other3");
    expect(await as(OTHER, "select id from public.organizations")).toHaveLength(1);
  });

  it("全社管理者以外は所属を外せず、一覧も見られない", async () => {
    const m = (await db.query<{ id: string }>("select id from public.memberships where user_id = $1", [CLIENT])).rows[0];
    await expect(as(CLIENT, "select public.revoke_membership($1)", [m.id])).rejects.toThrow("forbidden");
    await expect(as(CLIENT, "select * from public.list_members($1)", [ORG])).rejects.toThrow("forbidden");
  });
});
