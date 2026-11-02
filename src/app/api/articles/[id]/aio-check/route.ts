// AIOのチェックを実施する（docs/DECISIONS.md 2026-11-02）。画面（src/lib/remote/backend.ts）から呼ぶ。AIのキーはサーバーの環境変数だけにある。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runAioCheck } from "@/lib/generation/aioCheck";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// AIの応答を待つため、関数の実行時間を長めにとる（Vercel の上限内）
export const maxDuration = 300;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { idempotencyKey?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!idempotencyKey) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });

  // チェック役は点検役（REVIEW_PROVIDER）
  const provider = getAiSetup().textFor("review");
  const result = await runAioCheck(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    { articleId: id, idempotencyKey },
  );
  return result.ok
    ? NextResponse.json({ checkId: result.checkId })
    : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
