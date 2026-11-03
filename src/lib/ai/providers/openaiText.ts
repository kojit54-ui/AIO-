// 文章生成：OpenAI（ChatGPT）。普段も仕上げも GPT-6.1 Sol で、仕上げは考える量を増やす（docs/DECISIONS.md）。
// サーバー側でだけ使う。Responses API の1エンドポイントだけなので、SDK を入れずに HTTP で呼ぶ。
// store: false で、OpenAI 側に会話を保存させない（不正監視のログは別。docs/AI_SETUP.md）。

import { AiProviderError, providerErrorDetail, type AiCompletionRequest, type AiProvider, type AiQuality } from "../provider";

export interface OpenAiTextOptions {
  apiKey: string;
  draftModel: string;
  finishModel: string;
  /** テスト用。省略時は標準の fetch */
  fetch?: typeof fetch;
}

/**
 * json_object で答えさせるとき、OpenAI は input（指示文ではなく）に「json」という語があることを求め、無いと 400（param: input）で断る。
 * 30秒でためすの入力には無かったので、無いときだけ一言足す（2026-11-03、docs/LESSONS.md）
 */
export function withJsonHint(user: string): string {
  return /json/i.test(user) ? user : `${user}\n\n返答はJSONで。`;
}

const EFFORT: Record<AiQuality, "medium" | "high"> = { draft: "medium", finish: "high" };

interface ResponsesResult {
  status?: string;
  incomplete_details?: { reason?: string } | null;
  output?: { type: string; content?: { type: string; text?: string }[] }[];
  usage?: { input_tokens?: number; output_tokens?: number };
}

export function createOpenAiTextProvider(opts: OpenAiTextOptions): AiProvider {
  const doFetch = opts.fetch ?? fetch;

  return {
    name: "openai",
    async complete(req: AiCompletionRequest) {
      const quality = req.quality ?? "draft";
      let res: Response;
      try {
        res = await doFetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
          body: JSON.stringify({
            model: quality === "finish" ? opts.finishModel : opts.draftModel,
            instructions: req.system,
            input: withJsonHint(req.user),
            max_output_tokens: req.maxOutputTokens,
            reasoning: { effort: EFFORT[quality] },
            text: { format: { type: "json_object" } },
            store: false,
          }),
          signal: req.signal,
        });
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") throw e;
        throw new AiProviderError("unavailable", "AIの呼び出しに失敗しました（接続エラー）");
      }

      if (res.status === 401 || res.status === 403) throw new AiProviderError("auth", "OpenAIのAPIキーが正しくないか、権限がありません");
      if (res.status === 429) throw new AiProviderError("rate_limited", "AIの利用上限に達しました。少し待ってから再試行してください");
      if (!res.ok) throw new AiProviderError("unavailable", `AIの呼び出しに失敗しました（${res.status}）`, res.status, await providerErrorDetail(res));

      const json = (await res.json()) as ResponsesResult;
      const parts = (json.output ?? []).flatMap((o) => (o.type === "message" ? (o.content ?? []) : []));
      if (parts.some((p) => p.type === "refusal") || json.incomplete_details?.reason === "content_filter") {
        throw new AiProviderError("refused", "AIがこの内容の生成を断りました");
      }
      if (json.status === "incomplete") throw new AiProviderError("truncated", "生成が途中で切れました");
      const text = parts.flatMap((p) => (p.type === "output_text" && p.text ? [p.text] : [])).join("");
      return { text, usage: { inputTokens: json.usage?.input_tokens ?? 0, outputTokens: json.usage?.output_tokens ?? 0 } };
    },
  };
}
