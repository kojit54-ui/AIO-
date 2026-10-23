// 本物のAPIで1回だけ試す。通常の npm test では飛ばす。
// 使い方：.env.local にキーを入れてから `npm run test:live`。費用は1回あたり数円〜数十円。

import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { COACHING_NOTES, ORGANIZATIONS, QUESTIONS, REFERENCE_ARTICLES, THEMES } from "@/mock/data";
import { getAiSetup } from "./config";
import { generateHeadingImage } from "./images";
import { generateReviewedBody, generateOutline } from "./provider";

const live = process.env.npm_lifecycle_event === "test:live" || process.env.AI_LIVE === "1";
if (live) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // .env.local が無ければ、すでに設定された環境変数だけを使う
  }
}
const setup = getAiSetup();
const ctx = {
  organization: ORGANIZATIONS.find((o) => o.id === "org_sakura")!,
  note: COACHING_NOTES.find((n) => n.organizationId === "org_sakura"),
  theme: THEMES[0],
  questions: QUESTIONS,
  answers: [
    { questionId: "q1", text: "冬になると脱衣所が寒くて、高齢の母が心配だと相談された", unknown: false },
    { questionId: "q2", text: "床下と壁に断熱材を入れ、内窓を付けた。工事は2日", unknown: false },
  ],
  referenceArticles: REFERENCE_ARTICLES,
};

describe.skipIf(!live)("本物のAPI", () => {
  it("文章：見出し案と本文を作る", async () => {
    expect(setup.textIsSample, "文章AIのキー（OPENAI_API_KEY、TEXT_PROVIDER=anthropic なら ANTHROPIC_API_KEY）が設定されていません").toBe(false);
    const outline = await generateOutline(setup.text, ctx);
    const roles = { writer: setup.textFor("body"), reviewer: setup.textFor("review"), imageIdeas: setup.textFor("images") };
    const body = await generateReviewedBody(roles, ctx, outline.outline.map((o) => o.heading));
    console.log(JSON.stringify({ outline, body }, null, 2));
    expect(body.body.length).toBeGreaterThan(0);
    expect(body.imageSuggestions.length).toBeGreaterThan(0);

    if (!setup.imageIsSample && setup.imageMode === "generate") {
      const img = await generateHeadingImage(setup.image, body.imageSuggestions[0]);
      mkdirSync("test-results", { recursive: true });
      writeFileSync(`test-results/live-image.${img.mimeType.split("/")[1]}`, Buffer.from(img.base64, "base64"));
      console.log("画像を test-results/ に保存しました");
    }
  }, 300_000);
});
