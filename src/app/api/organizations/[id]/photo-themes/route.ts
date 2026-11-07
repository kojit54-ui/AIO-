// 写真1枚から、書ける記事のテーマを3つAIが考える（2026-11-07）。「どのテーマで書きますか」（/articles/new）から呼ぶ。
// 写真は保存しない。画像を読める役割（画像の提案役＝既定は Google）で読む。

import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { runPhotoThemes } from "@/lib/growth/hearingAi";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export const maxDuration = 90;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { image?: { mimeType?: unknown; data?: unknown }; memo?: unknown; idempotencyKey?: unknown } | null;
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  if (!UUID.test(id) || !idempotencyKey || !body?.image) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const setup = getAiSetup();
  const provider = setup.textFor("images");
  const result = await runPhotoThemes(
    { user: await createServerSupabase(), admin: createAdminSupabase(), provider, fallback: setup.textFor("outline"), isSample: provider === sampleTextProvider },
    { organizationId: id, image: { mimeType: String(body.image.mimeType ?? ""), data: String(body.image.data ?? "") }, memo: String(body?.memo ?? ""), idempotencyKey },
  );
  return result.ok ? NextResponse.json({ seen: result.seen, themes: result.themes, sample: result.sample }) : NextResponse.json({ code: result.code, message: result.message }, { status: result.status });
}
