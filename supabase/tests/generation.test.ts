// 生成の受付（二重実行防止・同時実行・月の上限・予算停止）のテスト。
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
const ART2 = "30000000-0000-0000-0000-0000000000a2";
const ART_B = "30000000-0000-0000-0000-00000000000b";

type Run = { id: string; status: string; kind: string; error_code: string | null; cost_yen: string };

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

const start = (userId: string, article: string, kind: string, k = key(), chars = 100) =>
  as<Run>(userId, "select * from public.start_generation($1, $2, $3, $4)", [article, kind, k, chars]).then((r) => r[0]);

/** サーバー（service role 相当）として結果を記録する */
const finish = async (runId: string, status: string, cost = 0) =>
  (await db.query<Run>("select * from public.finish_generation($1, $2, '{}', $3)", [runId, status, cost])).rows[0];

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  await db.exec(`
    insert into auth.users (id) values ('${U.client}'), ('${U.other}'), ('${U.coach}');
    insert into public.organizations (id, name, monthly_generation_limit) values ('${ORG}', 'A社', 3), ('${ORG_B}', 'B社', 30);
    insert into public.memberships (user_id, organization_id, role) values
      ('${U.client}', '${ORG}', 'client_member'), ('${U.coach}', '${ORG}', 'coach'), ('${U.other}', '${ORG_B}', 'client_member');
    insert into public.themes (id, organization_id, target_month, title, source) values
      ('20000000-0000-0000-0000-00000000000a', '${ORG}', '2026-10-01', 'A', 'coach'),
      ('20000000-0000-0000-0000-00000000000b', '${ORG_B}', '2026-10-01', 'B', 'coach');
    insert into public.articles (id, organization_id, theme_id) values
      ('${ART}', '${ORG}', '20000000-0000-0000-0000-00000000000a'),
      ('${ART2}', '${ORG}', '20000000-0000-0000-0000-00000000000a'),
      ('${ART_B}', '${ORG_B}', '20000000-0000-0000-0000-00000000000b');
  `);
}, 60_000);

beforeEach(async () => {
  await db.exec(
    "delete from public.generation_runs; delete from public.article_images; update public.app_settings set monthly_budget_yen = 10000, budget_notified_month = null, article_body_limit = 10, article_image_limit = 10",
  );
});

describe("受付", () => {
  it("同じキーで2回押しても受付は1件で、同じ記録が返る", async () => {
    const k = key();
    const a = await start(U.client, ART, "outline", k);
    const b = await start(U.client, ART, "outline", k);
    expect(b.id).toBe(a.id);
    expect((await db.query("select * from public.generation_runs")).rows).toHaveLength(1);
  });

  it("同じ会社で実行中の生成があれば、別のキーでも受け付けない", async () => {
    await start(U.client, ART, "outline");
    await expect(start(U.coach, ART2, "body")).rejects.toThrow("busy");
  });

  it("他社の実行中は関係なく受け付ける", async () => {
    await start(U.other, ART_B, "body");
    expect((await start(U.client, ART, "body")).status).toBe("queued");
  });

  it("時間切れの受付は失敗にして、次を受け付ける", async () => {
    const old = await start(U.client, ART, "body");
    await db.query("update public.generation_runs set created_at = now() - interval '11 minutes' where id = $1", [old.id]);
    await start(U.client, ART, "body");
    const r = (await db.query<Run>("select * from public.generation_runs where id = $1", [old.id])).rows[0];
    expect(r.status).toBe("failed");
    expect(r.error_code).toBe("timeout");
  });

  it("時間切れの判定は、続く判定で例外になっても効く（上限にも実行中にも数えない）", async () => {
    await db.exec("update public.organizations set monthly_generation_limit = 1 where id = '" + ORG + "'");
    try {
      const old = await start(U.client, ART, "body");
      await db.query("update public.generation_runs set created_at = now() - interval '11 minutes' where id = $1", [old.id]);
      await db.exec("update public.app_settings set monthly_budget_yen = 0");
      await expect(start(U.client, ART, "body")).rejects.toThrow("budget_exceeded");
      await db.exec("update public.app_settings set monthly_budget_yen = 10000");
      expect((await start(U.client, ART, "body")).status).toBe("queued");
    } finally {
      await db.exec("update public.organizations set monthly_generation_limit = 3 where id = '" + ORG + "'");
    }
  });

  it("状態の問い合わせで、時間を過ぎた受付は失敗になる。他社の受付は見えない", async () => {
    const run = await start(U.client, ART, "body");
    const get = (u: string) => as<Run>(u, "select * from public.get_generation($1)", [run.id]).then((r) => r[0]);
    expect((await get(U.client)).status).toBe("queued");
    await db.query("update public.generation_runs set created_at = now() - interval '11 minutes' where id = $1", [run.id]);
    expect(await get(U.client)).toMatchObject({ status: "failed", error_code: "timeout" });
    await expect(get(U.other)).rejects.toThrow("not_found");
  });

  it("他社の記事・所属なしは受け付けない", async () => {
    await expect(start(U.other, ART, "body")).rejects.toThrow("forbidden");
    await expect(start("00000000-0000-0000-0000-0000000000ff", ART, "body")).rejects.toThrow("forbidden");
  });

  it("入力が8,000字を超える、種類が不正、キーが短いときは受け付けない", async () => {
    await expect(start(U.client, ART, "body", key(), 8001)).rejects.toThrow("invalid_input");
    await expect(start(U.client, ART, "video", key())).rejects.toThrow("invalid_input");
    await expect(start(U.client, ART, "body", "short")).rejects.toThrow("invalid_input");
  });

  it("利用者は受付記録を直接書けず、結果の記録や予算の確認も呼べない", async () => {
    await expect(as(U.client, "insert into public.generation_runs (organization_id, article_id, kind, idempotency_key) values ($1, $2, 'body', 'k-direct-1')", [ORG, ART])).rejects.toThrow();
    const run = await start(U.client, ART, "body");
    await expect(as(U.client, "select public.finish_generation($1, 'succeeded')", [run.id])).rejects.toThrow();
    await expect(as(U.client, "select * from public.budget_status()")).rejects.toThrow();
    await expect(as(U.client, "select * from public.app_settings")).rejects.toThrow();
  });
});

describe("上限", () => {
  it("本文の生成は会社の月の上限で止まり、失敗した回は数えない", async () => {
    for (let i = 0; i < 3; i++) {
      const r = await start(U.client, i === 1 ? ART2 : ART, "body");
      await finish(r.id, i === 0 ? "failed" : "succeeded");
    }
    const r = await start(U.client, ART, "body"); // 失敗1回は数えないので3回目
    await finish(r.id, "succeeded");
    await expect(start(U.client, ART, "body")).rejects.toThrow("limit_reached");
    // 見出し案は本文の上限に数えない
    expect((await start(U.client, ART, "outline")).status).toBe("queued");
  });

  it("先月の生成は今月の上限に数えない", async () => {
    for (let i = 0; i < 3; i++) await finish((await start(U.client, ART, "body")).id, "succeeded");
    await db.exec("update public.generation_runs set created_at = app.month_start() - interval '1 day'");
    expect((await start(U.client, ART, "body")).status).toBe("queued");
  });

  it("同じ記事の本文生成は記事ごとの上限で止まる", async () => {
    await db.exec("update public.app_settings set article_body_limit = 1");
    await finish((await start(U.client, ART, "body")).id, "succeeded");
    await expect(start(U.client, ART, "body")).rejects.toThrow("limit_reached");
    expect((await start(U.client, ART2, "body")).status).toBe("queued");
  });
});

describe("予算", () => {
  it("全社の今月の費用が予算に達すると、どの会社も新しい生成を止める", async () => {
    await db.exec("update public.app_settings set monthly_budget_yen = 100");
    await finish((await start(U.other, ART_B, "body")).id, "succeeded", 79);
    let s = (await db.query<{ should_notify: boolean; stopped: boolean }>("select * from public.budget_status()")).rows[0];
    expect(s).toMatchObject({ should_notify: false, stopped: false });

    await finish((await start(U.client, ART, "outline")).id, "succeeded", 1);
    s = (await db.query<{ should_notify: boolean; stopped: boolean }>("select * from public.budget_status()")).rows[0];
    expect(s).toMatchObject({ should_notify: true, stopped: false });
    await db.query("select public.mark_budget_notified()");
    s = (await db.query<{ should_notify: boolean; stopped: boolean }>("select * from public.budget_status()")).rows[0];
    expect(s.should_notify).toBe(false);

    await finish((await start(U.client, ART, "outline")).id, "failed", 20); // 失敗しても費用は数える
    await expect(start(U.client, ART, "outline")).rejects.toThrow("budget_exceeded");
    await expect(start(U.other, ART_B, "body")).rejects.toThrow("budget_exceeded");
  });

  it("時間切れの後に結果が届いても、状態は変えずに費用だけ記録する", async () => {
    const run = await start(U.client, ART, "body");
    await finish(run.id, "failed");
    const r = await finish(run.id, "succeeded", 5);
    expect(r.status).toBe("failed");
    expect(Number(r.cost_yen)).toBe(5);
  });

  it("同じ完了報告を再送しても費用は増えない", async () => {
    const run = await start(U.client, ART, "body");
    await finish(run.id, "succeeded", 7);
    const r = await finish(run.id, "succeeded", 7);
    expect(r.status).toBe("succeeded");
    expect(Number(r.cost_yen)).toBe(7);
  });
});

describe("画像", () => {
  it("画像の生成は記事ごとの回数で止まり、本文の月の上限には数えない", async () => {
    await db.exec("update public.app_settings set article_image_limit = 2");
    await finish((await start(U.client, ART, "image")).id, "succeeded", 60);
    await finish((await start(U.client, ART, "image")).id, "failed", 10); // 失敗は数えない
    await finish((await start(U.client, ART, "image")).id, "succeeded", 60);
    await expect(start(U.client, ART, "image")).rejects.toThrow("limit_reached");
    // 別の記事と本文は止まらない
    await finish((await start(U.client, ART2, "image")).id, "succeeded");
    await finish((await start(U.client, ART, "body")).id, "succeeded");
  });

  it("画像の記録は自社の行だけ読め、利用者は書けない", async () => {
    await db.exec(`insert into public.article_images (article_id, organization_id, slot, storage_path, mime_type)
      values ('${ART}', '${ORG}', 'eyecatch', '${ORG}/${ART}/eyecatch.png', 'image/png')`);
    expect(await as(U.client, "select slot from public.article_images")).toEqual([{ slot: "eyecatch" }]);
    expect(await as(U.other, "select slot from public.article_images")).toEqual([]);
    await expect(
      as(U.client, `insert into public.article_images (article_id, organization_id, slot, storage_path, mime_type) values ('${ART}', '${ORG}', 'x', 'p', 'image/png')`),
    ).rejects.toThrow();
    await expect(as(U.client, "delete from public.article_images")).rejects.toThrow();
  });
});
