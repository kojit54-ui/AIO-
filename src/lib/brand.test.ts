import { describe, expect, it } from "vitest";
import { AIO_POINTS } from "@/lib/aio";
import { AIO_CHECK_GROUPS, AIO_CHECK_LIST } from "@/lib/aioCheck";
import { AIO_CHECK_SYSTEM_PROMPT } from "@/lib/ai/aioCheckPrompt";
import { REVIEW_SYSTEM_PROMPT, SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { CHOSEN_STAGES, PURPOSE_FOR_AI } from "@/lib/brand";
import { TRIAL_SYSTEM_PROMPT } from "@/lib/tryoutAi";

// サービスの定義（AIに選ばれ、人に選ばれる）が、画面とAIへの指示の両方に届いているか（docs/AIO.md「このサービスの定義」）
describe("サービスの定義", () => {
  it("書き手・点検役・AIOのチェックの指示に、同じ目的の文が入っている", () => {
    for (const p of [SYSTEM_PROMPT, REVIEW_SYSTEM_PROMPT, AIO_CHECK_SYSTEM_PROMPT]) expect(p).toContain(PURPOSE_FOR_AI);
  });

  it("30秒でためすの指示も、人に選ばれることをいちばん大切にしている", () => {
    expect(TRIAL_SYSTEM_PROMPT).toContain("読んだ人に選ばれること");
  });

  it("AIOの材料はどれも「人に選ばれる」理由を持っている", () => {
    for (const p of Object.values(AIO_POINTS)) {
      expect(p.people.length).toBeGreaterThan(10);
      expect(CHOSEN_STAGES.map((s) => s.key)).toContain(p.stage);
    }
  });

  it("AIOのチェックの項目は、2つの段階のどちらかにちょうど1回ずつ入る", () => {
    const grouped = AIO_CHECK_GROUPS.flatMap((g) => g.keys);
    expect(grouped.sort()).toEqual(AIO_CHECK_LIST.map((c) => c.key).sort());
    for (const g of AIO_CHECK_GROUPS) expect(g.keys.length).toBeGreaterThan(0);
  });
});

describe("人の心を動かす記事", () => {
  it("記事の質問に「気持ちと想い」を聞く問いがあり、次の一歩はいちばん最後", async () => {
    const { QUESTIONS } = await import("@/mock/data");
    expect(QUESTIONS.some((q) => q.aio === "feeling")).toBe(true);
    expect(QUESTIONS[QUESTIONS.length - 1].aio).toBe("action");
  });

  it("書き手には、心を動かす書き方と、気持ちを作らない約束の両方を伝える", () => {
    expect(SYSTEM_PROMPT).toContain("人の心を動かすために");
    expect(SYSTEM_PROMPT).toContain("感動や喜びを大げさに作らない");
    expect(REVIEW_SYSTEM_PROMPT).toContain("心が動くか");
  });
});

describe("お客様の言葉の扱い", () => {
  it("意味を変えずに読みやすく整える（そのまま写さない）", () => {
    expect(SYSTEM_PROMPT).toContain("答えの文をそのまま写さず");
    expect(TRIAL_SYSTEM_PROMPT).toContain("答えの文をそのまま写さず");
    expect(SYSTEM_PROMPT).toContain("言っていないことは足さない");
  });
});
