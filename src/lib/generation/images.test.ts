import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";
import type { ImageProvider } from "@/lib/ai/images";
import { AiProviderError } from "@/lib/ai/provider";
import { IMAGE_COST_YEN, ideasBySlot, runImageGeneration } from "./images";

const idea = (heading: string) => ({ heading, photoIdea: "p", alt: `alt-${heading}`, imagePrompt: "prompt" });
const ideas = { eyecatch: idea(""), perHeading: [idea("見出し1"), idea("見出し2")] };

/** supabase-js の呼び出しを記録する最小の偽物。テーブルごとに返す行を決める */
function fakeDb(tables: Record<string, unknown>, opts: { rpc?: Record<string, unknown> } = {}) {
  const calls: { table: string; op: string; args: unknown[] }[] = [];
  const storage: { op: string; args: unknown[] }[] = [];
  const query = (table: string) => {
    const q: Record<string, unknown> = {};
    const chain = (op: string) => (...args: unknown[]) => {
      calls.push({ table, op, args });
      return q;
    };
    for (const op of ["select", "eq", "is", "update", "upsert", "order", "limit"]) q[op] = chain(op);
    const result = () => {
      const v = tables[table];
      return { data: Array.isArray(v) ? v : v ?? null, error: null };
    };
    q.maybeSingle = async () => ({ data: Array.isArray(tables[table]) ? (tables[table] as unknown[])[0] ?? null : tables[table] ?? null, error: null });
    q.single = q.maybeSingle;
    q.then = (res: (v: unknown) => unknown) => Promise.resolve(result()).then(res);
    return q;
  };
  const client = {
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: query,
    rpc: (name: string, args: unknown) => {
      calls.push({ table: "rpc", op: name, args: [args] });
      const data = opts.rpc?.[name] ?? null;
      const p = Promise.resolve({ data, error: null });
      return Object.assign(p, { single: async () => ({ data, error: null }) });
    },
    storage: {
      createBucket: async () => ({ error: null }),
      from: () => ({
        upload: async (...args: unknown[]) => (storage.push({ op: "upload", args }), { error: null }),
        remove: async (...args: unknown[]) => (storage.push({ op: "remove", args }), { error: null }),
        createSignedUrls: async (paths: string[]) => ({ data: paths.map((p) => ({ signedUrl: `https://signed/${p}` })) }),
      }),
    },
  };
  return { client: client as unknown as SupabaseClient, calls, storage };
}

const article = { id: "a1", organization_id: "o1", theme_id: "t1", status: "drafting", current_version_id: "v1", lock_version: 0, published_without_approval: false, updated_at: "x" };
const version = { id: "v1", article_id: "a1", frozen: false, generation_settings: { eyecatch: ideas.eyecatch, image_suggestions: ideas.perHeading } };

describe("画像の枠", () => {
  it("アイキャッチと見出しを枠にし、同じ見出しは1つにする", () => {
    expect(ideasBySlot({ eyecatch: ideas.eyecatch, perHeading: [idea("a"), idea("a"), idea("")] }).map((x) => x.slot)).toEqual(["eyecatch", "a"]);
    expect(ideasBySlot(undefined)).toEqual([]);
  });
});

describe("画像の生成", () => {
  const provider = (): ImageProvider => ({
    name: "google",
    async generate() {
      return { base64: Buffer.from("png").toString("base64"), mimeType: "image/png" };
    },
  });

  it("選んだ枠だけを作り、保存して、作った枚数で費用を記録する", async () => {
    const user = fakeDb({ articles: article, memberships: { role: "client_member" }, article_versions: version, article_images: [] }, { rpc: { start_generation: { id: "r1", status: "queued" } } });
    const admin = fakeDb({ generation_runs: [{ id: "r1" }], article_images: null });
    const r = await runImageGeneration({ user: user.client, admin: admin.client, provider: provider(), isSample: false }, { articleId: "a1", slots: ["eyecatch", "見出し2"], idempotencyKey: "k-123456789" });
    expect(r).toMatchObject({ ok: true, failed: 0 });
    expect(admin.storage.filter((s) => s.op === "upload").map((s) => String(s.args[0]))).toEqual([
      expect.stringMatching(/^o1\/a1\/eyecatch-\d+\.png$/),
      expect.stringMatching(/^o1\/a1\/h1-\d+\.png$/),
    ]);
    const upserts = admin.calls.filter((c) => c.table === "article_images" && c.op === "upsert").map((c) => (c.args[0] as { slot: string }).slot);
    expect(upserts).toEqual(["eyecatch", "見出し2"]);
    const finish = admin.calls.find((c) => c.op === "finish_generation")!.args[0] as { p_status: string; p_cost_yen: number };
    expect(finish).toMatchObject({ p_status: "succeeded", p_cost_yen: 2 * IMAGE_COST_YEN });
    const start = user.calls.find((c) => c.op === "start_generation")!.args[0] as { p_kind: string };
    expect(start.p_kind).toBe("image");
  });

  it("1枚が失敗しても、できた分は残して失敗の枚数を返す", async () => {
    const admin = fakeDb({ generation_runs: [{ id: "r1" }], article_images: null });
    const failing: ImageProvider = { name: "google", generate: async ({ prompt }) => (prompt.startsWith("fail") ? Promise.reject(new AiProviderError("refused", "x")) : provider().generate({ prompt })) };
    const v = { ...version, generation_settings: { image_suggestions: [{ ...idea("見出し1"), imagePrompt: "fail" }, idea("見出し2")] } };
    const user = fakeDb({ articles: article, memberships: { role: "client_member" }, article_versions: v, article_images: [] }, { rpc: { start_generation: { id: "r1", status: "queued" } } });
    const r = await runImageGeneration({ user: user.client, admin: admin.client, provider: failing, isSample: false }, { articleId: "a1", slots: [], idempotencyKey: "k-123456789" });
    expect(r).toMatchObject({ ok: true, failed: 1 });
    expect((admin.calls.find((c) => c.op === "finish_generation")!.args[0] as { p_cost_yen: number }).p_cost_yen).toBe(IMAGE_COST_YEN);
  });

  it("顧客担当者でない、画像の提案が無いときは作らない", async () => {
    const admin = fakeDb({});
    const coach = fakeDb({ articles: article, memberships: { role: "coach" } });
    expect(await runImageGeneration({ user: coach.client, admin: admin.client, provider: provider(), isSample: false }, { articleId: "a1", slots: [], idempotencyKey: "k-123456789" })).toMatchObject({ ok: false, status: 403 });
    const noIdeas = fakeDb({ articles: article, memberships: { role: "client_member" }, article_versions: { ...version, generation_settings: {} } });
    expect(await runImageGeneration({ user: noIdeas.client, admin: admin.client, provider: provider(), isSample: false }, { articleId: "a1", slots: [], idempotencyKey: "k-123456789" })).toMatchObject({ ok: false, status: 400 });
    expect(admin.calls).toEqual([]);
  });
});
