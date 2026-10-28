// 生成の実行（サーバー側だけで使う）。受付 → 実行の確保 → AI → 版の保存 → 結果の記録、の順に進める。
// 受付の判定（二重実行・上限・予算）はDBの start_generation が行う（docs/DATA.md generation_runs）。
// 記事本文や回答はログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateCostYen } from "@/lib/ai/cost";
import { buildGenerationInput, type GenerationContext, InputError } from "@/lib/ai/input";
import { AiProviderError, type AiProvider, type BodyRoles, type StepUsage, failureReason, generateImageIdeas, generateOutline, generateReviewedBody } from "@/lib/ai/provider";
import { ParseError } from "@/lib/ai/prompt";
import { fromArticle, fromMonth, toArticle, toCoachingNote, toOrganization, toReferenceArticle, toTheme, toVersion, currentMonthJst } from "@/lib/remote/mapping";
import { applyAction } from "@/lib/workflow";
import { FOLLOW_UP_QUESTION, QUESTIONS } from "@/mock/data";
import type { Answer } from "@/types/domain";

export type GenerationKindInput = "outline" | "body";

export interface GenerationRequest {
  articleId: string;
  kind: GenerationKindInput;
  headings: string[];
  idempotencyKey: string;
}

export type GenerationOutcome =
  | { ok: true; versionId: string }
  | { ok: false; status: number; code: string; message: string };

const fail = (status: number, code: string, message: string): Extract<GenerationOutcome, { ok: false }> => ({ ok: false, status, code, message });

/** start_generation の例外メッセージ（エラーコード）を画面の応答にする */
const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "同じ会社で文章を作っている途中です。終わってからもう一度お試しください"],
  limit_reached: [429, "今月の生成回数の上限に達しました。コタムにご相談ください"],
  budget_exceeded: [429, "今月は新しい文章を作れなくなっています。コタムにご連絡ください"],
  invalid_input: [400, "入力の内容を確認してください"],
  forbidden: [403, "この記事で文章を作る権限がありません"],
};

/** 書き手の最初の1回の上限。点検・書き直し・画像の提案は OPTIONAL_TIMEOUT_MS で打ち切り、保存の時間を残す（関数の上限は300秒） */
export const TIMEOUT_MS = 240_000;
export const OPTIONAL_TIMEOUT_MS = 270_000;

const sumUsage = (steps: StepUsage[]) => ({
  inputTokens: steps.reduce((n, s) => n + s.usage.inputTokens, 0),
  outputTokens: steps.reduce((n, s) => n + s.usage.outputTokens, 0),
});
const sumCost = (steps: StepUsage[]) => Math.round(steps.reduce((n, s) => n + estimateCostYen(s.usage, s.provider), 0) * 100) / 100;

/**
 * 版のタイトル。利用者が直したタイトルは残し、まだテーマの文のままならAIのタイトル案の1つ目を使う。
 * テーマの文は「読者の悩み」まで含む長い説明のことがあり、そのまま記事のタイトルにすると読みにくい
 */
export function pickTitle(current: string | undefined, themeTitle: string, candidates: string[]): string {
  const edited = current?.trim() && current.trim() !== themeTitle.trim();
  if (edited) return current!.trim();
  return candidates.find((c) => c.trim())?.trim() ?? current?.trim() ?? themeTitle;
}

export async function runGeneration(
  deps: { user: SupabaseClient; admin: SupabaseClient; provider: AiProvider; isSample: boolean; roles?: Omit<BodyRoles, "writer"> },
  req: GenerationRequest,
): Promise<GenerationOutcome> {
  const { user: db, admin } = deps;
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");
  const userId = auth.user.id;

  // 読み込みは利用者として行い、RLSで自社の行だけにする
  const { data: articleRow } = await db.from("articles").select("*").eq("id", req.articleId).maybeSingle();
  if (!articleRow) return fail(404, "not_found", "記事が見つかりません");
  const article = toArticle(articleRow);
  const orgId = article.organizationId;

  const { data: membership } = await db
    .from("memberships")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", orgId)
    .is("revoked_at", null)
    .maybeSingle();
  if (membership?.role !== "client_member") return fail(403, "forbidden", "文章を作れるのは顧客担当者です");

  const loaded = await loadGenerationContext(db, articleRow, req.kind);
  if (!loaded.ok) return loaded;
  const { ctx, org, theme, base, answers } = loaded;
  let inputChars: number;
  try {
    inputChars = JSON.stringify(buildGenerationInput(ctx)).length;
  } catch (e) {
    if (e instanceof InputError) return fail(400, "invalid_input", e.message);
    throw e;
  }

  // 受付（利用者のセッションで呼び、DBが所属・二重実行・上限・予算を判定する）
  const { data: run, error: startError } = await db
    .rpc("start_generation", { p_article_id: req.articleId, p_kind: req.kind, p_idempotency_key: req.idempotencyKey, p_input_chars: inputChars })
    .single<{ id: string; status: string; result_version_id: string | null; error_code: string | null }>();
  if (startError || !run) {
    const code = Object.keys(START_ERRORS).find((k) => startError?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  if (run.status === "succeeded" && run.result_version_id) return { ok: true, versionId: run.result_version_id };
  if (run.status === "failed") return fail(502, run.error_code ?? "provider_error", "文章を作れませんでした。入力内容は残っています");

  // 同じ受付を2つのリクエストが同時に実行しないよう、queued → running を1回だけ確保する
  const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
  if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);

  // 結果の記録は費用の集計と「実行中」の解除に使うため、失敗したらやり直す。
  // それでも記録できなければログに残す（実行中のままの受付は generation_timeout_seconds 後に失敗扱いになる）
  const finish = async (status: "succeeded" | "failed", extra: { usage?: unknown; cost?: number; error?: string; versionId?: string }) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error } = await admin.rpc("finish_generation", {
        p_run_id: run.id,
        p_status: status,
        p_usage: extra.usage ?? {},
        p_cost_yen: extra.cost ?? 0,
        p_error_code: extra.error ?? null,
        p_result_version_id: extra.versionId ?? null,
      });
      if (!error) return;
    }
    console.error("generation finish not recorded", { runId: run.id, status });
  };

  let usage = { inputTokens: 0, outputTokens: 0 };
  let cost = 0;
  try {
    const signal = AbortSignal.timeout(TIMEOUT_MS);
    const optionalSignal = AbortSignal.timeout(OPTIONAL_TIMEOUT_MS);
    const common = { sample: deps.isSample, provider: deps.provider.name, kind: req.kind };
    let version: Record<string, unknown>;
    let checks: { excerpt: string; kind: string }[] = [];
    if (req.kind === "outline") {
      const r = await generateOutline(deps.provider, ctx, signal);
      usage = r.usage;
      cost = estimateCostYen(usage, deps.provider.name);
      version = {
        title: pickTitle(base?.title, theme.title, r.titleCandidates),
        title_candidates: r.titleCandidates,
        outline: r.outline,
        body: [],
        generation_settings: { ...common, needs_info: r.needsInfo },
      };
    } else {
      const headings = req.headings.map((h) => h.trim()).filter(Boolean);
      if (!headings.length) {
        await finish("failed", { error: "invalid_input" });
        return fail(400, "invalid_input", "見出しを1つ以上入れてください");
      }
      const roles = { writer: deps.provider, reviewer: deps.roles?.reviewer ?? deps.provider, imageIdeas: deps.roles?.imageIdeas ?? deps.provider };
      const r = await generateReviewedBody(roles, ctx, headings, { signal, optionalSignal });
      usage = sumUsage(r.steps);
      cost = sumCost(r.steps);
      checks = r.factChecks;
      version = {
        title: pickTitle(base?.title, theme.title, r.titleCandidates),
        title_candidates: r.titleCandidates.length ? r.titleCandidates : (base?.titleCandidates ?? []),
        outline: headings.map((heading) => ({ heading })),
        body: r.body,
        generation_settings: {
          ...common,
          needs_info: r.needsInfo,
          eyecatch: r.eyecatch,
          image_suggestions: r.imageSuggestions,
          review: r.review,
          steps: r.steps.map((s) => ({ step: s.step, provider: s.provider, ok: s.ok, ...(s.error ? { error: s.error } : {}) })),
        },
      };
    }

    // 版の保存はサーバー（service role）で行う。版番号は記事ごとの連番
    const { data: last } = await admin
      .from("article_versions")
      .select("version_no")
      .eq("article_id", article.id)
      .order("version_no", { ascending: false })
      .limit(1)
      .maybeSingle();
    const { data: saved, error: saveError } = await admin
      .from("article_versions")
      .insert({
        ...version,
        article_id: article.id,
        organization_id: orgId,
        version_no: (last?.version_no ?? 0) + 1,
        answers,
        parent_version_id: base?.id ?? null,
        created_by: userId,
      })
      .select("id")
      .single();
    if (saveError || !saved) throw new Error("version insert failed");
    if (checks.length) {
      await admin
        .from("fact_checks")
        .insert(checks.map((c) => ({ version_id: saved.id, organization_id: orgId, excerpt: c.excerpt, kind: c.kind })));
    }

    // 記事の状態は画面と同じ規則（src/lib/workflow.ts）で進める。読み直して1回だけやり直す
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: fresh } = await admin.from("articles").select("*").eq("id", article.id).single();
      const current = toArticle(fresh);
      const next = applyAction(current, { type: "edit", newVersionId: saved.id }, "client_member", org.reviewPolicy);
      const { data: updated } = await admin
        .from("articles")
        .update(fromArticle(next))
        .eq("id", article.id)
        .eq("lock_version", current.lockVersion)
        .select("id");
      if (updated?.length) break;
      if (attempt === 1) throw new Error("article update conflict");
    }

    await finish("succeeded", { usage, cost, versionId: saved.id });
    return { ok: true, versionId: saved.id };
  } catch (e) {
    const timedOut = e instanceof DOMException && (e.name === "TimeoutError" || e.name === "AbortError");
    const code = timedOut ? "timeout" : e instanceof InputError ? "invalid_input" : "provider_error";
    await finish("failed", { usage, cost: cost || estimateCostYen(usage, deps.provider.name), error: code });
    // 原因の種類だけを記録する（本文や回答は出さない）
    console.error("generation failed", { runId: run.id, code, reason: e instanceof AiProviderError ? e.code : e instanceof ParseError ? "parse" : "other" });
    if (code === "timeout") return fail(504, "timeout", "時間内に文章を作れませんでした。入力内容は残っています");
    return fail(502, code, "文章を作れませんでした。入力内容は残っています");
  }
}

/** 画像の提案の作り直しで、失敗の種類ごとに画面へ出す文 */
const IDEA_ERRORS: Record<string, string> = {
  auth: "画像の提案役のAIのキーが使えません。コタムにご連絡ください",
  rate_limited: "AIの利用上限に達しました。少し待ってからもう一度お試しください",
  timeout: "時間内に画像の提案を作れませんでした。もう一度お試しください",
  truncated: "画像の提案を作れませんでした（AIの返事が途中で切れました）。もう一度お試しください",
  parse: "画像の提案を作れませんでした（AIの返事を読み取れませんでした）。もう一度お試しください",
  refused: "画像の提案を作れませんでした（AIが断りました）。もう一度お試しください",
};

/**
 * 今の版の画像の提案（アイキャッチと見出しごと）だけを作り直し、その版に書き込む。本文は変えないので新しい版は作らない。
 * 本文を作ったときに画像の提案だけ失敗した版で使う。受付は画像の生成と同じ kind = image で数える（予算・二重実行の判定を通す）
 */
export async function runImageIdeas(
  deps: { user: SupabaseClient; admin: SupabaseClient; provider: AiProvider; isSample: boolean },
  req: { articleId: string; idempotencyKey: string },
): Promise<GenerationOutcome> {
  const { user: db, admin } = deps;
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");

  const { data: articleRow } = await db.from("articles").select("*").eq("id", req.articleId).maybeSingle();
  if (!articleRow) return fail(404, "not_found", "記事が見つかりません");
  const article = toArticle(articleRow);
  const { data: membership } = await db
    .from("memberships")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("organization_id", article.organizationId)
    .is("revoked_at", null)
    .maybeSingle();
  if (membership?.role !== "client_member") return fail(403, "forbidden", "画像の提案を作れるのは顧客担当者です");

  const loaded = await loadGenerationContext(db, articleRow, "body");
  if (!loaded.ok) return loaded;
  const { ctx, base } = loaded;
  const headings = (base?.body ?? []).flatMap((b) => (b.type === "heading" && b.level === 2 && b.text.trim() ? [b.text.trim()] : []));
  if (!base || !headings.length) return fail(400, "invalid_input", "先に本文を作ってください");
  let inputChars: number;
  try {
    inputChars = JSON.stringify(buildGenerationInput(ctx)).length;
  } catch (e) {
    if (e instanceof InputError) return fail(400, "invalid_input", e.message);
    throw e;
  }

  const { data: run, error: startError } = await db
    .rpc("start_generation", { p_article_id: req.articleId, p_kind: "image", p_idempotency_key: req.idempotencyKey, p_input_chars: inputChars })
    .single<{ id: string; status: string }>();
  if (startError || !run) {
    const code = Object.keys(START_ERRORS).find((k) => startError?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  if (run.status === "succeeded") return { ok: true, versionId: base.id };
  const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
  if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);

  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let usage = { inputTokens: 0, outputTokens: 0 };
  let status: "succeeded" | "failed" = "failed";
  let reason = "other";
  // 提供元の失敗の文（状態コードだけを含み、本文やキーは含まない）。原因を画面で確かめられるようにする
  let detail = "";
  try {
    const r = await generateImageIdeas(deps.provider, ctx, headings, { title: base.title, body: base.body }, signal);
    usage = r.usage;
    if (!r.eyecatch && !r.imageSuggestions.length) throw new ParseError("no ideas");
    const { data: row } = await admin.from("article_versions").select("generation_settings").eq("id", base.id).single();
    const { error } = await admin
      .from("article_versions")
      .update({ generation_settings: { ...(row?.generation_settings ?? {}), eyecatch: r.eyecatch, image_suggestions: r.imageSuggestions } })
      .eq("id", base.id);
    if (error) throw new Error("version update failed");
    status = "succeeded";
  } catch (e) {
    reason = failureReason(e, signal);
    if (e instanceof AiProviderError && e.code === "unavailable") detail = e.message;
    // 原因の種類だけを記録する（本文や回答は出さない）
    console.error("image ideas failed", { runId: run.id, reason });
  }
  const { error: finishError } = await admin.rpc("finish_generation", {
    p_run_id: run.id,
    p_status: status,
    p_usage: usage,
    p_cost_yen: Math.round(estimateCostYen(usage, deps.provider.name) * 100) / 100,
    p_error_code: status === "failed" ? (reason === "timeout" ? "timeout" : "provider_error") : null,
    p_result_version_id: status === "succeeded" ? base.id : null,
  });
  if (finishError) console.error("image ideas finish not recorded", { runId: run.id, status });
  if (status === "succeeded") return { ok: true, versionId: base.id };
  return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", IDEA_ERRORS[reason] ?? `画像の提案を作れませんでした（${detail || reason}）。もう一度お試しください`);
}

/** 生成に渡す材料（会社・今月の指導メモ・テーマ・使ってよい過去記事・回答）を読む。読み込みは呼び出し側の権限（RLS）で行う */
export async function loadGenerationContext(db: SupabaseClient, articleRow: Record<string, unknown>, kind: GenerationKindInput) {
  const article = toArticle(articleRow);
  const orgId = article.organizationId;
  const month = currentMonthJst();
  const [orgRes, themeRes, noteRes, refsRes, currentRes] = await Promise.all([
    db.from("organizations").select("*").eq("id", orgId).single(),
    db.from("themes").select("*").eq("id", article.themeId).single(),
    db.from("coaching_notes").select("*").eq("organization_id", orgId).eq("target_month", fromMonth(month)).maybeSingle(),
    db.from("reference_articles").select("*").eq("organization_id", orgId).eq("usable_for_ai", true),
    article.currentVersionId
      ? db.from("article_versions").select("*").eq("id", article.currentVersionId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  // 1つでも読めなければ、足りない材料で（費用をかけて）作らない
  if (orgRes.error || themeRes.error || noteRes.error || refsRes.error || currentRes.error || (article.currentVersionId && !currentRes.data)) return fail(500, "save_failed", "データを読み込めませんでした");
  const org = toOrganization(orgRes.data, 0);
  const theme = toTheme(themeRes.data);
  const base = currentRes.data ? toVersion(currentRes.data) : null;
  const draft = (articleRow.draft_answers as Answer[]) ?? [];
  // 見出し案は質問の回答（下書き）から、本文は今の版の回答から作る（まだ版が無ければ下書き）
  const answers = kind === "outline" || !base?.answers.length ? draft : base.answers;

  const ctx: GenerationContext = {
    organization: org,
    note: noteRes.data ? toCoachingNote(noteRes.data) : undefined,
    theme,
    questions: [...QUESTIONS, FOLLOW_UP_QUESTION],
    answers,
    referenceArticles: (refsRes.data ?? []).map(toReferenceArticle),
  };
  return { ok: true as const, ctx, org, theme, base, answers };
}
