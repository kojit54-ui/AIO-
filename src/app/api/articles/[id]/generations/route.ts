// 見出し案・本文の生成。画面（src/lib/remote/backend.ts）から呼ぶ。AIのキーはサーバーの環境変数だけにある。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runGeneration } from "@/lib/generation/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// AIの応答を待つため、関数の実行時間を長めにとる（Vercel の上限内）
export const maxDuration = 300;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { kind?: unknown; headings?: unknown; idempotencyKey?: unknown } | null;
  const kind = body?.kind;
  const headings = Array.isArray(body?.headings) ? body.headings.filter((h): h is string => typeof h === "string").slice(0, 12) : [];
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if ((kind !== "outline" && kind !== "body") || !idempotencyKey) {
    return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  }

  // 役割ごとに提供元を選ぶ：書き手（OUTLINE_PROVIDER・BODY_PROVIDER）、点検（REVIEW_PROVIDER）、画像の提案（IMAGE_IDEA_PROVIDER）
  const setup = getAiSetup();
  const provider = setup.textFor(kind);
  const roles = { reviewer: setup.textFor("review"), imageIdeas: setup.textFor("images") };
  const result = await runGeneration(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider, roles },
    { articleId: id, kind, headings, idempotencyKey },
  );
  return result.ok
    ? NextResponse.json({ versionId: result.versionId })
    : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
