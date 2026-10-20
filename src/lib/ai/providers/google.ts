// 画像生成：Google（Imagen）。既定の画像の提供元。

import { GoogleGenAI } from "@google/genai";
import type { ImageProvider } from "../images";
import { AiProviderError } from "../provider";

type GenerateImages = GoogleGenAI["models"]["generateImages"];

export interface GoogleImageOptions {
  apiKey: string;
  model: string;
  /** テスト用。省略時は SDK のクライアント */
  generateImages?: GenerateImages;
}

export function createGoogleImageProvider(opts: GoogleImageOptions): ImageProvider {
  const generateImages: GenerateImages = opts.generateImages ?? ((p) => new GoogleGenAI({ apiKey: opts.apiKey }).models.generateImages(p));

  return {
    name: "google",
    async generate({ prompt, signal }) {
      let res: Awaited<ReturnType<GenerateImages>>;
      try {
        res = await generateImages({
          model: opts.model,
          prompt,
          config: { numberOfImages: 1, aspectRatio: "16:9", outputMimeType: "image/png", abortSignal: signal },
        });
      } catch (e) {
        if (signal?.aborted) throw e;
        const status = (e as { status?: number })?.status;
        if (status === 401 || status === 403) throw new AiProviderError("auth", "GoogleのAPIキーが正しくないか、権限がありません");
        if (status === 429) throw new AiProviderError("rate_limited", "画像AIの利用上限に達しました。少し待ってから再試行してください");
        throw new AiProviderError("unavailable", `画像の生成に失敗しました（${status ?? "接続エラー"}）`);
      }
      const image = res.generatedImages?.[0]?.image;
      if (!image?.imageBytes) throw new AiProviderError("refused", "画像AIがこの内容の生成を断りました");
      return { base64: image.imageBytes, mimeType: image.mimeType ?? "image/png" };
    },
  };
}
