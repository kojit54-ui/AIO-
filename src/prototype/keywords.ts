// キーワード管理表の考え方。やった／やっていないを一覧で見て、次の1本を決める。
// 今は架空データとブラウザ内の保存だけ。SEMrush や Search Console をつなぐときは、
// source と monthlySearches を埋めた行を足すだけで画面はそのまま使える。

import { ROW_STATUS_LABEL, type KeywordPlan, type KeywordPriority, type KeywordRow, type KeywordSource, type RowStatus } from "./growth";

export const SOURCE_LABEL: Record<KeywordSource, string> = {
  proposal: "しおりのおすすめ",
  customer: "自分で足した",
  cotam: "コタムが追加",
  site: "ホームページから",
  search_console: "Search Console",
  semrush: "SEMrush",
};

/** 記事リストでの呼び方（ROW_STATUS_LABEL と同じ） */
export const LIST_STATUS_LABEL: Record<RowStatus, string> = ROW_STATUS_LABEL;

export const PRIORITY_LABEL: Record<KeywordPriority, string> = { 3: "おすすめ度 高", 2: "おすすめ度 中", 1: "おすすめ度 低" };

/** 前の試作で保存した行（優先度などが無い）を、管理表で使える形にそろえる */
export function normalizeRow(r: KeywordRow, pillarId: string | undefined): Required<KeywordRow> {
  return {
    ...r,
    pillarId: r.pillarId ?? (r.kind === "pillar" ? r.id : (pillarId ?? r.id)),
    priority: r.priority ?? (r.kind === "pillar" ? 3 : 2),
    reasons: r.reasons ?? [],
    source: r.source ?? "proposal",
    monthlySearches: r.monthlySearches ?? null,
    parked: r.parked ?? false,
  };
}

export function normalizeRows(plan: KeywordPlan | null): Required<KeywordRow>[] {
  const rows = plan?.rows ?? [];
  const firstPillar = rows.find((r) => r.kind === "pillar")?.id;
  return rows.map((r) => normalizeRow(r, firstPillar));
}

type Row = Required<KeywordRow>;

const STATUS_ORDER: Record<RowStatus, number> = { writing: 0, todo: 1, published: 2 };

/** おすすめ順：優先度の高い順。同じなら書いている途中 → まだ → やった、柱の記事を先に、元の並び */
export function sortByRecommendation(rows: Row[]): Row[] {
  return rows
    .map((r, i) => ({ r, i }))
    .sort(
      (a, b) =>
        b.r.priority - a.r.priority ||
        STATUS_ORDER[a.r.status] - STATUS_ORDER[b.r.status] ||
        (a.r.kind === "pillar" ? 0 : 1) - (b.r.kind === "pillar" ? 0 : 1) ||
        a.i - b.i,
    )
    .map((x) => x.r);
}

/** 次に書くならこれ。やめておいたものと、やったものは除く */
export function nextKeyword(rows: Row[]): Row | null {
  return sortByRecommendation(rows.filter((r) => !r.parked && r.status !== "published"))[0] ?? null;
}

export interface PillarGroup {
  pillar: Row | null;
  rows: Row[];
  done: number;
}

/** 柱ごとにまとめる。柱の記事を先頭に、そのあとは元の並び。やめておいたものは含めない */
export function groupByPillar(rows: Row[]): PillarGroup[] {
  const active = rows.filter((r) => !r.parked);
  const ids = [...new Set(active.map((r) => r.pillarId))];
  return ids.map((id) => {
    const inGroup = active.filter((r) => r.pillarId === id);
    const pillar = inGroup.find((r) => r.kind === "pillar") ?? null;
    const ordered = pillar ? [pillar, ...inGroup.filter((r) => r !== pillar)] : inGroup;
    return { pillar, rows: ordered, done: ordered.filter((r) => r.status === "published").length };
  });
}

export function countByStatus(rows: Row[]): Record<RowStatus | "all", number> {
  const active = rows.filter((r) => !r.parked);
  return {
    all: active.length,
    todo: active.filter((r) => r.status === "todo").length,
    writing: active.filter((r) => r.status === "writing").length,
    published: active.filter((r) => r.status === "published").length,
  };
}

/** 丸を押したとき：やった ⇄ まだ（書いている途中なら、やった） */
export const toggleDone = (s: RowStatus): RowStatus => (s === "published" ? "todo" : "published");

/** 状態のボタンを押したとき：まだ → 書いている → やった → まだ */
export const cycleStatus = (s: RowStatus): RowStatus => (s === "todo" ? "writing" : s === "writing" ? "published" : "todo");

/** 自分でキーワードを足す。空や、すでにある言葉（空白の違いは無視）は足さない */
export function newKeywordRow(rows: KeywordRow[], keyword: string, pillarId: string, source: KeywordSource = "customer"): KeywordRow | null {
  const clean = keyword.replace(/\s+/g, " ").trim();
  if (!clean) return null;
  const key = (s: string) => s.replace(/\s+/g, "");
  if (rows.some((r) => key(r.keyword) === key(clean))) return null;
  return {
    id: `kw_${Date.now().toString(36)}_${rows.length}`,
    keyword: clean,
    question: "",
    kind: "cluster",
    status: "todo",
    pillarId,
    priority: 2,
    reasons: [],
    source,
    monthlySearches: null,
    parked: false,
  };
}

/** しおりのひとこと */
export function shioriMessage(rows: Row[]): string {
  const c = countByStatus(rows);
  const next = nextKeyword(rows);
  if (c.all === 0) return "まだ記事がありません。書く記事を決めると、ここに並びます。";
  if (c.published === c.all) return `${c.all}本ぜんぶ、やったね！サイトがすっかり育ったよ。`;
  const head = c.published === 0 ? `書く記事が${c.all}本 並んだよ。` : `${c.all}本のうち ${c.published}本 やったね！`;
  return next ? `${head}次は「${next.keyword}」がおすすめ。` : head;
}
