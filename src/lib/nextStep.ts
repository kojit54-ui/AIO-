// ホームの一番上に出す「次の1手」（2026-11-07 田村さん「続けられる、続けたくなる仕組み。UI UXも。3AIで対話しながら」）。
// GPT・Gemini・Claude の3者で決めた：押すボタンを1つにして迷わせない。ただし逃げ道（別の記事を書く）は小さく残す。
// 吹き出しと同じく「止まっています」ではなく「ここから再開できます」の言い方にする。

import type { ArticleStatus } from "@/types/domain";

export interface NextStepArticle {
  id: string;
  title: string;
  status: ArticleStatus;
}

export type NextStepKind = "fix" | "continue" | "start" | "more";

export interface NextStep {
  kind: NextStepKind;
  /** 大きなボタンの文字 */
  label: string;
  /** ボタンの上の短い説明 */
  lead: string;
  /** 行き先の記事（start と more は新しく書く） */
  articleId?: string;
  /** 行き先の記事の題名（ボタンの上に出す） */
  title?: string;
}

/** 題名が長いときは短くする（スマホのボタンに収める） */
export function shortTitle(title: string, max = 18): string {
  const t = title.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

/**
 * 次の1手を決める。優先は 直してほしい所 ＞ 書きかけ ＞ 今月まだ ＞ 今月済み。
 * list は新しい順（articleSummaries と同じ）
 */
export function nextStep(list: NextStepArticle[], publishedThisMonth: number): NextStep {
  const fix = list.find((a) => a.status === "changes_requested");
  if (fix) return { kind: "fix", lead: "コタムから、直してほしい所が届いています", label: "直してほしい所を見る", title: shortTitle(fix.title, 30), articleId: fix.id };
  const draft = list.find((a) => a.status === "drafting");
  if (draft) return { kind: "continue", lead: "答えは残っています。前回の続きからできます", label: "前回の続きに答える", title: shortTitle(draft.title, 30), articleId: draft.id };
  if (publishedThisMonth === 0) return { kind: "start", lead: "質問に答えるだけで、記事になります", label: "今月の1本を書き始める" };
  return { kind: "more", lead: "今月の1本は公開できました。おつかれさまでした", label: "もう1本書いておく" };
}

/**
 * 公開できたときのひとこと。本文の大見出しから「何を載せたか」だけを言う（3AIの検討：題名だけで決めつけない。
 * 「AIに紹介された」「お客様が安心した」など、まだ確かめていない成果は言わない）
 */
export function publishedLines(body: { type: string; level?: number; text?: string }[]): string[] {
  const heads = body
    .filter((b) => b.type === "heading" && b.level === 2 && b.text?.trim())
    .map((b) => (b.text ?? "").trim().replace(/[。、]$/, ""))
    .slice(0, 2);
  const what = heads.length ? `この記事には「${heads.join("」「")}」のことを載せました。` : "";
  return ["公開おめでとうございます！", `${what}しおりも記事のことを覚えました。検索やAIにどう見られるか、これからいっしょに見ていきましょう。`];
}
