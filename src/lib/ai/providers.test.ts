import { describe, expect, it, vi } from "vitest";
import { getAiSetup } from "./config";
import { buildImagePrompt, IMAGE_RULES } from "./images";
import { parseBodyResult, parseImageIdeas, parseReviewResult, ParseError } from "./prompt";
import { AiProviderError } from "./provider";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGoogleImageProvider } from "./providers/google";
import { createGoogleTextProvider } from "./providers/googleText";
import { createOpenAiImageProvider } from "./providers/openai";
import { createOpenAiTextProvider } from "./providers/openaiText";
import { sampleImageProvider, sampleTextProvider, SAMPLE_LABEL } from "./providers/sample";
import { type AiProvider, generateOutline, generateReviewedBody } from "./provider";
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
    expect(getAiSetup({ TEXT_PROVIDER: "google", GEMINI_API_KEY: "g" }).text.name).toBe("google");
  });

  it("役割ごとに提供元を選ぶ：既定は 書き手＝OpenAI、点検＝Anthropic、画像の提案＝Google", () => {
    const all = getAiSetup({ OPENAI_API_KEY: "o", ANTHROPIC_API_KEY: "a", GEMINI_API_KEY: "g" });
    expect((["outline", "body", "review", "images"] as const).map((k) => all.textFor(k).name)).toEqual(["openai", "openai", "anthropic", "google"]);
    // 点検・画像の提案の会社のキーが無ければ、本文の書き手が受け持つ
    const onlyOpenAi = getAiSetup({ OPENAI_API_KEY: "o" });
    expect([onlyOpenAi.textFor("review").name, onlyOpenAi.textFor("images").name]).toEqual(["openai", "openai"]);
    expect(getAiSetup({ OPENAI_API_KEY: "o", GEMINI_API_KEY: "g", REVIEW_PROVIDER: "google" }).textFor("review").name).toBe("google");

    const env = { OPENAI_API_KEY: "o", ANTHROPIC_API_KEY: "a", OUTLINE_PROVIDER: "anthropic" };
    const s = getAiSetup(env);
    expect([s.textFor("outline").name, s.textFor("body").name, s.text.name]).toEqual(["anthropic", "openai", "openai"]);
    expect(s.textIsSample).toBe(false);
    // 指定した提供元のキーが無ければ、その手順はサンプルになり、画面にもそう出す
    expect(getAiSetup({ OPENAI_API_KEY: "o", BODY_PROVIDER: "google" }).textIsSample).toBe(true);
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
    const roles = { writer: sampleTextProvider, reviewer: sampleTextProvider, imageIdeas: sampleTextProvider };
    const body = await generateReviewedBody(roles, ctx, outline.outline.map((o) => o.heading));
    expect(outline.titleCandidates[0]).toContain(SAMPLE_LABEL);
    expect(body.imageSuggestions.map((i) => i.heading)).toEqual(outline.outline.map((o) => o.heading));
    expect(body.eyecatch?.photoIdea).toContain(SAMPLE_LABEL);
    expect(body.review).toMatchObject({ findings: [], rewritten: false });
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

describe("Google（文章）", () => {
  it("JSONで返させ、仕上げでは考える量を増やし、考えた分も出力として数える", async () => {
    const ok = { candidates: [{ finishReason: "STOP", content: { parts: [{ text: "…", thought: true }, { text: '{"ok":true}' }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, thoughtsTokenCount: 3 } };
    const generateContent = vi.fn().mockResolvedValue(ok);
    const p = createGoogleTextProvider({ apiKey: "k", draftModel: "gemini-draft", finishModel: "gemini-finish", generateContent });
    const res = await p.complete(req);
    await p.complete({ ...req, quality: "finish" });
    const calls = generateContent.mock.calls.map((c) => c[0]);
    expect(calls.map((c) => [c.model, c.config.thinkingConfig.thinkingLevel])).toEqual([
      ["gemini-draft", "MEDIUM"],
      ["gemini-finish", "HIGH"],
    ]);
    expect(calls[0]).toMatchObject({ contents: "u", config: { systemInstruction: "s", maxOutputTokens: 100, responseMimeType: "application/json" } });
    expect(res).toEqual({ text: '{"ok":true}', usage: { inputTokens: 10, outputTokens: 8 } });
  });

  it("断られた・途中で切れた・キー違い・上限を区別する", async () => {
    const make = (r: unknown, reject = false) =>
      createGoogleTextProvider({ apiKey: "k", draftModel: "m", finishModel: "m", generateContent: vi.fn()[reject ? "mockRejectedValue" : "mockResolvedValue"](r) });
    await expect(make({ promptFeedback: { blockReason: "SAFETY" } }).complete(req)).rejects.toMatchObject({ code: "refused" });
    await expect(make({ candidates: [{ finishReason: "SAFETY" }] }).complete(req)).rejects.toMatchObject({ code: "refused" });
    await expect(make({ candidates: [{ finishReason: "MAX_TOKENS" }] }).complete(req)).rejects.toMatchObject({ code: "truncated" });
    await expect(make(Object.assign(new Error("x"), { status: 403 }), true).complete(req)).rejects.toMatchObject({ code: "auth" });
    await expect(make(Object.assign(new Error("x"), { status: 429 }), true).complete(req)).rejects.toMatchObject({ code: "rate_limited" });
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
    const img = { heading: "h", photo_idea: "p", alt: "a", image_prompt: "i" };
    const ok = parseImageIdeas(JSON.stringify({ eyecatch: { photo_idea: "e", alt: "a", image_prompt: "i" }, image_suggestions: [img] }));
    expect(ok.imageSuggestions).toEqual([{ heading: "h", photoIdea: "p", alt: "a", imagePrompt: "i" }]);
    expect(ok.eyecatch).toEqual({ heading: "", photoIdea: "e", alt: "a", imagePrompt: "i" });
    expect(() => parseImageIdeas(JSON.stringify({ image_suggestions: [{ heading: "h" }] }))).toThrow(ParseError);
    expect(() => parseBodyResult(JSON.stringify({ body: [] }))).toThrow(ParseError);
  });
});

describe("役割分担（書く → 点検 → 書き直し、画像の提案）", () => {
  const ctx = {
    organization: ORGANIZATIONS.find((o) => o.id === "org_sakura")!,
    note: COACHING_NOTES.find((n) => n.organizationId === "org_sakura"),
    theme: THEMES[0],
    questions: QUESTIONS,
    answers: [],
    referenceArticles: [],
  };
  const bodyJson = (text: string) => JSON.stringify({ title_candidates: ["t"], body: [{ type: "heading", level: 2, text: "h1" }, { type: "paragraph", text }], fact_checks: [], needs_info: [] });
  const fake = (name: string, reply: (kind: string, user: string) => string): AiProvider & { calls: { kind: string; user: string }[] } => {
    const calls: { kind: string; user: string }[] = [];
    return {
      name,
      calls,
      async complete(r) {
        calls.push({ kind: r.kind, user: r.user });
        return { text: reply(r.kind, r.user), usage: { inputTokens: 1000, outputTokens: 100 } };
      },
    };
  };

  it("点検の指摘を書き手に渡して1回だけ書き直し、工程ごとの使用量を返す", async () => {
    const writer = fake("openai", (kind) => bodyJson(kind === "rewrite" ? "直した本文" : "下書き"));
    const reviewer = fake("anthropic", () => JSON.stringify({ summary: "s", findings: [{ category: "ai_tone", excerpt: "下書き", advice: "具体的に" }] }));
    const images = fake("google", () => JSON.stringify({ eyecatch: { photo_idea: "e", alt: "a", image_prompt: "i" }, image_suggestions: [{ heading: "h1", photo_idea: "p", alt: "a", image_prompt: "i" }] }));
    const r = await generateReviewedBody({ writer, reviewer, imageIdeas: images }, ctx, ["h1"]);
    expect(r.body[1]).toEqual({ type: "paragraph", text: "直した本文" });
    expect(writer.calls.map((c) => c.kind)).toEqual(["body", "rewrite"]);
    expect(writer.calls[1].user).toContain("具体的に");
    expect(reviewer.calls[0].user).toContain("<draft>");
    expect(r.review).toMatchObject({ provider: "anthropic", rewritten: true });
    expect(r.eyecatch?.photoIdea).toBe("e");
    // 画像の提案は点検・書き直しと並行するため、終わった順は決まらない
    expect(r.steps.map((s) => [s.step, s.provider, s.ok]).sort()).toEqual([
      ["images", "google", true],
      ["review", "anthropic", true],
      ["rewrite", "openai", true],
      ["write", "openai", true],
    ]);
  });

  it("書き直しは画像の提案の終わりを待たない", async () => {
    let releaseImages = () => {};
    const imagesDone = new Promise<void>((r) => (releaseImages = r));
    const writer = fake("openai", (kind) => bodyJson(kind === "rewrite" ? "直した本文" : "下書き"));
    const reviewer = fake("anthropic", () => JSON.stringify({ summary: "", findings: [{ category: "aio", excerpt: "x", advice: "y" }] }));
    const slowImages: AiProvider = {
      name: "google",
      async complete() {
        await imagesDone;
        return { text: JSON.stringify({ image_suggestions: [] }), usage: { inputTokens: 0, outputTokens: 0 } };
      },
    };
    const pending = generateReviewedBody({ writer, reviewer, imageIdeas: slowImages }, ctx, ["h1"]);
    await vi.waitFor(() => expect(writer.calls.map((c) => c.kind)).toEqual(["body", "rewrite"]));
    releaseImages();
    expect((await pending).review?.rewritten).toBe(true);
  });

  it("点検・書き直し・画像の提案が失敗しても、下書きで返す", async () => {
    const writer = fake("openai", (kind) => (kind === "rewrite" ? "読めない" : bodyJson("下書き")));
    const reviewer = fake("anthropic", () => JSON.stringify({ summary: "", findings: [{ category: "aio", excerpt: "x", advice: "y" }] }));
    const broken: AiProvider = { name: "google", complete: async () => { throw new AiProviderError("unavailable", "x"); } };
    const r = await generateReviewedBody({ writer, reviewer, imageIdeas: broken }, ctx, ["h1"]);
    expect(r.body[1]).toEqual({ type: "paragraph", text: "下書き" });
    expect(r.review?.rewritten).toBe(false);
    expect(r.imageSuggestions).toEqual([]);
    // 返答が読めなかった書き直しも、使った分は残す
    expect(r.steps.find((s) => s.step === "rewrite")).toMatchObject({ ok: false, usage: { inputTokens: 1000 } });
    expect(r.steps.find((s) => s.step === "images")).toMatchObject({ ok: false });
  });

  it("指摘が無ければ書き直さない。点検結果は決まった形だけ受け付ける", async () => {
    const writer = fake("openai", () => bodyJson("下書き"));
    const reviewer = fake("anthropic", () => JSON.stringify({ summary: "良い", findings: [] }));
    const r = await generateReviewedBody({ writer, reviewer, imageIdeas: reviewer }, ctx, ["h1"]);
    expect(writer.calls).toHaveLength(1);
    expect(r.review?.rewritten).toBe(false);
    expect(() => parseReviewResult(JSON.stringify({ findings: [{ category: "unknown", excerpt: "x", advice: "y" }] }))).toThrow(ParseError);
  });
});
