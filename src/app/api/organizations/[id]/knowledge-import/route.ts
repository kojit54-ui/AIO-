// ChatGPT・Claude・Gemini のまとめから、会社の知識の候補を読み取る（docs/DECISIONS.md 2026-11-02）。画面（/knowledge）から呼ぶ。保存はしない。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runImportRead } from "@/lib/growth/hearingAi";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 180;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { idempotencyKey?: unknown; text?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey || typeof body?.text !== "string") return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const provider = getAiSetup().textFor("outline");
  const result = await runImportRead(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    { organizationId: id, text: body.text, idempotencyKey },
  );
  return result.ok ? NextResponse.json({ items: result.items }) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
