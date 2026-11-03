// 質問に答え終わったあと、この記事の答え（結論）とタイトル案3つをAIが作る（2026-11-03）。書く画面（src/app/prototype/write）から呼ぶ。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runTitleIdeas } from "@/lib/growth/hearingAi";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 90;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { keyword?: unknown; reader?: unknown; answers?: unknown; idempotencyKey?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const provider = getAiSetup().textFor("outline");
  const result = await runTitleIdeas(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    {
      organizationId: id,
      keyword: String(body?.keyword ?? ""),
      reader: String(body?.reader ?? ""),
      answers: Array.isArray(body?.answers) ? (body.answers as { question: string; answer: string }[]) : [],
      idempotencyKey,
    },
  );
  return result.ok ? NextResponse.json({ conclusion: result.conclusion, titles: result.titles, sample: result.sample }) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
