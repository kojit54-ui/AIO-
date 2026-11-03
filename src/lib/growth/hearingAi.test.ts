import { describe, expect, it } from "vitest";
import { parseFollowUpWithWhy, parseProfile } from "@/lib/ai/growthPrompts";
import { HEARING_QUESTIONS, isAnswerDone, nextDeepDive, pendingDeepDive, withNewText, type HearingAnswer } from "@/prototype/growth";
import { answerFromDb, answerToDb } from "@/prototype/remote";

const q = HEARING_QUESTIONS.find((x) => x.id === "strengths")!;
const thin: HearingAnswer = { questionId: "strengths", text: "丁寧", followUps: [] };

describe("ヒアリングのAIの深掘り", () => {
  it("答え待ちの深掘り（AIの質問）があれば、それを返し、答え終わったことにしない", () => {
    const a: HearingAnswer = { ...thin, followUps: [{ question: "どんな場面で？", why: "体験があるとAIが紹介しやすい", answer: "", pending: true }] };
    expect(nextDeepDive(q, a)).toBe("どんな場面で？");
    expect(pendingDeepDive(a)?.why).toContain("体験");
    expect(isAnswerDone(q, a)).toBe(false);
  });

  it("AIがもう要らないと決めたら、短い答えでも決まった深掘りを出さない", () => {
    expect(nextDeepDive(q, thin)).not.toBeNull();
    expect(nextDeepDive(q, { ...thin, deepDiveDone: true })).toBeNull();
    expect(isAnswerDone(q, { ...thin, deepDiveDone: true })).toBe(true);
  });

  it("答えを書き直したら、深掘りを聞き直す", () => {
    const next = withNewText({ ...thin, deepDiveDone: true, followUps: [{ question: "q", answer: "a" }] }, "早い");
    expect(next.followUps).toEqual([]);
    expect(next.deepDiveDone).toBe(false);
  });

  it("聞く理由と答え待ちは、DBに保存して読み直しても残る", () => {
    const a: HearingAnswer = { ...thin, deepDiveDone: true, followUps: [{ question: "q", why: "w", answer: "", pending: true }] };
    const row = answerToDb("org", a);
    const back = answerFromDb({ question_id: row.question_id, text: row.text, follow_ups: row.follow_ups, is_draft: row.is_draft, deep_dive_done: true });
    expect(back.followUps[0]).toEqual({ question: "q", why: "w", answer: "", pending: true });
    expect(back.deepDiveDone).toBe(true);
    // 立てていないときは、列を送らない（列を足す SQL の前でも保存できる）
    expect("deep_dive_done" in answerToDb("org", thin)).toBe(false);
  });

  it("AIの返事から、質問と聞く理由を読む", () => {
    expect(parseFollowUpWithWhy('{"follow_up": null, "why": ""}')).toBeNull();
    expect(parseFollowUpWithWhy('{"follow_up": "例えば価格は？", "why": "価格があるとAIが引用しやすいためです"}')).toEqual({ question: "例えば価格は？", why: "価格があるとAIが引用しやすいためです", example: "" });
    expect(parseFollowUpWithWhy('{"follow_up": "例えば価格は？"}')).toEqual({ question: "例えば価格は？", why: "", example: "" });
    expect(parseFollowUpWithWhy('{"follow_up": "q", "why": "w", "example": "例：約45万円、2日"}')?.example).toBe("例：約45万円、2日");
  });
});

describe("ヒアリングから会社の情報", () => {
  it("事業内容とお客様は必須。文体が無ければ既定にする", () => {
    expect(() => parseProfile('{"business": "", "target_customers": "x"}')).toThrow();
    const p = parseProfile('{"business": "リフォーム", "target_customers": "60代", "strengths": "", "tone": "", "banned_expressions": "", "contact": ""}');
    expect(p.tone).toContain("ですます調");
    expect(p.business).toBe("リフォーム");
  });
});

describe("記事の質問の記入例", () => {
  it("質問ごとの記入例を読み、「例：」をそろえる。空は落とす", async () => {
    const { parseExamples } = await import("@/lib/ai/growthPrompts");
    const r = parseExamples(JSON.stringify({ examples: { q1: "6歳の子の受け口を相談された", q2: "", other: "x" } }), ["q1", "q2"]);
    expect(r).toEqual({ q1: "例：6歳の子の受け口を相談された" });
    expect(() => parseExamples(JSON.stringify({ examples: {} }), ["q1"])).toThrow();
  });

  it("試作の記入例は、会社の業種の言葉を入れて全部の質問に出す", async () => {
    const { sampleQuestionExamples } = await import("./questionExamples");
    const ex = sampleQuestionExamples({ business: "歯科医院。子どもの矯正" });
    expect(ex.q1).toContain("歯科医院");
    const { FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION, QUESTIONS } = await import("@/mock/data");
    expect(Object.keys(ex).sort()).toEqual([...QUESTIONS, FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION].map((x) => x.id).sort());
  });
});

describe("記事の質問の「AIの案」（サーバー）", () => {
  /** 必要な呼び出しだけを返す、Supabase のつくりもの */
  function fakeDb(tables: Record<string, unknown>) {
    const query = (result: unknown) => {
      const q: Record<string, unknown> = {};
      for (const m of ["select", "eq", "is", "update"]) q[m] = () => q;
      q.maybeSingle = async () => ({ data: result, error: null });
      q.single = async () => ({ data: result, error: null });
      q.then = (ok: (v: unknown) => unknown) => Promise.resolve({ data: result, error: null }).then(ok);
      return q;
    };
    return {
      auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
      from: (t: string) => query(tables[t]),
      rpc: (name: string) => query(name === "start_hearing_ai" ? { id: "run1", status: "queued" } : null),
    } as never;
  }

  it("会社のまとめがまだ無くても、ヒアリングの答えから案を出す", async () => {
    const { runAnswerIdeas } = await import("./hearingAi");
    let sent = "";
    const provider = { name: "openai", complete: async (r: { user: string }) => ((sent = r.user), { text: '{"ideas":["案1","案2","案3"]}', usage: { inputTokens: 1, outputTokens: 1 } }) } as never;
    const db = fakeDb({
      organizations: { profile: null },
      hearing_answers: [{ question_id: "business", text: "印刷会社。企業のブランディングも", follow_ups: [], is_draft: false, deep_dive_done: true }],
      generation_runs: [{ id: "run1" }],
    });
    const r = await runAnswerIdeas({ user: db, admin: db, provider, isSample: false }, { organizationId: "o1", keyword: "印刷会社 ブランディング", question: "どんな相談がありましたか", goal: "共感", idempotencyKey: "k" });
    expect(r).toEqual({ ok: true, ideas: ["案1", "案2", "案3"], sample: false });
    expect(sent).toContain("印刷会社。企業のブランディングも");
  });

  it("ヒアリングにも答えていなければ、先に答えるよう伝える", async () => {
    const { runAnswerIdeas } = await import("./hearingAi");
    const db = fakeDb({ organizations: { profile: null }, hearing_answers: [] });
    const r = await runAnswerIdeas({ user: db, admin: db, provider: {} as never, isSample: true }, { organizationId: "o1", keyword: "k", question: "q", goal: "", idempotencyKey: "k" });
    expect(r.ok).toBe(false);
  });

  it("この記事の答えとタイトル案を、読む人と答えから作る（保存はしない）", async () => {
    const { runTitleIdeas } = await import("./hearingAi");
    let sent = "";
    const provider = { name: "openai", complete: async (r: { user: string }) => ((sent = r.user), { text: '{"conclusion":"まず相談を","titles":["T1","T2","T3"]}', usage: { inputTokens: 1, outputTokens: 1 } }) } as never;
    const db = fakeDb({ organizations: { profile: { business: "印刷会社" } }, generation_runs: [{ id: "run1" }] });
    const r = await runTitleIdeas({ user: db, admin: db, provider, isSample: false }, { organizationId: "o1", keyword: "印刷 ブランディング", reader: "名刺を作り直したい人", answers: [{ question: "相談", answer: "ロゴも直したい" }, { question: "空", answer: "" }], idempotencyKey: "k" });
    expect(r).toEqual({ ok: true, conclusion: "まず相談を", titles: ["T1", "T2", "T3"], sample: false });
    expect(sent).toContain("名刺を作り直したい人");
    expect(sent).toContain("ロゴも直したい");
    expect(sent).not.toContain('"空"');
  });

  it("答えが1つも無ければ、タイトル案は作らない", async () => {
    const { runTitleIdeas } = await import("./hearingAi");
    const db = fakeDb({ organizations: { profile: { business: "x" } } });
    const r = await runTitleIdeas({ user: db, admin: db, provider: {} as never, isSample: true }, { organizationId: "o1", keyword: "k", reader: "r", answers: [], idempotencyKey: "k" });
    expect(r.ok).toBe(false);
  });
});
