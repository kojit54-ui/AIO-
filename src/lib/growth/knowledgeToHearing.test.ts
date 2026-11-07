import { describe, expect, it } from "vitest";
import { hearingFillsFromKnowledge } from "./knowledgeToHearing";
import { IMPORT_PROMPT } from "./aiImport";

const n = (label: string, text: string) => ({ label, text });

describe("取り込んだ知識で、ヒアリングの質問を飛ばす", () => {
  it("頼み文の見出しを、それぞれの質問に結びつける", () => {
    const labels = [...IMPORT_PROMPT.matchAll(/【(.+?)】/g)].map((m) => m[1]);
    const fills = hearingFillsFromKnowledge(labels.map((l) => n(l, `${l}についての、くわしい答えです`)), {});
    expect(Object.fromEntries(fills.map((f) => [f.questionId, f.from]))).toEqual({
      business: "会社・お仕事の内容",
      services: "主な商品・サービスと、価格や期間の目安",
      customers: "よく来るお客様の特徴",
      area: "お仕事をしている地域",
      strengths: "選ばれる理由・強み",
      competitors: "比べられる相手と、その違い",
      faq: "お客様からよく聞かれる質問と、その答え",
      avoid: "使わない言葉・気をつけていること",
    });
  });

  it("地名は短くても使う", () => {
    expect(hearingFillsFromKnowledge([n("お仕事をしている地域", "札幌市")], {})).toEqual([{ questionId: "area", text: "札幌市", from: "お仕事をしている地域" }]);
  });

  it("不明・短すぎる答えは使わず、もう答えた質問には入れない", () => {
    const notes = [n("お仕事をしている地域", "不明"), n("選ばれる理由・強み", "早い"), n("比べられる相手と、その違い", "特になし"), n("会社・お仕事の内容", "戸建ての断熱リフォームと水回りの工事")];
    expect(hearingFillsFromKnowledge(notes, {})).toEqual([{ questionId: "business", text: "戸建ての断熱リフォームと水回りの工事", from: "会社・お仕事の内容" }]);
    expect(hearingFillsFromKnowledge(notes, { business: { questionId: "business", text: "リフォーム", followUps: [] } })).toEqual([]);
    // 書きかけ（次へを押していない）の答えには入れてよい
    expect(hearingFillsFromKnowledge(notes, { business: { questionId: "business", text: "リ", followUps: [], draft: true } })).toHaveLength(1);
  });
});
