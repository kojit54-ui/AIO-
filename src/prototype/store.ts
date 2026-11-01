"use client";

// 「育つブログ」の状態。2つの置き場所がある。
// - 試作（Supabase の接続先が無いとき）：ブラウザの中（localStorage）だけ
// - 本物のデータ（connectGrow で GrowRemote を渡したとき）：会社ごとにDBへ保存する（T5-5）
//   画面はすぐ書きかえ、保存はうしろで行う。失敗したら知らせて、DBの内容を読み直す。
//   おすすめ（proposals）と記事ごとの一問一答の答えはまだ表が無いので、会社ごとにこのブラウザに置く。

import { useSyncExternalStore } from "react";
import type { SellItem } from "./keywords";
import { type HearingAnswer, type KeywordPlan, type KeywordRow, type PillarProposal, type RowStatus } from "./growth";
import { GrowSyncError, isUuid, type GrowRemote } from "./remote";

export interface GrowState {
  answers: Record<string, HearingAnswer>;
  proposals: PillarProposal[] | null;
  plan: KeywordPlan | null;
  /** 記事ごとの一問一答の答え（キーワードの行 id → 質問 id → 答え） */
  articleAnswers: Record<string, Record<string, string>>;
  /** 今売りたいもの（順位順）。null はまだ触っていない（ヒアリングの答えから作って見せる） */
  sellItems: SellItem[] | null;
}

export interface GrowSync {
  mode: "local" | "remote";
  /** remote で、DBから読み終わったか */
  loaded: boolean;
  saving: boolean;
  error: string | null;
}

const KEY = "cotam-grow-prototype-v1";
const remoteLocalKey = (orgId: string) => `cotam-grow-local-v1:${orgId}`;
const EMPTY: GrowState = { answers: {}, proposals: null, plan: null, articleAnswers: {}, sellItems: null };
/** 打っている途中の答えや、ドラッグ中の並べかえを毎回保存しないための待ち時間 */
export const SAVE_DELAY_MS = 800;

let state: GrowState | null = null;
let remote: GrowRemote | null = null;
let sync: GrowSync = { mode: "local", loaded: true, saving: false, error: null };
const listeners = new Set<() => void>();

function readLocal(key: string): GrowState {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<GrowState>) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function load(): GrowState {
  if (state) return state;
  state = remote ? EMPTY : readLocal(KEY);
  return state;
}

function emit() {
  listeners.forEach((l) => l());
}

function set(next: GrowState) {
  state = next;
  try {
    if (remote) {
      // DBに表が無いものだけをこのブラウザに置く
      window.localStorage.setItem(remoteLocalKey(remote.organizationId), JSON.stringify({ proposals: next.proposals, articleAnswers: next.articleAnswers, sellEmptied: next.sellItems?.length === 0 }));
    } else {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    }
  } catch {
    // 保存できない環境でも画面は動かす
  }
  emit();
}

function setSync(patch: Partial<GrowSync>) {
  sync = { ...sync, ...patch };
  emit();
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// ---- 本物のデータとの行き来 ----

let inFlight = 0;
const timers = new Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>();

/** 保存は1本の列に並べて順番に送る。先に送った古い内容があとから届いて新しい内容を上書きしないようにする */
let queue: Promise<void> = Promise.resolve();

/** うしろで保存する。失敗したら知らせて、DBの内容に戻す */
function persist(r: GrowRemote, job: () => Promise<void>) {
  inFlight += 1;
  setSync({ saving: true });
  // 会社を切りかえたあとでも、並んでいた保存は前の会社に対して最後まで送る（画面への反映は各処理が remote === r で確かめる）
  const run = queue.then(job);
  queue = run.catch(() => undefined);
  run
    .then(() => {
      if (remote === r && sync.error) setSync({ error: null });
    })
    .catch((e: unknown) => {
      if (remote !== r) return;
      setSync({ error: e instanceof GrowSyncError ? e.message : "保存できませんでした。通信状態を確かめて、もう一度お試しください" });
      void reloadRemote(r);
    })
    .finally(() => {
      inFlight -= 1;
      if (remote === r) setSync({ saving: inFlight > 0 || timers.size > 0 });
    });
}

/** 同じ種類の保存は最後の1回だけにまとめる */
function later(key: string, run: () => void) {
  const old = timers.get(key);
  if (old) clearTimeout(old.timer);
  const timer = setTimeout(() => {
    timers.delete(key);
    run();
  }, SAVE_DELAY_MS);
  timers.set(key, { timer, run });
  setSync({ saving: true });
}

/** 待っている保存をすぐ行う（画面を閉じる前、別の会社に切りかえる前） */
export function flushGrow() {
  const pending = [...timers.values()];
  pending.forEach((p) => clearTimeout(p.timer));
  timers.clear();
  pending.forEach((p) => p.run());
}

let loadSeq = 0;
async function reloadRemote(r: GrowRemote) {
  const seq = ++loadSeq;
  try {
    const snap = await r.load();
    if (remote !== r || seq !== loadSeq) return;
    const keep = readLocal(remoteLocalKey(r.organizationId));
    // 売りたいものを全部消したことはDBでは「行が無い」としか分からないので、このブラウザの印で区別する
    const emptied = (keep as GrowState & { sellEmptied?: boolean }).sellEmptied === true;
    state = { answers: snap.answers, plan: snap.plan, sellItems: snap.sellItems ?? (emptied ? [] : null), proposals: keep.proposals, articleAnswers: keep.articleAnswers };
    setSync({ loaded: true });
  } catch (e) {
    if (remote !== r || seq !== loadSeq) return;
    setSync({ loaded: true, error: e instanceof GrowSyncError ? e.message : "読み込めませんでした。通信状態を確かめて、読み込み直してください" });
  }
}

/** 本物のデータにつなぐ（null で試作に戻す）。同じ会社なら何もしない */
export function connectGrow(next: GrowRemote | null) {
  if (next?.organizationId === remote?.organizationId && (next === null) === (remote === null)) return;
  flushGrow();
  remote = next;
  state = null;
  sync = next ? { mode: "remote", loaded: false, saving: false, error: null } : { mode: "local", loaded: true, saving: false, error: null };
  emit();
  if (next) void reloadRemote(next);
}

/** DBの内容を読み直す（保存に失敗したあとなど） */
export function reloadGrow() {
  if (!remote) return;
  setSync({ error: null });
  void reloadRemote(remote);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushGrow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushGrow();
  });
}

// ---- 画面からの操作 ----

/** 今の状態を読む（画面の外、テスト用） */
export const readGrowState = (): GrowState => load();
export const readGrowSync = (): GrowSync => sync;

let sellSeq = 0;
/** 画面で作った売りたいものの仮の id → DB の id */
const sellIdMap = new Map<string, string>();

const rowKey = (x: KeywordRow) => `${x.kind}\n${x.keyword}`;

/**
 * 保存のあとに返ってきた組み立て（DB の id つき）に置きかえる。
 * 保存を待つあいだに画面で変えた進み具合・「やめておく」は、置きかえたあとにも残して保存し直す。
 * 待つあいだに別の組み立てを選んでいたら置きかえない。
 */
function adoptSavedPlan(r: GrowRemote, sent: KeywordPlan, saved: KeywordPlan | null) {
  const cur = load().plan;
  if (remote !== r || !cur || cur.proposalId !== sent.proposalId) return;
  if (!saved) return;
  const sentBy = new Map(sent.rows.map((x) => [rowKey(x), x]));
  const curBy = new Map(cur.rows.map((x) => [rowKey(x), x]));
  const patches: [string, { status?: RowStatus; parked?: boolean }][] = [];
  const rows = saved.rows.map((x) => {
    const before = sentBy.get(rowKey(x));
    const now = curBy.get(rowKey(x));
    if (!before || !now) return x;
    const patch: { status?: RowStatus; parked?: boolean } = {};
    if (now.status !== before.status) patch.status = now.status;
    if (!!now.parked !== !!before.parked) patch.parked = !!now.parked;
    if (!Object.keys(patch).length) return x;
    patches.push([x.id, patch]);
    return { ...x, ...patch };
  });
  // 保存を待つあいだに足した行（まだ列に並んでいる）は消さずに残す
  const savedKeys = new Set(saved.rows.map(rowKey));
  const pending = cur.rows.filter((x) => !savedKeys.has(rowKey(x)) && !sentBy.has(rowKey(x)));
  set({ ...load(), plan: { ...saved, rows: [...rows, ...pending] } });
  for (const [id, patch] of patches) persist(r, () => r.updateRow(id, patch));
}

export const growActions = {
  saveAnswer(answer: HearingAnswer) {
    const s = load();
    set({ ...s, answers: { ...s.answers, [answer.questionId]: answer } });
    const r = remote;
    if (!r) return;
    const key = `answer:${answer.questionId}`;
    const run = () => persist(r, () => r.saveAnswer(answer));
    if (answer.draft) later(key, run);
    else {
      // 決まった答えは待たずに保存し、その前の途中の答えは捨てる
      const old = timers.get(key);
      if (old) clearTimeout(old.timer);
      timers.delete(key);
      run();
    }
  },
  setProposals(proposals: PillarProposal[]) {
    set({ ...load(), proposals });
  },
  /** 設計図を選ぶ・選び直す。前の設計図で書いた記事の答えは消す（行の id が同じでも持ち越さない） */
  choosePlan(plan: KeywordPlan | null, proposal: PillarProposal | null = null) {
    set({ ...load(), plan, articleAnswers: {} });
    const r = remote;
    if (!r) return;
    persist(r, async () => {
      const saved = await r.choosePlan(plan, proposal);
      if (plan) adoptSavedPlan(r, plan, saved);
    });
  },
  setRowStatus(rowId: string, status: RowStatus) {
    const s = load();
    if (!s.plan) return;
    set({ ...s, plan: { ...s.plan, rows: s.plan.rows.map((r) => (r.id === rowId ? { ...r, status } : r)) } });
    const r = remote;
    if (r) persist(r, () => r.updateRow(rowId, { status }));
  },
  /** 管理表にキーワードを足す */
  addRow(row: KeywordRow) {
    const s = load();
    if (!s.plan) return;
    const plan = { ...s.plan, rows: [...s.plan.rows, row] };
    set({ ...s, plan });
    const r = remote;
    if (!r) return;
    // 売りたいものの並べかえを待っていたら先に送り、仮の id を DB の id に直せるようにする
    const sell = timers.get("sell");
    if (sell) {
      clearTimeout(sell.timer);
      timers.delete("sell");
      sell.run();
    }
    persist(r, async () => {
      // 送る時点の組み立てで、柱と売りたいものの id を DB の id に直す（組み立てを選ぶ保存が先に終わっていることがある）
      const now = remote === r ? load().plan : plan; // 会社を切りかえていたら、足したときの組み立てで送る
      if (!now || !now.rows.some((x) => rowKey(x) === rowKey(row))) return; // 送る前に選び直した
      const pillarKey = plan.rows.find((x) => x.id === row.pillarId);
      const pillarId = isUuid(row.pillarId) ? row.pillarId : now?.rows.find((x) => pillarKey && rowKey(x) === rowKey(pillarKey))?.id;
      const sellItemId = row.sellItemId && !isUuid(row.sellItemId) ? (sellIdMap.get(row.sellItemId) ?? null) : row.sellItemId;
      const current = now?.rows.find((x) => rowKey(x) === rowKey(row)) ?? row;
      const sent = now ?? plan;
      adoptSavedPlan(r, sent, await r.addRow({ ...current, pillarId, sellItemId }));
    });
  },
  /** 「やめておく」にする・戻す。消さずに残す */
  setRowParked(rowId: string, parked: boolean) {
    const s = load();
    if (!s.plan) return;
    set({ ...s, plan: { ...s.plan, rows: s.plan.rows.map((r) => (r.id === rowId ? { ...r, parked } : r)) } });
    const r = remote;
    if (r) persist(r, () => r.updateRow(rowId, { parked }));
  },
  /** 今売りたいものと、その順位を保存する */
  setSellItems(items: SellItem[]) {
    set({ ...load(), sellItems: items });
    const r = remote;
    if (!r) return;
    const seq = ++sellSeq;
    later("sell", () =>
      persist(r, async () => {
        const saved = await r.saveSellItems(items);
        items.forEach((x, i) => {
          if (!isUuid(x.id) && saved[i]?.name === x.name) sellIdMap.set(x.id, saved[i].id);
        });
        // 保存のあいだにまた並べかえていたら、新しいほうを残す
        if (remote === r && seq === sellSeq) set({ ...load(), sellItems: saved });
      }),
    );
  },
  saveArticleAnswers(rowId: string, answers: Record<string, string>) {
    const s = load();
    set({ ...s, articleAnswers: { ...s.articleAnswers, [rowId]: answers } });
  },
  /** 試作の入力を消す。本物のデータでは使わない（会社の記録は消さない） */
  reset() {
    if (remote) return;
    set(EMPTY);
  },
};

const getSnapshot = () => (sync.mode === "remote" && !sync.loaded ? null : load());

/** 最初の描画（サーバー）では空。ブラウザで読み込んでから ready になる */
export function useGrow(): GrowState & { ready: boolean } {
  const s = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return s ? { ...s, ready: true } : { ...EMPTY, ready: false };
}

const SERVER_SYNC: GrowSync = { mode: "local", loaded: false, saving: false, error: null };
export function useGrowSync(): GrowSync {
  return useSyncExternalStore(subscribe, readGrowSync, () => SERVER_SYNC);
}
