// 会社ごとのアクセス制限（RLS）と記事の状態遷移トリガーのテスト。
// 実際の PostgreSQL（PGlite）にマイグレーションを流し、authenticated ロールで操作する。

import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const sql = (f: string) => readFileSync(new URL(f, import.meta.url), "utf8");

const U = {
  clientA: "00000000-0000-0000-0000-00000000000a",
  clientB: "00000000-0000-0000-0000-00000000000b",
  coachA: "00000000-0000-0000-0000-0000000000ca",
  revoked: "00000000-0000-0000-0000-0000000000dd",
  admin: "00000000-0000-0000-0000-0000000000ad",
};
const ORG_A = "10000000-0000-0000-0000-00000000000a"; // 確認依頼は任意
const ORG_B = "10000000-0000-0000-0000-00000000000b"; // 確認依頼は必須
const THEME_A = "20000000-0000-0000-0000-00000000000a";
const THEME_B = "20000000-0000-0000-0000-00000000000b";
const ART_A = "30000000-0000-0000-0000-00000000000a";
const ART_B = "30000000-0000-0000-0000-00000000000b";
const VER_A1 = "40000000-0000-0000-0000-0000000000a1";
const VER_B1 = "40000000-0000-0000-0000-0000000000b1";

let db: PGlite;

/** 指定した利用者として、authenticated ロールで1トランザクション実行する */
async function as<T = Record<string, unknown>>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}

async function rejects(p: Promise<unknown>) {
  await expect(p).rejects.toThrow();
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql("./auth_stub.sql"));
  await db.exec(sql("../migrations/20261020000000_init.sql"));
  // サーバー（service role 相当）として初期データを入れる
  await db.exec(`
    insert into auth.users (id) values ('${U.clientA}'), ('${U.clientB}'), ('${U.coachA}'), ('${U.revoked}'), ('${U.admin}');
    insert into public.app_admins values ('${U.admin}');
    insert into public.organizations (id, name, review_policy, profile, profile_approved_at) values
      ('${ORG_A}', 'A社', 'optional', '{"contact":"A"}', now()),
      ('${ORG_B}', 'B社', 'required', '{"contact":"B"}', now());
    insert into public.memberships (user_id, organization_id, role, revoked_at) values
      ('${U.clientA}', '${ORG_A}', 'client_member', null),
      ('${U.clientB}', '${ORG_B}', 'client_member', null),
      ('${U.coachA}', '${ORG_A}', 'coach', null),
      ('${U.revoked}', '${ORG_A}', 'client_member', now());
    insert into public.coaching_notes (organization_id, target_month, client_visible_note) values
      ('${ORG_A}', '2026-10-01', 'A向け'), ('${ORG_B}', '2026-10-01', 'B向け');
    insert into public.coaching_internal_notes values ('${ORG_A}', '2026-10-01', 'A社の内部メモ', now());
    insert into public.reference_articles (organization_id, title, body) values ('${ORG_A}', 'A過去記事', '本文'), ('${ORG_B}', 'B過去記事', '本文');
    insert into public.themes (id, organization_id, target_month, title, source) values
      ('${THEME_A}', '${ORG_A}', '2026-10-01', 'Aテーマ', 'coach'),
      ('${THEME_B}', '${ORG_B}', '2026-10-01', 'Bテーマ', 'coach');
    insert into public.articles (id, organization_id, theme_id) values ('${ART_A}', '${ORG_A}', '${THEME_A}'), ('${ART_B}', '${ORG_B}', '${THEME_B}');
    insert into public.article_versions (id, article_id, organization_id, version_no, title) values
      ('${VER_A1}', '${ART_A}', '${ORG_A}', 1, 'A記事'), ('${VER_B1}', '${ART_B}', '${ORG_B}', 1, 'B記事');
    update public.articles set current_version_id = '${VER_A1}' where id = '${ART_A}';
    update public.articles set current_version_id = '${VER_B1}' where id = '${ART_B}';
  `);
}, 60_000);

describe("他社のデータ", () => {
  const tables = ["organizations", "coaching_notes", "themes", "reference_articles", "articles", "article_versions"];

  it.each(tables)("%s は自社の行だけが見える", async (table) => {
    const col = table === "organizations" ? "id" : "organization_id";
    const rows = await as<{ org: string }>(U.clientB, `select ${col}::text as org from public.${table}`);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.org === ORG_B)).toBe(true);
  });

  it("他社の記事は更新できない（0件更新）", async () => {
    const rows = await as(U.clientB, `update public.articles set lock_version = lock_version + 1 where id = $1 returning id`, [ART_A]);
    expect(rows).toHaveLength(0);
  });

  it("他社の記事に版を追加できない", async () => {
    await rejects(as(U.clientB, `insert into public.article_versions (article_id, organization_id, version_no) values ($1, $2, 2)`, [ART_A, ORG_A]));
  });

  it("organization_id を自社に偽っても他社の記事には版を追加できない", async () => {
    await rejects(as(U.clientB, `insert into public.article_versions (article_id, organization_id, version_no) values ($1, $2, 2)`, [ART_A, ORG_B]));
  });

  it("他社に記事を作れない", async () => {
    await rejects(as(U.clientB, `insert into public.articles (organization_id, theme_id) values ($1, $2)`, [ORG_A, THEME_A]));
  });

  it("担当外の会社はコタム担当者でも見えない", async () => {
    const rows = await as(U.coachA, `select id from public.articles where organization_id = $1`, [ORG_B]);
    expect(rows).toHaveLength(0);
  });

  it("所属を外された利用者は何も見えない", async () => {
    expect(await as(U.revoked, `select id from public.articles`)).toHaveLength(0);
    expect(await as(U.revoked, `select id from public.organizations`)).toHaveLength(0);
  });

  it("全社管理者はすべての会社を見られる", async () => {
    expect(await as(U.admin, `select id from public.organizations`)).toHaveLength(2);
  });
});

describe("役割ごとの制限", () => {
  it("顧客は内部メモを読めない", async () => {
    expect(await as(U.clientA, `select * from public.coaching_internal_notes`)).toHaveLength(0);
  });

  it("担当のコタムは内部メモを読める", async () => {
    expect(await as(U.coachA, `select * from public.coaching_internal_notes`)).toHaveLength(1);
  });

  it("顧客は指導メモ・過去記事・会社設定を変更できない", async () => {
    expect(await as(U.clientA, `update public.coaching_notes set focus = 'x' returning id`)).toHaveLength(0);
    expect(await as(U.clientA, `update public.reference_articles set title = 'x' returning id`)).toHaveLength(0);
    expect(await as(U.clientA, `update public.organizations set review_policy = 'optional' returning id`)).toHaveLength(0);
  });

  it("顧客が作るテーマは source=client に限られる", async () => {
    await rejects(as(U.clientA, `insert into public.themes (organization_id, target_month, title, source) values ($1, '2026-10-01', 't', 'coach')`, [ORG_A]));
    const ok = await as(U.clientA, `insert into public.themes (organization_id, target_month, title, source) values ($1, '2026-10-01', 't', 'client') returning id`, [ORG_A]);
    expect(ok).toHaveLength(1);
  });

  it("コタムはレビューを書けるが、顧客は書けない", async () => {
    await rejects(as(U.clientA, `insert into public.reviews (article_id, version_id, organization_id, reviewer_id, decision) values ($1, $2, $3, $4, 'comment')`, [ART_A, VER_A1, ORG_A, U.clientA]));
    const ok = await as(U.coachA, `insert into public.reviews (article_id, version_id, organization_id, reviewer_id, decision) values ($1, $2, $3, $4, 'comment') returning id`, [ART_A, VER_A1, ORG_A, U.coachA]);
    expect(ok).toHaveLength(1);
  });

  it("利用者は生成の記録を書き換えられない", async () => {
    await rejects(as(U.clientA, `insert into public.generation_runs (organization_id, article_id, kind, idempotency_key) values ($1, $2, 'body', 'k1')`, [ORG_A, ART_A]));
  });
});

describe("記事の状態遷移", () => {
  // 各テストで lock_version を正しく進めるため、現在値を読んでから更新する
  async function update(userId: string, articleId: string, set: string, params: unknown[] = []) {
    return as(
      userId,
      `update public.articles set ${set}, lock_version = lock_version + 1 where id = $1 returning status, published_without_approval`,
      [articleId, ...params],
    );
  }

  it("顧客は自分で承認できない", async () => {
    await rejects(update(U.clientA, ART_A, `status = 'approved', approved_version_id = current_version_id`));
  });

  it("確認依頼 → 承認 → 編集で承認が消えないと拒否される", async () => {
    await update(U.clientA, ART_A, `status = 'in_review', review_requested_version_id = current_version_id`);
    // 確認依頼した版は固定する（サーバー処理）
    await db.query(`update public.article_versions set frozen = true where id = $1`, [VER_A1]);
    await rejects(update(U.coachA, ART_A, `status = 'approved', approved_version_id = $2`, ["40000000-0000-0000-0000-000000000000"]));
    const approved = await update(U.coachA, ART_A, `status = 'approved', approved_version_id = review_requested_version_id, review_requested_version_id = null`);
    expect(approved[0]).toMatchObject({ status: "approved" });
    await rejects(update(U.clientA, ART_A, `status = 'drafting'`));
    const edited = await update(U.clientA, ART_A, `status = 'drafting', approved_version_id = null`);
    expect(edited[0]).toMatchObject({ status: "drafting" });
  });

  it("版は利用者から書き換えられず、固定された版はサーバーからも書き換えられない", async () => {
    // 利用者には版の更新権限がない（新しい版を追加するだけ）
    expect(await as(U.clientA, `update public.article_versions set title = 'x' where id = $1 returning id`, [VER_A1])).toHaveLength(0);
    await rejects(db.query(`update public.article_versions set title = 'x' where id = $1`, [VER_A1]));
  });

  it("lock_version が進んでいない更新は編集競合として拒否する", async () => {
    await rejects(as(U.clientA, `update public.articles set status = 'drafting' where id = $1`, [ART_A]));
  });

  it("確認依頼が任意の会社は、作成中から公開済みにでき、未承認公開が記録される", async () => {
    const rows = await update(U.clientA, ART_A, `status = 'published', published_url = 'https://example.com/a'`);
    expect(rows[0]).toMatchObject({ status: "published", published_without_approval: true });
  });

  it("確認依頼が必須の会社は、未承認の記事を公開済みにできない", async () => {
    await rejects(update(U.clientB, ART_B, `status = 'published', published_url = 'https://example.com/b'`));
  });

  it("コタムは顧客の操作（確認依頼・公開）を代わりにできない", async () => {
    await rejects(update(U.coachA, ART_A, `status = 'drafting'`));
  });

  it("http(s) 以外の公開URLは保存できない", async () => {
    await rejects(update(U.clientB, ART_B, `published_url = 'javascript:alert(1)'`));
  });
});
