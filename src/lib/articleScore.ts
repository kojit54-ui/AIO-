// 記事の「いまの点数」（100点満点）。AIOのチェックの項目から計算する（docs/DECISIONS.md 2026-11-09）。
// 点数は通す・通さないの関門にしない。低くてもブログに載せられる。いまの点数と「何をすれば上がるか」を見せて、
// お客様が自分で点数を上げたくなるようにする。

import { AIO_CHECK_LIST } from "@/lib/aioCheck";
import type { AioCheck, AioCheckItem, AioCheckKey, ArticleVersion } from "@/types/domain";

/** 答えを記事に書き込んだ項目はOKとして数える（答えが「まだ分からない」の項目は数えない） */
export function effectiveItems(check: AioCheck, applied: boolean): AioCheckItem[] {
  if (!applied) return check.items;
  const answered = new Set(check.questions.filter((q) => check.answers.some((a) => a.questionId === q.id && !a.unknown && a.text.trim())).map((q) => q.key));
  return check.items.map((i) => (answered.has(i.key) ? { ...i, ok: true, note: "答えてもらった内容を書き足しました" } : i));
}

/** OKの数から点数。項目の重さはそろえる（どれか1つだけ頑張っても満点にならない） */
export function scoreOf(items: Pick<AioCheckItem, "ok">[]): number {
  if (items.length === 0) return 0;
  return Math.round((items.filter((i) => i.ok).length / items.length) * 100);
}

export interface ScoreLevel {
  min: number;
  label: string;
  message: string;
}

/** 点数の段。どの段でもブログには載せられる、と言い添える */
export const SCORE_LEVELS: ScoreLevel[] = [
  { min: 100, label: "満点", message: "全部そろいました。AIにも、読んだ人にも選ばれやすい記事です。" },
  { min: 85, label: "とてもよい", message: "このまま載せて大丈夫です。あと少しで満点です。" },
  { min: 70, label: "よい", message: "載せられます。下の1つを足すと、もっと選ばれやすくなります。" },
  { min: 50, label: "あと少し", message: "載せることはできます。下の質問に答えると、ぐっと点数が上がります。" },
  { min: 0, label: "これから", message: "まず載せても大丈夫です。下の質問に1つ答えるだけでも点数が上がります。" },
];

export const scoreLevel = (score: number) => SCORE_LEVELS.find((l) => score >= l.min) ?? SCORE_LEVELS[SCORE_LEVELS.length - 1];

export interface ScoreTip {
  key: AioCheckKey;
  label: string;
  note: string;
  ask: string;
  example: string;
  /** これを足すと上がる点数 */
  gain: number;
  /** AIが今回の質問で聞いている項目か */
  asked: boolean;
}

export interface ArticleScore {
  score: number;
  ok: number;
  total: number;
  level: ScoreLevel;
  /** 点数を上げるための項目。AIが聞いている項目を先に、次にチェック表の順 */
  tips: ScoreTip[];
  /** いま届いている質問に全部答えたときの点数 */
  potential: number;
}

export function articleScore(check: AioCheck, applied: boolean): ArticleScore {
  const items = effectiveItems(check, applied);
  const score = scoreOf(items);
  const askedKeys = new Set(check.status === "asking" ? check.questions.map((q) => q.key) : []);
  const order = (k: AioCheckKey) => AIO_CHECK_LIST.findIndex((c) => c.key === k);
  const tips = items
    .filter((i) => !i.ok)
    .map((i): ScoreTip => {
      const c = AIO_CHECK_LIST.find((x) => x.key === i.key);
      const flipped = items.map((x) => (x.key === i.key ? { ...x, ok: true } : x));
      return { key: i.key, label: c?.label.split("（")[0] ?? i.key, note: i.note, ask: c?.ask ?? "", example: c?.example ?? "", gain: scoreOf(flipped) - score, asked: askedKeys.has(i.key) };
    })
    .sort((a, b) => Number(b.asked) - Number(a.asked) || order(a.key) - order(b.key));
  const potential = scoreOf(items.map((x) => (askedKeys.has(x.key) ? { ...x, ok: true } : x)));
  return { score, ok: items.filter((i) => i.ok).length, total: items.length, level: scoreLevel(score), tips, potential };
}

/** 今の版の点数。チェックした版か、答えを反映して作った版のチェックだけを使う。まだなら null */
export function currentScore(checks: AioCheck[], articleId: string, version: Pick<ArticleVersion, "id"> | string | null | undefined): ArticleScore | null {
  const versionId = typeof version === "string" ? version : version?.id;
  if (!versionId) return null;
  const latest = checks.filter((c) => c.articleId === articleId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (!latest || (latest.versionId !== versionId && latest.resultVersionId !== versionId)) return null;
  return articleScore(latest, latest.resultVersionId === versionId);
}

/** ひとつ前のチェックの点数（「前回より +15点」用）。前回が無ければ null */
export function previousScore(checks: AioCheck[], articleId: string, currentCheckId: string): number | null {
  const list = checks.filter((c) => c.articleId === articleId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const i = list.findIndex((c) => c.id === currentCheckId);
  const prev = i >= 0 ? list[i + 1] : undefined;
  return prev ? articleScore(prev, prev.status === "done" && !!prev.resultVersionId).score : null;
}
