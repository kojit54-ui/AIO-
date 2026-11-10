// 毎朝9時（日本時間）に、今日を「次に書く日」に決めた人へお知らせを送る。Vercel の Cron（vercel.json）から呼ぶ。
// Vercel の Cron（CRON_SECRET）か Supabase の pg_cron（SCHEDULER_SECRET）が Authorization: Bearer で鍵を付けてくる（src/lib/cron/auth.ts）。?dry=1 なら数えるだけ。

import { type NextRequest, NextResponse } from "next/server";
import { cronCaller } from "@/lib/cron/auth";
import { siteOrigin } from "@/lib/auth/origin";
import { runWritingReminders } from "@/lib/reminder/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const caller = cronCaller(request.headers.get("authorization"));
  // 呼ばれたことをログで確かめられるように、誰から呼ばれたかだけを1行残す（鍵・個人情報は出さない）
  console.log("[writing-reminder]", JSON.stringify({ caller: caller ?? "forbidden" }));
  if (!caller) return NextResponse.json({ code: "forbidden" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found" }, { status: 404 });
  const result = await runWritingReminders({ admin: createAdminSupabase(), appUrl: await siteOrigin(), dryRun: request.nextUrl.searchParams.get("dry") === "1" });
  return NextResponse.json(result);
}
