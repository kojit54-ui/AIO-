// 記事の画像の一覧（GET）と生成（POST）。画面（src/lib/remote/backend.ts）から呼ぶ。画像AIのキーはサーバーの環境変数だけにある。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleImageProvider } from "@/lib/ai/providers/sample";
import { imageCostYen, listArticleImages, runImageGeneration } from "@/lib/generation/images";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 画像AIの応答を待つため、関数の実行時間を長めにとる（Vercel の上限内）
export const maxDuration = 300;

const notConfigured = () => NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return notConfigured();
  const { id } = await params;
  const user = await createServerSupabase();
  const { data: auth } = await user.auth.getUser();
  if (!auth.user) return NextResponse.json({ code: "session_expired", message: "ログインの有効期限が切れました" }, { status: 401 });
  const setup = getAiSetup();
  return NextResponse.json({
    enabled: setup.imageMode === "generate",
    // 画面の費用の目安に使う。記録する費用と同じ単価
    unitCostYen: setup.image === sampleImageProvider ? 0 : imageCostYen(setup.image.name),
    images: await listArticleImages(user, createAdminSupabase(), id),
  });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return notConfigured();
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { slots?: unknown; idempotencyKey?: unknown } | null;
  const slots = Array.isArray(body?.slots) ? body.slots.filter((s): s is string => typeof s === "string").slice(0, 50) : []; // 枚数の上限はサーバー側で数え、作らなかった分は failed で返す
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!idempotencyKey) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const setup = getAiSetup();
  if (setup.imageMode !== "generate") return NextResponse.json({ code: "forbidden", message: "画像の生成は止めてあります" }, { status: 403 });

  const result = await runImageGeneration(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider: setup.image, isSample: setup.image === sampleImageProvider },
    { articleId: id, slots, idempotencyKey },
  );
  return result.ok
    ? NextResponse.json({ images: result.images, failed: result.failed })
    : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
