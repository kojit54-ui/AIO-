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

export const PRIORITY_LABEL: Record<KeywordPriority, string> = { 3: "しおりのおすすめ度 高", 2: "しおりのおすすめ度 中", 1: "しおりのおすすめ度 低" };

/** 顧客が「今売りたいもの」。並び順がそのまま順位（先頭が1位） */
export interface SellItem {
  id: string;
  name: string;
}

/** 「売りたい商品やサービス」の答えから、最初の売りたいものの並びを作る（読点・改行・「／」で区切る。最大5つ） */
export function sellItemsFromAnswer(text: string): SellItem[] {
  const names = text
    .split(/\n|、|，|,|／|\//)
    .map((x) => x.replace(/^例：|^[-・\s]+/, "").trim())
    .filter(Boolean);
  return [...new Set(names)].slice(0, 5).map((name, i) => ({ id: `sell_${i}`, name }));
}

const squash = (x: string) => x.replace(/\s+/g, "");

/** 記事がどの売りたいものの記事か。行に決めてあればそれ、無ければ記事の言葉に売りたいものの名前が入っているもの（上の順位を優先） */
export function sellItemOf(row: KeywordRow, items: SellItem[]): { item: SellItem; rank: number } | null {
  const byId = row.sellItemId ? items.findIndex((x) => x.id === row.sellItemId) : -1;
  const rank = byId >= 0 ? byId : items.findIndex((x) => squash(x.name) && squash(row.keyword).includes(squash(x.name)));
  return rank >= 0 ? { item: items[rank], rank } : null;
}

/** 売りたいものの順位で足す点：1位 3、2位 2、3位 1、それより下 0 */
export const sellBoost = (rank: number | undefined) => (rank === undefined ? 0 : Math.max(0, 3 - rank));

/** 並べかえ：from 番目を to 番目へ動かした新しい配列 */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= list.length) return list;
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, x);
  return next;
}

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
    sellItemId: r.sellItemId ?? null,
  };
}

export function normalizeRows(plan: KeywordPlan | null): Required<KeywordRow>[] {
  const rows = plan?.rows ?? [];
  const firstPillar = rows.find((r) => r.kind === "pillar")?.id;
  return rows.map((r) => normalizeRow(r, firstPillar));
}

type Row = Required<KeywordRow>;

const STATUS_ORDER: Record<RowStatus, number> = { writing: 0, todo: 1, published: 2 };

/** 記事の点：しおりのおすすめ度（1〜3）＋ 今売りたいものの順位の点（0〜3） */
export const rowScore = (r: Row, items: SellItem[] = []) => r.priority + sellBoost(sellItemOf(r, items)?.rank);

/**
 * おすすめ順：点（しおりのおすすめ度＋売りたいものの順位）の高い順。
 * 同じなら書いている途中 → まだ → やった、柱の記事を先に、元の並び
 */
export function sortByRecommendation(rows: Row[], items: SellItem[] = []): Row[] {
  return rows
    .map((r, i) => ({ r, i, score: rowScore(r, items) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        STATUS_ORDER[a.r.status] - STATUS_ORDER[b.r.status] ||
        (a.r.kind === "pillar" ? 0 : 1) - (b.r.kind === "pillar" ? 0 : 1) ||
        a.i - b.i,
    )
    .map((x) => x.r);
}

/** 次に書くならこれ。やめておいたものと、やったものは除く */
export function nextKeyword(rows: Row[], items: SellItem[] = []): Row | null {
  return sortByRecommendation(rows.filter((r) => !r.parked && r.status !== "published"), items)[0] ?? null;
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
export function newKeywordRow(rows: KeywordRow[], keyword: string, pillarId: string, source: KeywordSource = "customer", sellItemId: string | null = null): KeywordRow | null {
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
    sellItemId,
  };
}

/** しおりのひとこと */
export function shioriMessage(rows: Row[], items: SellItem[] = []): string {
  const c = countByStatus(rows);
  const next = nextKeyword(rows, items);
  if (c.all === 0) return "まだ記事がありません。書く記事を決めると、ここに並びます。";
  if (c.published === c.all) return `${c.all}本ぜんぶ、やったね！サイトがすっかり育ったよ。`;
  const head = c.published === 0 ? `書く記事が${c.all}本 並んだよ。` : `${c.all}本のうち ${c.published}本 やったね！`;
  return next ? `${head}次は「${next.keyword}」がおすすめ。` : head;
}
