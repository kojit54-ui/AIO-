import { afterEach, describe, expect, it, vi } from "vitest";
import { HEARING_QUESTIONS, planFromProposal, sampleProposals, type KeywordPlan, type KeywordRow } from "./growth";
import { GrowSyncError, type GrowRemote, type GrowSnapshot } from "./remote";
import { connectGrow, growActions, readGrowState, readGrowSync, SAVE_DELAY_MS } from "./store";

describe("試作の状態", () => {
  it("設計図を選び直すと、前の設計図で書いた記事の答えは残らない", () => {
    growActions.reset();
    const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => [q.id, { questionId: q.id, text: q.example.replace(/^例：/, ""), followUps: [] }]));
    const plan = planFromProposal(sampleProposals(answers)[0]);
    growActions.choosePlan(plan);
    growActions.saveArticleAnswers(plan.rows[0].id, { a1: "答え" });
    expect(readGrowState().articleAnswers[plan.rows[0].id]).toEqual({ a1: "答え" });
    growActions.choosePlan(null);
    growActions.choosePlan(plan);
    expect(readGrowState().articleAnswers).toEqual({});
  });
});

const ORG = "33333333-3333-4333-8333-333333333333";
const flush = () => vi.advanceTimersByTimeAsync(0);

function fakeRemote(snap: GrowSnapshot = { answers: {}, plan: null, sellItems: null }) {
  const calls: string[] = [];
  let n = 0;
  const uuid = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
  const r: GrowRemote & { calls: string[]; failNext: boolean } = {
    organizationId: ORG,
    calls,
    failNext: false,
    async load() {
      calls.push("load");
      return snap;
    },
    async saveAnswer(a) {
      calls.push(`answer:${a.questionId}:${a.text}`);
      if (r.failNext) {
        r.failNext = false;
        throw new GrowSyncError("保存できませんでした");
      }
    },
    async choosePlan(plan) {
      calls.push("choose");
      return plan ? { proposalId: uuid(), rows: plan.rows.map((x) => ({ ...x, id: uuid(), status: "todo" })) } : null;
    },
    async updateRow(id, patch) {
      calls.push(`row:${id}:${JSON.stringify(patch)}`);
    },
    async addRow() {
      calls.push("add");
      return null;
    },
    async saveSellItems(items) {
      calls.push(`sell:${items.map((x) => x.name).join(",")}`);
      return items.map((x) => ({ id: uuid(), name: x.name }));
    },
  };
  return r;
}

describe("本物のデータにつないだとき", () => {
  afterEach(() => {
    connectGrow(null);
    vi.useRealTimers();
  });

  it("読み込むまでは ready にせず、DBの答えで始める", async () => {
    vi.useFakeTimers();
    const r = fakeRemote({ answers: { business: { questionId: "business", text: "工務店", followUps: [] } }, plan: null, sellItems: null });
    connectGrow(r);
    expect(readGrowSync()).toMatchObject({ mode: "remote", loaded: false });
    await flush();
    expect(readGrowSync().loaded).toBe(true);
    expect(readGrowState().answers.business.text).toBe("工務店");
  });

  it("打っている途中の答えはまとめて1回だけ保存し、決まった答えはすぐ保存する", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    connectGrow(r);
    await flush();
    for (const t of ["工", "工務", "工務店"]) growActions.saveAnswer({ questionId: "business", text: t, followUps: [], draft: true });
    expect(readGrowState().answers.business.text).toBe("工務店");
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(r.calls.filter((c) => c.startsWith("answer"))).toEqual(["answer:business:工務店"]);

    growActions.saveAnswer({ questionId: "area", text: "途中", followUps: [], draft: true });
    growActions.saveAnswer({ questionId: "area", text: "市内", followUps: [] });
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(r.calls.filter((c) => c.startsWith("answer:area"))).toEqual(["answer:area:市内"]);
  });

  it("保存に失敗したら知らせて、DBの内容を読み直す", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    connectGrow(r);
    await flush();
    r.failNext = true;
    growActions.saveAnswer({ questionId: "business", text: "消えるはず", followUps: [] });
    await flush();
    expect(readGrowSync().error).toBe("保存できませんでした");
    expect(r.calls.filter((c) => c === "load")).toHaveLength(2);
    expect(readGrowState().answers.business).toBeUndefined();
  });

  it("組み立てを選んだら DB の id に置きかえ、待つあいだに変えた進み具合も残して保存し直す", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    connectGrow(r);
    await flush();
    const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => [q.id, { questionId: q.id, text: q.example.replace(/^例：/, ""), followUps: [] }]));
    const p = sampleProposals(answers)[0];
    const plan: KeywordPlan = planFromProposal(p);
    growActions.choosePlan(plan, p);
    growActions.setRowStatus(plan.rows[1].id, "writing");
    await flush();
    const now = readGrowState().plan!;
    expect(now.proposalId).not.toBe(plan.proposalId);
    expect(now.rows.every((x) => /^0{8}-/.test(x.id))).toBe(true);
    expect(now.rows[1].status).toBe("writing");
    expect(r.calls).toContain(`row:${now.rows[1].id}:{"status":"writing"}`);
  });

  it("売りたいものの並べかえは最後の1回だけ保存し、DBの id に置きかえる", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    connectGrow(r);
    await flush();
    growActions.setSellItems([{ id: "sell_0", name: "内窓" }, { id: "sell_1", name: "外壁" }]);
    growActions.setSellItems([{ id: "sell_1", name: "外壁" }, { id: "sell_0", name: "内窓" }]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(r.calls.filter((c) => c.startsWith("sell"))).toEqual(["sell:外壁,内窓"]);
    expect(readGrowState().sellItems?.map((x) => x.name)).toEqual(["外壁", "内窓"]);
    expect(readGrowState().sellItems?.every((x) => /^0{8}-/.test(x.id))).toBe(true);
  });

  it("前の保存が届く前に次の保存をしても、順番どおりに送る（古い途中の答えで上書きしない）", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    const order: string[] = [];
    r.saveAnswer = async (a) => {
      // 途中の答えだけ届くのが遅い
      await new Promise((ok) => setTimeout(ok, a.draft ? 500 : 10));
      order.push(`${a.text}:${a.draft ? "draft" : "done"}`);
    };
    connectGrow(r);
    await flush();
    growActions.saveAnswer({ questionId: "business", text: "工務", followUps: [], draft: true });
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    growActions.saveAnswer({ questionId: "business", text: "工務店", followUps: [] });
    await vi.advanceTimersByTimeAsync(1000);
    expect(order).toEqual(["工務:draft", "工務店:done"]);
  });

  it("売りたいものを全部消したら、空のまま残す（答えから作った候補を出し直さない）", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    connectGrow(r);
    await flush();
    growActions.setSellItems([]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(readGrowState().sellItems).toEqual([]);
  });

  it("書きかけのまま会社を切りかえても、前の会社の答えは前の会社に保存する", async () => {
    vi.useFakeTimers();
    const a = fakeRemote();
    connectGrow(a);
    await flush();
    growActions.saveAnswer({ questionId: "business", text: "途中", followUps: [], draft: true });
    const b = { ...fakeRemote(), organizationId: "44444444-4444-4444-8444-444444444444" };
    connectGrow(b);
    await flush();
    expect(a.calls).toContain("answer:business:途中");
    expect(readGrowState().answers.business).toBeUndefined();
  });

  it("組み立てを選ぶ保存の途中で足した記事も、柱と売りたいものの札をつけて保存し、消えない", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    let added: KeywordRow | null = null;
    let chosen: KeywordPlan | null = null;
    const choose = r.choosePlan;
    r.choosePlan = async (plan, proposal) => {
      await new Promise((ok) => setTimeout(ok, 300));
      chosen = await choose(plan, proposal);
      return chosen;
    };
    r.addRow = async (row) => {
      added = row;
      return chosen && { ...chosen, rows: [...chosen.rows, { ...row, id: "99999999-9999-4999-8999-999999999999" }] };
    };
    connectGrow(r);
    await flush();
    const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => [q.id, { questionId: q.id, text: q.example.replace(/^例：/, ""), followUps: [] }]));
    const p = sampleProposals(answers)[0];
    const plan = planFromProposal(p);
    growActions.choosePlan(plan, p);
    growActions.setSellItems([{ id: "sell_0", name: "内窓" }]);
    growActions.addRow({ id: "new1", keyword: "自分で足した記事", question: "", kind: "cluster", status: "todo", pillarId: plan.rows[0].id, sellItemId: "sell_0" });
    expect(readGrowState().plan!.rows.at(-1)!.keyword).toBe("自分で足した記事");
    await vi.advanceTimersByTimeAsync(1000);
    const pillar = readGrowState().plan!.rows[0];
    expect(added!.pillarId).toBe(pillar.id);
    expect(added!.sellItemId).toMatch(/^0{8}-/);
    expect(readGrowState().plan!.rows.some((x) => x.keyword === "自分で足した記事")).toBe(true);
  });

  it("前の保存を待つあいだに2本足しても、2本とも保存する", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    const plan: KeywordPlan = { proposalId: "55555555-5555-4555-8555-555555555555", rows: [{ id: "66666666-6666-4666-8666-666666666666", keyword: "柱", question: "", kind: "pillar", status: "todo" }] };
    let db = plan;
    r.load = async () => ({ answers: {}, plan: db, sellItems: null });
    const sent: string[] = [];
    r.saveAnswer = () => new Promise((ok) => setTimeout(ok, 300));
    r.addRow = async (row) => {
      sent.push(row.keyword);
      db = { ...db, rows: [...db.rows, { ...row, id: `77777777-7777-4777-8777-00000000000${sent.length}` }] };
      return db;
    };
    connectGrow(r);
    await flush();
    growActions.saveAnswer({ questionId: "business", text: "待たせる", followUps: [] });
    growActions.addRow({ id: "a", keyword: "A", question: "", kind: "cluster", status: "todo", pillarId: plan.rows[0].id });
    growActions.addRow({ id: "b", keyword: "B", question: "", kind: "cluster", status: "todo", pillarId: plan.rows[0].id });
    await vi.advanceTimersByTimeAsync(1000);
    expect(sent).toEqual(["A", "B"]);
    expect(readGrowState().plan!.rows.map((x) => x.keyword)).toEqual(["柱", "A", "B"]);
  });

  it("売りたいものを保存する途中で並べかえても、DB の id で送る（作り直さない）", async () => {
    vi.useFakeTimers();
    const r = fakeRemote();
    const sentIds: string[][] = [];
    let n = 0;
    r.saveSellItems = async (items) => {
      sentIds.push(items.map((x) => x.id));
      await new Promise((ok) => setTimeout(ok, 300));
      return items.map((x) => ({ id: /^0{8}-/.test(x.id) ? x.id : `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`, name: x.name }));
    };
    connectGrow(r);
    await flush();
    growActions.setSellItems([{ id: "sell_0", name: "内窓" }, { id: "sell_1", name: "外壁" }]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS); // 1回目を送りはじめる
    growActions.setSellItems([{ id: "sell_1", name: "外壁" }, { id: "sell_0", name: "内窓" }]);
    await vi.advanceTimersByTimeAsync(2000);
    expect(sentIds).toHaveLength(2);
    expect(sentIds[1].every((id) => /^0{8}-/.test(id))).toBe(true);
  });

  it("仮の id が同じでも、別の会社の売りたいものの DB の id は使わない", async () => {
    vi.useFakeTimers();
    const a = fakeRemote();
    connectGrow(a);
    await flush();
    growActions.setSellItems([{ id: "sell_0", name: "内窓" }]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    const b = { ...fakeRemote(), organizationId: "44444444-4444-4444-8444-444444444444" };
    const sent: string[] = [];
    b.saveSellItems = async (items) => {
      sent.push(...items.map((x) => x.id));
      return items.map((x) => ({ id: "88888888-8888-4888-8888-888888888888", name: x.name }));
    };
    connectGrow(b);
    await flush();
    growActions.setSellItems([{ id: "sell_0", name: "外壁" }]);
    await vi.advanceTimersByTimeAsync(SAVE_DELAY_MS);
    expect(sent).toEqual(["sell_0"]);
  });

  it("本物のデータでは「最初からやり直す」で会社の記録を消さない", async () => {
    vi.useFakeTimers();
    const r = fakeRemote({ answers: { business: { questionId: "business", text: "工務店", followUps: [] } }, plan: null, sellItems: null });
    connectGrow(r);
    await flush();
    growActions.reset();
    expect(readGrowState().answers.business.text).toBe("工務店");
  });
});
