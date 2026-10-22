// 見出しごとの画像。初期は「撮るとよい写真」の提案（追加費用なし）を出し、生成はオプション。
// 生成する画像には文字を入れない（日本語の文字が崩れやすいため）。実在の事例に見える写真も避ける。
// 提供元は Google（既定）と OpenAI を差し替えられる。サーバー側でだけ使う。

import type { ImageSuggestion } from "./prompt";

export type ImageMode = "suggest" | "generate";

export interface GeneratedImage {
  base64: string;
  mimeType: string;
}

export interface ImageProvider {
  readonly name: string;
  generate(req: { prompt: string; signal?: AbortSignal }): Promise<GeneratedImage>;
}

/** すべての画像に付ける共通の条件。AIの書いた image_prompt より後ろに置き、上書きされないようにする */
export const IMAGE_RULES =
  "Style: clean, soft, explanatory illustration for a small business blog, 16:9. " +
  "Do not include any text, letters, numbers, captions, signs, logos or watermarks. " +
  "Do not depict identifiable real people, real brands, or anything that looks like a documented real project or customer case.";

export function buildImagePrompt(s: Pick<ImageSuggestion, "imagePrompt">): string {
  return `${s.imagePrompt.trim()}\n\n${IMAGE_RULES}`;
}

export async function generateHeadingImage(provider: ImageProvider, s: ImageSuggestion, signal?: AbortSignal): Promise<GeneratedImage & { alt: string }> {
  const img = await provider.generate({ prompt: buildImagePrompt(s), signal });
  return { ...img, alt: s.alt };
}
