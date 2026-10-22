import { describe, expect, it, vi } from "vitest";
import { getAiSetup } from "./config";
import { buildImagePrompt, IMAGE_RULES } from "./images";
import { parseBodyResult, ParseError } from "./prompt";
import { AiProviderError } from "./provider";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGoogleImageProvider } from "./providers/google";
import { createOpenAiImageProvider } from "./providers/openai";
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

  it("キーがあれば Anthropic と Google を使い、OpenAI に切り替えられる", () => {
    const s = getAiSetup({ ANTHROPIC_API_KEY: "a", GEMINI_API_KEY: "g", IMAGE_MODE: "generate" });
    expect([s.text.name, s.image.name, s.imageMode]).toEqual(["anthropic", "google", "generate"]);
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

describe("画像", () => {
  it("どの画像にも文字を入れない条件を最後に付ける", () => {
    const p = buildImagePrompt({ imagePrompt: "A warm bathroom" });
    expect(p.endsWith(IMAGE_RULES)).toBe(true);
    expect(IMAGE_RULES).toContain("Do not include any text");
  });

  it("Google は 16:9 で1枚作り、返ってこなければ断られた扱いにする", async () => {
    const generateImages = vi.fn().mockResolvedValueOnce({ generatedImages: [{ image: { imageBytes: "AAA", mimeType: "image/png" } }] });
    const p = createGoogleImageProvider({ apiKey: "k", model: "imagen", generateImages });
    expect(await p.generate({ prompt: "x" })).toEqual({ base64: "AAA", mimeType: "image/png" });
    expect(generateImages.mock.calls[0][0]).toMatchObject({ model: "imagen", config: { numberOfImages: 1, aspectRatio: "16:9" } });
    generateImages.mockResolvedValueOnce({ generatedImages: [] });
    await expect(p.generate({ prompt: "x" })).rejects.toMatchObject({ code: "refused" });
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
