// 書く記事の提案（コタムからの提案）を作る。画面（src/prototype/remote.ts）から呼ぶ。
// AIとラッコキーワードのキーはサーバーの環境変数だけにある。できた提案は keyword_proposals に残り、同じ会社の画面に出る。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runKeywordProposal } from "@/lib/growth/proposals";
import { getRakkoClient } from "@/lib/keywords/rakko";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

// 下調べとAIの応答を待つため、関数の実行時間を長めにとる（Vercel の上限内）
export const maxDuration = 300;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { idempotencyKey?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });

  // 記事の組み立ては書き手（OUTLINE_PROVIDER、既定は TEXT_PROVIDER）が考える
  const provider = getAiSetup().textFor("outline");
  const result = await runKeywordProposal(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider, rakko: getRakkoClient() },
    { organizationId: id, idempotencyKey },
  );
  return result.ok ? NextResponse.json(result.set) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
