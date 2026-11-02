// ヒアリングのAI（サーバー側だけで使う。docs/DECISIONS.md 2026-11-02「コタムを待たずに書き始める」）。
// 1. 深掘り：お客様の答えを読み、聞く理由を添えて、かなり深いところまで1問ずつ聞き返す
// 2. 会社の情報：ヒアリングの答えから会社プロフィールをまとめ、お客様が確かめる（確かめるまで記事には使わない）
// 受付（start_hearing_ai）→ 実行の確保 → AI → 結果の記録、の順。答えはログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { buildExamplesPrompt, buildFollowUpPrompt, buildProfilePrompt, EXAMPLES_SYSTEM_PROMPT, FOLLOWUP_SYSTEM_PROMPT, parseExamples, parseFollowUpWithWhy, parseProfile, PROFILE_SYSTEM_PROMPT } from "@/lib/ai/growthPrompts";
import { FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION, QUESTIONS } from "@/mock/data";
import { sampleQuestionExamples } from "./questionExamples";
import { estimateCostYen } from "@/lib/ai/cost";
import { failureReason, type AiProvider, type AiUsage } from "@/lib/ai/provider";
import { HEARING_QUESTIONS, MAX_AI_DEEP_DIVES, MAX_ANSWER, REQUIRED_FOR_PROPOSALS, isAnswerDone, nextDeepDive, type HearingAnswer } from "@/prototype/growth";
import { answerFromDb, type HearingAnswerRow } from "@/prototype/remote";
import type { CompanyProfile } from "@/types/domain";
import { hearingForPrompt } from "./proposals";

type Fail = { ok: false; status: number; code: string; message: string };
const fail = (status: number, code: string, message: string): Fail => ({ ok: false, status, code, message });

const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "AIがほかの作業をしています。少し待ってからもう一度お試しください"],
  limit_reached: [429, "今月、AIに聞き返してもらえる回数に達しました。コタムにご相談ください"],
  budget_exceeded: [429, "今月はAIを使えなくなっています。コタムにご連絡ください"],
  invalid_input: [400, "入力の内容を確認してください"],
  forbidden: [403, "この会社のヒアリングをする権限がありません"],
};

const AI_ERRORS: Record<string, string> = {
  auth: "AIのキーが使えません。コタムにご連絡ください",
  billing: "AIのクレジット残高が足りません。コタムにご連絡ください",
  rate_limited: "AIの利用上限に達しました。少し待ってからもう一度お試しください",
  timeout: "時間内に終わりませんでした。もう一度お試しください",
};

/** 深掘りは短い返事なので、待ち時間を短くする */
export const FOLLOWUP_TIMEOUT_MS = 60_000;
export const PROFILE_TIMEOUT_MS = 120_000;

export interface HearingDeps {
  user: SupabaseClient;
  admin: SupabaseClient;
  provider: AiProvider;
  isSample: boolean;
}

/** 受付と実行の確保。AIを使う前の共通部分 */
async function begin(deps: HearingDeps, organizationId: string, idempotencyKey: string, inputChars: number) {
  const { user: db, admin } = deps;
  const { data: run, error } = await db
    .rpc("start_hearing_ai", { p_organization_id: organizationId, p_idempotency_key: idempotencyKey, p_input_chars: Math.min(inputChars, 8000) })
    .single<{ id: string; status: string }>();
  if (error || !run) {
    const code = Object.keys(START_ERRORS).find((k) => error?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  if (run.status !== "queued") return fail(409, "busy", START_ERRORS.busy[1]);
  const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
  if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);
  const finish = async (status: "succeeded" | "failed", usage: AiUsage, reason: string | null) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error: e } = await admin.rpc("finish_generation", {
        p_run_id: run.id,
        p_status: status,
        p_usage: usage,
        p_cost_yen: Math.round(estimateCostYen(usage, deps.provider.name) * 100) / 100,
        p_error_code: status === "failed" ? (reason === "timeout" ? "timeout" : "provider_error") : null,
      });
      if (!e) return;
    }
    console.error("hearing ai finish not recorded", { runId: run.id, status });
  };
  return { ok: true as const, runId: run.id, finish };
}

async function requireUser(db: SupabaseClient) {
  const { data } = await db.auth.getUser();
  return data.user;
}

export interface FollowUpRequest {
  organizationId: string;
  questionId: string;
  answer: Pick<HearingAnswer, "text" | "followUps">;
  idempotencyKey: string;
}

/** 深掘りの質問を1つ作る。もう十分なら null */
export async function runHearingFollowUp(deps: HearingDeps, req: FollowUpRequest): Promise<{ ok: true; followUp: { question: string; why: string; example: string } | null } | Fail> {
  if (!(await requireUser(deps.user))) return fail(401, "session_expired", "ログインの有効期限が切れました");
  const q = HEARING_QUESTIONS.find((x) => x.id === req.questionId);
  const text = typeof req.answer?.text === "string" ? req.answer.text.trim() : "";
  const followUps = Array.isArray(req.answer?.followUps)
    ? req.answer.followUps
        .filter((f) => typeof f?.question === "string" && typeof f?.answer === "string")
        .map((f) => ({ question: f.question.slice(0, 200), answer: f.answer.slice(0, MAX_ANSWER) }))
    : [];
  if (!q || !text || text.length > MAX_ANSWER) return fail(400, "invalid_input", "入力の内容を確認してください");
  // 深掘りは1問につき決まった回数まで。飛ばした深掘り（空の答え）があれば、その問いではもう聞かない
  if (followUps.length >= MAX_AI_DEEP_DIVES || followUps.some((f) => !f.answer.trim())) return { ok: true, followUp: null };

  const input = { question: q.label, aio: q.aio, answer: text, followUps };
  const b = await begin(deps, req.organizationId, req.idempotencyKey, JSON.stringify(input).length);
  if (!b.ok) return b;
  const signal = AbortSignal.timeout(FOLLOWUP_TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  try {
    let followUp: { question: string; why: string; example: string } | null;
    if (deps.isSample) {
      // キーが無いときは、決まった深掘りを返す
      const question = nextDeepDive(q, { questionId: q.id, text, followUps });
      followUp = question ? { question, why: "", example: "" } : null;
    } else {
      const res = await deps.provider.complete({ kind: "hearing", system: FOLLOWUP_SYSTEM_PROMPT, user: buildFollowUpPrompt(input), maxOutputTokens: 600, signal });
      usage = res.usage;
      followUp = parseFollowUpWithWhy(res.text);
    }
    await b.finish("succeeded", usage, null);
    return { ok: true, followUp };
  } catch (e) {
    const reason = failureReason(e, signal);
    console.error("hearing follow-up failed", { runId: b.runId, reason });
    await b.finish("failed", usage, reason);
    return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", AI_ERRORS[reason] ?? "AIが聞き返せませんでした。このまま次へ進めます");
  }
}

/** ヒアリングの答えから会社の情報をまとめ、会社に保存する（確かめるまで記事には使わない） */
export async function runProfileFromHearing(deps: HearingDeps, req: { organizationId: string; idempotencyKey: string }): Promise<{ ok: true; profile: CompanyProfile } | Fail> {
  const { user: db, admin } = deps;
  const user = await requireUser(db);
  if (!user) return fail(401, "session_expired", "ログインの有効期限が切れました");
  // 会社の情報を作れるのは、その会社のお客様（RLSで自社の答えだけが読める）
  const { data: membership } = await db.from("memberships").select("role").eq("user_id", user.id).eq("organization_id", req.organizationId).is("revoked_at", null).maybeSingle();
  if (membership?.role !== "client_member") return fail(403, "forbidden", "会社の情報を作れるのは、会社の担当の方です");
  const { data: rows, error } = await db.from("hearing_answers").select("*").eq("organization_id", req.organizationId);
  if (error) return fail(500, "provider_error", "会社のことを読み込めませんでした。もう一度お試しください");
  const answers: Record<string, HearingAnswer> = {};
  for (const r of (rows ?? []) as HearingAnswerRow[]) answers[r.question_id] = answerFromDb(r);
  const ready = REQUIRED_FOR_PROPOSALS.every((id) => {
    const q = HEARING_QUESTIONS.find((x) => x.id === id);
    return !!q && isAnswerDone(q, answers[id]);
  });
  if (!ready) return fail(400, "invalid_input", "先に「会社のことを教える」で、お仕事・売りたいもの・お客様・地域の4つに答えてください");
  const hearing = hearingForPrompt(answers, []);

  const b = await begin(deps, req.organizationId, req.idempotencyKey, JSON.stringify(hearing).length);
  if (!b.ok) return b;
  const signal = AbortSignal.timeout(PROFILE_TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  try {
    let profile: CompanyProfile;
    if (deps.isSample) {
      const t = (id: string) => answers[id]?.text.trim() ?? "";
      profile = {
        business: [t("business"), t("area") && `地域：${t("area")}`].filter(Boolean).join("　"),
        targetCustomers: t("customers"),
        strengths: t("strengths"),
        tone: "ですます調。専門用語には短い説明を添える",
        bannedExpressions: t("avoid") || "根拠を示せない言い切り（業界最安・絶対に など）",
        contact: "",
      };
    } else {
      const res = await deps.provider.complete({ kind: "hearing", system: PROFILE_SYSTEM_PROMPT, user: buildProfilePrompt(hearing), maxOutputTokens: 2000, signal });
      usage = res.usage;
      profile = parseProfile(res.text);
    }
    // 保存はサーバー（service role）。お客様が確かめるまで profile_approved_at は空にしておく
    const { error: saveError } = await admin.from("organizations").update({ profile, profile_approved_at: null }).eq("id", req.organizationId);
    if (saveError) throw new Error("profile update failed");
    await b.finish("succeeded", usage, null);
    return { ok: true, profile };
  } catch (e) {
    const reason = failureReason(e, signal);
    console.error("profile from hearing failed", { runId: b.runId, reason });
    await b.finish("failed", usage, reason);
    return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", AI_ERRORS[reason] ?? "会社の情報をまとめられませんでした。もう一度お試しください");
  }
}

/**
 * 記事の質問の記入例を、その会社の情報に合わせて作り、会社の情報（profile.questionExamples）に残す。
 * すでにあればそれを返す。会社の情報が無ければ作らない
 */
export async function runQuestionExamples(deps: HearingDeps, req: { organizationId: string; idempotencyKey: string }): Promise<{ ok: true; examples: Record<string, string> } | Fail> {
  const { user: db, admin } = deps;
  if (!(await requireUser(db))) return fail(401, "session_expired", "ログインの有効期限が切れました");
  const { data: org, error } = await db.from("organizations").select("profile").eq("id", req.organizationId).maybeSingle();
  if (error || !org) return fail(404, "not_found", "会社が見つかりません");
  const profile = org.profile as CompanyProfile | null;
  if (!profile?.business) return fail(400, "invalid_input", "先に会社の情報を作ってください");
  if (profile.questionExamples && Object.keys(profile.questionExamples).length) return { ok: true, examples: profile.questionExamples };

  const questions = [...QUESTIONS, FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION].map((q) => ({ id: q.id, label: q.label }));
  const { questionExamples: _old, ...forPrompt } = profile;
  void _old;
  const b = await begin(deps, req.organizationId, req.idempotencyKey, JSON.stringify({ forPrompt, questions }).length);
  if (!b.ok) return b;
  const signal = AbortSignal.timeout(FOLLOWUP_TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  try {
    let examples: Record<string, string>;
    if (deps.isSample) examples = sampleQuestionExamples(profile);
    else {
      const res = await deps.provider.complete({ kind: "hearing", system: EXAMPLES_SYSTEM_PROMPT, user: buildExamplesPrompt(forPrompt, questions), maxOutputTokens: 1500, signal });
      usage = res.usage;
      examples = parseExamples(res.text, questions.map((q) => q.id));
    }
    // 記入例だけを足す。確かめ済みかどうか（profile_approved_at）は変えない
    const { error: saveError } = await admin.from("organizations").update({ profile: { ...profile, questionExamples: examples } }).eq("id", req.organizationId);
    if (saveError) throw new Error("examples update failed");
    await b.finish("succeeded", usage, null);
    return { ok: true, examples };
  } catch (e) {
    const reason = failureReason(e, signal);
    console.error("question examples failed", { runId: b.runId, reason });
    await b.finish("failed", usage, reason);
    return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", AI_ERRORS[reason] ?? "記入例を作れませんでした");
  }
}
