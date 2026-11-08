// AIOのチェックの実行（サーバー側だけで使う。docs/DECISIONS.md 2026-11-02）。
// チェック：点検役が今の版を見て、項目ごとの結果と聞き返しの質問を aio_checks に残す。
// 反映：書き手が聞き返しの答えを本文に書き込み、新しい版を作る。どちらも生成の受付（start_generation の aio_check）を通す。
// 記事本文や回答はログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { buildAioApplyPrompt, buildAioCheckPrompt, parseAioCheck, AIO_APPLY_SYSTEM_PROMPT, AIO_CHECK_SYSTEM_PROMPT } from "@/lib/ai/aioCheckPrompt";
import { estimateCostYen } from "@/lib/ai/cost";
import { buildGenerationInput, countedInputChars, InputError } from "@/lib/ai/input";
import { type AiProvider, type AiUsage, failureReason } from "@/lib/ai/provider";
import { parseBodyResult } from "@/lib/ai/prompt";
import { fromArticle, toAioCheck, toArticle } from "@/lib/remote/mapping";
import { applyAction } from "@/lib/workflow";
import { loadGenerationContext, TIMEOUT_MS } from "./server";

type Outcome<T> = ({ ok: true } & T) | { ok: false; status: number; code: string; message: string };
const fail = (status: number, code: string, message: string) => ({ ok: false as const, status, code, message });

const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "同じ会社でAIが作業している途中です。終わってからもう一度お試しください"],
  limit_reached: [429, "この記事でAIOのチェックができる回数を使い切りました。コタムにご相談ください"],
  budget_exceeded: [429, "今月はAIを使えなくなっています。コタムにご連絡ください"],
  invalid_input: [400, "入力の内容を確認してください"],
  forbidden: [403, "この記事でAIOのチェックをする権限がありません"],
};

const FAIL_MESSAGES: Record<string, string> = {
  auth: "チェック役のAIのキーが使えません。コタムにご連絡ください",
  billing: "AIのクレジット残高が足りません。コタムにご連絡ください",
  rate_limited: "AIの利用上限に達しました。少し待ってからもう一度お試しください",
  timeout: "時間内に終わりませんでした。もう一度お試しください",
};

interface Deps {
  user: SupabaseClient;
  admin: SupabaseClient;
  provider: AiProvider;
  isSample: boolean;
}

/** 記事・権限・材料を読み、生成の受付をして実行を確保する。AIを呼ぶ前の共通部分 */
async function begin(deps: Deps, articleId: string, idempotencyKey: string) {
  const { user: db, admin } = deps;
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");
  const { data: articleRow } = await db.from("articles").select("*").eq("id", articleId).maybeSingle();
  if (!articleRow) return fail(404, "not_found", "記事が見つかりません");
  const article = toArticle(articleRow);
  const { data: membership } = await db
    .from("memberships")
    .select("role")
    .eq("user_id", auth.user.id)
    .eq("organization_id", article.organizationId)
    .is("revoked_at", null)
    .maybeSingle();
  if (membership?.role !== "client_member") return fail(403, "forbidden", "AIOのチェックは会社の担当の方が行います");

  const loaded = await loadGenerationContext(db, articleRow, "body");
  if (!loaded.ok) return loaded;
  if (!loaded.base || loaded.base.body.length === 0) return fail(400, "invalid_input", "本文ができてからチェックできます");
  let inputChars: number;
  try {
    inputChars = countedInputChars(buildGenerationInput(loaded.ctx));
  } catch (e) {
    if (e instanceof InputError) return fail(400, "invalid_input", e.message);
    throw e;
  }
  const { data: run, error: startError } = await db
    .rpc("start_generation", { p_article_id: articleId, p_kind: "aio_check", p_idempotency_key: idempotencyKey, p_input_chars: inputChars })
    .single<{ id: string; status: string; result_version_id: string | null }>();
  if (startError || !run) {
    const code = Object.keys(START_ERRORS).find((k) => startError?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  const repeated = run.status === "succeeded";
  if (run.status === "failed") return fail(502, "provider_error", "うまくいきませんでした。もう一度お試しください");
  if (!repeated) {
    const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
    if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);
  }
  const finish = async (status: "succeeded" | "failed", usage: AiUsage, error: string | null, versionId: string | null) => {
    const { error: e } = await admin.rpc("finish_generation", {
      p_run_id: run.id,
      p_status: status,
      p_usage: usage,
      p_cost_yen: Math.round(estimateCostYen(usage, deps.provider.name) * 100) / 100,
      p_error_code: error,
      p_result_version_id: versionId,
    });
    if (e) console.error("aio check finish not recorded", { runId: run.id, status });
  };
  return { ok: true as const, userId: auth.user.id, article, loaded, run, repeated, finish };
}

function failed(e: unknown, signal: AbortSignal, runId: string, what: string) {
  const reason = failureReason(e, signal);
  console.error(`${what} failed`, { runId, reason });
  return fail(reason === "timeout" ? 504 : 502, reason === "timeout" ? "timeout" : "provider_error", FAIL_MESSAGES[reason] ?? "うまくいきませんでした。もう一度お試しください");
}

/** AIOのチェックを実施する。今の版を点検役が見て、結果と聞き返しの質問を残す */
export async function runAioCheck(deps: Deps, req: { articleId: string; idempotencyKey: string }): Promise<Outcome<{ checkId: string }>> {
  const b = await begin(deps, req.articleId, req.idempotencyKey);
  if (!b.ok) return b;
  const { admin } = deps;
  const base = b.loaded.base!;
  if (b.repeated) {
    const { data } = await admin.from("aio_checks").select("id").eq("version_id", base.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (data) return { ok: true, checkId: data.id };
  }
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  try {
    const { count } = await admin.from("fact_checks").select("id", { count: "exact", head: true }).eq("version_id", base.id).eq("status", "unchecked");
    const input = buildGenerationInput(b.loaded.ctx);
    const res = await deps.provider.complete({
      kind: "aio_check",
      system: AIO_CHECK_SYSTEM_PROMPT,
      user: buildAioCheckPrompt(input, { title: base.title, body: base.body }, count ?? 0),
      maxOutputTokens: 4000,
      signal,
    });
    usage = res.usage;
    const r = parseAioCheck(res.text);
    const { data: saved, error } = await admin
      .from("aio_checks")
      .insert({
        article_id: b.article.id,
        organization_id: b.article.organizationId,
        version_id: base.id,
        status: r.questions.length ? "asking" : "done",
        summary: r.summary,
        items: r.items,
        questions: r.questions,
        is_sample: deps.isSample,
        created_by: b.userId,
      })
      .select("*")
      .single();
    if (error || !saved) throw new Error("aio check insert failed");
    await b.finish("succeeded", usage, null, base.id);
    return { ok: true, checkId: toAioCheck(saved).id };
  } catch (e) {
    await b.finish("failed", usage, failureReason(e, signal) === "timeout" ? "timeout" : "provider_error", null);
    return failed(e, signal, b.run.id, "aio check");
  }
}

/** 聞き返しの答えを本文に反映し、新しい版を作る。チェックは終わりにする */
export async function applyAioCheck(deps: Deps, req: { articleId: string; checkId: string; idempotencyKey: string }): Promise<Outcome<{ versionId: string }>> {
  const { user: db, admin } = deps;
  // チェックはお客様の権限で読む（他社のチェックは読めない）
  const { data: checkRow } = await db.from("aio_checks").select("*").eq("id", req.checkId).eq("article_id", req.articleId).maybeSingle();
  if (!checkRow) return fail(404, "not_found", "チェックが見つかりません");
  const check = toAioCheck(checkRow);
  if (check.status === "done" && check.resultVersionId) return { ok: true, versionId: check.resultVersionId };
  if (check.status !== "asking") return fail(409, "invalid_state", "このチェックは終わっています");

  const b = await begin(deps, req.articleId, req.idempotencyKey);
  if (!b.ok) return b;
  if (b.repeated && b.run.result_version_id) return { ok: true, versionId: b.run.result_version_id };
  const base = b.loaded.base!;
  if (base.id !== check.versionId) {
    await b.finish("failed", { inputTokens: 0, outputTokens: 0 }, "invalid_input", null);
    return fail(409, "conflict", "チェックの後に記事が直されました。もう一度チェックしてください");
  }
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  try {
    const input = buildGenerationInput(b.loaded.ctx);
    const res = await deps.provider.complete({
      kind: "rewrite",
      system: AIO_APPLY_SYSTEM_PROMPT,
      user: buildAioApplyPrompt(input, { title: base.title, body: base.body }, check.questions, check.answers),
      maxOutputTokens: 16000,
      signal,
    });
    usage = res.usage;
    const r = parseBodyResult(res.text);

    // 版の保存は本文の生成と同じく service role で行う。画像の提案と点検の結果は元の版から引き継ぐ
    const { data: baseRow } = await admin.from("article_versions").select("generation_settings").eq("id", base.id).single();
    const { data: last } = await admin.from("article_versions").select("version_no").eq("article_id", b.article.id).order("version_no", { ascending: false }).limit(1).maybeSingle();
    const { data: saved, error: saveError } = await admin
      .from("article_versions")
      .insert({
        article_id: b.article.id,
        organization_id: b.article.organizationId,
        version_no: (last?.version_no ?? 0) + 1,
        title: base.title,
        title_candidates: base.titleCandidates,
        outline: base.outline,
        body: r.body,
        answers: base.answers,
        parent_version_id: base.id,
        created_by: b.userId,
        generation_settings: { ...(baseRow?.generation_settings ?? {}), sample: deps.isSample, provider: deps.provider.name, kind: "aio_check", needs_info: r.needsInfo },
      })
      .select("id")
      .single();
    if (saveError || !saved) throw new Error("version insert failed");
    if (r.factChecks.length) {
      await admin.from("fact_checks").insert(r.factChecks.map((c) => ({ version_id: saved.id, organization_id: b.article.organizationId, excerpt: c.excerpt, kind: c.kind })));
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: fresh } = await admin.from("articles").select("*").eq("id", b.article.id).single();
      const current = toArticle(fresh);
      const next = applyAction(current, { type: "edit", newVersionId: saved.id }, "client_member", b.loaded.org.reviewPolicy);
      const { data: updated } = await admin.from("articles").update(fromArticle(next)).eq("id", b.article.id).eq("lock_version", current.lockVersion).select("id");
      if (updated?.length) break;
      if (attempt === 1) throw new Error("article update conflict");
    }
    await admin.from("aio_checks").update({ status: "done", result_version_id: saved.id }).eq("id", check.id);
    await b.finish("succeeded", usage, null, saved.id);
    return { ok: true, versionId: saved.id };
  } catch (e) {
    await b.finish("failed", usage, failureReason(e, signal) === "timeout" ? "timeout" : "provider_error", null);
    return failed(e, signal, b.run.id, "aio apply");
  }
}
