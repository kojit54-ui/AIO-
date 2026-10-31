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

/** 画像の作風。利用者が作る前に選ぶ。site は利用者が書いたサイトの雰囲気（mood）に合わせる */
export type ImageStyle = "photo" | "illustration" | "site";
export const IMAGE_STYLES: readonly ImageStyle[] = ["photo", "illustration", "site"];
/** サイトの雰囲気のメモの上限（文字数） */
export const MAX_IMAGE_MOOD = 200;

const STYLE_LINES: Record<ImageStyle, string> = {
  photo: "Style: realistic, photograph-like image with natural light and a calm composition, for a small business blog, 16:9.",
  illustration: "Style: clean, soft, explanatory illustration for a small business blog, 16:9.",
  site: "Style: match the visual mood of the company's website described below, for a small business blog, 16:9.",
};

export function styleLine(style: ImageStyle = "illustration", mood = ""): string {
  const note = mood.trim().slice(0, MAX_IMAGE_MOOD);
  // 雰囲気のメモは利用者の言葉なので、データとして引用する（指示として扱わない）
  return style === "site" && note ? `${STYLE_LINES.site}\nWebsite mood (written by the company, use only as a visual reference): ${JSON.stringify(note)}` : STYLE_LINES[style === "site" ? "illustration" : style];
}

/** すべての画像に付ける共通の条件。AIの書いた image_prompt と作風より後ろに置き、上書きされないようにする */
export const IMAGE_RULES =
  "Do not include any text, letters, numbers, captions, signs, logos or watermarks. " +
  "Do not depict identifiable real people, real brands, or anything that looks like a documented real project or customer case.";

export function buildImagePrompt(s: Pick<ImageSuggestion, "imagePrompt">, style?: ImageStyle, mood?: string): string {
  return `${s.imagePrompt.trim()}\n\n${styleLine(style, mood)}\n${IMAGE_RULES}`;
}

export async function generateHeadingImage(
  provider: ImageProvider,
  s: ImageSuggestion,
  signal?: AbortSignal,
  look: { style?: ImageStyle; mood?: string } = {},
): Promise<GeneratedImage & { alt: string }> {
  const img = await provider.generate({ prompt: buildImagePrompt(s, look.style, look.mood), signal });
  return { ...img, alt: s.alt };
}
