import { NextResponse } from "next/server";
import { mfgTipOfDay } from "@/lib/manufacturing";

// ホームの「製造業のこぼれ話」を1つ返す。知識表のデータは大きいので、ブラウザに送らずここで選ぶ。
// 会社の説明はURLに載せない（POSTの本文で受け取り、ログにも出さない）。
export async function POST(req: Request) {
  let body: { day?: unknown; business?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const day = typeof body.day === "string" ? body.day.slice(0, 40) : "";
  const business = typeof body.business === "string" ? body.business.slice(0, 2000) : "";
  if (!day) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const tip = mfgTipOfDay(day, business);
  if (!tip) return NextResponse.json({ tip: null });
  const { id, kind, title, summary, articleIdea, source } = tip;
  return NextResponse.json({ tip: { id, kind, title, summary, articleIdea: articleIdea ?? null, source: { title: source.title, url: source.url, publisher: source.publisher } } });
}
