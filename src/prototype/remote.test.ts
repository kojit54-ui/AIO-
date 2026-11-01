import { describe, expect, it } from "vitest";
import { HEARING_QUESTIONS, planFromProposal, sampleProposals } from "./growth";
import { sellItemsFromAnswer } from "./keywords";
import { answerFromDb, answerToDb, createGrowRemote, GrowSyncError, isUuid, planRowsForRpc, proposalSetFromDb, rowFromDb, sellItemsForRpc, toQuestionId } from "./remote";

const U1 = "11111111-1111-4111-8111-111111111111";
const U2 = "22222222-2222-4222-8222-222222222222";

describe("本物のデータとの変換", () => {
  it("答え：DBの決まり（質問 id の形・4000字・深掘り10件）に合わせて渡し、読んだら元の形に戻す", () => {
    // 4,000字を超える答えは切らずに断る（切ると読み直したときに消える）
    expect(() => answerToDb(U1, { questionId: "business", text: "あ".repeat(4001), followUps: [] })).toThrow(GrowSyncError);
    const row = answerToDb(U1, {
      questionId: "Biz-Area",
      text: "あ".repeat(4000),
      followUps: Array.from({ length: 12 }, (_, i) => ({ question: `q${i}`, answer: `a${i}` })),
      draft: true,
    });
    expect(row.question_id).toBe("biz_area");
    expect(row.text).toHaveLength(4000);
    expect(row.follow_ups).toHaveLength(10);
    expect(row.is_draft).toBe(true);
    expect(toQuestionId("business")).toBe("business");

    expect(answerFromDb({ question_id: "business", text: "工務店", follow_ups: [{ question: "q", answer: "a" }, "壊れた", { answer: "x" }], is_draft: false })).toEqual({
      questionId: "business",
      text: "工務店",
      followUps: [{ question: "q", answer: "a" }],
    });
    expect(answerFromDb({ question_id: "faq", text: "", follow_ups: null, is_draft: true })).toMatchObject({ followUps: [], draft: true });
  });

  it("答え：画面の質問 id はそのままDBの形になっている（読み直しても同じ質問に戻る）", () => {
    for (const q of HEARING_QUESTIONS) expect(toQuestionId(q.id)).toBe(q.id);
  });

  it("組み立て：長すぎる提案の言葉は、組み立てを作るときにDBの長さにそろえる（保存の前後で同じ行と分かる）", () => {
    const long = "あ".repeat(120);
    const plan = planFromProposal({ id: "p", pillar: { id: "x", keyword: long, question: long + long }, clusters: [{ id: "y", keyword: long, question: "" }], reasons: [], why: "" } as never);
    expect(plan.rows.every((r) => r.keyword.length === 80)).toBe(true);
    expect(plan.rows[0].question.length).toBe(200);
    expect(planRowsForRpc(plan).map((r) => r.keyword)).toEqual(plan.rows.map((r) => r.keyword));
    // 81字目から違うだけの言葉は、切りそろえると同じになるので1つにする
    const twins = planFromProposal({ id: "p", pillar: { id: "x", keyword: "柱", question: "" }, clusters: [{ id: "a", keyword: long + "A", question: "" }, { id: "b", keyword: long + "B", question: "" }], reasons: [], why: "" } as never);
    expect(twins.rows).toHaveLength(2);
    // 絵文字の途中で切らない（片割れの文字はDBが受け付けない）
    const emoji = planFromProposal({ id: "p", pillar: { id: "x", keyword: "あ".repeat(79) + "😀😀", question: "" }, clusters: [], reasons: [], why: "" } as never);
    expect(emoji.rows[0].keyword).toBe("あ".repeat(79) + "😀");
    expect(planRowsForRpc(emoji)[0].keyword).toBe("あ".repeat(79) + "😀");
    // 切った末尾の半角スペースは、DB（btrim）と同じく落とす。画面とDBで言葉がずれると行の対応が取れない
    const spaced = planFromProposal({ id: "p", pillar: { id: "x", keyword: " " + "あ".repeat(79) + " いう", question: "" }, clusters: [{ id: "a", keyword: "   ", question: "" }], reasons: [], why: "" } as never);
    expect(spaced.rows.map((r) => r.keyword)).toEqual(["あ".repeat(79)]);
    expect(planRowsForRpc(spaced)[0].keyword).toBe("あ".repeat(79));
  });

  it("売りたいもの：名前は文字単位で60字に切り、前後の半角スペースを落とす", () => {
    const items = sellItemsFromAnswer("あ".repeat(59) + "😀😀、" + "い".repeat(59) + " う");
    expect(items.map((x) => x.name)).toEqual(["あ".repeat(59) + "😀", "い".repeat(59)]);
    expect(sellItemsForRpc([{ id: "sell_0", name: " 家 " }])).toEqual([{ name: "家" }]);
  });

  it("組み立て：柱を先に、周りの記事は柱の key を指して渡す（30行まで）", () => {
    const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => [q.id, { questionId: q.id, text: q.example.replace(/^例：/, ""), followUps: [] }]));
    const plan = planFromProposal(sampleProposals(answers)[0]);
    const rows = planRowsForRpc(plan);
    expect(rows[0]).toMatchObject({ key: "k0", kind: "pillar", pillar_key: null, sort_order: 0 });
    expect(rows.slice(1).every((r) => r.kind === "cluster" && r.pillar_key === "k0")).toBe(true);
    expect(rows.every((r) => r.keyword.length <= 80 && r.reader_question.length <= 200)).toBe(true);
    const many = { ...plan, rows: Array.from({ length: 40 }, () => plan.rows[1]) };
    expect(planRowsForRpc(many)).toHaveLength(30);
  });

  it("行：DBの行を画面の行にし、知らない値は安全な値にする（検索数は数字のまま、作らない）", () => {
    const base = { kind: "cluster" as const, pillar_row_id: U1, keyword: "断熱", reader_question: "寒い？", status: "todo" as const, monthly_searches: null, parked: false, sell_item_id: null, sort_order: 1 };
    expect(rowFromDb({ ...base, id: U2, priority: 9, reasons: ["sales", "謎"], source: "謎" })).toMatchObject({ id: U2, pillarId: U1, priority: 2, reasons: ["sales"], source: "proposal", monthlySearches: null });
    expect(rowFromDb({ ...base, id: U1, kind: "pillar", pillar_row_id: null, priority: 3, reasons: [], source: "rakko", monthly_searches: 1300 })).toMatchObject({ pillarId: U1, source: "rakko", monthlySearches: 1300 });
  });

  it("売りたいもの：画面で作った仮の id は渡さず、DBの id はそのまま渡す（名前を変えても同じもの）", () => {
    expect(sellItemsForRpc([{ id: U1, name: "内窓" }, { id: "sell_0", name: "外壁" }])).toEqual([{ id: U1, name: "内窓" }, { name: "外壁" }]);
    expect(isUuid("sell_0")).toBe(false);
    // 11個目を黙って切り捨てない（外れたものがDBで消えるため）
    expect(() => sellItemsForRpc(Array.from({ length: 11 }, (_, i) => ({ id: `sell_${i}`, name: `品${i}` })))).toThrow(GrowSyncError);
    expect(new GrowSyncError("x").name).toBe("GrowSyncError");
  });

  it("コタムからの提案：DBの行を画面の提案にし、提案ごと・言葉ごとに別の id を付ける", () => {
    const set = proposalSetFromDb({
      id: "kp1",
      proposals: [
        { pillar: { keyword: "内窓 札幌", question: "内窓とは" }, clusters: [{ keyword: "内窓 費用", question: "いくら？" }, { keyword: "", question: "空" }], reasons: ["sales", "謎"], why: "売上" },
        { pillar: { keyword: "" }, clusters: [] },
      ],
      is_sample: true,
      used_research: false,
      created_at: "2026-11-02T00:00:00Z",
    });
    expect(set.list).toHaveLength(1);
    expect(set.list[0]).toMatchObject({ id: "kp1-0", pillar: { id: "kp1-0-p", keyword: "内窓 札幌" }, clusters: [{ id: "kp1-0-c0", keyword: "内窓 費用" }], reasons: ["sales"] });
    expect(set.info).toEqual({ isSample: true, usedResearch: false, createdAt: "2026-11-02T00:00:00Z" });
    // 選ぶと、柱の id を周りの記事が指す
    const plan = planFromProposal(set.list[0]);
    expect(plan.rows[1].pillarId).toBe(plan.rows[0].id);
  });

  it("コタムからの提案を頼む：サーバーの言葉をそのまま知らせ、通信の失敗はやさしい言葉にする", async () => {
    const ok = createGrowRemote({} as never, U1, async () => new Response(JSON.stringify({ id: "kp2", proposals: [{ pillar: { keyword: "柱", question: "q" }, clusters: [], reasons: ["aio"], why: "w" }], isSample: false, usedResearch: true, createdAt: "x" })));
    expect((await ok.requestProposals()).info).toEqual({ isSample: false, usedResearch: true, createdAt: "x" });
    const limited = createGrowRemote({} as never, U1, async () => new Response(JSON.stringify({ code: "limit_reached", message: "今月のおすすめを作れる回数に達しました" }), { status: 429 }));
    await expect(limited.requestProposals()).rejects.toThrow("回数に達しました");
    const offline = createGrowRemote({} as never, U1, async () => {
      throw new TypeError("fetch failed");
    });
    await expect(offline.requestProposals()).rejects.toThrow(GrowSyncError);
  });
});
