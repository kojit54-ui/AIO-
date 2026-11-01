// 書く記事の提案（コタムからの提案）を作る。サーバー側でだけ使う。T5-4。
// 受付（start_keyword_proposal）→ 実行の確保 → 検索の下調べ（ラッコ）→ AI → 提案の保存 → 結果の記録、の順に進める。
// できた提案は keyword_proposals に残り、同じ会社の人（顧客・コタム）の画面に人の手を介さず出る（docs/DECISIONS.md 2026-11-01）。
// ヒアリングの答えや下調べの生データはログに出さず、顧客の画面にも出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateCostYen } from "@/lib/ai/cost";
import { buildProposalPrompt, parseProposals, PROPOSAL_SYSTEM_PROMPT, type HearingForPrompt, type ParsedProposal } from "@/lib/ai/growthPrompts";
import { ParseError } from "@/lib/ai/prompt";
import { failureReason, type AiProvider, type AiUsage } from "@/lib/ai/provider";
import type { RakkoClient } from "@/lib/keywords/rakko";
import { collectResearch, type ResearchForPrompt } from "@/lib/keywords/research";
import { HEARING_QUESTIONS, canPropose, isAnswerDone, sampleProposals, type HearingAnswer } from "@/prototype/growth";
import { answerFromDb, type HearingAnswerRow } from "@/prototype/remote";

export interface ProposalSet {
  id: string;
  proposals: ParsedProposal[];
  isSample: boolean;
  usedResearch: boolean;
  createdAt: string;
}

export type ProposalOutcome = { ok: true; set: ProposalSet } | { ok: false; status: number; code: string; message: string };

const fail = (status: number, code: string, message: string): Extract<ProposalOutcome, { ok: false }> => ({ ok: false, status, code, message });

const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "同じ会社で文章を作っている途中です。終わってからもう一度お試しください"],
  limit_reached: [429, "今月のおすすめを作れる回数に達しました。来月またお試しください"],
  budget_exceeded: [429, "今月は新しいおすすめを作れなくなっています。コタムにご連絡ください"],
  invalid_input: [400, "入力の内容を確認してください"],
  forbidden: [403, "この会社のおすすめを作る権限がありません"],
};

const AI_ERRORS: Record<string, string> = {
  auth: "AIのキーが使えません。コタムにご連絡ください",
  billing: "AIのクレジット残高が足りません。コタムにご連絡ください",
  rate_limited: "AIの利用上限に達しました。少し待ってからもう一度お試しください",
  timeout: "時間内におすすめを作れませんでした。もう一度お試しください",
  truncated: "おすすめを作れませんでした（AIの返事が途中で切れました）。もう一度お試しください",
  parse: "おすすめを作れませんでした（AIの返事を読み取れませんでした）。もう一度お試しください",
  refused: "おすすめを作れませんでした（AIが断りました）。もう一度お試しください",
};

/** 下調べとAIの上限。関数の上限（300秒）の中で保存と記録の時間を残す */
export const TIMEOUT_MS = 240_000;
/** 下調べは長くても待たずに、ヒアリングだけで作る */
export const RESEARCH_TIMEOUT_MS = 30_000;
/** AIに渡すヒアリングの合計の目安（受付の input_chars は8,000字まで） */
export const MAX_HEARING_CHARS = 7000;
const SELL_KEY = "sell_now";

const cut = (s: string, n: number) => Array.from(s).slice(0, n).join("");

/**
 * AIに渡すヒアリング。答え終わった問いだけを入れ、今売りたいもの（上ほど売りたい）を足す。
 * 合計が MAX_HEARING_CHARS に収まるよう、1つの答えの長さをそろえて切る
 */
export function hearingForPrompt(answers: Record<string, HearingAnswer>, sellNames: string[]): HearingForPrompt {
  const done = HEARING_QUESTIONS.filter((q) => isAnswerDone(q, answers[q.id]));
  for (let limit = 2000; limit >= 50; limit = Math.floor(limit * 0.8)) {
    const hearing: HearingForPrompt = {};
    for (const q of done) {
      const a = answers[q.id]!;
      hearing[q.id] = {
        question: q.label,
        answer: cut(a.text.trim(), limit),
        followUps: a.followUps.filter((f) => f.answer.trim()).map((f) => ({ question: f.question, answer: cut(f.answer.trim(), Math.floor(limit / 2)) })),
      };
    }
    if (sellNames.length) hearing[SELL_KEY] = { question: "今売りたいもの（上ほど売りたい）", answer: sellNames.join("\n"), followUps: [] };
    if (JSON.stringify(hearing).length <= MAX_HEARING_CHARS) return hearing;
  }
  // ここまで切っても長いときは、今売りたいものと必須の問いだけにする
  const hearing: HearingForPrompt = {};
  for (const q of done.slice(0, 4)) hearing[q.id] = { question: q.label, answer: cut(answers[q.id]!.text.trim(), 50), followUps: [] };
  return hearing;
}

/** 下調べで調べる言葉の候補。売りたいもの（上から）、売りたいサービスの項目の順 */
export function researchSeeds(answers: Record<string, HearingAnswer>, sellNames: string[]): string[] {
  const services = (answers.services?.text ?? "")
    .split(/\n|、|，|,|／|\//)
    .map((s) => s.replace(/^例：|^[-・\s]+/, "").trim())
    .filter(Boolean);
  return [...sellNames, ...services];
}

/** サンプル（AIは未接続）の提案。画面と同じ作り方で、ヒアリングの言葉から作る */
function sampleSet(answers: Record<string, HearingAnswer>): ParsedProposal[] {
  return sampleProposals(answers).map((p) => ({
    pillar: { keyword: p.pillar.keyword, question: p.pillar.question },
    clusters: p.clusters.map((c) => ({ keyword: c.keyword, question: c.question })),
    reasons: p.reasons,
    why: p.why,
  }));
}

export interface ProposalDeps {
  user: SupabaseClient;
  admin: SupabaseClient;
  provider: AiProvider;
  isSample: boolean;
  rakko: RakkoClient | null;
}

export async function runKeywordProposal(deps: ProposalDeps, req: { organizationId: string; idempotencyKey: string }): Promise<ProposalOutcome> {
  const { user: db, admin } = deps;
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");

  // 読み込みは利用者の権限（RLS）。他社の答えは読めない
  const [{ data: answerRows, error: e1 }, { data: sellRows, error: e2 }] = await Promise.all([
    db.from("hearing_answers").select("question_id, text, follow_ups, is_draft").eq("organization_id", req.organizationId),
    db.from("sell_items").select("name").eq("organization_id", req.organizationId).order("rank"),
  ]);
  if (e1 || e2) return fail(500, "provider_error", "会社のことを読み込めませんでした。もう一度お試しください");
  const answers: Record<string, HearingAnswer> = {};
  for (const r of (answerRows ?? []) as HearingAnswerRow[]) answers[r.question_id] = answerFromDb(r);
  if (!canPropose(answers)) return fail(400, "invalid_input", "先に、お仕事・売りたいサービス・お客様・地域の4つに答えてください");
  const sellNames = ((sellRows ?? []) as { name: string }[]).map((x) => x.name);
  const hearing = hearingForPrompt(answers, sellNames);
  const inputChars = Math.min(JSON.stringify(hearing).length, 8000);

  const { data: run, error: startError } = await db
    .rpc("start_keyword_proposal", { p_organization_id: req.organizationId, p_idempotency_key: req.idempotencyKey, p_input_chars: inputChars })
    .single<{ id: string; status: string }>();
  if (startError || !run) {
    const code = Object.keys(START_ERRORS).find((k) => startError?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  // 同じキーの再送で、すでにできていればそれを返す
  if (run.status === "succeeded") {
    const { data: done } = await admin.from("keyword_proposals").select("*").eq("run_id", run.id).maybeSingle();
    if (done) return { ok: true, set: toSet(done) };
  }
  const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
  if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  let rakkoCredit = 0;
  let status: "succeeded" | "failed" = "failed";
  let reason = "other";
  let saved: ProposalSet | null = null;
  try {
    let proposals: ParsedProposal[];
    let research: ResearchForPrompt[] = [];
    if (deps.isSample) {
      // キーが無いときは下調べもしない（クレジットを使わない）
      proposals = sampleSet(answers);
    } else {
      if (deps.rakko) {
        try {
          // 持ち時間を過ぎたら、そこまでに取れた下調べ（とクレジット）で進める
          const r = await collectResearch(deps.rakko, researchSeeds(answers, sellNames), signal, AbortSignal.timeout(RESEARCH_TIMEOUT_MS));
          research = r.research;
          rakkoCredit = r.consumedCredit;
          // 理由の種類だけを記録する（言葉やキーは出さない）
          if (r.problems.length) console.error("keyword research partial", { runId: run.id, codes: [...new Set(r.problems.map((p) => p.code))] });
        } catch (e) {
          if (signal.aborted) throw e;
          console.error("keyword research failed", { runId: run.id, reason: e instanceof Error ? e.name : "other" });
        }
      }
      proposals = await askProposals(deps.provider, hearing, research, signal, (u) => {
        usage = { inputTokens: usage.inputTokens + u.inputTokens, outputTokens: usage.outputTokens + u.outputTokens };
      });
    }
    const { data: row, error } = await admin
      .from("keyword_proposals")
      .insert({ organization_id: req.organizationId, run_id: run.id, proposals, is_sample: deps.isSample, used_research: research.length > 0, requested_by: auth.user.id })
      .select("*")
      .single();
    if (error || !row) throw new Error("proposal insert failed");
    saved = toSet(row);
    status = "succeeded";
  } catch (e) {
    reason = failureReason(e, signal);
    console.error("keyword proposal failed", { runId: run.id, reason });
  }
  // 結果の記録は費用の集計・月の回数・「実行中」の解除に使うため、失敗したらやり直す（src/lib/generation/server.ts と同じ）
  let recorded = false;
  for (let attempt = 0; attempt < 3 && !recorded; attempt++) {
    const { error: finishError } = await admin.rpc("finish_generation", {
      p_run_id: run.id,
      p_status: status,
      p_usage: { ...usage, rakko_credit: rakkoCredit },
      p_cost_yen: Math.round(estimateCostYen(usage, deps.provider.name) * 100) / 100,
      p_error_code: status === "failed" ? (reason === "timeout" ? "timeout" : "provider_error") : null,
    });
    recorded = !finishError;
  }
  if (!recorded) console.error("keyword proposal finish not recorded", { runId: run.id, status });
  if (saved) return { ok: true, set: saved };
  return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", AI_ERRORS[reason] ?? "おすすめを作れませんでした。もう一度お試しください");
}

/** 返事の形が違ったときは1回だけ聞き直す */
async function askProposals(provider: AiProvider, hearing: HearingForPrompt, research: ResearchForPrompt[], signal: AbortSignal, onUsage: (u: AiUsage) => void): Promise<ParsedProposal[]> {
  const user = buildProposalPrompt(hearing, research);
  for (let attempt = 0; ; attempt++) {
    const res = await provider.complete({ kind: "keyword_proposal", system: PROPOSAL_SYSTEM_PROMPT, user, maxOutputTokens: 6000, signal });
    onUsage(res.usage);
    try {
      return parseProposals(res.text);
    } catch (e) {
      if (!(e instanceof ParseError) || attempt >= 1) throw e;
    }
  }
}

export function toSet(row: Record<string, unknown>): ProposalSet {
  return {
    id: row.id as string,
    proposals: row.proposals as ParsedProposal[],
    isSample: row.is_sample === true,
    usedResearch: row.used_research === true,
    createdAt: row.created_at as string,
  };
}

