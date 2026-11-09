// 毎朝9時（日本時間）に、お試しが明日終わる会社へ「初回の請求の前の日のお知らせ」を送る。Vercel の Cron（vercel.json）から呼ぶ。
// Vercel は CRON_SECRET を Authorization: Bearer で付けてくる。?dry=1 なら数えるだけ。

import { type NextRequest, NextResponse } from "next/server";
import { siteOrigin } from "@/lib/auth/origin";
import { runTrialReminders } from "@/lib/billing/reminder";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ code: "forbidden" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_found" }, { status: 404 });
  const result = await runTrialReminders({ admin: createAdminSupabase(), appUrl: await siteOrigin(), dryRun: request.nextUrl.searchParams.get("dry") === "1" });
  return NextResponse.json(result);
}
