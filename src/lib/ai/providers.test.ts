import { describe, expect, it, vi } from "vitest";
import { getAiSetup } from "./config";
import { buildImagePrompt, IMAGE_RULES } from "./images";
import { parseBodyResult, ParseError } from "./prompt";
import { AiProviderError } from "./provider";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGoogleImageProvider } from "./providers/google";
import { createOpenAiImageProvider } from "./providers/openai";
import { createOpenAiTextProvider } from "./providers/openaiText";
import { sampleImageProvider, sampleTextProvider, SAMPLE_LABEL } from "./providers/sample";
import { generateBody, generateOutline } from "./provider";
import { COACHING_NOTES, ORGANIZATIONS, QUESTIONS, THEMES } from "@/mock/data";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const message = (over: Record<string, unknown> = {}) => ({
  id: "msg_1",
  type: "message",
  role: "assistant",
  model: "claude-sonnet-5-5",
  content: [{ type: "text", text: '{"ok":true}' }],
  stop_reason: "end_turn",
  usage: { input_tokens: 10, output_tokens: 5 },
  ...over,
});

const req = { kind: "body" as const, system: "s", user: "u", maxOutputTokens: 100 };

describe("getAiSetup", () => {
  it("キーが無ければサンプルを使う", () => {
    const s = getAiSetup({});
    expect(s).toMatchObject({ textIsSample: true, imageIsSample: true, imageMode: "suggest" });
  });

  it("文章は OpenAI、画像は Google を使い、それぞれ切り替えられる", () => {
    const s = getAiSetup({ OPENAI_API_KEY: "o", GEMINI_API_KEY: "g", IMAGE_MODE: "generate" });
    expect([s.text.name, s.image.name, s.imageMode]).toEqual(["openai", "google", "generate"]);
    expect(getAiSetup({ ANTHROPIC_API_KEY: "a" }).textIsSample).toBe(true);
    expect(getAiSetup({ TEXT_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "a" }).text.name).toBe("anthropic");
    expect(getAiSetup({ IMAGE_PROVIDER: "openai", OPENAI_API_KEY: "o" }).image.name).toBe("openai");
  });
});

describe("サンプル（キー未設定のとき）", () => {
  it("同じ流れで見出し案・本文・画像案を返し、サンプルと分かる", async () => {
    const ctx = {
      organization: ORGANIZATIONS.find((o) => o.id === "org_sakura")!,
      note: COACHING_NOTES.find((n) => n.organizationId === "org_sakura"),
      theme: THEMES[0],
      questions: QUESTIONS,
      answers: [],
      referenceArticles: [],
    };
    const outline = await generateOutline(sampleTextProvider, ctx);
    const body = await generateBody(sampleTextProvider, ctx, outline.outline.map((o) => o.heading));
    expect(outline.titleCandidates[0]).toContain(SAMPLE_LABEL);
    expect(body.imageSuggestions.map((i) => i.heading)).toEqual(outline.outline.map((o) => o.heading));
    expect((await sampleImageProvider.generate({ prompt: "x" })).mimeType).toBe("image/svg+xml");
  });
});

describe("Anthropic", () => {
  it("普段は Sonnet、仕上げは Opus を呼び、代替モデルの設定を付ける", async () => {
    const f = vi.fn<typeof fetch>(async () => json(message()));
    const p = createAnthropicProvider({ apiKey: "k", draftModel: "claude-sonnet-5-5", finishModel: "claude-opus-5-5", fetch: f });
    const res = await p.complete(req);
    await p.complete({ ...req, quality: "finish" });
    const bodies = f.mock.calls.map((c) => JSON.parse(String(c[1]?.body)));
    expect(bodies.map((b) => b.model)).toEqual(["claude-sonnet-5-5", "claude-opus-5-5"]);
    expect(bodies[0]).toMatchObject({ fallbacks: "default", output_config: { effort: "medium" } });
    expect(res).toEqual({ text: '{"ok":true}', usage: { inputTokens: 10, outputTokens: 5 } });
  });

  it("断られた・途中で切れた・キー違いを区別する", async () => {
    const make = (r: Response) => createAnthropicProvider({ apiKey: "k", draftModel: "m", finishModel: "m", fetch: (async () => r) as typeof fetch });
    await expect(make(json(message({ stop_reason: "refusal" }))).complete(req)).rejects.toMatchObject({ code: "refused" });
    await expect(make(json(message({ stop_reason: "max_tokens" }))).complete(req)).rejects.toMatchObject({ code: "truncated" });
    await expect(make(json({ type: "error", error: { type: "authentication_error", message: "x" } }, 401)).complete(req)).rejects.toMatchObject({
      code: "auth",
    });
  });
});

const response = (over: Record<string, unknown> = {}) => ({
  id: "resp_1",
  status: "completed",
  output: [
    { type: "reasoning", summary: [] },
    { type: "message", role: "assistant", content: [{ type: "output_text", text: '{"ok":true}' }] },
  ],
  usage: { input_tokens: 10, output_tokens: 5 },
  ...over,
});

describe("OpenAI（文章）", () => {
  it("JSONで返させ、会話を保存させず、仕上げでは考える量を増やす", async () => {
    const f = vi.fn<typeof fetch>(async () => json(response()));
    const p = createOpenAiTextProvider({ apiKey: "k", draftModel: "gpt-draft", finishModel: "gpt-finish", fetch: f });
    const res = await p.complete(req);
    await p.complete({ ...req, quality: "finish" });
    const bodies = f.mock.calls.map((c) => JSON.parse(String(c[1]?.body)));
    expect(f.mock.calls[0][0]).toBe("https://api.openai.com/v1/responses");
    expect(bodies.map((b) => [b.model, b.reasoning.effort])).toEqual([
      ["gpt-draft", "medium"],
      ["gpt-finish", "high"],
    ]);
    expect(bodies[0]).toMatchObject({ instructions: "s", input: "u", max_output_tokens: 100, store: false, text: { format: { type: "json_object" } } });
    expect(res).toEqual({ text: '{"ok":true}', usage: { inputTokens: 10, outputTokens: 5 } });
  });

  it("断られた・途中で切れた・キー違い・上限を区別する", async () => {
    const make = (r: Response) => createOpenAiTextProvider({ apiKey: "k", draftModel: "m", finishModel: "m", fetch: (async () => r) as typeof fetch });
    const refusal = response({ output: [{ type: "message", content: [{ type: "refusal", refusal: "no" }] }] });
    await expect(make(json(refusal)).complete(req)).rejects.toMatchObject({ code: "refused" });
    await expect(make(json(response({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" } }))).complete(req)).rejects.toMatchObject({
      code: "truncated",
    });
    await expect(make(json({ error: { message: "x" } }, 401)).complete(req)).rejects.toMatchObject({ code: "auth" });
    await expect(make(json({ error: { message: "x" } }, 429)).complete(req)).rejects.toMatchObject({ code: "rate_limited" });
  });
});

describe("画像", () => {
  it("どの画像にも文字を入れない条件を最後に付ける", () => {
    const p = buildImagePrompt({ imagePrompt: "A warm bathroom" });
    expect(p.endsWith(IMAGE_RULES)).toBe(true);
    expect(IMAGE_RULES).toContain("Do not include any text");
  });

  it("Google は 16:9 で画像を1枚作り、返ってこなければ断られた扱いにする", async () => {
    const generateContent = vi
      .fn()
      .mockResolvedValueOnce({ candidates: [{ content: { parts: [{ text: "ok" }, { inlineData: { data: "AAA", mimeType: "image/png" } }] } }] });
    const p = createGoogleImageProvider({ apiKey: "k", model: "gemini-image", generateContent });
    expect(await p.generate({ prompt: "x" })).toEqual({ base64: "AAA", mimeType: "image/png" });
    expect(generateContent.mock.calls[0][0]).toMatchObject({
      model: "gemini-image",
      contents: "x",
      config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
    });
    generateContent.mockResolvedValueOnce({ candidates: [{ content: { parts: [{ text: "できません" }] } }] });
    await expect(p.generate({ prompt: "x" })).rejects.toMatchObject({ code: "refused" });
    generateContent.mockRejectedValueOnce(Object.assign(new Error("quota"), { status: 429 }));
    await expect(p.generate({ prompt: "x" })).rejects.toMatchObject({ code: "rate_limited" });
  });

  it("OpenAI に切り替えても同じ形で返す", async () => {
    const f = vi.fn(async () => json({ data: [{ b64_json: "BBB" }] }));
    const p = createOpenAiImageProvider({ apiKey: "k", model: "gpt-image", size: "1536x1024", fetch: f as typeof fetch });
    expect(await p.generate({ prompt: "x" })).toEqual({ base64: "BBB", mimeType: "image/png" });
    const bad = createOpenAiImageProvider({ apiKey: "k", model: "m", size: "s", fetch: (async () => json({}, 401)) as typeof fetch });
    await expect(bad.generate({ prompt: "x" })).rejects.toBeInstanceOf(AiProviderError);
  });

  it("画像案は決まった形だけ受け付ける", () => {
    const base = { body: [{ type: "paragraph", text: "a" }] };
    const ok = parseBodyResult(JSON.stringify({ ...base, image_suggestions: [{ heading: "h", photo_idea: "p", alt: "a", image_prompt: "i" }] }));
    expect(ok.imageSuggestions).toEqual([{ heading: "h", photoIdea: "p", alt: "a", imagePrompt: "i" }]);
    expect(() => parseBodyResult(JSON.stringify({ ...base, image_suggestions: [{ heading: "h" }] }))).toThrow(ParseError);
  });
});
