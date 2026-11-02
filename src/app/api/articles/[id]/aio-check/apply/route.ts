// AIOのチェックで聞き返した答えを、記事に反映する（新しい版を作る）。画面（src/lib/remote/backend.ts）から呼ぶ。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { applyAioCheck } from "@/lib/generation/aioCheck";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 300;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { idempotencyKey?: unknown; checkId?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  const checkId = typeof body?.checkId === "string" ? body.checkId : "";
  if (!idempotencyKey || !checkId) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });

  // 答えを書き込むのは書き手（BODY_PROVIDER）
  const provider = getAiSetup().textFor("body");
  const result = await applyAioCheck(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    { articleId: id, checkId, idempotencyKey },
  );
  return result.ok
    ? NextResponse.json({ versionId: result.versionId })
    : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
