// ヒアリングの深掘りの質問を、聞く理由つきで1つ作る（docs/DECISIONS.md 2026-11-02）。画面（/prototype/hearing）から呼ぶ。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { type FollowUpRequest, runHearingFollowUp } from "@/lib/growth/hearingAi";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 120;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Partial<FollowUpRequest> | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey || typeof body?.questionId !== "string" || !body.answer) {
    return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  }
  // 聞き手は書き手（OUTLINE_PROVIDER、既定は TEXT_PROVIDER）
  const provider = getAiSetup().textFor("outline");
  const result = await runHearingFollowUp(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    { organizationId: id, questionId: body.questionId, answer: body.answer, idempotencyKey },
  );
  return result.ok ? NextResponse.json({ followUp: result.followUp }) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
