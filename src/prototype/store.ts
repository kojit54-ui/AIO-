"use client";

// 「育つブログ」の試作の状態。ブラウザの中（localStorage）だけに置き、本物のデータやAIにはつながない。

import { useSyncExternalStore } from "react";
import { type HearingAnswer, type KeywordPlan, type PillarProposal, type RowStatus } from "./growth";

export interface GrowState {
  answers: Record<string, HearingAnswer>;
  proposals: PillarProposal[] | null;
  plan: KeywordPlan | null;
  /** 記事ごとの一問一答の答え（キーワードの行 id → 質問 id → 答え） */
  articleAnswers: Record<string, Record<string, string>>;
}

const KEY = "cotam-grow-prototype-v1";
const EMPTY: GrowState = { answers: {}, proposals: null, plan: null, articleAnswers: {} };

let state: GrowState | null = null;
const listeners = new Set<() => void>();

function load(): GrowState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as GrowState) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  return state;
}

function set(next: GrowState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // 保存できない環境でも画面は動かす
  }
  listeners.forEach((l) => l());
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** 今の状態を読む（画面の外、テスト用） */
export const readGrowState = (): GrowState => load();

export const growActions = {
  saveAnswer(answer: HearingAnswer) {
    const s = load();
    set({ ...s, answers: { ...s.answers, [answer.questionId]: answer } });
  },
  setProposals(proposals: PillarProposal[]) {
    set({ ...load(), proposals });
  },
  /** 設計図を選ぶ・選び直す。前の設計図で書いた記事の答えは消す（行の id が同じでも持ち越さない） */
  choosePlan(plan: KeywordPlan | null) {
    set({ ...load(), plan, articleAnswers: {} });
  },
  setRowStatus(rowId: string, status: RowStatus) {
    const s = load();
    if (!s.plan) return;
    set({ ...s, plan: { ...s.plan, rows: s.plan.rows.map((r) => (r.id === rowId ? { ...r, status } : r)) } });
  },
  saveArticleAnswers(rowId: string, answers: Record<string, string>) {
    const s = load();
    set({ ...s, articleAnswers: { ...s.articleAnswers, [rowId]: answers } });
  },
  reset() {
    set(EMPTY);
  },
};

/** 最初の描画（サーバー）では空。ブラウザで読み込んでから ready になる */
export function useGrow(): GrowState & { ready: boolean } {
  const s = useSyncExternalStore(subscribe, load, () => null);
  return s ? { ...s, ready: true } : { ...EMPTY, ready: false };
}
