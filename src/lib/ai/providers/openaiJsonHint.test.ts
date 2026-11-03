import { describe, expect, it } from "vitest";
import { buildTrialPrompt } from "@/lib/tryoutAi";
import { createOpenAiTextProvider, withJsonHint } from "./openaiText";

// OpenAI は json_object のとき input に「json」の語を求める（無いと 400・param: input）。2026-11-03 の30秒でためすの失敗
describe("withJsonHint", () => {
  it("無いときだけ足す", () => {
    expect(withJsonHint("こんにちは")).toMatch(/JSON/);
    expect(withJsonHint("返答はJSONで")).toBe("返答はJSONで");
  });
  it("送る input には必ず json の語が入る（30秒でためすの入力でも）", async () => {
    let sent = "";
    const p = createOpenAiTextProvider({
      apiKey: "k",
      draftModel: "m",
      finishModel: "m",
      fetch: (async (_u: string, init: RequestInit) => {
        sent = JSON.parse(String(init.body)).input;
        return new Response(JSON.stringify({ output: [{ type: "message", content: [{ type: "output_text", text: "{}" }] }] }), { status: 200 });
      }) as unknown as typeof fetch,
    });
    const user = buildTrialPrompt({ company: "テスト工業", region: "東京都", job: "金属加工", story: "部品を作った", answers: {} } as never);
    await p.complete({ kind: "trial", system: "s", user, maxOutputTokens: 10 } as never);
    expect(sent).toMatch(/json/i);
  });
});
