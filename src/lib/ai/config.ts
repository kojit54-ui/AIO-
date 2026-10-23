// 環境変数から提供元を選ぶ。キーが無ければサンプルに切り替え、画面は「AIは未接続」と表示する。
// 環境変数の一覧と設定方法は .env.example と docs/AI_SETUP.md。サーバー側でだけ読む。

import type { ImageMode, ImageProvider } from "./images";
import type { AiProvider } from "./provider";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGoogleImageProvider } from "./providers/google";
import { createGoogleTextProvider } from "./providers/googleText";
import { createOpenAiImageProvider } from "./providers/openai";
import { createOpenAiTextProvider } from "./providers/openaiText";
import { sampleImageProvider, sampleTextProvider } from "./providers/sample";

export const DEFAULTS = {
  textProvider: "openai" as TextProviderName,
  openaiTextModel: "gpt-6.1-sol",
  openaiFinishModel: "gpt-6.1-sol",
  anthropicTextModel: "claude-sonnet-5-5",
  anthropicFinishModel: "claude-opus-5-5",
  googleTextModel: "gemini-4-argon",
  googleFinishModel: "gemini-4-argon",
  googleImageModel: "gemini-3.1-flash-image",
  openaiImageModel: "gpt-image-2.5",
  openaiImageSize: "1536x1024",
} as const;

/** 文章の提供元。名前は AiProvider.name と同じ */
export const TEXT_PROVIDERS = ["openai", "anthropic", "google"] as const;
export type TextProviderName = (typeof TEXT_PROVIDERS)[number];

/**
 * 文章を作る役割。見出し案・本文（書き直しを含む）は書き手、review は点検役、images は画像の提案役。
 * 既定は 書き手＝TEXT_PROVIDER（OpenAI）、点検＝Anthropic、画像の提案＝Google（docs/DECISIONS.md 2026-10-23）
 */
export type TextStep = "outline" | "body" | "review" | "images";

const ROLE_DEFAULTS: Partial<Record<TextStep, TextProviderName>> = { review: "anthropic", images: "google" };
const STEP_ENV: Record<TextStep, string> = { outline: "OUTLINE_PROVIDER", body: "BODY_PROVIDER", review: "REVIEW_PROVIDER", images: "IMAGE_IDEA_PROVIDER" };

export interface AiSetup {
  /** 既定の提供元（TEXT_PROVIDER） */
  text: AiProvider;
  /** 役割ごとの提供元（OUTLINE_PROVIDER・BODY_PROVIDER・REVIEW_PROVIDER・IMAGE_IDEA_PROVIDER）。点検と画像の提案は、その会社のキーが無ければ本文の書き手が受け持つ */
  textFor(step: TextStep): AiProvider;
  image: ImageProvider;
  imageMode: ImageMode;
  /** true のとき、画面に「サンプル（AIは未接続）」を出す */
  textIsSample: boolean;
  imageIsSample: boolean;
}

type Env = Record<string, string | undefined>;

const val = (env: Env, key: string) => env[key]?.trim() || undefined;

const asProviderName = (v: string | undefined): TextProviderName | undefined => TEXT_PROVIDERS.find((p) => p === v);

export function getAiSetup(env: Env = process.env): AiSetup {
  const defaultName = asProviderName(val(env, "TEXT_PROVIDER")) ?? DEFAULTS.textProvider;
  const cache = new Map<TextProviderName, AiProvider>();
  const provider = (name: TextProviderName) => {
    if (!cache.has(name)) cache.set(name, createTextProvider(env, name, name === defaultName));
    return cache.get(name)!;
  };
  const text = provider(defaultName);
  const stepProvider = (step: TextStep) => provider(asProviderName(val(env, STEP_ENV[step])) ?? ROLE_DEFAULTS[step] ?? defaultName);
  const image = pickImageProvider(env);
  return {
    text,
    textFor: (step) => {
      const p = stepProvider(step);
      return p === sampleTextProvider && (step === "review" || step === "images") ? stepProvider("body") : p;
    },
    image,
    imageMode: val(env, "IMAGE_MODE") === "generate" ? "generate" : "suggest",
    textIsSample: stepProvider("outline") === sampleTextProvider || stepProvider("body") === sampleTextProvider,
    imageIsSample: image === sampleImageProvider,
  };
}

/**
 * 提供元ごとのモデルは OPENAI_TEXT_MODEL・ANTHROPIC_TEXT_MODEL・GEMINI_TEXT_MODEL（仕上げは *_FINISH_MODEL）。
 * 以前からの AI_TEXT_MODEL・AI_FINISH_MODEL は既定の提供元（TEXT_PROVIDER）にだけ効く。
 */
function createTextProvider(env: Env, name: TextProviderName, isDefault: boolean): AiProvider {
  const prefix = { openai: "OPENAI", anthropic: "ANTHROPIC", google: "GEMINI" }[name];
  const model = (kind: "TEXT" | "FINISH", fallback: string) =>
    val(env, `${prefix}_${kind}_MODEL`) ?? (isDefault ? val(env, `AI_${kind}_MODEL`) : undefined) ?? fallback;
  const key = val(env, `${prefix}_API_KEY`);
  if (!key) return sampleTextProvider;
  if (name === "anthropic") {
    return createAnthropicProvider({ apiKey: key, draftModel: model("TEXT", DEFAULTS.anthropicTextModel), finishModel: model("FINISH", DEFAULTS.anthropicFinishModel) });
  }
  if (name === "google") {
    return createGoogleTextProvider({ apiKey: key, draftModel: model("TEXT", DEFAULTS.googleTextModel), finishModel: model("FINISH", DEFAULTS.googleFinishModel) });
  }
  return createOpenAiTextProvider({ apiKey: key, draftModel: model("TEXT", DEFAULTS.openaiTextModel), finishModel: model("FINISH", DEFAULTS.openaiFinishModel) });
}

function pickImageProvider(env: Env): ImageProvider {
  if ((val(env, "IMAGE_PROVIDER") ?? "google") === "openai") {
    const key = val(env, "OPENAI_API_KEY");
    return key
      ? createOpenAiImageProvider({
          apiKey: key,
          model: val(env, "OPENAI_IMAGE_MODEL") ?? DEFAULTS.openaiImageModel,
          size: val(env, "OPENAI_IMAGE_SIZE") ?? DEFAULTS.openaiImageSize,
        })
      : sampleImageProvider;
  }
  const key = val(env, "GEMINI_API_KEY");
  return key ? createGoogleImageProvider({ apiKey: key, model: val(env, "GOOGLE_IMAGE_MODEL") ?? DEFAULTS.googleImageModel }) : sampleImageProvider;
}
