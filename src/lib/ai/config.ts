// 環境変数から提供元を選ぶ。キーが無ければサンプルに切り替え、画面は「AIは未接続」と表示する。
// 環境変数の一覧と設定方法は .env.example と docs/AI_SETUP.md。サーバー側でだけ読む。

import type { ImageMode, ImageProvider } from "./images";
import type { AiProvider } from "./provider";
import { createAnthropicProvider } from "./providers/anthropic";
import { createGoogleImageProvider } from "./providers/google";
import { createOpenAiImageProvider } from "./providers/openai";
import { createOpenAiTextProvider } from "./providers/openaiText";
import { sampleImageProvider, sampleTextProvider } from "./providers/sample";

export const DEFAULTS = {
  textProvider: "openai",
  openaiTextModel: "gpt-6.1-sol",
  openaiFinishModel: "gpt-6.1-sol",
  anthropicTextModel: "claude-sonnet-5-5",
  anthropicFinishModel: "claude-opus-5-5",
  googleImageModel: "gemini-3.1-flash-image",
  openaiImageModel: "gpt-image-2.5",
  openaiImageSize: "1536x1024",
} as const;

export interface AiSetup {
  text: AiProvider;
  image: ImageProvider;
  imageMode: ImageMode;
  /** true のとき、画面に「サンプル（AIは未接続）」を出す */
  textIsSample: boolean;
  imageIsSample: boolean;
}

type Env = Record<string, string | undefined>;

const val = (env: Env, key: string) => env[key]?.trim() || undefined;

export function getAiSetup(env: Env = process.env): AiSetup {
  const text = pickTextProvider(env);
  const image = pickImageProvider(env);
  return {
    text,
    image,
    imageMode: val(env, "IMAGE_MODE") === "generate" ? "generate" : "suggest",
    textIsSample: text === sampleTextProvider,
    imageIsSample: image === sampleImageProvider,
  };
}

function pickTextProvider(env: Env): AiProvider {
  if ((val(env, "TEXT_PROVIDER") ?? DEFAULTS.textProvider) === "anthropic") {
    const key = val(env, "ANTHROPIC_API_KEY");
    return key
      ? createAnthropicProvider({
          apiKey: key,
          draftModel: val(env, "AI_TEXT_MODEL") ?? DEFAULTS.anthropicTextModel,
          finishModel: val(env, "AI_FINISH_MODEL") ?? DEFAULTS.anthropicFinishModel,
        })
      : sampleTextProvider;
  }
  const key = val(env, "OPENAI_API_KEY");
  return key
    ? createOpenAiTextProvider({
        apiKey: key,
        draftModel: val(env, "AI_TEXT_MODEL") ?? DEFAULTS.openaiTextModel,
        finishModel: val(env, "AI_FINISH_MODEL") ?? DEFAULTS.openaiFinishModel,
      })
    : sampleTextProvider;
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
