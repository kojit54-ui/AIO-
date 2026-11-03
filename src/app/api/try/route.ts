// 30秒でためす（/try）の書き出しをAIで作る。ログインしていない人も呼ぶ（docs/DECISIONS.md 2026-11-03）。
// 行き過ぎないように：同じサイトからだけ、ロボットよけ、入力の検査、回数と予算（start_trial_run）、止めるスイッチ、答えの検査。
// AIを使えないときは { mode: "sample" } を返し、画面は見本で続ける。入力も出力もログに出さない。

import { createHash } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { getAiSetup } from "@/lib/ai/config";
import { estimateCostYen } from "@/lib/ai/cost";
import { type AiUsage, failureReason } from "@/lib/ai/provider";
import { sampleTextProvider } from "@/lib/ai/providers/sample";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { TRIAL_SYSTEM_PROMPT, buildTrialPrompt, parseTrialResult, validateTrialInput } from "@/lib/tryoutAi";

export const maxDuration = 60;

const TIMEOUT_MS = 30_000;
/** 開いてからこれより早い送信はロボットとみなす */
const MIN_ELAPSED_MS = 8_000;

const sample = (reason: string) => NextResponse.json({ mode: "sample", reason });

/** 元に戻せない目印。IP とブラウザの種類を、サーバーの秘密といっしょにハッシュする */
function visitorId(request: NextRequest): string {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const ua = (request.headers.get("user-agent") ?? "").slice(0, 200);
  const salt = process.env.TRIAL_SALT?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex");
}

/** よそのサイトからの呼び出しを断る */
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
  if (!isSupabaseConfigured()) return sample("not_configured");
  if (!sameSite(request)) return NextResponse.json({ code: "forbidden" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  // ロボットよけ：見えない欄に何か入っている、または開いてすぐの送信
  const elapsed = Date.now() - Number(body?.startedAt ?? 0);
  if (!body || body.website || !Number.isFinite(elapsed) || elapsed < MIN_ELAPSED_MS || elapsed > 2 * 60 * 60 * 1000) return sample("bot");

  const checked = validateTrialInput(body);
  if (!checked.ok) return NextResponse.json({ code: "invalid_input", message: checked.message }, { status: 400 });
  const input = checked.input;

  const provider = getAiSetup().textFor("outline");
  if (provider === sampleTextProvider) return sample("not_configured");

  const admin = createAdminSupabase();
  const user = buildTrialPrompt(input);
  const { data: runId, error } = await admin.rpc("start_trial_run", { p_visitor: visitorId(request), p_input_chars: Math.min(Array.from(user).length, 2000) });
  if (error || typeof runId !== "string") {
    const code = ["disabled", "visitor_limit", "daily_limit", "budget_exceeded"].find((k) => error?.message?.includes(k));
    return sample(code ?? "unavailable");
  }

  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  const finish = async (status: "succeeded" | "failed" | "rejected", code: string | null) => {
    const cost = Math.round(estimateCostYen(usage, provider.name) * 100) / 100;
    const { error: e } = await admin.rpc("finish_trial_run", { p_id: runId, p_status: status, p_cost_yen: cost, p_error_code: code });
    if (e) console.error("trial run finish not recorded", { runId });
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await provider.complete({ kind: "trial", system: TRIAL_SYSTEM_PROMPT, user, maxOutputTokens: 1500, quality: "draft", signal: controller.signal });
    usage = res.usage;
    const { result, reason } = parseTrialResult(res.text, input);
    if (!result) {
      await finish("rejected", reason);
      return sample(reason === "off_topic" ? "off_topic" : "checked");
    }
    await finish("succeeded", null);
    return NextResponse.json({ mode: "ai", result });
  } catch (e) {
    await finish("failed", failureReason(e, controller.signal));
    return sample("unavailable");
  } finally {
    clearTimeout(timer);
  }
}
