import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/mock/data";
import { articleQuestions } from "./growth";
import { toArticleAnswers } from "./articleBridge";

describe("新しい流れの答えを、AIが記事を書く質問の答えにする", () => {
  it("6問すべてを、同じ中身の問いに移す。空の答えは「まだ分からない」", () => {
    const out = toArticleAnswers({ a1: "相談", a2: "対応", a3: "", a4: "注意", a5: "電話", a6: "うれしい" });
    expect(out.map((a) => a.questionId).sort()).toEqual(QUESTIONS.map((q) => q.id).sort());
    expect(out.find((a) => a.questionId === "q1")).toEqual({ questionId: "q1", text: "相談", unknown: false });
    expect(out.find((a) => a.questionId === "q3")).toEqual({ questionId: "q3", text: "", unknown: true });
  });

  it("同じ材料（AIO）の問いどうしを結ぶ", () => {
    const row = { keyword: "k", question: "", kind: "pillar" } as never;
    const out = toArticleAnswers(Object.fromEntries(articleQuestions(row).map((q) => [q.id, q.id])));
    for (const q of articleQuestions(row)) {
      const to = out.find((a) => a.text === q.id)!;
      expect(QUESTIONS.find((x) => x.id === to.questionId)?.aio).toBe(q.aio);
    }
  });
});
