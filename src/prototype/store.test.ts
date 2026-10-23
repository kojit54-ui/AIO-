import { describe, expect, it } from "vitest";
import { HEARING_QUESTIONS, planFromProposal, sampleProposals } from "./growth";
import { growActions, readGrowState } from "./store";

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
