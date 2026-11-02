// 書く記事の提案のための下調べ。ラッコキーワードで「実際に検索されている言葉」と「よく聞かれる質問」を集め、
// AIの提案役（src/lib/ai/growthPrompts.ts）にデータとして渡す。サーバー側でだけ使う。
//
// 顧客の画面には、ここで集めた生データ（キーワード一覧・検索数）をそのまま出さない。
// AIが選んで言い換えた「コタムからの提案」だけを出す（docs/DECISIONS.md 2026-11-01、ラッコの API利用ガイドライン）。
// 検索数も AI には「多い・ふつう・少ない」の目安だけを渡し、数字を書かせない。

import { RakkoError, type RakkoClient, normalizeSeedKeyword } from "./rakko";

export type SearchDemand = "high" | "medium" | "low" | "unknown";

export interface ResearchForPrompt {
  seed: string;
  /** 実際に検索されている言葉（多い順） */
  searched: { keyword: string; demand: SearchDemand }[];
  /** よく聞かれる質問（多い順） */
  questions: string[];
}

export interface ResearchResult {
  research: ResearchForPrompt[];
  consumedCredit: number;
  /** 一部だけ取れなかったときの理由（画面とログ用。キーや生データは入れない） */
  problems: { seed: string; code: RakkoError["code"] }[];
}

/** 1回の提案で調べる言葉の数。1語あたり3クレジット（サジェスト1.5＋質問1.5） */
export const MAX_SEEDS = 3;
const KEYWORDS_PER_SEED = 30;
const QUESTIONS_PER_SEED = 15;

export function demandOf(monthlySearches: number | null): SearchDemand {
  if (monthlySearches === null) return "unknown";
  if (monthlySearches >= 1000) return "high";
  if (monthlySearches >= 100) return "medium";
  return "low";
}

/** 調べる言葉をそろえる。空・重複（空白の違いだけのもの）を除き、上から MAX_SEEDS 語まで */
export function pickSeeds(candidates: string[]): string[] {
  const seen = new Set<string>();
  const seeds: string[] = [];
  for (const c of candidates) {
    let s: string;
    try {
      s = normalizeSeedKeyword(c);
    } catch {
      continue;
    }
    const key = s.replace(/\s+/g, "").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    seeds.push(s);
    if (seeds.length >= MAX_SEEDS) break;
  }
  return seeds;
}

/**
 * 言葉ごとにサジェストとよくある質問を取る。1語が失敗しても残りは続ける。
 * ただしクレジット切れとキーの誤りは、続けても同じなのでそこで止める。
 */
export async function collectResearch(client: RakkoClient, candidates: string[], signal?: AbortSignal, deadline?: AbortSignal): Promise<ResearchResult> {
  const result: ResearchResult = { research: [], consumedCredit: 0, problems: [] };
  // deadline（下調べの持ち時間）が来たら、そこまでに取れた分とクレジットを返す。signal は全体の打ち切りで、そのときは例外にする
  const callSignal = signal && deadline ? AbortSignal.any([signal, deadline]) : (deadline ?? signal);
  for (const seed of pickSeeds(candidates)) {
    if (deadline?.aborted) break;
    const [suggest, questions] = await Promise.allSettled([
      client.suggestKeywords(seed, { limit: KEYWORDS_PER_SEED, signal: callSignal }),
      client.questionSearch(seed, { limit: QUESTIONS_PER_SEED, signal: callSignal }),
    ]);
    const searched = suggest.status === "fulfilled" ? suggest.value.items.map((k) => ({ keyword: k.keyword, demand: demandOf(k.monthlySearches) })) : [];
    const qs = questions.status === "fulfilled" ? questions.value.items.map((q) => q.question) : [];
    result.consumedCredit += (suggest.status === "fulfilled" ? suggest.value.consumedCredit : 0) + (questions.status === "fulfilled" ? questions.value.consumedCredit : 0);
    if (searched.length || qs.length) result.research.push({ seed, searched, questions: qs });

    const errors = [suggest, questions].flatMap((r) => (r.status === "rejected" ? [r.reason as unknown] : []));
    if (!errors.length) continue;
    if (signal?.aborted) throw signal.reason;
    if (deadline?.aborted) break;
    const other = errors.find((e) => !(e instanceof RakkoError));
    if (other) throw other;
    const codes = [...new Set(errors.map((e) => (e as RakkoError).code))];
    for (const code of codes) result.problems.push({ seed, code });
    if (codes.includes("no_credit") || codes.includes("auth")) break;
  }
  return result;
}
