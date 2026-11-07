// 新規受付の案内を受け取る人のメールを残す（docs/DECISIONS.md 2026-11-07）。ログインしていない人も呼ぶ。
// 行き過ぎないように：同じサイトからだけ、大きさの上限、ロボットよけ（見えない欄・開いてすぐの送信）、同じメールは1行。
// メールはログに出さない。登録済みかどうかは返さない（他人のメールの有無を知られないように）。

import { type NextRequest, NextResponse } from "next/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { normalizeEmail, normalizeSource } from "@/lib/waitlist";

const MAX_BODY_BYTES = 2_000;
const MIN_ELAPSED_MS = 2_000;

function sameSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameSite(request)) return NextResponse.json({ code: "forbidden" }, { status: 403 });
  const raw = await request.text().catch(() => "");
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ code: "too_large" }, { status: 413 });
  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    body = null;
  }
  const email = normalizeEmail(body?.email);
  if (!body || !email) return NextResponse.json({ code: "invalid_email" }, { status: 400 });
  // ロボットよけ。ロボットには成功と同じ答えを返す
  const elapsed = Date.now() - Number(body.startedAt ?? 0);
  if (body.website || !Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS) return NextResponse.json({ ok: true });
  if (!isSupabaseConfigured()) return NextResponse.json({ code: "not_configured" }, { status: 503 });

  const { error } = await createAdminSupabase()
    .from("signup_waitlist")
    .upsert({ email, source: normalizeSource(body.source) }, { onConflict: "email", ignoreDuplicates: true });
  if (error) {
    console.error("waitlist insert failed", error.code);
    return NextResponse.json({ code: "unavailable" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
