// ラッコキーワード API（https://api.rakkokeyword.com、仕様 v1.26.0）。サーバー側でだけ使う。
// キーは環境変数 RAKKO_API_KEY だけに置き、画面・ログ・エラー文に出さない（docs/KEYWORD_TOOLS_SETUP.md）。
//
// 使ってよい範囲（API利用ガイドライン https://rakkokeyword.com/knowledge/9510/ 、2026-11-01 確認）：
// コタムが調べて手を加え、特定の顧客に提案として渡すのは申し込みなしで可。
// コタムのキー1つで顧客の画面にデータをそのまま出すのは個別ライセンス（月55,000円）が要る。
// どちらで使うかは docs/DECISIONS.md に従う。
//
// クレジット：サジェスト・よくある質問は1回1.5、アカウント情報は0。レート制限は60回/60秒。

export type RakkoErrorCode = "not_configured" | "invalid_input" | "auth" | "no_credit" | "rate_limited" | "unavailable" | "bad_response";

export class RakkoError extends Error {
  constructor(
    readonly code: RakkoErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "RakkoError";
  }
}

/** 書く記事の候補になるキーワード。数字は取れないとき null のまま（作らない） */
export interface RakkoKeyword {
  keyword: string;
  /** Google の月間検索数（年平均） */
  monthlySearches: number | null;
  /** SEO難易度 1〜100 */
  seoDifficulty: number | null;
}

/** よくある質問。relativeDemand はその検索の中での相対値（1〜100）で、別のキーワードの結果とは比べられない */
export interface RakkoQuestion {
  question: string;
  relativeDemand: number | null;
}

export interface RakkoList<T> {
  items: T[];
  /** 条件に合う全体の件数（返したのは items.length 件） */
  totalCount: number;
  consumedCredit: number;
}

export interface RakkoAccount {
  planName: string;
  dueDate: string;
  creditBalance: number;
}

export interface RakkoClient {
  suggestKeywords(keyword: string, opts?: { limit?: number; signal?: AbortSignal }): Promise<RakkoList<RakkoKeyword>>;
  questionSearch(keyword: string, opts?: { limit?: number; signal?: AbortSignal }): Promise<RakkoList<RakkoQuestion>>;
  accountInfo(opts?: { signal?: AbortSignal }): Promise<RakkoAccount>;
}

export interface RakkoClientOptions {
  apiKey: string;
  /** テスト用。省略時は標準の fetch */
  fetch?: typeof fetch;
  baseUrl?: string;
  timeoutMs?: number;
}

export const RAKKO_BASE_URL = "https://api.rakkokeyword.com";
const DEFAULT_TIMEOUT_MS = 30_000;
/** 1回に返す件数の上限。画面で選べる量にとどめる */
export const RAKKO_MAX_LIMIT = 200;
const MAX_KEYWORD_LENGTH = 80;

type Env = Record<string, string | undefined>;

/** キーが無ければ null。呼ぶ側は「ラッコは未接続」と表示する */
export function getRakkoClient(env: Env = process.env, fetchImpl?: typeof fetch): RakkoClient | null {
  const apiKey = env.RAKKO_API_KEY?.trim();
  return apiKey ? createRakkoClient({ apiKey, fetch: fetchImpl }) : null;
}

export function normalizeSeedKeyword(input: string): string {
  const keyword = input.replace(/[\s　]+/g, " ").trim();
  if (!keyword) throw new RakkoError("invalid_input", "調べたい言葉を入れてください");
  if (keyword.length > MAX_KEYWORD_LENGTH) throw new RakkoError("invalid_input", `調べたい言葉は${MAX_KEYWORD_LENGTH}文字までにしてください`);
  return keyword;
}

const clampLimit = (n: number | undefined, fallback: number) => Math.min(RAKKO_MAX_LIMIT, Math.max(1, Math.floor(n ?? fallback)));

const numOrNull = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export function createRakkoClient(opts: RakkoClientOptions): RakkoClient {
  const doFetch = opts.fetch ?? fetch;
  const baseUrl = opts.baseUrl ?? RAKKO_BASE_URL;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  async function call(method: "GET" | "POST", path: string, body: unknown, signal?: AbortSignal): Promise<Record<string, unknown>> {
    const timeout = AbortSignal.timeout(timeoutMs);
    let res: Response;
    try {
      res = await doFetch(`${baseUrl}${path}`, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json", "X-API-Key": opts.apiKey },
        body: method === "POST" ? JSON.stringify(body) : undefined,
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      });
    } catch (e) {
      if (signal?.aborted) throw e;
      throw new RakkoError("unavailable", timeout.aborted ? "ラッコキーワードの返事が時間内に来ませんでした。少し待ってからもう一度お試しください" : "ラッコキーワードにつながりませんでした（接続エラー）");
    }

    if (res.status === 400) throw new RakkoError("invalid_input", "ラッコキーワードが調べ方を受け付けませんでした。言葉を変えてお試しください");
    if (res.status === 401 || res.status === 403) throw new RakkoError("auth", "ラッコキーワードのAPIキーが正しくないか、使えるプランではありません（スタンダード以上が必要）");
    if (res.status === 402) throw new RakkoError("no_credit", "ラッコキーワードのクレジットが足りません。やり直しでは直らないので、クレジットを買い足すか翌月の付与を待ってください");
    if (res.status === 429) throw new RakkoError("rate_limited", "ラッコキーワードを短い間に使いすぎました。1分ほど待ってからもう一度お試しください");
    if (!res.ok) throw new RakkoError("unavailable", `ラッコキーワードで問題が起きました（${res.status}）。少し待ってからもう一度お試しください`);

    const json: unknown = await res.json().catch(() => null);
    if (!isObj(json) || json.result !== true || !isObj(json.data)) throw new RakkoError("bad_response", "ラッコキーワードの返事を読み取れませんでした");
    return json;
  }

  function list<T>(json: Record<string, unknown>, pick: (item: Record<string, unknown>) => T | null): RakkoList<T> {
    const data = json.data as Record<string, unknown>;
    if (!Array.isArray(data.items)) throw new RakkoError("bad_response", "ラッコキーワードの返事を読み取れませんでした");
    const items = data.items.flatMap((it) => {
      const v = isObj(it) ? pick(it) : null;
      return v === null ? [] : [v];
    });
    const summary = isObj(data.summary) ? data.summary : {};
    const meta = isObj(json.meta) ? json.meta : {};
    return { items, totalCount: numOrNull(summary.totalCount) ?? items.length, consumedCredit: numOrNull(meta.consumedCredit) ?? 0 };
  }

  return {
    async suggestKeywords(input, o = {}) {
      const keyword = normalizeSeedKeyword(input);
      const json = await call("POST", "/v1/suggest-keywords", { keyword, modes: ["google"], sortBy: "searchVolume", orderBy: "desc", limit: clampLimit(o.limit, 100) }, o.signal);
      const seen = new Set<string>();
      return list(json, (it) => {
        const kw = typeof it.keyword === "string" ? it.keyword.trim() : "";
        if (!kw || seen.has(kw)) return null;
        seen.add(kw);
        const m = isObj(it.metrics) ? it.metrics : {};
        return { keyword: kw, monthlySearches: numOrNull(m.searchVolume), seoDifficulty: numOrNull(m.seoDifficulty) };
      });
    },

    async questionSearch(input, o = {}) {
      const keyword = normalizeSeedKeyword(input);
      const json = await call("POST", "/v1/question-search", { keyword, sortBy: "relativeDemand", orderBy: "desc", limit: clampLimit(o.limit, 50) }, o.signal);
      return list(json, (it) => {
        const q = typeof it.question === "string" ? it.question.trim() : "";
        if (!q) return null;
        const m = isObj(it.metrics) ? it.metrics : {};
        return { question: q, relativeDemand: numOrNull(m.relativeDemand) };
      });
    },

    async accountInfo(o = {}) {
      const json = await call("GET", "/v1/account/info", undefined, o.signal);
      const data = json.data as Record<string, unknown>;
      const contract = isObj(data.contract) ? data.contract : {};
      const credit = isObj(data.credit) ? data.credit : {};
      const balance = numOrNull(credit.balance);
      if (typeof contract.planName !== "string" || balance === null) throw new RakkoError("bad_response", "ラッコキーワードの返事を読み取れませんでした");
      return { planName: contract.planName, dueDate: typeof contract.dueDate === "string" ? contract.dueDate : "", creditBalance: balance };
    },
  };
}
