// 文章生成：Google（Gemini）。TEXT_PROVIDER=google、または手順ごとの指定（OUTLINE_PROVIDER など）で使う。
// サーバー側でだけ使う。APIキーは環境変数から受け取り、ログや返り値に出さない。
// 普段も仕上げも同じモデルで、仕上げは考える量を増やす（OpenAI と同じ扱い）。

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { AiProviderError, type AiCompletionRequest, type AiProvider, type AiQuality } from "../provider";

type GenerateContent = GoogleGenAI["models"]["generateContent"];

export interface GoogleTextOptions {
  apiKey: string;
  draftModel: string;
  finishModel: string;
  /** テスト用。省略時は SDK のクライアント */
  generateContent?: GenerateContent;
}

const THINKING: Record<AiQuality, ThinkingLevel> = { draft: ThinkingLevel.MEDIUM, finish: ThinkingLevel.HIGH };

export function createGoogleTextProvider(opts: GoogleTextOptions): AiProvider {
  const generateContent: GenerateContent = opts.generateContent ?? ((p) => new GoogleGenAI({ apiKey: opts.apiKey }).models.generateContent(p));

  return {
    name: "google",
    async complete(req: AiCompletionRequest) {
      const quality = req.quality ?? "draft";
      let res: Awaited<ReturnType<GenerateContent>>;
      try {
        res = await generateContent({
          model: quality === "finish" ? opts.finishModel : opts.draftModel,
          contents: req.user,
          config: {
            systemInstruction: req.system,
            maxOutputTokens: req.maxOutputTokens,
            responseMimeType: "application/json",
            thinkingConfig: { thinkingLevel: THINKING[quality] },
            candidateCount: 1,
            abortSignal: req.signal,
          },
        });
      } catch (e) {
        if (req.signal?.aborted) throw e;
        const status = (e as { status?: number })?.status;
        if (status === 401 || status === 403) throw new AiProviderError("auth", "GoogleのAPIキーが正しくないか、権限がありません");
        // 402：提供元の前払いクレジットが無い（Google AI Studio の前払い）。キーの誤りと区別する
        if (status === 402) throw new AiProviderError("billing", "AIの提供元のクレジット残高が足りません。コタムにご連絡ください");
        if (status === 429) throw new AiProviderError("rate_limited", "AIの利用上限に達しました。少し待ってから再試行してください");
        throw new AiProviderError("unavailable", `AIの呼び出しに失敗しました（${status ?? "接続エラー"}）`);
      }

      const candidate = res.candidates?.[0];
      if (res.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY" || candidate?.finishReason === "RECITATION") {
        throw new AiProviderError("refused", "AIがこの内容の生成を断りました");
      }
      if (candidate?.finishReason === "MAX_TOKENS") throw new AiProviderError("truncated", "生成が途中で切れました");
      const text = (candidate?.content?.parts ?? []).flatMap((p) => (p.text && !p.thought ? [p.text] : [])).join("");
      const u = res.usageMetadata;
      // 考えた分（thoughtsTokenCount）も出力として請求される
      return { text, usage: { inputTokens: u?.promptTokenCount ?? 0, outputTokens: (u?.candidatesTokenCount ?? 0) + (u?.thoughtsTokenCount ?? 0) } };
    },
  };
}
