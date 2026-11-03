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
