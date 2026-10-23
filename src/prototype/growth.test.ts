import { describe, expect, it } from "vitest";
import {
  AIO_POINTS,
  HEARING_QUESTIONS,
  articleQuestions,
  collectedAio,
  type HearingAnswer,
  MAX_DEEP_DIVES,
  canPropose,
  computeGrowth,
  nextDeepDive,
  planFromProposal,
  sampleProposals,
} from "./growth";

const q = (id: string) => HEARING_QUESTIONS.find((x) => x.id === id)!;
const ans = (questionId: string, text: string, followUps: HearingAnswer["followUps"] = []): HearingAnswer => ({ questionId, text, followUps });

const full: Record<string, HearingAnswer> = Object.fromEntries(
  HEARING_QUESTIONS.map((x) => [x.id, ans(x.id, x.example.replace(/^例：/, ""))]),
);

describe("ヒアリングの深掘り", () => {
  it("短い答えには深掘りの質問を返し、詳しい答えや空の答えには返さない", () => {
    expect(nextDeepDive(q("strengths"), ans("strengths", "丁寧"))).toBe(q("strengths").deepDives[0]);
    expect(nextDeepDive(q("strengths"), ans("strengths", ""))).toBeNull();
    const rich = "一級建築士が現地調査から工事の管理まで担当する\n工事後の点検が無料で、10年続けている";
    expect(nextDeepDive(q("strengths"), ans("strengths", rich))).toBeNull();
  });

  it("深掘りは1問につき上限まで。用意した質問が無い問いでは聞かない", () => {
    const twice = ans("strengths", "丁寧", [
      { question: "a", answer: "はい" },
      { question: "b", answer: "はい" },
    ]);
    expect(twice.followUps).toHaveLength(MAX_DEEP_DIVES);
    expect(nextDeepDive(q("strengths"), twice)).toBeNull();
    expect(nextDeepDive(q("avoid"), ans("avoid", "なし"))).toBeNull();
  });

  it("深掘りに答えると、次の深掘りは答えの量を見て決める", () => {
    const once = ans("strengths", "丁寧", [{ question: q("strengths").deepDives[0], answer: "はい" }]);
    expect(nextDeepDive(q("strengths"), once)).toBe(q("strengths").deepDives[1]);
  });
});

describe("キーワードの提案", () => {
  it("必要な答えがそろうまで提案を作らない", () => {
    expect(canPropose({})).toBe(false);
    expect(canPropose(full)).toBe(true);
  });

  it("3つの提案を作り、柱とクラスターにヒアリングの言葉を使う", () => {
    const ps = sampleProposals(full);
    expect(ps).toHaveLength(3);
    expect(ps[0].pillar.keyword).toContain("さくら市");
    expect(ps[0].pillar.keyword).toContain("内窓の取り付け");
    for (const p of ps) {
      expect(p.clusters.length).toBeGreaterThanOrEqual(3);
      expect(new Set([p.pillar.id, ...p.clusters.map((c) => c.id)]).size).toBe(p.clusters.length + 1);
    }
  });
});

describe("レベルアップ", () => {
  it("公開した記事でレベルが上がり、バッジが付く", () => {
    const plan = planFromProposal(sampleProposals(full)[0]);
    expect(computeGrowth({}, null)).toMatchObject({ level: 1, points: 0 });
    expect(computeGrowth(full, plan)).toMatchObject({ level: 1, points: 5 });

    const one = { ...plan, rows: plan.rows.map((r, i) => (i === 1 ? { ...r, status: "published" as const } : r)) };
    const g1 = computeGrowth(full, one);
    expect(g1).toMatchObject({ level: 2, points: 15, nextAt: 30 });
    expect(g1.badges.find((b) => b.id === "first")?.earned).toBe(true);
    expect(g1.badges.find((b) => b.id === "pillar")?.earned).toBe(false);

    const all = { ...plan, rows: plan.rows.map((r) => ({ ...r, status: "published" as const })) };
    const g2 = computeGrowth(full, all);
    expect(g2.points).toBe(5 + 30 + 5 * 10);
    expect(g2.badges.every((b) => b.earned)).toBe(true);
  });
});

describe("AIOの材料", () => {
  it("どの質問も、何のために聞くか（AIOの材料）を持つ", () => {
    const qs = [...HEARING_QUESTIONS, ...articleQuestions({ id: "x", keyword: "k", question: "q" })];
    for (const x of qs) expect(AIO_POINTS[x.aio]).toBeDefined();
  });

  it("答えた質問の材料だけを、重ねずに数える", () => {
    expect(collectedAio(HEARING_QUESTIONS, (id) => id === "business" || id === "area" || id === "faq")).toEqual(["entity", "qa"]);
    expect(collectedAio(HEARING_QUESTIONS, () => false)).toEqual([]);
  });
});
