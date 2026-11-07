import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPhotoThemesPrompt, parsePhotoThemes } from "@/lib/ai/growthPrompts";
import { createGoogleTextProvider } from "@/lib/ai/providers/googleText";
import { createOpenAiTextProvider } from "@/lib/ai/providers/openaiText";
import { runPhotoThemes } from "@/lib/growth/hearingAi";
import { AiProviderError } from "@/lib/ai/provider";
import { SAMPLE_PHOTO_LABEL, SAMPLE_PHOTO_THEMES, fitSize } from "./photoStart";

const image = { mimeType: "image/jpeg" as const, data: "QUJD" };
const req = { kind: "hearing" as const, system: "s", user: "u", maxOutputTokens: 100, images: [image] };

describe("写真から記事を始める", () => {
  it("写真は長い辺1280pxまで小さくし、大きくはしない", () => {
    expect(fitSize(4032, 3024)).toEqual({ w: 1280, h: 960 });
    expect(fitSize(800, 600)).toEqual({ w: 800, h: 600 });
  });

  it("AIの返事からテーマを3つまで読み、足りないものは捨てる", () => {
    const r = parsePhotoThemes(JSON.stringify({ seen: "屋根の上で板金を張っている様子です", themes: [{ title: "工場の雨漏り、まず見る所", reader_problem: "工場の屋根から雨漏りして困っている設備担当", why: "作業中の手元" }, { title: "" }, { title: "a", reader_problem: "b" }, { title: "c", reader_problem: "d" }, { title: "e", reader_problem: "f" }] }));
    expect(r.seen).toBe("屋根の上で板金を張っている様子です");
    expect(r.themes).toHaveLength(3);
    expect(r.themes[0]).toEqual({ title: "工場の雨漏り、まず見る所", readerProblem: "工場の屋根から雨漏りして困っている設備担当", why: "作業中の手元" });
    expect(() => parsePhotoThemes('{"themes":[]}')).toThrow();
  });

  it("頼み文に、会社の情報とお客様のひとことをデータとして入れる", () => {
    const p = buildPhotoThemesPrompt({ profile: { business: "板金" }, memo: "屋根の修理" });
    expect(p).toContain("<materials>");
    expect(p).toContain("屋根の修理");
  });

  it("見本は「サンプル」と分かるようにする", () => {
    expect(SAMPLE_PHOTO_THEMES.seen).toContain(SAMPLE_PHOTO_LABEL);
    for (const t of SAMPLE_PHOTO_THEMES.themes) expect(t.title).toContain(SAMPLE_PHOTO_LABEL);
  });

  it("Gemini には写真を文といっしょに渡す", async () => {
    const generateContent = vi.fn().mockResolvedValue({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: "{}" }] } }] });
    await createGoogleTextProvider({ apiKey: "k", draftModel: "m", finishModel: "m", generateContent }).complete(req);
    expect(generateContent.mock.calls[0][0].contents).toEqual([{ role: "user", parts: [{ inlineData: { mimeType: "image/jpeg", data: "QUJD" } }, { text: "u" }] }]);
  });

  it("GPT には写真を data: のURLで渡す", async () => {
    const f = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: "{}" }] }], usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200 }));
    await createOpenAiTextProvider({ apiKey: "k", draftModel: "m", finishModel: "m", fetch: f }).complete(req);
    const body = JSON.parse(String(f.mock.calls[0][1]?.body));
    expect(body.input[0].content[0]).toEqual({ type: "input_image", image_url: "data:image/jpeg;base64,QUJD" });
  });

  it("写真の形が違うときは、AIを呼ばずに断る", async () => {
    const user = { auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) } } as unknown as SupabaseClient;
    const deps = { user, admin: {} as SupabaseClient, provider: { name: "x", complete: vi.fn() }, isSample: false };
    const r = await runPhotoThemes(deps, { organizationId: "o1", image: { mimeType: "image/gif", data: "QUJD" }, memo: "", idempotencyKey: "k" });
    expect(r).toMatchObject({ ok: false, code: "invalid_input" });
    const r2 = await runPhotoThemes(deps, { organizationId: "o1", image: { mimeType: "image/jpeg", data: "<script>" }, memo: "", idempotencyKey: "k" });
    expect(r2).toMatchObject({ ok: false, code: "invalid_input" });
    expect(deps.provider.complete).not.toHaveBeenCalled();
  });

  it("画像を読む役がクレジット切れなら、書き手のAIで読む", async () => {
    const q = { select: () => q, eq: () => q, maybeSingle: async () => ({ data: { profile: { business: "板金" } }, error: null }) };
    const user = {
      auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
      from: () => q,
      rpc: () => ({ single: async () => ({ data: { id: "r1", status: "queued" }, error: null }) }),
    } as unknown as SupabaseClient;
    const u = { update: () => u, eq: () => u, select: async () => ({ data: [{ id: "r1" }] }) };
    const admin = { from: () => u, rpc: async () => ({ error: null }) } as unknown as SupabaseClient;
    const ok = JSON.stringify({ seen: "屋根", themes: [{ title: "雨漏り", reader_problem: "工場の雨漏りに困る人" }] });
    const google = { name: "google", complete: vi.fn().mockRejectedValue(new AiProviderError("billing", "x", 402)) };
    const openai = { name: "openai", complete: vi.fn().mockResolvedValue({ text: ok, usage: { inputTokens: 1, outputTokens: 1 } }) };
    const r = await runPhotoThemes({ user, admin, provider: google, fallback: openai, isSample: false }, { organizationId: "o1", image, memo: "", idempotencyKey: "k" });
    expect(r).toMatchObject({ ok: true, themes: [{ title: "雨漏り" }] });
    expect(openai.complete.mock.calls[0][0].images).toEqual([image]);
  });
});
