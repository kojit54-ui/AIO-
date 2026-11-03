// 記事の「作戦」：誰のどんな悩みに答えるか・この記事の答え（結論）・タイトル（2026-11-03 田村さん：見出しの一覧だけ見せられても分からない）。
// プロの書き方に合わせ、テーマ→読む人の悩み→材料→答え→タイトル→見出し→本文 の順に決める（docs/DECISIONS.md）。
// 答えは記事の答え（Answer）と同じ形で残し、AIへは「お客様が決めたこと」として渡す。

import type { Answer, Question } from "@/types/domain";

export const PLAN_IDS = { reader: "reader", conclusion: "conclusion", title: "title" } as const;

/** AIに渡すときの名前。AIが「お客様が決めたこと」と分かるように書く */
export const PLAN_QUESTIONS: Question[] = [
  { id: PLAN_IDS.reader, label: "この記事で答える、読む人の悩み（お客様が決めた）", example: "" },
  { id: PLAN_IDS.conclusion, label: "この記事の答え（結論。お客様が確かめた。本文のはじめに書く）", example: "" },
  { id: PLAN_IDS.title, label: "記事のタイトル（お客様が選んだ。このまま使う）", example: "" },
];

export function planOf(answers: Answer[]): { reader: string; conclusion: string; title: string } {
  const get = (id: string) => answers.find((a) => a.questionId === id && !a.unknown)?.text.trim() ?? "";
  return { reader: get(PLAN_IDS.reader), conclusion: get(PLAN_IDS.conclusion), title: get(PLAN_IDS.title) };
}

/** 読む人の悩みの最初の案。書く記事リストの「お客様の疑問」から作る */
export function defaultReader(keyword: string, question?: string): string {
  const q = (question ?? "").trim();
  return q ? `「${q}」と迷っている人` : `「${keyword}」のことで迷っている人`;
}

/** 画面に出すときの名前 */
export const PLAN_LABELS: Record<string, string> = { reader: "読んでほしい人（悩み）", conclusion: "この記事の答え", title: "タイトル" };
