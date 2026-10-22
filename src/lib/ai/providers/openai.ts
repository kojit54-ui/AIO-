// 画像生成：OpenAI。Google から切り替えられるように用意しておく（IMAGE_PROVIDER=openai）。文章は openaiText.ts。
// 画像の1エンドポイントだけなので、SDK を入れずに HTTP で呼ぶ。

import type { ImageProvider } from "../images";
import { AiProviderError } from "../provider";

export interface OpenAiImageOptions {
  apiKey: string;
  model: string;
  size: string;
  fetch?: typeof fetch;
}

export function createOpenAiImageProvider(opts: OpenAiImageOptions): ImageProvider {
  const doFetch = opts.fetch ?? fetch;

  return {
    name: "openai",
    async generate({ prompt, signal }) {
      const res = await doFetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
        body: JSON.stringify({ model: opts.model, prompt, n: 1, size: opts.size }),
        signal,
      });
      if (res.status === 401 || res.status === 403) throw new AiProviderError("auth", "OpenAIのAPIキーが正しくないか、権限がありません");
      if (res.status === 429) throw new AiProviderError("rate_limited", "画像AIの利用上限に達しました。少し待ってから再試行してください");
      if (res.status === 400) throw new AiProviderError("refused", "画像AIがこの内容の生成を断りました");
      if (!res.ok) throw new AiProviderError("unavailable", `画像の生成に失敗しました（${res.status}）`);
      const json = (await res.json()) as { data?: { b64_json?: string }[] };
      const b64 = json.data?.[0]?.b64_json;
      if (!b64) throw new AiProviderError("unavailable", "画像が返ってきませんでした");
      return { base64: b64, mimeType: "image/png" };
    },
  };
}
