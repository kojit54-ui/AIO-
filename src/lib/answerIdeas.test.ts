import { describe, expect, it } from "vitest";
import { buildAnswerIdeasPrompt, parseAnswerIdeas } from "@/lib/ai/growthPrompts";
import { insertIdea } from "./answerIdeas";

describe("記事の質問の「AIの案」", () => {
  it("案を3つまで読み、長すぎる案は切る", () => {
    const long = "あ".repeat(400);
    const ideas = parseAnswerIdeas(JSON.stringify({ ideas: ["一つ目", { text: "二つ目" }, long, "四つ目"] }));
    expect(ideas).toHaveLength(3);
    expect(ideas[0]).toBe("一つ目");
    expect(ideas[1]).toBe("二つ目");
    expect(Array.from(ideas[2]).length).toBe(150);
  });

  it("案が無ければ失敗にする", () => {
    expect(() => parseAnswerIdeas('{"ideas": []}')).toThrow();
  });

  it("指示文は入力側に JSON の語を含み、会社の情報をデータとして渡す", () => {
    const prompt = buildAnswerIdeasPrompt({ profile: { business: "印刷" }, keyword: "印刷会社 ブランディング", question: "どんな相談がありましたか", goal: "うちと同じ悩みだと思える" });
    expect(prompt).toMatch(/JSON/);
    expect(prompt).toContain("<materials>");
    expect(prompt).toContain("印刷会社 ブランディング");
  });

  it("選んだ案は、書いてある答えの下に足す", () => {
    expect(insertIdea("", "案")).toBe("案");
    expect(insertIdea("もとの答え\n", "案")).toBe("もとの答え\n案");
  });
});
