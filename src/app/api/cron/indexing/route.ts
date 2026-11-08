// 毎朝、新しく出た・直した読みものを検索エンジンに知らせる（src/lib/indexing.ts）。Vercel の Cron（vercel.json）から呼ぶ。
// 自動公開のあとにすぐ知らせたいときも、同じ CRON_SECRET を付けてここを呼べばよい。?dry=1 なら送らずに中身だけ返す。
// ?days=7 で、さかのぼる日数を変えられる（最初の1回など）。

import { type NextRequest, NextResponse } from "next/server";
import { freshUrls, pingWebSub, submitIndexNow, submitSitemaps, type StepResult } from "@/lib/indexing";

export const dynamic = "force-dynamic";

async function step(fn: () => Promise<StepResult>): Promise<StepResult> {
  try {
    return await fn();
  } catch (e) {
    return { ok: false, note: e instanceof Error ? e.message.slice(0, 200) : "失敗" };
  }
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ code: "forbidden" }, { status: 401 });
  const days = Math.min(Math.max(Number(request.nextUrl.searchParams.get("days")) || 2, 1), 60);
  const urls = freshUrls(new Date(), days);
  if (request.nextUrl.searchParams.get("dry") === "1" || !urls.length) return NextResponse.json({ urls, sent: false });
  const [indexNow, webSub, searchConsole] = await Promise.all([step(() => submitIndexNow(urls)), step(() => pingWebSub()), step(() => submitSitemaps())]);
  const result = { urls, sent: true, indexNow, webSub, searchConsole };
  // URLと結果だけを残す（本文・鍵は出さない）
  console.log("[indexing]", JSON.stringify(result));
  return NextResponse.json(result);
}
