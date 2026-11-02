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
    expect(parseFollowUpWithWhy('{"follow_up": "例えば価格は？", "why": "価格があるとAIが引用しやすいためです"}')).toEqual({ question: "例えば価格は？", why: "価格があるとAIが引用しやすいためです" });
    expect(parseFollowUpWithWhy('{"follow_up": "例えば価格は？"}')).toEqual({ question: "例えば価格は？", why: "" });
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
