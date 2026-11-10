// 毎月1日の朝（日本時間9時）に、前の月のしおり通信を送る。Vercel の Cron（vercel.json）から呼ぶ。
// Vercel の Cron（CRON_SECRET）か Supabase の pg_cron（SCHEDULER_SECRET）が Authorization: Bearer で鍵を付けてくる（src/lib/cron/auth.ts）。?dry=1 なら数えるだけ。

import { type NextRequest, NextResponse } from "next/server";
import { cronCaller } from "@/lib/cron/auth";
import { siteOrigin } from "@/lib/auth/origin";
import { runNewsletter } from "@/lib/newsletter/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const caller = cronCaller(request.headers.get("authorization"));
  // 呼ばれたことをログで確かめられるように、誰から呼ばれたかだけを1行残す（鍵・個人情報は出さない）
  console.log("[newsletter]", JSON.stringify({ caller: caller ?? "forbidden" }));
  if (!caller) return NextResponse.json({ code: "forbidden" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found" }, { status: 404 });
  const result = await runNewsletter({ admin: createAdminSupabase(), appUrl: await siteOrigin(), dryRun: request.nextUrl.searchParams.get("dry") === "1" });
  return NextResponse.json(result);
}
