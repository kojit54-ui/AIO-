import { describe, expect, it } from "vitest";
import { HEARING_QUESTIONS, type KeywordPlan, type KeywordRow, computeGrowth, planFromProposal, sampleProposals } from "./growth";
import { countByStatus, cycleStatus, groupByPillar, moveItem, newKeywordRow, nextKeyword, normalizeRows, sellItemOf, sellItemsFromAnswer, shioriMessage, sortByRecommendation, toggleDone } from "./keywords";

const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => [q.id, { questionId: q.id, text: q.example.replace(/^例：/, ""), followUps: [] }]));
const plan = planFromProposal(sampleProposals(answers)[0]);
const withStatus = (p: KeywordPlan, i: number, patch: Partial<KeywordRow>): KeywordPlan => ({ ...p, rows: p.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)) });

describe("キーワード管理表", () => {
  it("提案から作った表は、柱の記事と最初の周りの記事が優先度 高で、検索数は作らない", () => {
    expect(plan.rows[0].priority).toBe(3);
    expect(plan.rows[1].priority).toBe(3);
    expect(plan.rows.at(-1)!.priority).toBe(1);
    expect(plan.rows.every((r) => r.monthlySearches === null && r.source === "proposal" && r.pillarId === plan.rows[0].id)).toBe(true);
  });

  it("前の試作で保存した行（優先度などが無い）も表に出せる", () => {
    const old: KeywordPlan = { proposalId: "x", rows: [{ id: "a", keyword: "柱", question: "", kind: "pillar", status: "todo" }, { id: "b", keyword: "周り", question: "", kind: "cluster", status: "todo" }] };
    const rows = normalizeRows(old);
    expect(rows[1]).toMatchObject({ pillarId: "a", priority: 2, source: "proposal", monthlySearches: null, parked: false });
    expect(groupByPillar(rows)).toHaveLength(1);
  });

  it("次に書くのは、優先度の高い順で、書いている途中を先に。やったもの・やめておいたものは除く", () => {
    let p = withStatus(plan, 0, { status: "published" });
    expect(nextKeyword(normalizeRows(p))!.id).toBe(plan.rows[1].id);
    p = withStatus(p, 2, { status: "writing" });
    expect(nextKeyword(normalizeRows(p))!.id).toBe(plan.rows[2].id);
    p = withStatus(withStatus(p, 1, { parked: true }), 2, { status: "published" });
    expect(nextKeyword(normalizeRows(p))!.priority).toBe(2);
    const all = { ...plan, rows: plan.rows.map((r) => ({ ...r, status: "published" as const })) };
    expect(nextKeyword(normalizeRows(all))).toBeNull();
    expect(shioriMessage(normalizeRows(all))).toContain("ぜんぶ");
  });

  it("おすすめ順は優先度の高い順で、同じ優先度は元の並び", () => {
    const sorted = sortByRecommendation(normalizeRows(plan));
    expect(sorted.map((r) => r.priority)).toEqual([...sorted.map((r) => r.priority)].sort((a, b) => b - a));
    expect(sorted[0].kind).toBe("pillar");
  });

  it("やめておいたキーワードは、数にもレベルにも入らない", () => {
    const parked = withStatus(plan, plan.rows.length - 1, { parked: true });
    expect(countByStatus(normalizeRows(parked)).all).toBe(plan.rows.length - 1);
    const rest = { ...parked, rows: parked.rows.map((r) => (r.parked ? r : { ...r, status: "published" as const })) };
    expect(computeGrowth(answers, rest).badges.find((b) => b.id === "all")!.earned).toBe(true);
  });

  it("丸はやった⇄まだ、状態のボタンは まだ→書いている→やった→まだ", () => {
    expect(toggleDone("todo")).toBe("published");
    expect(toggleDone("writing")).toBe("published");
    expect(toggleDone("published")).toBe("todo");
    expect([cycleStatus("todo"), cycleStatus("writing"), cycleStatus("published")]).toEqual(["writing", "published", "todo"]);
  });

  it("キーワードを足すとき、空や同じ言葉（空白の違いは無視）は足さない", () => {
    expect(newKeywordRow(plan.rows, "  ", "p")).toBeNull();
    expect(newKeywordRow(plan.rows, plan.rows[1].keyword.replace(" ", "　 "), "p")).toBeNull();
    const row = newKeywordRow(plan.rows, " 内窓  結露 ", plan.rows[0].id)!;
    expect(row).toMatchObject({ keyword: "内窓 結露", source: "customer", priority: 2, status: "todo", monthlySearches: null });
  });
});

describe("今売りたいものの順番", () => {
  const rows = (): ReturnType<typeof normalizeRows> =>
    normalizeRows({
      proposalId: "x",
      rows: [
        { id: "a", keyword: "内窓 費用", question: "", kind: "cluster", status: "todo", priority: 2 },
        { id: "b", keyword: "浴室 断熱 費用", question: "", kind: "cluster", status: "todo", priority: 2 },
        { id: "c", keyword: "外壁塗装 時期", question: "", kind: "cluster", status: "todo", priority: 3 },
      ],
    });

  it("ヒアリングの答えから売りたいものを作る（重なりは1つ、最大5つ）", () => {
    expect(sellItemsFromAnswer("内窓、浴室 断熱\n内窓").map((x) => x.name)).toEqual(["内窓", "浴室 断熱"]);
    expect(sellItemsFromAnswer("a、b、c、d、e、f")).toHaveLength(5);
    expect(sellItemsFromAnswer("")).toEqual([]);
  });

  it("記事の言葉に売りたいものの名前が入っていれば、その記事とみなす（空白の違いは無視）。決めてあればそれを使う", () => {
    const items = sellItemsFromAnswer("内窓、浴室断熱");
    const r = rows();
    expect(sellItemOf(r[0], items)?.rank).toBe(0);
    expect(sellItemOf(r[1], items)?.rank).toBe(1);
    expect(sellItemOf(r[2], items)).toBeNull();
    expect(sellItemOf({ ...r[2], sellItemId: items[1].id }, items)?.rank).toBe(1);
  });

  it("順番を入れかえると、おすすめ順と次の1本が変わる", () => {
    const items = sellItemsFromAnswer("内窓、浴室断熱");
    // 内窓1位：2+3=5 が先、外壁(3+0)より浴室(2+2)が上
    expect(sortByRecommendation(rows(), items).map((r) => r.id)).toEqual(["a", "b", "c"]);
    const swapped = moveItem(items, 1, 0);
    expect(nextKeyword(rows(), swapped)!.id).toBe("b");
    // 売りたいものが無ければ、しおりのおすすめ度だけで決まる
    expect(nextKeyword(rows(), [])!.id).toBe("c");
  });

  it("並べかえは元の配列を変えず、範囲の外は端に置く", () => {
    const list = [1, 2, 3];
    expect(moveItem(list, 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem(list, 2, -5)).toEqual([3, 1, 2]);
    expect(list).toEqual([1, 2, 3]);
  });
});
