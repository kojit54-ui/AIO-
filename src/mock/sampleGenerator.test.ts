import { describe, expect, it } from "vitest";
import type { Answer, Theme } from "@/types/domain";
import { buildBody, buildOutline, extractFactChecks, needsFollowUp, sampleShorten } from "./sampleGenerator";

const theme: Theme = {
  id: "t",
  organizationId: "o",
  targetMonth: "2026-10",
  title: "冬の脱衣所が寒い家でできること",
  readerProblem: "入浴前後の寒さがつらい人",
  message: "",
  sortOrder: 1,
  source: "coach",
};
const answers: Answer[] = [
  { questionId: "q1", text: "脱衣所が寒いと相談された", unknown: false },
  { questionId: "q2", text: "床下に断熱材を入れて、窓を内窓にした", unknown: false },
  { questionId: "q3", text: "", unknown: true },
  { questionId: "q4", text: "ヒーターだけだと結露が増える", unknown: false },
  { questionId: "q5", text: "点検に申し込んでほしい", unknown: false },
];

describe("sampleGenerator", () => {
  it("対応内容が短いと追加質問を出す", () => {
    expect(needsFollowUp([{ questionId: "q2", text: "直した", unknown: false }])).toBe(true);
    expect(needsFollowUp(answers)).toBe(false);
  });

  it("「まだ分からない」の質問は見出しにしない", () => {
    expect(buildOutline(answers).map((s) => s.heading)).not.toContain("その後の様子");
  });

  it("本文は回答の内容だけで作り、回答にない数値を足さない", () => {
    const body = buildBody(answers, [], theme, null);
    const text = body.map((b) => (b.type === "list" ? b.items.join("") : b.text)).join("");
    expect(text).toContain("床下に断熱材を入れて");
    expect(text).not.toMatch(/[0-9]/);
  });

  it("数値・金額・顧客名を要確認箇所として抜き出す", () => {
    const checks = extractFactChecks(
      [{ type: "paragraph", text: "築35年のお宅で、田中様から費用は120万円と聞いた。室温は5度上がった。" }],
      "v1",
    );
    expect(checks.map((c) => c.kind).sort()).toEqual(["customer_name", "number", "number", "price"]);
  });

  it("短くするは最初の文だけを残す", () => {
    expect(sampleShorten("一文目です。二文目です。")).toBe("一文目です。");
  });
});
