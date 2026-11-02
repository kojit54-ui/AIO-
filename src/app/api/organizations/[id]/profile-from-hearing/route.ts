// ヒアリングの答えから会社の情報をまとめる（docs/DECISIONS.md 2026-11-02）。コタムの登録を待たずに書き始められるようにする。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runProfileFromHearing } from "@/lib/growth/hearingAi";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 180;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { idempotencyKey?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const provider = getAiSetup().textFor("body");
  const result = await runProfileFromHearing(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, isSample: provider === sampleTextProvider },
    { organizationId: id, idempotencyKey },
  );
  return result.ok ? NextResponse.json({ profile: result.profile }) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
