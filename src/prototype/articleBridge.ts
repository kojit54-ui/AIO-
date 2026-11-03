import { PLAN_IDS } from "@/lib/articlePlan";
import type { Answer } from "@/types/domain";

/** 新しい流れの質問の答え（a1〜a6）を、記事づくりの質問（q1〜q6）の答えにする。中身は同じ問い */
const TO_ARTICLE_QUESTION: Record<string, string> = { a1: "q1", a2: "q2", a3: "q3", a4: "q4", a6: "q6", a5: "q5" };
export function toArticleAnswers(answers: Record<string, string>): Answer[] {
  const main = Object.entries(TO_ARTICLE_QUESTION).map(([from, to]) => ({ questionId: to, text: (answers[from] ?? "").trim(), unknown: !(answers[from] ?? "").trim() }));
  // 記事の作戦（読む人の悩み・この記事の答え・タイトル）は、決めたものだけ同じ id で渡す
  const plan = Object.values(PLAN_IDS)
    .filter((id) => (answers[id] ?? "").trim())
    .map((id) => ({ questionId: id, text: answers[id].trim(), unknown: false }));
  return [...main, ...plan];
}
