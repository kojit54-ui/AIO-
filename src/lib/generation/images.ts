// 記事の画像の生成と一覧（サーバー側だけで使う）。docs/TASKS.md T4-1。
// 今の版の画像の提案（アイキャッチと見出しごと）から、ナノバナナ（Gemini の画像モデル）で画像を作り、
// Supabase Storage の非公開バケットに置く。画面には期限付きのURLだけを渡す。
// 受付の判定（二重実行・記事ごとの回数・予算）はDBの start_generation が行う（kind = image）。

import type { SupabaseClient } from "@supabase/supabase-js";
import { generateHeadingImage, type ImageProvider } from "@/lib/ai/images";
import { AiProviderError } from "@/lib/ai/provider";
import { toArticle, toVersion } from "@/lib/remote/mapping";
import type { ArticleImage, ImageIdea } from "@/types/domain";

export const IMAGE_BUCKET = "article-images";
/** 1枚の概算費用（円）。gemini-3.1-flash-image の1K画像は約 $0.067（docs/DECISIONS.md）。1ドル150円で切り上げ */
export const IMAGE_COST_YEN = 11;
/** 1回に作る枚数の上限（アイキャッチ＋見出し） */
export const MAX_IMAGES_PER_RUN = 8;
export const IMAGE_TIMEOUT_MS = 240_000;
const URL_SECONDS = 60 * 60;

export type ImageOutcome = { ok: true; images: ArticleImage[]; failed: number } | { ok: false; status: number; code: string; message: string };

const fail = (status: number, code: string, message: string): Extract<ImageOutcome, { ok: false }> => ({ ok: false, status, code, message });

const START_ERRORS: Record<string, [number, string]> = {
  busy: [409, "同じ会社で生成している途中です。終わってからもう一度お試しください"],
  limit_reached: [429, "この記事で画像を作れる回数の上限に達しました。コタムにご相談ください"],
  budget_exceeded: [429, "今月は新しい画像を作れなくなっています。コタムにご連絡ください"],
  forbidden: [403, "この記事で画像を作る権限がありません"],
  invalid_input: [400, "入力の内容を確認してください"],
};

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg" };

/** 今の版の画像の提案を、枠（eyecatch または見出し）ごとに並べる */
export function ideasBySlot(ideas: { eyecatch: ImageIdea | null; perHeading: ImageIdea[] } | undefined): { slot: string; idea: ImageIdea }[] {
  if (!ideas) return [];
  const out = [...(ideas.eyecatch ? [{ slot: "eyecatch", idea: ideas.eyecatch }] : []), ...ideas.perHeading.map((idea) => ({ slot: idea.heading, idea }))];
  // 同じ見出しが2回あっても1枠にする
  return out.filter((x, i) => x.slot && out.findIndex((y) => y.slot === x.slot) === i);
}

/** 記事の画像の一覧。読める行はRLSで絞り、URLは service role で期限付きのものを作る */
export async function listArticleImages(user: SupabaseClient, admin: SupabaseClient, articleId: string): Promise<ArticleImage[]> {
  const { data: rows } = await user.from("article_images").select("*").eq("article_id", articleId);
  if (!rows?.length) return [];
  const paths = rows.map((r) => r.storage_path as string);
  const bucket = admin.storage.from(IMAGE_BUCKET);
  const [{ data: view }, { data: download }] = await Promise.all([
    bucket.createSignedUrls(paths, URL_SECONDS),
    bucket.createSignedUrls(paths, URL_SECONDS, { download: true }),
  ]);
  return rows.flatMap((r, i) => {
    const url = view?.[i]?.signedUrl;
    if (!url) return [];
    return [{ slot: r.slot, alt: r.alt, url, downloadUrl: download?.[i]?.signedUrl ?? url, isSample: r.is_sample, createdAt: r.created_at }];
  });
}

let bucketReady = false;
async function ensureBucket(admin: SupabaseClient) {
  if (bucketReady) return;
  const { error } = await admin.storage.createBucket(IMAGE_BUCKET, { public: false, fileSizeLimit: "10MB" });
  // すでにあるときのエラーは無視する
  if (error && !/exist/i.test(error.message)) throw new Error("bucket create failed");
  bucketReady = true;
}

export async function runImageGeneration(
  deps: { user: SupabaseClient; admin: SupabaseClient; provider: ImageProvider; isSample: boolean },
  req: { articleId: string; slots: string[]; idempotencyKey: string },
): Promise<ImageOutcome> {
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
  if (membership?.role !== "client_member") return fail(403, "forbidden", "画像を作れるのは顧客担当者です");

  const { data: versionRow } = article.currentVersionId
    ? await db.from("article_versions").select("*").eq("id", article.currentVersionId).maybeSingle()
    : { data: null };
  const all = ideasBySlot(versionRow ? toVersion(versionRow).imageIdeas : undefined);
  if (!all.length) return fail(400, "invalid_input", "先に本文を作ってください（画像の提案がありません）");
  const targets = (req.slots.length ? all.filter((x) => req.slots.includes(x.slot)) : all).slice(0, MAX_IMAGES_PER_RUN);
  if (!targets.length) return fail(400, "invalid_input", "作る画像を選んでください");

  const inputChars = Math.min(8000, targets.reduce((n, t) => n + t.idea.imagePrompt.length, 0));
  const { data: run, error: startError } = await db
    .rpc("start_generation", { p_article_id: req.articleId, p_kind: "image", p_idempotency_key: req.idempotencyKey, p_input_chars: inputChars })
    .single<{ id: string; status: string }>();
  if (startError || !run) {
    const code = Object.keys(START_ERRORS).find((k) => startError?.message?.includes(k));
    if (code) return fail(START_ERRORS[code][0], code, START_ERRORS[code][1]);
    return fail(500, "provider_error", "受け付けられませんでした。もう一度お試しください");
  }
  if (run.status === "succeeded") return { ok: true, images: await listArticleImages(db, admin, req.articleId), failed: 0 };
  if (run.status === "failed") return fail(502, "provider_error", "画像を作れませんでした");
  const { data: claimed } = await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued").select("id");
  if (!claimed?.length) return fail(409, "busy", START_ERRORS.busy[1]);

  const finish = async (status: "succeeded" | "failed", made: number, error?: string) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const { error: e } = await admin.rpc("finish_generation", {
        p_run_id: run.id,
        p_status: status,
        p_usage: { images: made },
        p_cost_yen: deps.isSample ? 0 : made * IMAGE_COST_YEN,
        p_error_code: error ?? null,
        p_result_version_id: null,
      });
      if (!e) return;
    }
    console.error("image finish not recorded", { runId: run.id, status });
  };

  try {
    await ensureBucket(admin);
  } catch {
    await finish("failed", 0, "provider_error");
    return fail(500, "save_failed", "画像の保存場所を用意できませんでした");
  }

  const signal = AbortSignal.timeout(IMAGE_TIMEOUT_MS);
  const stamp = Date.now();
  // 枠ごとに並べて作る。1枚が失敗しても、できた分は残す
  const results = await Promise.allSettled(
    targets.map(async ({ slot, idea }, i) => {
      const img = await generateHeadingImage(deps.provider, idea, signal);
      const path = `${article.organizationId}/${article.id}/${slot === "eyecatch" ? "eyecatch" : `h${i}`}-${stamp}.${EXT[img.mimeType] ?? "png"}`;
      const { error: upErr } = await admin.storage.from(IMAGE_BUCKET).upload(path, Buffer.from(img.base64, "base64"), { contentType: img.mimeType });
      if (upErr) throw new Error("upload failed");
      const { data: old } = await admin.from("article_images").select("storage_path").eq("article_id", article.id).eq("slot", slot).maybeSingle();
      const { error: rowErr } = await admin.from("article_images").upsert(
        { article_id: article.id, organization_id: article.organizationId, slot, alt: img.alt, storage_path: path, mime_type: img.mimeType, is_sample: deps.isSample, created_by: auth.user!.id, created_at: new Date().toISOString() },
        { onConflict: "article_id,slot" },
      );
      if (rowErr) throw new Error("row upsert failed");
      if (old?.storage_path && old.storage_path !== path) await admin.storage.from(IMAGE_BUCKET).remove([old.storage_path]);
    }),
  );
  const made = results.filter((r) => r.status === "fulfilled").length;
  for (const r of results) {
    // 原因の種類だけを記録する（指示文や記事の内容は出さない）
    if (r.status === "rejected") console.error("image failed", { runId: run.id, reason: r.reason instanceof AiProviderError ? r.reason.code : r.reason instanceof DOMException ? "timeout" : "other" });
  }
  await finish(made ? "succeeded" : "failed", made, made ? undefined : "provider_error");
  if (!made) {
    const first = results.find((r): r is PromiseRejectedResult => r.status === "rejected")?.reason;
    return fail(502, "provider_error", first instanceof AiProviderError ? first.message : "画像を作れませんでした。もう一度お試しください");
  }
  return { ok: true, images: await listArticleImages(db, admin, req.articleId), failed: targets.length - made };
}
