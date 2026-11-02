import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import type { AiProvider } from "@/lib/ai/provider";
import { AiProviderError } from "@/lib/ai/provider";
import type { RakkoClient } from "@/lib/keywords/rakko";
import { HEARING_QUESTIONS, type HearingAnswer } from "@/prototype/growth";
import { MAX_HEARING_CHARS, hearingForPrompt, researchSeeds, runKeywordProposal, searchSignals } from "./proposals";

// 深掘りを飛ばした答え（答え終わった扱い）
const SKIPPED = [{ question: "深掘り", answer: "" }];
const done = (id: string, text: string) => ({ question_id: id, text, follow_ups: SKIPPED, is_draft: false });
const HEARING = [done("business", "工務店"), done("services", "内窓、浴室の断熱"), done("customers", "寒さに困る家族"), done("area", "札幌市")];

/** supabase-js の呼び出しを記録する最小の偽物 */
function fakeDb(tables: Record<string, unknown>, opts: { rpc?: Record<string, unknown>; rpcError?: Record<string, string> } = {}) {
  const calls: { table: string; op: string; args: unknown[] }[] = [];
  const query = (table: string) => {
    const q: Record<string, unknown> = {};
    const chain = (op: string) => (...args: unknown[]) => {
      calls.push({ table, op, args });
      return q;
    };
    for (const op of ["select", "eq", "is", "update", "insert", "order", "limit"]) q[op] = chain(op);
    const one = () => {
      const ins = calls.findLast((c) => c.table === table && c.op === "insert");
      if (ins) return { id: "kp1", created_at: "2026-11-02T00:00:00Z", ...(ins.args[0] as object) };
      const v = tables[table];
      return Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
    };
    q.maybeSingle = async () => ({ data: one(), error: null });
    q.single = q.maybeSingle;
    q.then = (res: (v: unknown) => unknown) => Promise.resolve({ data: tables[table] ?? null, error: null }).then(res);
    return q;
  };
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: query,
    rpc: (name: string, args: unknown) => {
      calls.push({ table: "rpc", op: name, args: [args] });
      const error = opts.rpcError?.[name] ? { message: opts.rpcError[name] } : null;
      const data = error ? null : (opts.rpc?.[name] ?? null);
      return Object.assign(Promise.resolve({ data, error }), { single: async () => ({ data, error }) });
    },
  };
  return { client: client as unknown as SupabaseClient, calls };
}

const answer = (pillar: string) => ({
  pillar: { keyword: pillar, question: `${pillar}とは` },
  clusters: ["a", "b", "c"].map((x) => ({ keyword: `${pillar} ${x}`, question: `${x}は？` })),
  reasons: ["sales"],
  why: "売上につながる",
});
const GOOD = JSON.stringify({ proposals: [answer("内窓 札幌"), answer("浴室 断熱"), answer("断熱 費用")] });

function provider(texts: (string | Error)[]) {
  const prompts: string[] = [];
  const p: AiProvider = {
    name: "openai",
    async complete(req) {
      prompts.push(req.user);
      const t = texts.shift() ?? GOOD;
      if (t instanceof Error) throw t;
      return { text: t, usage: { inputTokens: 1000, outputTokens: 500 } };
    },
  };
  return { p, prompts };
}

function rakko() {
  const seeds: string[] = [];
  const r: RakkoClient = {
    async suggestKeywords(keyword) {
      seeds.push(keyword);
      return { items: [{ keyword: `${keyword} 費用`, monthlySearches: 1200, seoDifficulty: 10 }], totalCount: 1, consumedCredit: 1.5 };
    },
    async questionSearch() {
      return { items: [{ question: "内窓は結露に効く？", relativeDemand: 50 }], totalCount: 1, consumedCredit: 1.5 };
    },
    async accountInfo() {
      return { planName: "x", dueDate: "x", creditBalance: 100 };
    },
  };
  return { r, seeds };
}

const setup = (hearing = HEARING) => {
  const user = fakeDb({ hearing_answers: hearing, sell_items: [{ name: "内窓" }] }, { rpc: { start_keyword_proposal: { id: "run1", status: "queued" } } });
  const admin = fakeDb({ generation_runs: [{ id: "run1" }] });
  return { user, admin };
};
const finishArgs = (admin: ReturnType<typeof fakeDb>) => admin.calls.find((c) => c.op === "finish_generation")!.args[0] as Record<string, unknown>;
const inserted = (admin: ReturnType<typeof fakeDb>) => admin.calls.find((c) => c.table === "keyword_proposals" && c.op === "insert")?.args[0] as Record<string, unknown> | undefined;

describe("AIに渡すヒアリング", () => {
  const a = (id: string, text: string, draft = false): [string, HearingAnswer] => [id, { questionId: id, text, followUps: SKIPPED, ...(draft ? { draft: true } : {}) }];

  it("答え終わった問いと、今売りたいものの順位を渡す", () => {
    const h = hearingForPrompt(Object.fromEntries([a("business", "工務店"), a("faq", "書きかけ", true)]), ["内窓", "外壁"]);
    expect(Object.keys(h)).toEqual(["business", "sell_now"]);
    expect(h.business.question).toBe(HEARING_QUESTIONS[0].label);
    expect(h.sell_now.answer).toBe("内窓\n外壁");
  });

  it("長い答えは切りそろえ、合計を受付の上限より小さくする", () => {
    const answers = Object.fromEntries(HEARING_QUESTIONS.map((q) => a(q.id, "あ".repeat(4000))));
    const h = hearingForPrompt(answers, []);
    expect(JSON.stringify(h).length).toBeLessThanOrEqual(MAX_HEARING_CHARS);
    expect(Object.keys(h)).toHaveLength(HEARING_QUESTIONS.length);
  });

  it("下調べの言葉は、売りたいもの、売りたいサービスの順", () => {
    expect(researchSeeds(Object.fromEntries([a("services", "例：内窓、外壁塗装")]), ["浴室"])).toEqual(["浴室", "内窓", "外壁塗装"]);
  });
});

describe("提案を作る", () => {
  it("下調べを AI に渡し、提案を保存して、費用と下調べのクレジットを記録する", async () => {
    const { user, admin } = setup();
    const ai = provider([]);
    const rk = rakko();
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: ai.p, isSample: false, rakko: rk.r }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res.ok).toBe(true);
    expect(rk.seeds).toEqual(["内窓", "浴室の断熱"]);
    expect(ai.prompts[0]).toContain("内窓は結露に効く？");
    // 検索数の数字は AI に渡さない（多い・ふつう・少ないの目安だけ）
    expect(ai.prompts[0]).not.toContain("1200");
    expect(inserted(admin)).toMatchObject({ organization_id: "o1", run_id: "run1", is_sample: false, used_research: true });
    expect(finishArgs(admin)).toMatchObject({ p_status: "succeeded", p_usage: { inputTokens: 1000, outputTokens: 500, rakko_credit: 6 } });
  });

  it("返事の形が違えば1回だけ聞き直す。2回とも違えば失敗として記録する", async () => {
    let s = setup();
    let ai = provider(["{}"]);
    expect((await runKeywordProposal({ user: s.user.client, admin: s.admin.client, provider: ai.p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" })).ok).toBe(true);
    expect(ai.prompts).toHaveLength(2);
    expect(inserted(s.admin)?.used_research).toBe(false);

    s = setup();
    ai = provider(["{}", "{}"]);
    const res = await runKeywordProposal({ user: s.user.client, admin: s.admin.client, provider: ai.p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res).toMatchObject({ ok: false, status: 502 });
    expect(inserted(s.admin)).toBeUndefined();
    expect(finishArgs(s.admin)).toMatchObject({ p_status: "failed", p_usage: { inputTokens: 2000, outputTokens: 1000 } });
  });

  it("下調べが失敗しても、ヒアリングだけで作る", async () => {
    const { user, admin } = setup();
    const rk = rakko();
    rk.r.suggestKeywords = async () => {
      throw new Error("network");
    };
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: provider([]).p, isSample: false, rakko: rk.r }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res.ok).toBe(true);
    expect(inserted(admin)?.used_research).toBe(false);
  });

  it("AIのキーが無いときはサンプルを保存し、下調べもAIも呼ばない", async () => {
    const { user, admin } = setup();
    const ai = provider([]);
    const rk = rakko();
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: ai.p, isSample: true, rakko: rk.r }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res.ok && res.set.isSample).toBe(true);
    expect(ai.prompts).toHaveLength(0);
    expect(rk.seeds).toHaveLength(0);
    expect((inserted(admin)?.proposals as unknown[]).length).toBe(3);
  });

  it("提案に要る4つの答えがそろっていなければ、受け付けない", async () => {
    const { user, admin } = setup(HEARING.slice(0, 3));
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: provider([]).p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res).toMatchObject({ ok: false, status: 400 });
    expect(user.calls.some((c) => c.op === "start_keyword_proposal")).toBe(false);
  });

  it("受付の判定（回数の上限など）を画面の言葉にする", async () => {
    const user = fakeDb({ hearing_answers: HEARING, sell_items: [] }, { rpcError: { start_keyword_proposal: "limit_reached" } });
    const res = await runKeywordProposal({ user: user.client, admin: fakeDb({}).client, provider: provider([]).p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res).toMatchObject({ ok: false, status: 429, code: "limit_reached" });
  });

  it("AIの失敗は種類ごとの言葉で返し、失敗として記録する", async () => {
    const { user, admin } = setup();
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: provider([new AiProviderError("billing", "402")]).p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res).toMatchObject({ ok: false, status: 502, message: expect.stringContaining("クレジット") });
    expect(finishArgs(admin)).toMatchObject({ p_status: "failed" });
  });

  it("結果の記録に失敗したら、やり直す（実行中のままにしない）", async () => {
    const { user, admin } = setup();
    const rpc = admin.client.rpc.bind(admin.client);
    let failures = 2;
    (admin.client as unknown as { rpc: unknown }).rpc = (name: string, args: unknown) => {
      if (name === "finish_generation" && failures-- > 0) {
        admin.calls.push({ table: "rpc", op: "finish_failed", args: [] });
        return Object.assign(Promise.resolve({ data: null, error: { message: "network" } }), { single: async () => ({ data: null, error: { message: "network" } }) });
      }
      return rpc(name, args);
    };
    const res = await runKeywordProposal({ user: user.client, admin: admin.client, provider: provider([]).p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(res.ok).toBe(true);
    expect(admin.calls.filter((c) => c.op === "finish_failed")).toHaveLength(2);
    expect(finishArgs(admin)).toMatchObject({ p_status: "succeeded" });
  });
});

describe("Search Console の言葉を提案に使う", () => {
  const q = (query: string, impressions: number, position: number) => ({ query, clicks: 0, impressions, position });
  const snapshot = {
    range: { start: "2026-10-03", end: "2026-10-30" },
    totals: { clicks: 1, impressions: 100, ctr: 1, position: 20 },
    queries: [q("内窓 札幌", 300, 15.2), q("内窓 費用", 120, 4.1), q("たまたま", 2, 9), q("遠すぎる", 500, 48)],
    pages: [],
  };

  it("表示の多い順に、上位は strong・30位までは near。少なすぎる・遠すぎる言葉は外す", () => {
    expect(searchSignals(snapshot)).toEqual([
      { query: "内窓 札幌", status: "near" },
      { query: "内窓 費用", status: "strong" },
    ]);
    expect(searchSignals(null)).toEqual([]);
  });

  it("つながっている会社では、言葉を AI に渡す（数字は渡さない）", async () => {
    const user = fakeDb(
      { hearing_answers: HEARING, sell_items: [], search_console: { verified_at: "2026-11-02T00:00:00Z", snapshot } },
      { rpc: { start_keyword_proposal: { id: "run1", status: "queued" } } },
    );
    const admin = fakeDb({ generation_runs: [{ id: "run1" }] });
    const ai = provider([]);
    await runKeywordProposal({ user: user.client, admin: admin.client, provider: ai.p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(ai.prompts[0]).toContain("search_console");
    expect(ai.prompts[0]).toContain("内窓 札幌");
    expect(ai.prompts[0]).not.toContain("300");
  });

  it("つながっていない会社では渡さない", async () => {
    const user = fakeDb(
      { hearing_answers: HEARING, sell_items: [], search_console: { verified_at: null, snapshot } },
      { rpc: { start_keyword_proposal: { id: "run1", status: "queued" } } },
    );
    const admin = fakeDb({ generation_runs: [{ id: "run1" }] });
    const ai = provider([]);
    await runKeywordProposal({ user: user.client, admin: admin.client, provider: ai.p, isSample: false, rakko: null }, { organizationId: "o1", idempotencyKey: "key-12345678" });
    expect(ai.prompts[0]).not.toContain("search_console");
  });
});
