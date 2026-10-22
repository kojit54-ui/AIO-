// 生成の実行（サーバー側だけで使う）。受付 → 実行の確保 → AI → 版の保存 → 結果の記録、の順に進める。
// 受付の判定（二重実行・上限・予算）はDBの start_generation が行う（docs/DATA.md generation_runs）。
// 記事本文や回答はログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateCostYen } from "@/lib/ai/cost";
import { buildGenerationInput, type GenerationContext, InputError } from "@/lib/ai/input";
import { AiProviderError, type AiProvider, generateBody, generateOutline } from "@/lib/ai/provider";
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

const fail = (status: number, code: string, message: string): GenerationOutcome => ({ ok: false, status, code, message });

/** start_generation の例外メッセージ（エラーコード）を画面の応答にする */
const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "同じ会社で文章を作っている途中です。終わってからもう一度お試しください"],
  limit_reached: [429, "今月の生成回数の上限に達しました。コタムにご相談ください"],
  budget_exceeded: [429, "今月は新しい文章を作れなくなっています。コタムにご連絡ください"],
  invalid_input: [400, "入力の内容を確認してください"],
  forbidden: [403, "この記事で文章を作る権限がありません"],
};

export const TIMEOUT_MS = 240_000;

export async function runGeneration(
  deps: { user: SupabaseClient; admin: SupabaseClient; provider: AiProvider; isSample: boolean },
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
  const answers = req.kind === "outline" || !base?.answers.length ? draft : base.answers;

  const ctx: GenerationContext = {
    organization: org,
    note: noteRes.data ? toCoachingNote(noteRes.data) : undefined,
    theme,
    questions: [...QUESTIONS, FOLLOW_UP_QUESTION],
    answers,
    referenceArticles: (refsRes.data ?? []).map(toReferenceArticle),
  };
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
  try {
    const signal = AbortSignal.timeout(TIMEOUT_MS);
    const common = { sample: deps.isSample, provider: deps.provider.name, kind: req.kind };
    let version: Record<string, unknown>;
    let checks: { excerpt: string; kind: string }[] = [];
    if (req.kind === "outline") {
      const r = await generateOutline(deps.provider, ctx, signal);
      usage = r.usage;
      version = {
        title: base?.title || theme.title,
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
      const r = await generateBody(deps.provider, ctx, headings, { signal });
      usage = r.usage;
      checks = r.factChecks;
      version = {
        title: base?.title || r.titleCandidates[0] || theme.title,
        title_candidates: r.titleCandidates.length ? r.titleCandidates : (base?.titleCandidates ?? []),
        outline: headings.map((heading) => ({ heading })),
        body: r.body,
        generation_settings: { ...common, needs_info: r.needsInfo, image_suggestions: r.imageSuggestions },
      };
    }
    const cost = estimateCostYen(usage);

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
    await finish("failed", { usage, cost: estimateCostYen(usage), error: code });
    // 原因の種類だけを記録する（本文や回答は出さない）
    console.error("generation failed", { runId: run.id, code, reason: e instanceof AiProviderError ? e.code : e instanceof ParseError ? "parse" : "other" });
    if (code === "timeout") return fail(504, "timeout", "時間内に文章を作れませんでした。入力内容は残っています");
    return fail(502, code, "文章を作れませんでした。入力内容は残っています");
  }
}
