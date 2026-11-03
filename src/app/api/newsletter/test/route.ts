// 見本の画面の「自分あてに試しに送る」。ログインしている担当の方のアドレスだけに送る。

import { NextResponse } from "next/server";
import { siteOrigin } from "@/lib/auth/origin";
import { sendTestNewsletter } from "@/lib/newsletter/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found", message: "検証環境・本番環境で使います" }, { status: 404 });
  const r = await sendTestNewsletter({ user: await createServerSupabase(), admin: createAdminSupabase(), appUrl: await siteOrigin() });
  return r.ok ? NextResponse.json(r) : NextResponse.json({ code: r.code, message: r.message }, { status: r.status });
}
