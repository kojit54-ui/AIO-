import { describe, expect, it } from "vitest";
import { buildGenerationInput } from "@/lib/ai/input";
import { FOLLOW_UP_QUESTION, QUESTIONS } from "@/mock/data";
import type { Organization, Theme } from "@/types/domain";
import { MAX_KNOWLEDGE_CHARS, buildKnowledge, pickKnowledge } from "./knowledge";

const questions = [...QUESTIONS, FOLLOW_UP_QUESTION];

describe("会社の知識", () => {
  it("会社のこと → AIOのチェック → 公開した記事 → 前の記事の答え、の順に並べ、書きかけは入れない", () => {
    const items = buildKnowledge({
      hearing: {
        strengths: { questionId: "strengths", text: "一級建築士が担当", followUps: [{ question: "例えば？", answer: "現地調査から" }] },
        area: { questionId: "area", text: "途中", followUps: [], draft: true },
      },
      aioAnswers: [{ question: "選ばれる理由は？", answer: "同じ人が最後まで" }],
      pastArticles: [{ articleId: "a1", title: "結露の話", published: true, answers: [{ questionId: "q1", text: "窓の結露", unknown: false }], body: [{ type: "paragraph", text: "冬の結露について" }] }],
      questions,
    });
    expect(items.map((i) => i.source)).toEqual(["hearing", "aio_check", "published", "article"]);
    expect(items[0].text).toContain("現地調査から");
    expect(items.some((i) => i.text.includes("途中"))).toBe(false);
  });

  it("文字数の目安に収まる分だけ選ぶ", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ source: "hearing" as const, label: `l${i}`, text: "あ".repeat(300) }));
    const picked = pickKnowledge(many);
    expect(picked.length).toBeLessThan(30);
    expect(picked.reduce((n, k) => n + k.label.length + k.text.length + 20, 0)).toBeLessThanOrEqual(MAX_KNOWLEDGE_CHARS);
  });

  it("AIへの入力に companyKnowledge として入り、全体の上限を超えない", () => {
    const org = { id: "o", name: "A", profile: null, profileApprovedAt: null, reviewPolicy: "optional", monthlyGenerationLimit: 30, generationsUsedThisMonth: 0 } as Organization;
    const theme = { id: "t", organizationId: "o", targetMonth: "2026-11", title: "t", readerProblem: "p", message: "m", sortOrder: 0, source: "coach" } as Theme;
    const input = buildGenerationInput({ organization: org, note: undefined, theme, questions, answers: [], referenceArticles: [], knowledge: [{ source: "hearing", label: "強み", text: "丁寧" }] });
    expect(input.companyKnowledge).toEqual([{ label: "強み", text: "丁寧" }]);
  });
});
