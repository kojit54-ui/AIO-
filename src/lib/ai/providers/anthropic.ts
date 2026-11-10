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

const EFFORT: Record<AiQuality, "low" | "medium" | "high"> = { quick: "low", draft: "medium", finish: "high" };

/**
 * Claude は答える前に考える分も max_tokens に数える。呼び出し側の上限（返答の長さの目安）だけを渡すと、
 * 短い上限（タイトル案1000など）では考えるだけで使い切って途中で切れる（2026-11-10 本番で truncated）。
 * 考える分の余裕を足す。ただし SDK は非ストリーミングで約21,333を超えると断るので、その手前で止める。
 */
const THINKING_HEADROOM: Record<AiQuality, number> = { quick: 2000, draft: 8000, finish: 16000 };
const MAX_NON_STREAMING_TOKENS = 21000;
/** JSONで返させる指示のとき、文字列の中の " で壊れないように添える（日本語の引用は「」を使わせる） */
const JSON_NOTE = "\n\n（JSONで返すときは、JSONだけを返し、文字列の中で引用するときは「」を使い、半角の \" を使うなら \\\" とエスケープしてください。）";
export function anthropicMaxTokens(requested: number, quality: AiQuality): number {
  return Math.max(requested, Math.min(requested + THINKING_HEADROOM[quality], MAX_NON_STREAMING_TOKENS));
}

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
            max_tokens: anthropicMaxTokens(req.maxOutputTokens, quality),
            system: `${req.system}${JSON_NOTE}`,
            messages: [
              {
                role: "user",
                content: req.images?.length
                  ? [...req.images.map((i) => ({ type: "image" as const, source: { type: "base64" as const, media_type: i.mimeType, data: i.data } })), { type: "text" as const, text: req.user }]
                  : req.user,
              },
            ],
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
  if (e instanceof Anthropic.APIError) return new AiProviderError("unavailable", `AIの呼び出しに失敗しました（${e.status ?? "接続エラー"}）`, e.status);
  return e instanceof Error ? e : new Error(String(e));
}
