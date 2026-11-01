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
//
// 画面に出す内容 = DBで確かめた内容（server）＋ まだ保存し終わっていない操作（ops）を順に当てたもの。
// 保存が終わったら server を更新して、その操作を ops から外す。読み直したときも ops を当て直すので、
// 保存を待っているあいだの変更（足した記事、進み具合）が消えない。行は id ではなく「種類＋言葉」で指す
// （足したばかりの行や選んだばかりの組み立ては、保存が終わるまで DB の id が無いため）。

type Synced = Pick<GrowState, "answers" | "plan">;
interface Op {
  id: number;
  /** 答えの保存なら質問 id（同じ質問の古い途中の答えを、新しい保存が終わったときにまとめて外す） */
  question?: string;
  apply: (s: Synced) => Synced;
}

let server: Synced = { answers: {}, plan: null };
let ops: Op[] = [];
let opSeq = 0;
/** 組み立てを選び直した回数。足す操作は、足したあとに選び直していたら送らない */
let planGen = 0;

const rowKey = (x: KeywordRow) => `${x.kind}\n${x.keyword}`;

function rebase(): Synced {
  return ops.reduce((acc, o) => o.apply(acc), server);
}

/** 仮の行 id → DB の行 id。書いている途中の画面（URL に仮の id）からも同じ行を開けるようにする */
const rowAlias = new Map<string, string>();
export const resolveRowId = (id: string) => rowAlias.get(id) ?? id;

/** server と ops から画面の内容を作り直す。仮の id の行が DB の id になったら、記事ごとの答えも付けかえる */
function refresh() {
  const prev = load();
  const next = rebase();
  let articleAnswers = prev.articleAnswers;
  if (prev.plan && next.plan) {
    const byKey = new Map(next.plan.rows.map((x) => [rowKey(x), x.id]));
    for (const old of prev.plan.rows) {
      const now = byKey.get(rowKey(old));
      if (isUuid(old.id) || !now || now === old.id) continue;
      rowAlias.set(old.id, now);
      if (articleAnswers[old.id] && !articleAnswers[now]) {
        const { [old.id]: moved, ...rest } = articleAnswers;
        articleAnswers = { ...rest, [now]: moved };
      }
    }
  }
  set({ ...prev, ...next, articleAnswers });
}

function track(op: Omit<Op, "id">): number {
  const id = ++opSeq;
  ops.push({ ...op, id });
  refresh();
  return id;
}

function dropOps(pred: (o: Op) => boolean) {
  ops = ops.filter((o) => !pred(o));
}

function patchRow(s: Synced, key: string, patch: Partial<KeywordRow>): Synced {
  if (!s.plan) return s;
  return { ...s, plan: { ...s.plan, rows: s.plan.rows.map((x) => (rowKey(x) === key ? { ...x, ...patch } : x)) } };
}

let inFlight = 0;
const timers = new Map<string, { timer: ReturnType<typeof setTimeout>; run: () => void }>();

/** 保存は1本の列に並べて順番に送る。先に送った古い内容があとから届いて新しい内容を上書きしないようにする */
let queue: Promise<void> = Promise.resolve();

/**
 * うしろで保存する。job は DB に送り、終わったら server を直す関数を返す（会社を切りかえていたら呼ばない）。
 * 失敗したらその操作を外し、知らせて、DBの内容を読み直す。
 */
function persist(r: GrowRemote, job: () => Promise<((srv: Synced) => Synced) | void>, done: (o: Op) => boolean = () => false) {
  inFlight += 1;
  setSync({ saving: true });
  // 会社を切りかえたあとでも、並んでいた保存は前の会社に対して最後まで送る
  const run = queue.then(job);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  run
    .then((update) => {
      if (remote !== r) return;
      if (update) server = update(server);
      dropOps(done);
      refresh();
      if (sync.error) setSync({ error: null });
    })
    .catch((e: unknown) => {
      if (remote !== r) return;
      dropOps(done);
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

function runNow(key: string) {
  const t = timers.get(key);
  if (!t) return;
  clearTimeout(t.timer);
  timers.delete(key);
  t.run();
}

/** 待っている保存をすぐ行う（画面を閉じる前、別の会社に切りかえる前） */
export function flushGrow() {
  [...timers.keys()].forEach(runNow);
}

let loadSeq = 0;
/** 読み直しも保存と同じ列に並べる。読みはじめたあとに終わった保存を、古い読み直しで消さないため */
function reloadRemote(r: GrowRemote): Promise<void> {
  const run = queue.then(() => readRemote(r));
  queue = run;
  return run;
}

async function readRemote(r: GrowRemote) {
  const seq = ++loadSeq;
  try {
    const snap = await r.load();
    if (remote !== r || seq !== loadSeq) return;
    const keep = readLocal(remoteLocalKey(r.organizationId));
    // 売りたいものを全部消したことはDBでは「行が無い」としか分からないので、このブラウザの印で区別する
    const emptied = (keep as GrowState & { sellEmptied?: boolean }).sellEmptied === true;
    server = { answers: snap.answers, plan: snap.plan };
    // 売りたいものの保存待ちがあれば、画面の並べかえを残す（あとの保存でDBにも入る）
    const sellItems = sellSettled < sellSeq && state ? state.sellItems : (snap.sellItems ?? (emptied ? [] : null));
    state = { ...rebase(), sellItems, proposals: keep.proposals, articleAnswers: keep.articleAnswers };
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
  server = { answers: {}, plan: null };
  ops = [];
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
/** 保存し終わった（または失敗した）売りたいものの保存の番号。sellSeq より小さければ、まだ保存待ちの並べかえがある */
let sellSettled = 0;
/** 画面で作った売りたいものの仮の id → DB の id。仮の id（sell_0 など）は会社ごとに重なるので、会社の id と組にする */
const sellIdMap = new Map<string, string>();
const sellKey = (r: GrowRemote, tempId: string) => `${r.organizationId}:${tempId}`;

/** 行の進み具合・「やめておく」を変える。送る時点で DB の id を探す（足したばかりの行は、足す保存のあとで id が分かる） */
function changeRow(rowId: string, patch: { status?: RowStatus; parked?: boolean }) {
  const s = load();
  const target = s.plan?.rows.find((x) => x.id === rowId);
  if (!s.plan || !target) return;
  const r = remote;
  if (!r) {
    set({ ...s, plan: { ...s.plan, rows: s.plan.rows.map((x) => (x.id === rowId ? { ...x, ...patch } : x)) } });
    return;
  }
  const key = rowKey(target);
  const id = track({ apply: (acc) => patchRow(acc, key, patch) });
  persist(
    r,
    async () => {
      // 会社を切りかえたあとは、今の server は別の会社のものなので、変えたときの行の id で送る
      const dbId = remote === r ? server.plan?.rows.find((x) => rowKey(x) === key)?.id : target.id;
      if (!isUuid(dbId)) return; // 送る前に組み立てを選び直した
      await r.updateRow(dbId, patch);
      return (srv) => patchRow(srv, key, patch);
    },
    (o) => o.id === id,
  );
}

export const growActions = {
  saveAnswer(answer: HearingAnswer) {
    const r = remote;
    if (!r) {
      const s = load();
      set({ ...s, answers: { ...s.answers, [answer.questionId]: answer } });
      return;
    }
    const q = answer.questionId;
    const id = track({ question: q, apply: (acc) => ({ ...acc, answers: { ...acc.answers, [q]: answer } }) });
    const key = `answer:${q}`;
    // 保存が終わったら、それより前の同じ質問の操作（まとめて捨てた途中の答え）も外す
    const run = () =>
      persist(
        r,
        async () => {
          await r.saveAnswer(answer);
          return (srv) => ({ ...srv, answers: { ...srv.answers, [q]: answer } });
        },
        (o) => o.question === q && o.id <= id,
      );
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
    set({ ...load(), articleAnswers: {} });
    const r = remote;
    if (!r) {
      set({ ...load(), plan });
      return;
    }
    planGen += 1;
    const id = track({ apply: (acc) => ({ ...acc, plan }) });
    persist(
      r,
      async () => {
        const saved = await r.choosePlan(plan, proposal);
        return (srv) => ({ ...srv, plan: saved });
      },
      (o) => o.id === id,
    );
  },
  setRowStatus(rowId: string, status: RowStatus) {
    changeRow(rowId, { status });
  },
  /** 管理表にキーワードを足す */
  addRow(row: KeywordRow) {
    const s = load();
    if (!s.plan) return;
    const r = remote;
    if (!r) {
      set({ ...s, plan: { ...s.plan, rows: [...s.plan.rows, row] } });
      return;
    }
    const key = rowKey(row);
    const pillar = s.plan.rows.find((x) => x.id === row.pillarId);
    const gen = planGen;
    const id = track({
      apply: (acc) => (acc.plan && !acc.plan.rows.some((x) => rowKey(x) === key) ? { ...acc, plan: { ...acc.plan, rows: [...acc.plan.rows, row] } } : acc),
    });
    // 売りたいものの並べかえを待っていたら先に送り、仮の id を DB の id に直せるようにする
    runNow("sell");
    persist(
      r,
      async () => {
        if (gen !== planGen && remote === r) return; // 足したあとに組み立てを選び直した
        // 送る時点の DB の組み立てで、柱と売りたいものの id を直す（組み立てを選ぶ保存が先に終わっていることがある）
        const base = remote === r ? server.plan : null; // 会社を切りかえたあとは、今の server は別の会社のもの
        const pillarId = isUuid(row.pillarId) ? row.pillarId : base?.rows.find((x) => pillar && rowKey(x) === rowKey(pillar))?.id;
        const sellItemId = row.sellItemId && !isUuid(row.sellItemId) ? (sellIdMap.get(sellKey(r, row.sellItemId)) ?? null) : row.sellItemId;
        const saved = await r.addRow({ ...row, pillarId, sellItemId });
        return saved ? (srv) => ({ ...srv, plan: saved }) : undefined;
      },
      (o) => o.id === id,
    );
  },
  /** 「やめておく」にする・戻す。消さずに残す */
  setRowParked(rowId: string, parked: boolean) {
    changeRow(rowId, { parked });
  },
  /** 今売りたいものと、その順位を保存する */
  setSellItems(items: SellItem[]) {
    set({ ...load(), sellItems: items });
    const r = remote;
    if (!r) return;
    const seq = ++sellSeq;
    later("sell", () =>
      persist(r, async () => {
        try {
          await sendSell();
        } finally {
          sellSettled = Math.max(sellSettled, seq);
        }
      }),
    );
    async function sendSell() {
      if (!r) return;
      // 先に送った保存で DB の id が分かった仮の id は、DB の id で送る（作り直して記事の札が外れないように）
      const resolved = items.map((x) => (isUuid(x.id) ? x : { ...x, id: sellIdMap.get(sellKey(r, x.id)) ?? x.id }));
      const saved = await r.saveSellItems(resolved);
      resolved.forEach((x, i) => {
        if (!isUuid(x.id) && saved[i]?.name === x.name) sellIdMap.set(sellKey(r, x.id), saved[i].id);
      });
      // 保存のあいだにまた並べかえていたら、新しいほうを残す
      if (remote === r && seq === sellSeq) set({ ...load(), sellItems: saved });
    }
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
