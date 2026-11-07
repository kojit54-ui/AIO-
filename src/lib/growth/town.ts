// 案4「AIの町すごろく」（2026-11-03）。記事を書くほど、町に会社の建物が建って大きくなる。
// マスはどれも実際の記録（スタンプ帳と同じ）から進む。最後の「お客様に選ばれた（お問い合わせ）」だけは、
// このサービスでは分からないので、会社の人が自分で「来た！」と押したときに進む（このブラウザに覚える）。

import type { MockDb } from "@/mock/store";
import { badges } from "./badges";

export interface TownStep {
  id: string;
  icon: string;
  label: string;
  /** マスに止まったときに、次にすること */
  how: string;
  done: boolean;
  /** AIに選ばれる／お客様に選ばれる のマス */
  stage?: "ai" | "people";
}

export interface TownLevel {
  min: number;
  name: string;
}

/** 建物の大きさ。ブログに載せた本数で育つ */
export const TOWN_LEVELS: TownLevel[] = [
  { min: 0, name: "空き地" },
  { min: 1, name: "小さなお店" },
  { min: 3, name: "町のお店" },
  { min: 5, name: "目立つビル" },
  { min: 10, name: "町のシンボル" },
];

export function townLevel(published: number): { index: number; level: TownLevel; next: TownLevel | null } {
  let index = 0;
  TOWN_LEVELS.forEach((l, i) => {
    if (published >= l.min) index = i;
  });
  return { index, level: TOWN_LEVELS[index], next: TOWN_LEVELS[index + 1] ?? null };
}

/** すごろくのマス。上から順に進む */
export function townSteps(db: MockDb, orgId: string, inquiry: boolean, now = new Date()): TownStep[] {
  const got = new Map(badges(db, orgId, now).map((b) => [b.id, b.got]));
  const s = (id: string, icon: string, label: string, how: string, done: boolean, stage?: TownStep["stage"]): TownStep => ({ id, icon, label, how, done, stage });
  return [
    s("hello", "👋", "会社のことを教える", "しおりの質問に3つ答えましょう", !!got.get("hello")),
    s("first", "✏️", "1本書く", "今月の記事を書いてみましょう", !!got.get("first")),
    s("check", "🔍", "AIOのチェック", "書いた記事でAIOのチェックをしましょう", !!got.get("check")),
    s("publish", "🚀", "ブログに載せる", "記事を1本ブログに載せましょう", !!got.get("publish")),
    s("five", "📚", "5本載せる", "記事を5本ブログに載せましょう", !!got.get("five")),
    s("mention", "🤖", "AIに選ばれた", "AIの答えに会社が出てくるか、しおりが調べます", !!got.get("mention"), "ai"),
    s("inquiry", "🤝", "お客様に選ばれた", "記事を読んだ人からお問い合わせが来たら、押してください", inquiry, "people"),
  ];
}

/**
 * コマのいる場所＝いちばん先まで進んだマスの、次のマス。全部終わったらゴール（マスの数）。
 * 途中のマスを飛ばしていても、戻さない（2026-11-07 3AIの検討。載せたのに「会社のことを教える」で止まっていた）
 */
export function townPosition(steps: TownStep[]): number {
  let last = -1;
  steps.forEach((x, i) => {
    if (x.done) last = i;
  });
  return last + 1;
}

/** コマより手前で、まだのマス（飛ばしたマス）。あとからでも進められる */
export function skippedSteps(steps: TownStep[]): TownStep[] {
  const pos = townPosition(steps);
  return steps.slice(0, pos).filter((x) => !x.done);
}

/** すごろくのマスに無い、寄り道のスタンプ（スタンプ帳のうち、すごろくと重ならないもの） */
export const SIDE_STAMP_IDS = ["teach", "search", "perfect", "streak3"];

/** ブログに載せた本数 */
export function publishedCount(db: MockDb, orgId: string): number {
  return db.articles.filter((a) => a.organizationId === orgId && a.status === "published").length;
}
