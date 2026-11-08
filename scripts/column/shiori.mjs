// 読みもの（/column）に入れる、しおりのイラストを Gemini で作り、public/column/<名前>.webp に保存する。
// 2026-11-08 田村さん「写実的な写真としおりが混ざるとAIっぽい」で、読みものにはしおりのイラストを使わなくなった（docs/COLUMN_BACKLOG.md）。ほかの用途のために残す。
// 使い方：GEMINI_API_KEY=... node scripts/column/shiori.mjs <名前> "<しおりがしている場面（英語）>"
// 手本として public/guide のしおりの絵（スーツ）を渡し、同じ顔・同じ絵柄にする。色は入口ページと同じ生成りと藍。
// 2026-11-08 田村さん「この方向でOK」「Geminiに渡すときにウォーターマークなしで、とお願いして」。
// 文字・ロゴ・本物の画面（Googleなど）・ウォーターマーク・署名は描かせない。記事では illustration: true を付け、注意書きは出さない（田村さん「AIにやらせてるっぽさが出る」）。
// 1枚あたりの費用はおおむね数円〜十数円（Google AI Studio の前払い残高から引かれる）。

import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import fs from "node:fs";

const [name, scene] = process.argv.slice(2);
if (!name || !scene || !/^[a-z0-9-]+$/.test(name)) {
  console.error('使い方：node scripts/column/shiori.mjs <名前（半角英小文字・数字・-）> "<場面（英語）>"');
  process.exit(1);
}
const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!key) {
  console.error("GEMINI_API_KEY がありません");
  process.exit(1);
}
const model = process.env.GOOGLE_IMAGE_MODEL || "gemini-3.1-flash-image-preview";
const outDir = process.env.OUT_DIR || "public/column";
const ref = (f) => ({ inlineData: { mimeType: "image/webp", data: fs.readFileSync(`public/guide/${f}`).toString("base64") } });

export const SHIORI_PROMPT = (s) => `Use the woman in the reference images as the character "Shiori": same face, short brown bob hair, black-rimmed glasses, navy suit jacket and white blouse, same anime illustration style with clean lines and soft cel shading. Keep her face identical.
Wide 16:9 illustration for a Japanese business blog article for small manufacturing companies.
Scene: ${s}
Color palette: warm off-white paper background (#F6F3EC), deep indigo (#1F3A5F) accents, a little brass/gold. Calm, friendly, not flashy. Plenty of empty space, but keep the main subject near the center so it is not cut off on phones.
Strict rules: no watermark, no signature, no artist mark, no AI logo or sparkle mark in any corner. No text, no letters, no numbers, no logos, no brand marks anywhere in the image. Do not draw the Google logo or any real product screen; use simple flat icons and blank lines instead.
Full-bleed scene that fills the whole frame edge to edge: no borders, no frames, no white margins, no inset panels. Papers, signs, clipboards and screens show only blank lines, never writing. Shiori has exactly two hands.`;

const ai = new GoogleGenAI({ apiKey: key });
const res = await ai.models.generateContent({
  model,
  contents: [{ role: "user", parts: [ref("shiori-point.webp"), ref("shiori-face.webp"), { text: SHIORI_PROMPT(scene) }] }],
  config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" }, candidateCount: 1 },
});
const data = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;
if (!data) {
  console.error("画像ができませんでした（断られた可能性があります）");
  process.exit(2);
}
const out = `${outDir}/${name}.webp`;
await sharp(Buffer.from(data, "base64")).resize({ width: 1600, height: 900, fit: "cover" }).webp({ quality: 82 }).toFile(out);
console.log(`保存しました：${out}（${Math.round(fs.statSync(out).size / 1024)}KB）`);
console.log("四隅までウォーターマーク・署名・文字・ロゴがないか拡大して見てから使う。入っていたら作り直す。alt は60字以上で、何を表すイメージか・しおりが何をしているか・そばの図まで書く");
