// 読みもの（/column）の写真を Gemini の画像モデルで作り、public/column/<名前>.webp に保存する。
// 使い方：GEMINI_API_KEY=... node scripts/column/photo.mjs <名前> "<撮りたい場面（日本語でよい）>"
// 実在の会社・製品・人に見えないよう、文字・ロゴ・顔のアップを入れない指示を足す。画面には「写真はイメージです」と出す。
// 1枚あたりの費用はおおむね数円〜十数円（Google AI Studio の前払い残高から引かれる）。

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import fs from "node:fs";

const [name, scene] = process.argv.slice(2);
if (!name || !scene || !/^[a-z0-9-]+$/.test(name)) {
  console.error('使い方：node scripts/column/photo.mjs <名前（半角英小文字・数字・-）> "<場面>"');
  process.exit(1);
}
const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!key) {
  console.error("GEMINI_API_KEY がありません");
  process.exit(1);
}
const model = process.env.GOOGLE_IMAGE_MODEL || "gemini-3.1-flash-image";

const prompt = `A candid documentary photograph for a Japanese small manufacturing company's blog.
Scene: ${scene}
Style: shot on a full-frame camera with a 35mm lens, natural window light mixed with fluorescent factory light, realistic colors, slight film grain, shallow depth of field, real-world imperfections (oil stains, scratches, worn floor, tidy but used tools). Composition like a magazine feature, not a stock photo.
Strict rules: no text, no letters, no logos, no brand names, no watermarks, no signage. If people appear, show hands, backs or side views only — no close-up faces. Nothing futuristic, no glowing effects, no robots, no holograms. Looks like a real photo taken in Japan in the 2020s.`;

const ai = new GoogleGenAI({ apiKey: key });
const res = await ai.models.generateContent({
  model,
  contents: prompt,
  config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" }, candidateCount: 1 },
});
const data = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
if (!data) {
  console.error("画像ができませんでした（断られた可能性があります）");
  process.exit(2);
}
const out = `public/column/${name}.webp`;
await sharp(Buffer.from(data, "base64")).resize({ width: 1600, height: 900, fit: "cover" }).webp({ quality: 80 }).toFile(out);
console.log(`保存しました：${out}（${Math.round(fs.statSync(out).size / 1024)}KB）`);
console.log("四隅までウォーターマーク・文字・ロゴがないか見てから使う。alt は40字以上で場面と記事の話を書く（docs/COLUMN_BACKLOG.md）");
