// 画像生成：Google（Gemini の画像モデル）。既定の画像の提供元。
// Imagen（generateImages）は Gemini API のキーでは使えないため、generateContent で画像モデルを呼ぶ。

import { GoogleGenAI } from "@google/genai";
import type { ImageProvider } from "../images";
import { AiProviderError } from "../provider";

type GenerateContent = GoogleGenAI["models"]["generateContent"];

export interface GoogleImageOptions {
  apiKey: string;
  model: string;
  /** テスト用。省略時は SDK のクライアント */
  generateContent?: GenerateContent;
}

export function createGoogleImageProvider(opts: GoogleImageOptions): ImageProvider {
  const generateContent: GenerateContent = opts.generateContent ?? ((p) => new GoogleGenAI({ apiKey: opts.apiKey }).models.generateContent(p));

  return {
    name: "google",
    async generate({ prompt, signal }) {
      let res: Awaited<ReturnType<GenerateContent>>;
      try {
        res = await generateContent({
          model: opts.model,
          contents: prompt,
          config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" }, candidateCount: 1, abortSignal: signal },
        });
      } catch (e) {
        if (signal?.aborted) throw e;
        const status = (e as { status?: number })?.status;
        if (status === 401 || status === 403) throw new AiProviderError("auth", "GoogleのAPIキーが正しくないか、権限がありません");
        // 402：提供元の前払いクレジットが無い（Google AI Studio の前払い）。キーの誤りと区別する
        if (status === 402) throw new AiProviderError("billing", "AIの提供元のクレジット残高が足りません。コタムにご連絡ください");
        if (status === 429) throw new AiProviderError("rate_limited", "画像AIの利用上限に達しました。請求先の設定を確認するか、少し待ってから再試行してください");
        throw new AiProviderError("unavailable", `画像の生成に失敗しました（${status ?? "接続エラー"}）`);
      }
      const image = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData;
      if (!image?.data) throw new AiProviderError("refused", "画像AIがこの内容の生成を断りました");
      return { base64: image.data, mimeType: image.mimeType ?? "image/png" };
    },
  };
}
