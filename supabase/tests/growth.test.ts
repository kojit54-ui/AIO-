// 育つブログの保存（ヒアリングの答え・記事の組み立て・書く記事リスト・今売りたいもの）のテスト。T5-3。

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
const ART_B = "30000000-0000-0000-0000-00000000000b";
// A社とB社の両方を担当するコタム
const COACH_AB = "00000000-0000-0000-0000-0000000000cb";

let db: PGlite;

async function as<T>(userId: string, query: string, params: unknown[] = []): Promise<T[]> {
  return db.transaction(async (tx) => {
    await tx.exec("set local role authenticated");
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    return (await tx.query<T>(query, params)).rows;
  });
}

const rows = (pillar: string, clusters: string[]) =>
  JSON.stringify([
    { key: "p", kind: "pillar", keyword: pillar, reader_question: `${pillar}の全体`, priority: 3, reasons: ["sales"], source: "proposal" },
    ...clusters.map((k, i) => ({ key: `c${i}`, kind: "cluster", pillar_key: "p", keyword: k, reader_question: `${k}は？`, priority: i < 2 ? 3 : 1, reasons: ["aio"], source: i === 0 ? "rakko" : "proposal" })),
  ]);

async function choose(user: string, org: string, pillar: string, clusters: string[]) {
  return (await as<{ id: string }>(user, "select public.choose_keyword_plan($1, $2, $3) as id", [org, JSON.stringify({ pillar: { keyword: pillar } }), rows(pillar, clusters)]))[0].id;
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(sql(new URL("./auth_stub.sql", import.meta.url)));
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(sql(new URL(f, dir)));
  await db.exec(`
    insert into auth.users (id) values ('${CLIENT}'), ('${COACH}'), ('${OTHER}'), ('${COACH_AB}');
    insert into public.organizations (id, name) values ('${ORG}', 'A社'), ('${ORG_B}', 'B社');
    insert into public.memberships (user_id, organization_id, role) values
      ('${CLIENT}', '${ORG}', 'client_member'), ('${COACH}', '${ORG}', 'coach'), ('${OTHER}', '${ORG_B}', 'client_member'),
      ('${COACH_AB}', '${ORG}', 'coach'), ('${COACH_AB}', '${ORG_B}', 'coach');
    insert into public.themes (id, organization_id, target_month, title, source) values
      ('20000000-0000-0000-0000-00000000000a', '${ORG}', '2026-11-01', 'A', 'coach'),
      ('20000000-0000-0000-0000-00000000000b', '${ORG_B}', '2026-11-01', 'B', 'coach');
    insert into public.articles (id, organization_id, theme_id) values
      ('${ART}', '${ORG}', '20000000-0000-0000-0000-00000000000a'),
      ('${ART_B}', '${ORG_B}', '20000000-0000-0000-0000-00000000000b');
  `);
}, 60_000);

describe("会社のことを教える（ヒアリングの答え）", () => {
  it("顧客とコタムの両方が自社の答えを書き、直せる", async () => {
    await as(CLIENT, `insert into public.hearing_answers (organization_id, question_id, text, follow_ups, updated_by) values ($1, 'services', '内窓', '[{"question":"例えば？","answer":""}]', $2)`, [ORG, CLIENT]);
    await as(COACH, `update public.hearing_answers set text = '内窓と断熱', is_draft = false where organization_id = $1 and question_id = 'services'`, [ORG]);
    expect(await as(CLIENT, "select text, is_draft from public.hearing_answers where organization_id = $1", [ORG])).toEqual([{ text: "内窓と断熱", is_draft: false }]);
  });

  it("他社の答えは読めず、書けない", async () => {
    expect(await as(OTHER, "select * from public.hearing_answers where organization_id = $1", [ORG])).toEqual([]);
    await expect(as(OTHER, `insert into public.hearing_answers (organization_id, question_id, text) values ($1, 'x', 'y')`, [ORG])).rejects.toThrow();
    expect(await as(OTHER, `update public.hearing_answers set text = 'z' where organization_id = $1 returning 1`, [ORG])).toEqual([]);
  });

  it("質問の id と長さを検査する", async () => {
    await expect(as(CLIENT, `insert into public.hearing_answers (organization_id, question_id) values ($1, 'Bad Id')`, [ORG])).rejects.toThrow();
    await expect(as(CLIENT, `insert into public.hearing_answers (organization_id, question_id, text) values ($1, 'long', repeat('あ', 4001))`, [ORG])).rejects.toThrow();
  });
});

describe("今売りたいもの", () => {
  it("渡した順番で置きかえ、id を渡した行は残す", async () => {
    await as(CLIENT, "select public.save_sell_items($1, $2)", [ORG, JSON.stringify([{ name: "内窓" }, { name: "浴室の断熱" }, { name: "外壁" }])]);
    const first = await as<{ id: string; name: string }>(CLIENT, "select id, name from public.sell_items where organization_id = $1 order by rank", [ORG]);
    expect(first.map((x) => x.name)).toEqual(["内窓", "浴室の断熱", "外壁"]);
    // 入れかえと削除
    await as(CLIENT, "select public.save_sell_items($1, $2)", [ORG, JSON.stringify([{ id: first[1].id, name: "浴室の断熱" }, { id: first[0].id, name: "内窓" }])]);
    const next = await as<{ id: string; name: string }>(CLIENT, "select id, name from public.sell_items where organization_id = $1 order by rank", [ORG]);
    expect(next).toEqual([first[1], first[0]]);
  });

  it("両社を担当するコタムでも、売りたいもの・答えを他社へ移せない", async () => {
    await expect(as(COACH_AB, "update public.sell_items set organization_id = $2 where organization_id = $1", [ORG, ORG_B])).rejects.toThrow("immutable");
    await expect(as(COACH_AB, "update public.hearing_answers set organization_id = $2 where organization_id = $1", [ORG, ORG_B])).rejects.toThrow("immutable");
  });

  it("他社は読めず、置きかえられない", async () => {
    expect(await as(OTHER, "select * from public.sell_items where organization_id = $1", [ORG])).toEqual([]);
    await expect(as(OTHER, "select public.save_sell_items($1, '[]')", [ORG])).rejects.toThrow("forbidden");
    expect((await db.query("select 1 from public.sell_items where organization_id = $1", [ORG])).rows).toHaveLength(2);
  });
});

describe("記事の組み立てと書く記事リスト", () => {
  let planId: string;

  it("選ぶと、柱と周りの記事の行ができ、周りの記事は柱を指す", async () => {
    planId = await choose(CLIENT, ORG, "さくら市 内窓", ["内窓 費用", "内窓 補助金", "内窓 結露"]);
    const r = await as<{ id: string; kind: string; keyword: string; pillar_row_id: string | null; source: string; status: string }>(
      CLIENT,
      "select id, kind, keyword, pillar_row_id, source, status from public.keyword_rows where plan_id = $1 order by sort_order",
      [planId],
    );
    expect(r.map((x) => x.keyword)).toEqual(["さくら市 内窓", "内窓 費用", "内窓 補助金", "内窓 結露"]);
    const pillar = r.find((x) => x.kind === "pillar")!;
    expect(r.filter((x) => x.kind === "cluster").every((x) => x.pillar_row_id === pillar.id)).toBe(true);
    expect(r[1].source).toBe("rakko");
    expect(r.every((x) => x.status === "todo")).toBe(true);
  });

  it("顧客は行を「やった」・やめておくにでき、記事をつなげる", async () => {
    const [row] = await as<{ id: string }>(CLIENT, "select id from public.keyword_rows where plan_id = $1 and keyword = '内窓 費用'", [planId]);
    expect(await as(CLIENT, "update public.keyword_rows set status = 'writing', article_id = $2 where id = $1 returning status", [row.id, ART])).toEqual([{ status: "writing" }]);
    await as(CLIENT, "update public.keyword_rows set parked = true where plan_id = $1 and keyword = '内窓 結露'", [planId]);
  });

  it("月の検索回数は利用者が書けない（キーワードツールの値だけ）。サーバー処理は書ける", async () => {
    await expect(as(CLIENT, "update public.keyword_rows set monthly_searches = 9999 where plan_id = $1", [planId])).rejects.toThrow("tool-only");
    await expect(as(COACH, "update public.keyword_rows set monthly_searches = 9999 where plan_id = $1", [planId])).rejects.toThrow("tool-only");
    await expect(
      as(CLIENT, "insert into public.keyword_rows (plan_id, organization_id, kind, keyword, monthly_searches) values ($1, $2, 'cluster', '追加', 10)", [planId, ORG]),
    ).rejects.toThrow("tool-only");
    await db.query("update public.keyword_rows set monthly_searches = 390 where plan_id = $1 and keyword = '内窓 費用'", [planId]);
    expect((await db.query<{ m: number }>("select monthly_searches as m from public.keyword_rows where plan_id = $1 and keyword = '内窓 費用'", [planId])).rows[0].m).toBe(390);
  });

  it("他社の組み立て・行は読めず、他社の記事や組み立てにはつなげない", async () => {
    expect(await as(OTHER, "select * from public.keyword_rows where organization_id = $1", [ORG])).toEqual([]);
    expect(await as(OTHER, "select * from public.keyword_plans where organization_id = $1", [ORG])).toEqual([]);
    await expect(choose(OTHER, ORG, "乗っ取り", ["a", "b", "c"])).rejects.toThrow("forbidden");
    const [row] = await as<{ id: string }>(CLIENT, "select id from public.keyword_rows where plan_id = $1 and keyword = '内窓 補助金'", [planId]);
    await expect(as(CLIENT, "update public.keyword_rows set article_id = $2 where id = $1", [row.id, ART_B])).rejects.toThrow("organization mismatch");
    const bPlan = await choose(OTHER, ORG_B, "B社の柱", ["b1", "b2", "b3"]);
    await expect(as(OTHER, "insert into public.keyword_rows (plan_id, organization_id, kind, keyword) values ($1, $2, 'cluster', 'x')", [bPlan, ORG])).rejects.toThrow();
  });

  it("記事を公開すると、その行は自動で「やった」になる", async () => {
    await db.query("update public.articles set status = 'published', published_at = now(), published_without_approval = true where id = $1", [ART]);
    expect((await db.query<{ status: string }>("select status from public.keyword_rows where article_id = $1", [ART])).rows).toEqual([{ status: "published" }]);
  });

  it("選び直すと前の組み立てはしまわれ、書いた・やった行は同じキーワードの新しい行に引き継ぐ", async () => {
    const next = await choose(COACH, ORG, "さくら市 断熱", ["内窓 費用", "断熱 補助金", "断熱 期間"]);
    expect((await db.query<{ archived: boolean }>("select archived_at is not null as archived from public.keyword_plans where id = $1", [planId])).rows[0].archived).toBe(true);
    const active = await as<{ id: string }>(CLIENT, "select id from public.keyword_plans where organization_id = $1 and archived_at is null", [ORG]);
    expect(active).toEqual([{ id: next }]);
    const carried = await as<{ status: string; article_id: string }>(CLIENT, "select status, article_id from public.keyword_rows where plan_id = $1 and keyword = '内窓 費用'", [next]);
    expect(carried).toEqual([{ status: "published", article_id: ART }]);
  });

  it("組み立ての中身は後から書きかえられない。行の数は1〜30", async () => {
    await expect(as(CLIENT, "update public.keyword_plans set proposal = '{}' where organization_id = $1", [ORG])).rejects.toThrow("immutable");
    await expect(as(CLIENT, "select public.choose_keyword_plan($1, '{}', '[]')", [ORG])).rejects.toThrow("invalid_input");
  });
});
