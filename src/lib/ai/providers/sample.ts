// APIキーが無いときの代わり。決まった形のサンプルを返し、AIが動いているようには見せない。

import type { ImageProvider } from "../images";
import type { AiProvider } from "../provider";

export const SAMPLE_LABEL = "サンプル（AIは未接続）";

export const sampleTextProvider: AiProvider = {
  name: "sample",
  async complete(req) {
    const headings = parseHeadings(req.user);
    const text =
      req.kind === "outline"
        ? {
            title_candidates: [`${SAMPLE_LABEL} タイトル案1`, `${SAMPLE_LABEL} タイトル案2`, `${SAMPLE_LABEL} タイトル案3`],
            outline: ["ご相談の内容", "行った対応", "お客様の変化", "同じお悩みの方へ"].map((heading) => ({ heading })),
            needs_info: [],
          }
        : {
            title_candidates: [`${SAMPLE_LABEL} タイトル案1`, `${SAMPLE_LABEL} タイトル案2`, `${SAMPLE_LABEL} タイトル案3`],
            body: headings.flatMap((h) => [
              { type: "heading", level: 2, text: h },
              { type: "paragraph", text: `${SAMPLE_LABEL}：ここに「${h}」の本文が入ります。` },
            ]),
            fact_checks: [],
            needs_info: [],
            image_suggestions: headings.map((h) => ({
              heading: h,
              photo_idea: `${SAMPLE_LABEL}：「${h}」に合う写真の提案が入ります。`,
              alt: h,
              image_prompt: "A simple illustration",
            })),
          };
    return { text: JSON.stringify(text), usage: { inputTokens: 0, outputTokens: 0 } };
  },
};

function parseHeadings(user: string): string[] {
  const m = user.match(/見出し：(\[.*?\])/);
  try {
    const v: unknown = m ? JSON.parse(m[1]) : [];
    return Array.isArray(v) && v.every((x) => typeof x === "string") && v.length > 0 ? v : ["見出し"];
  } catch {
    return ["見出し"];
  }
}

// 灰色の16:9の枠に「サンプル」と書いたSVG。生成画像の代わりに表示する
const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#e5e7eb"/><text x="320" y="190" font-size="28" text-anchor="middle" fill="#6b7280" font-family="sans-serif">${SAMPLE_LABEL}</text></svg>`;

export const sampleImageProvider: ImageProvider = {
  name: "sample",
  async generate() {
    return { base64: Buffer.from(SAMPLE_SVG).toString("base64"), mimeType: "image/svg+xml" };
  },
};
