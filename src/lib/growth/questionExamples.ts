// 記事の質問の記入例（試作・キーが無いとき用）。本物はAIが会社の情報に合わせて作る（src/lib/growth/hearingAi.ts）。

import type { CompanyProfile } from "@/types/domain";

/** 記事の質問の記入例を、試作（キーが無いとき）用に作る。業種の言葉を入れるだけ */
export function sampleQuestionExamples(profile: Pick<CompanyProfile, "business">): Record<string, string> {
  const biz = Array.from(profile.business.split(/[。、（(]/)[0] || "お仕事").slice(0, 20).join("");
  return {
    q1: `例：「${biz}」について、はじめて相談に来たお客様から、何から始めればよいか聞かれた`,
    q2: "例：まず今の状態を一緒に確かめて、できることを3つに分けて説明した",
    q3: "例：「思っていたより早く終わって安心した」と言われた。期間は約2週間",
    q4: "例：自分で調べて決めてしまう前に、一度相談してもらうほうが結局早い",
    q5: "例：気になることがあれば、まず電話かフォームで気軽に相談してほしい",
    q2_followup: "例：最初に話を聞いたとき、お客様は不安そうに何度も同じことを確かめていた",
    prev_followup: "例：半年たって様子を聞いたら「あのとき相談してよかった」と言ってもらえた",
  };
}

