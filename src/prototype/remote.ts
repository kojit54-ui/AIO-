// 「育つブログ」の画面を本物のデータ（Supabase）につなぐ層。T5-5。
// 表は supabase/migrations/20261101000000_growth.sql（docs/DATA.md「育つブログ」）。
// ログイン中の利用者として読み書きし、会社ごとの制限・検索回数を書かせない決まりはDB（RLSとトリガー）が守る。
// 画面の型（src/prototype/growth.ts・keywords.ts）とDBの行の変換は、テストできるように純粋な関数にしておく。

import type { SupabaseClient } from "@supabase/supabase-js";
import type { HearingAnswer, KeywordPlan, KeywordPriority, KeywordRow, KeywordSource, PillarProposal, ProposalReason, RowStatus } from "./growth";
import { MAX_SELL_ITEMS, type SellItem } from "./keywords";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID.test(v);

/** 画面の質問 id（例：business）をDBの question_id の形（英小文字・数字・_ の40字まで）にそろえる */
export const toQuestionId = (id: string) => id.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 40);

export interface HearingAnswerRow {
  question_id: string;
  text: string;
  follow_ups: unknown;
  is_draft: boolean;
}

export function answerFromDb(r: HearingAnswerRow): HearingAnswer {
  const followUps = Array.isArray(r.follow_ups)
    ? r.follow_ups.flatMap((f) => {
        const o = f as Record<string, unknown>;
        return typeof o?.question === "string" ? [{ question: o.question, answer: typeof o.answer === "string" ? o.answer : "" }] : [];
      })
    : [];
  return { questionId: r.question_id, text: r.text, followUps, ...(r.is_draft ? { draft: true } : {}) };
}

export function answerToDb(orgId: string, a: HearingAnswer) {
  return {
    organization_id: orgId,
    question_id: toQuestionId(a.questionId),
    text: a.text.slice(0, 4000),
    follow_ups: a.followUps.slice(0, 10).map((f) => ({ question: f.question, answer: f.answer })),
    is_draft: a.draft === true,
  };
}

export interface KeywordRowRecord {
  id: string;
  kind: "pillar" | "cluster";
  pillar_row_id: string | null;
  keyword: string;
  reader_question: string;
  status: RowStatus;
  priority: number;
  reasons: string[];
  source: string;
  monthly_searches: number | null;
  parked: boolean;
  sell_item_id: string | null;
  sort_order: number;
}

const SOURCES: KeywordSource[] = ["proposal", "customer", "cotam", "site", "search_console", "semrush", "rakko", "keyword_planner"];
const REASONS: ProposalReason[] = ["sales", "competition", "aio"];

export function rowFromDb(r: KeywordRowRecord): KeywordRow {
  return {
    id: r.id,
    keyword: r.keyword,
    question: r.reader_question,
    kind: r.kind,
    status: r.status,
    pillarId: r.kind === "pillar" ? r.id : (r.pillar_row_id ?? undefined),
    priority: (r.priority >= 1 && r.priority <= 3 ? r.priority : 2) as KeywordPriority,
    reasons: r.reasons.filter((x): x is ProposalReason => REASONS.includes(x as ProposalReason)),
    source: SOURCES.includes(r.source as KeywordSource) ? (r.source as KeywordSource) : "proposal",
    monthlySearches: r.monthly_searches,
    parked: r.parked,
    sellItemId: r.sell_item_id,
  };
}

/** choose_keyword_plan に渡す行。柱は key "p<id>"、周りの記事は pillar_key で柱を指す。売りたいものの札は選び直しのあとで付け直す */
export function planRowsForRpc(plan: KeywordPlan) {
  return plan.rows.slice(0, 30).map((r, i) => ({
    key: `k${i}`,
    kind: r.kind,
    pillar_key: r.kind === "cluster" && r.pillarId ? `k${plan.rows.findIndex((x) => x.id === r.pillarId)}` : null,
    keyword: r.keyword.slice(0, 80),
    reader_question: r.question.slice(0, 200),
    priority: r.priority ?? 2,
    reasons: r.reasons ?? [],
    source: r.source ?? "proposal",
    sort_order: i,
  }));
}

/** save_sell_items に渡す形。画面で作った仮の id（sell_0 など）は渡さず、DBで新しく作らせる */
export function sellItemsForRpc(items: SellItem[]) {
  // 黙って切り捨てると、外れたものがDBで消えて記事の札も外れる。多すぎるときは保存せずに知らせる
  if (items.length > MAX_SELL_ITEMS) throw new GrowSyncError(`売りたいものは${MAX_SELL_ITEMS}個までです。どれかを消してください`);
  return items.map((x) => (isUuid(x.id) ? { id: x.id, name: x.name } : { name: x.name }));
}

export interface GrowSnapshot {
  answers: Record<string, HearingAnswer>;
  plan: KeywordPlan | null;
  sellItems: SellItem[] | null;
}

export interface GrowRemote {
  organizationId: string;
  load(): Promise<GrowSnapshot>;
  saveAnswer(a: HearingAnswer): Promise<void>;
  /** 組み立てを選ぶ（null ならしまう）。選んだあとの行（DBの id つき）を返す */
  choosePlan(plan: KeywordPlan | null, proposal: PillarProposal | null): Promise<KeywordPlan | null>;
  updateRow(rowId: string, patch: { status?: RowStatus; parked?: boolean }): Promise<void>;
  /** 行を足す。足したあとの組み立てを返す */
  addRow(row: KeywordRow): Promise<KeywordPlan | null>;
  /** 売りたいものを置きかえる。DBの id つきで返す */
  saveSellItems(items: SellItem[]): Promise<SellItem[]>;
}

/** 失敗は画面にそのまま出せる日本語にする。DBのエラー文や本文はログにも画面にも出さない */
export class GrowSyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GrowSyncError";
  }
}

function fail(error: { code?: string; message?: string } | null): never {
  if (error?.code === "42501") throw new GrowSyncError("この操作はできません。ログインし直してください");
  if (error?.code === "PGRST303" || error?.message?.includes("JWT")) throw new GrowSyncError("ログインの有効期限が切れました。ログインし直してください");
  throw new GrowSyncError("保存できませんでした。通信状態を確かめて、もう一度お試しください");
}

const ROW_COLUMNS = "id, kind, pillar_row_id, keyword, reader_question, status, priority, reasons, source, monthly_searches, parked, sell_item_id, sort_order";

export function createGrowRemote(client: SupabaseClient, organizationId: string): GrowRemote {
  async function loadPlan(): Promise<KeywordPlan | null> {
    const { data: plan, error } = await client.from("keyword_plans").select("id").eq("organization_id", organizationId).is("archived_at", null).maybeSingle();
    if (error) fail(error);
    if (!plan) return null;
    const { data: rows, error: e2 } = await client.from("keyword_rows").select(ROW_COLUMNS).eq("plan_id", plan.id).order("sort_order");
    if (e2) fail(e2);
    return { proposalId: plan.id as string, rows: ((rows ?? []) as KeywordRowRecord[]).map(rowFromDb) };
  }

  async function loadSellItems(): Promise<SellItem[] | null> {
    const { data, error } = await client.from("sell_items").select("id, name").eq("organization_id", organizationId).order("rank");
    if (error) fail(error);
    return data && data.length ? data.map((x) => ({ id: x.id as string, name: x.name as string })) : null;
  }

  return {
    organizationId,

    async load() {
      const [{ data: answers, error }, plan, sellItems] = await Promise.all([
        client.from("hearing_answers").select("question_id, text, follow_ups, is_draft").eq("organization_id", organizationId),
        loadPlan(),
        loadSellItems(),
      ]);
      if (error) fail(error);
      const map: Record<string, HearingAnswer> = {};
      for (const r of (answers ?? []) as HearingAnswerRow[]) map[r.question_id] = answerFromDb(r);
      return { answers: map, plan, sellItems };
    },

    async saveAnswer(a) {
      const { error } = await client.from("hearing_answers").upsert(answerToDb(organizationId, a), { onConflict: "organization_id,question_id" });
      if (error) fail(error);
    },

    async choosePlan(plan, proposal) {
      if (!plan) {
        const { error } = await client.from("keyword_plans").update({ archived_at: new Date().toISOString() }).eq("organization_id", organizationId).is("archived_at", null);
        if (error) fail(error);
        return null;
      }
      const { error } = await client.rpc("choose_keyword_plan", {
        p_organization_id: organizationId,
        p_proposal: proposal ? { pillar: proposal.pillar, clusters: proposal.clusters, reasons: proposal.reasons, why: proposal.why } : { rows: plan.rows.length },
        p_rows: planRowsForRpc(plan),
      });
      if (error) fail(error);
      return loadPlan();
    },

    async updateRow(rowId, patch) {
      if (!isUuid(rowId)) return;
      const { error } = await client.from("keyword_rows").update(patch).eq("id", rowId).eq("organization_id", organizationId);
      if (error) fail(error);
    },

    async addRow(row) {
      const { data: plan, error } = await client.from("keyword_plans").select("id").eq("organization_id", organizationId).is("archived_at", null).maybeSingle();
      if (error) fail(error);
      if (!plan) return null;
      const { data: last } = await client.from("keyword_rows").select("sort_order").eq("plan_id", plan.id).order("sort_order", { ascending: false }).limit(1);
      const { error: e2 } = await client.from("keyword_rows").insert({
        plan_id: plan.id,
        organization_id: organizationId,
        kind: row.kind,
        pillar_row_id: row.kind === "cluster" && isUuid(row.pillarId) ? row.pillarId : null,
        keyword: row.keyword.slice(0, 80),
        reader_question: row.question.slice(0, 200),
        priority: row.priority ?? 2,
        reasons: row.reasons ?? [],
        source: row.source ?? "customer",
        sell_item_id: isUuid(row.sellItemId) ? row.sellItemId : null,
        status: row.status,
        parked: !!row.parked,
        sort_order: ((last?.[0]?.sort_order as number | undefined) ?? 0) + 1,
      });
      if (e2) fail(e2);
      return loadPlan();
    },

    async saveSellItems(items) {
      const { error } = await client.rpc("save_sell_items", { p_organization_id: organizationId, p_items: sellItemsForRpc(items) });
      if (error) fail(error);
      return (await loadSellItems()) ?? [];
    },
  };
}
