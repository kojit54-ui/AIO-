// Search Console の数字を、古くなっていれば読み直す。ホームを開いたときに画面から呼ぶ。

import { type NextRequest, NextResponse } from "next/server";
import { refreshSearchConsole } from "@/lib/growth/searchConsoleServer";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ code: "invalid_input", message: "入力の内容を確認してください" }, { status: 400 });
  const r = await refreshSearchConsole({ user: await createServerSupabase(), admin: createAdminSupabase() }, { organizationId: id });
  return r.ok ? NextResponse.json(r) : NextResponse.json({ code: r.code, message: r.message }, { status: r.status });
}
