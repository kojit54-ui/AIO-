// Search Console をつなぐ（docs/DECISIONS.md 2026-11-02）。画面（/search-console）から呼ぶ。

import { type NextRequest, NextResponse } from "next/server";
import { connectSearchConsole } from "@/lib/growth/searchConsoleServer";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { siteUrl?: unknown } | null;
  if (!UUID.test(id) || typeof body?.siteUrl !== "string") return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const r = await connectSearchConsole({ user: await createServerSupabase(), admin: createAdminSupabase() }, { organizationId: id, siteUrl: body.siteUrl });
  return r.ok ? NextResponse.json(r) : NextResponse.json({ code: r.code, message: r.message }, { status: r.status });
}
