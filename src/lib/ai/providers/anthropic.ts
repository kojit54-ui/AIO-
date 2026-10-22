// 文章生成：Anthropic（Claude）。TEXT_PROVIDER=anthropic のときに使う。普段は Sonnet、仕上げは Opus。
// サーバー側でだけ使う。APIキーは環境変数から受け取り、ログや返り値に出さない。

import Anthropic from "@anthropic-ai/sdk";
import { AiProviderError, type AiCompletionRequest, type AiProvider, type AiQuality } from "../provider";

export interface AnthropicOptions {
  apiKey: string;
  draftModel: string;
  finishModel: string;
  /** テスト用。省略時は標準の fetch */
  fetch?: typeof fetch;
}

const EFFORT: Record<AiQuality, "medium" | "high"> = { draft: "medium", finish: "high" };

export function createAnthropicProvider(opts: AnthropicOptions): AiProvider {
  const client = new Anthropic({ apiKey: opts.apiKey, fetch: opts.fetch, maxRetries: 2 });

  return {
    name: "anthropic",
    async complete(req: AiCompletionRequest) {
      const quality = req.quality ?? "draft";
      let res: Anthropic.Beta.BetaMessage;
      try {
        res = await client.beta.messages.create(
          {
            model: quality === "finish" ? opts.finishModel : opts.draftModel,
            max_tokens: req.maxOutputTokens,
            system: req.system,
            messages: [{ role: "user", content: req.user }],
            output_config: { effort: EFFORT[quality] },
            // 安全側の判定で断られたとき、サーバー側で既定の代替モデルに回す
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
          },
          { signal: req.signal },
        );
      } catch (e) {
        throw toProviderError(e);
      }

      if (res.stop_reason === "refusal") throw new AiProviderError("refused", "AIがこの内容の生成を断りました");
      if (res.stop_reason === "max_tokens") throw new AiProviderError("truncated", "生成が途中で切れました");
      const text = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("");
      return { text, usage: { inputTokens: res.usage.input_tokens, outputTokens: res.usage.output_tokens } };
    },
  };
}

function toProviderError(e: unknown): Error {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    return new AiProviderError("auth", "AnthropicのAPIキーが正しくないか、権限がありません");
  }
  if (e instanceof Anthropic.RateLimitError) return new AiProviderError("rate_limited", "AIの利用上限に達しました。少し待ってから再試行してください");
  if (e instanceof Anthropic.APIUserAbortError) return e;
  if (e instanceof Anthropic.APIError) return new AiProviderError("unavailable", `AIの呼び出しに失敗しました（${e.status ?? "接続エラー"}）`);
  return e instanceof Error ? e : new Error(String(e));
}
