// AIに紹介されたかのチェック（docs/DECISIONS.md 2026-11-02「AIに紹介されたかの月次チェック」）。
// 地域とサービスから、お客様がAIに聞きそうな質問を作り、検索できるAI（OpenAI Responses API の web_search）に聞く。
// 答えの文と出典に、会社の名前や公開した記事のサイトが出てくるかを記録する。サーバー側でだけ使う。答えはログに出さない。

import type { SupabaseClient } from "@supabase/supabase-js";
import { estimateCostYen } from "@/lib/ai/cost";
import { DEFAULTS } from "@/lib/ai/config";
import type { AiUsage } from "@/lib/ai/provider";
import type { HearingAnswer } from "@/prototype/growth";
import { answerFromDb, type HearingAnswerRow } from "@/prototype/remote";
import { MONTHLY_MENTION_CHECKS, mentionQuestions } from "./mentionQuestions";

/** 答えと出典に、会社の名前かサイトが出てくるか */
export function findMention(answer: string, sources: { url: string; title: string }[], names: string[], domains: string[]): { mentioned: boolean; excerpt: string } {
  const hitName = names.find((n) => n.length >= 2 && answer.includes(n));
  const hitDomain = domains.find((d) => sources.some((s) => s.url.includes(d)) || answer.includes(d));
  if (!hitName && !hitDomain) return { mentioned: false, excerpt: Array.from(answer.trim()).slice(0, 200).join("") };
  const key = hitName ?? hitDomain!;
  const i = answer.indexOf(key);
  const start = Math.max(0, i - 80);
  return { mentioned: true, excerpt: Array.from(i >= 0 ? answer.slice(start, i + key.length + 120) : answer).slice(0, 300).join("") };
}

interface SearchResult {
  text: string;
  sources: { url: string; title: string }[];
  usage: AiUsage;
}

/** OpenAI の検索つきで1問を聞く */
async function askWithSearch(apiKey: string, model: string, question: string, signal: AbortSignal, doFetch: typeof fetch = fetch): Promise<SearchResult> {
  const res = await doFetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, input: question, tools: [{ type: "web_search" }], store: false, max_output_tokens: 2000 }),
    signal,
  });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const json = (await res.json()) as {
    output?: { type: string; content?: { type: string; text?: string; annotations?: { type: string; url?: string; title?: string }[] }[] }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const parts = (json.output ?? []).flatMap((o) => (o.type === "message" ? (o.content ?? []) : [])).filter((p) => p.type === "output_text");
  const sources = parts.flatMap((p) => (p.annotations ?? []).filter((a) => a.type === "url_citation" && a.url).map((a) => ({ url: a.url!, title: a.title ?? a.url! })));
  return {
    text: parts.map((p) => p.text ?? "").join(""),
    sources: sources.filter((s, i) => sources.findIndex((x) => x.url === s.url) === i).slice(0, 8),
    usage: { inputTokens: json.usage?.input_tokens ?? 0, outputTokens: json.usage?.output_tokens ?? 0 },
  };
}

type Fail = { ok: false; status: number; code: string; message: string };
const fail = (status: number, code: string, message: string): Fail => ({ ok: false, status, code, message });

/** AIに紹介されたかを調べて記録する。キーが無ければサンプル（「調べていません」）を残す */
export async function runMentionCheck(
  deps: { user: SupabaseClient; admin: SupabaseClient; env?: Record<string, string | undefined>; fetch?: typeof fetch },
  req: { organizationId: string; idempotencyKey: string },
): Promise<{ ok: true; checked: number } | Fail> {
  const { user: db, admin } = deps;
  const env = deps.env ?? process.env;
  const { data: auth } = await db.auth.getUser();
  if (!auth.user) return fail(401, "session_expired", "ログインの有効期限が切れました");

  const [orgRes, hearingRes, articlesRes, monthRes] = await Promise.all([
    db.from("organizations").select("name").eq("id", req.organizationId).maybeSingle(),
    db.from("hearing_answers").select("*").eq("organization_id", req.organizationId),
    db.from("articles").select("published_url").eq("organization_id", req.organizationId).not("published_url", "is", null),
    db.from("aio_mentions").select("created_at").eq("organization_id", req.organizationId).gte("created_at", new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString()),
  ]);
  if (!orgRes.data) return fail(404, "not_found", "会社が見つかりません");
  const hearing: Record<string, HearingAnswer> = {};
  for (const r of (hearingRes.data ?? []) as HearingAnswerRow[]) hearing[r.question_id] = answerFromDb(r);
  const questions = mentionQuestions(hearing);
  if (!questions.length) return fail(400, "invalid_input", "先に「会社のことを教える」で、売りたいものと地域に答えてください");
  const runsThisMonth = new Set((monthRes.data ?? []).map((r) => String(r.created_at).slice(0, 16))).size;
  if (runsThisMonth >= MONTHLY_MENTION_CHECKS) return fail(429, "limit_reached", `今月は${MONTHLY_MENTION_CHECKS}回調べました。来月またお試しください`);

  // 受付（予算と二重実行の判定）。ヒアリングのAIと同じ枠を使う
  const { data: run, error } = await db
    .rpc("start_hearing_ai", { p_organization_id: req.organizationId, p_idempotency_key: req.idempotencyKey, p_input_chars: JSON.stringify(questions).length })
    .single<{ id: string; status: string }>();
  if (error || !run) {
    const code = ["busy", "limit_reached", "budget_exceeded", "billing_inactive", "forbidden"].find((k) => error?.message?.includes(k)) ?? "provider_error";
    return fail(code === "forbidden" ? 403 : 429, code, code === "busy" ? "AIがほかの作業をしています。少し待ってからお試しください" : "今は調べられません。コタムにご相談ください");
  }
  if (run.status !== "queued") return fail(409, "busy", "同じ受付が実行中です");
  await admin.from("generation_runs").update({ status: "running" }).eq("id", run.id).eq("status", "queued");

  const apiKey = env.OPENAI_API_KEY?.trim();
  const model = env.OPENAI_SEARCH_MODEL?.trim() || env.OPENAI_TEXT_MODEL?.trim() || DEFAULTS.openaiTextModel;
  const names = [orgRes.data.name as string, ...(orgRes.data.name as string).split(/[\s　]/)].filter((n) => n.length >= 2);
  const domains = [...new Set(((articlesRes.data ?? []) as { published_url: string }[]).flatMap((a) => { try { return [new URL(a.published_url).hostname.replace(/^www\./, "")]; } catch { return []; } }))];
  let usage: AiUsage = { inputTokens: 0, outputTokens: 0 };
  const signal = AbortSignal.timeout(120_000);
  try {
    const rows = [];
    for (const q of questions) {
      if (!apiKey) {
        rows.push({ organization_id: req.organizationId, question: q, mentioned: false, excerpt: "サンプル（AIは未接続）：検索できるAIのキーが入ると、ここに答えが入ります。", sources: [], provider: "sample", is_sample: true });
        continue;
      }
      const r = await askWithSearch(apiKey, model, q, signal, deps.fetch);
      usage = { inputTokens: usage.inputTokens + r.usage.inputTokens, outputTokens: usage.outputTokens + r.usage.outputTokens };
      const m = findMention(r.text, r.sources, names, domains);
      rows.push({ organization_id: req.organizationId, question: q, mentioned: m.mentioned, excerpt: m.excerpt, sources: r.sources, provider: "openai", is_sample: false });
    }
    const { error: insErr } = await admin.from("aio_mentions").insert(rows);
    if (insErr) throw new Error("mentions insert failed");
    // 検索の利用料は文章の単価とは別。ここでは文章の分だけを数える（docs/DECISIONS.md に記録）
    await admin.rpc("finish_generation", { p_run_id: run.id, p_status: "succeeded", p_usage: usage, p_cost_yen: Math.round(estimateCostYen(usage, "openai") * 100) / 100, p_error_code: null });
    return { ok: true, checked: rows.length };
  } catch (e) {
    console.error("mention check failed", { runId: run.id, reason: e instanceof Error ? e.message.slice(0, 40) : "other" });
    await admin.rpc("finish_generation", { p_run_id: run.id, p_status: "failed", p_usage: usage, p_cost_yen: Math.round(estimateCostYen(usage, "openai") * 100) / 100, p_error_code: "provider_error" });
    return fail(502, "provider_error", "AIに聞けませんでした。少し待ってからもう一度お試しください");
  }
}

