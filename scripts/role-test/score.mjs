// 役割別テスト：画面の写しを GPT と Gemini に採点させる（docs/ROLE_TEST.md）
// node scripts/role-test/score.mjs <customer|article|admin> <出力フォルダ> [前回の結果フォルダ] [直したことのメモ.txt]
// 画像は <出力フォルダ> の決まった名前（browse.mjs・sent.mjs が撮るもの）を使う。結果は <出力フォルダ>/score-<gpt|gemini>-<role>.md
// キーは環境変数 OPENAI_API_KEY・GEMINI_API_KEY（.env.local。コードやログに出さない）
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

const IMAGES = {
  customer: ["v-login-375.png", "v-sent-375.png", "customer_-375.png", "customer_mypage-375.png"],
  // 記事の画面（点数）。browse.mjs で /articles/<id> を撮ったもの（1280 と 375）
  article: (dir) => readdirSync(dir).filter((f) => /^article_articles_.*-(1280|375)\.png$/.test(f)).sort(),
  admin: ["admin_coach-1280.png", "admin_admin_usage-1280.png", "admin_admin_invitations-1280.png", "admin_admin_waitlist-1280.png", "admin_admin_trial-1280.png"],
};
const OPENAI_MODEL = process.env.ROLE_TEST_OPENAI_MODEL || "gpt-6.1-sol";
const GEMINI_MODEL = process.env.ROLE_TEST_GEMINI_MODEL || "gemini-4-argon";

const [role, dir, prevDir, fixedFile] = process.argv.slice(2);
if ((!IMAGES[role] && !process.env.ROLE_IMAGES) || !dir) {
  console.error("使い方: node scripts/role-test/score.mjs <customer|article|admin> <出力フォルダ> [前回の結果フォルダ] [直したことのメモ.txt]");
  process.exit(1);
}
const here = (f) => new URL(`./roles/${f}`, import.meta.url);
/** 前回の採点から「減点した理由」だけを抜く */
const reasons = (text) => (/(減点した理由|届かない理由)[\s\S]*?(?=追加の案|良い点|$)/.exec(text)?.[0] ?? text.slice(-2000)).slice(0, 2200);
let prompt = readFileSync(here(`${role}.md`), "utf8") + "\n" + readFileSync(here("rubric.md"), "utf8");
if (prevDir) {
  const prev = ["gpt", "gemini"].map((w) => `${prevDir}/score-${w}-${role}.md`).filter(existsSync).map((f) => reasons(readFileSync(f, "utf8")));
  if (prev.length) prompt += `\n## 前回の指摘（2人の採点者から。重なりあり）\n${prev.join("\n")}\n`;
}
if (fixedFile) prompt += `\n## 前回のあとに直したこと（参考）\n${readFileSync(fixedFile, "utf8")}\n`;
// ROLE_IMAGES="a.png,b.png" で、決まった名前以外の写しを渡せる（新しい役を足すとき）
const files = process.env.ROLE_IMAGES ? process.env.ROLE_IMAGES.split(",") : typeof IMAGES[role] === "function" ? IMAGES[role](dir) : IMAGES[role];
const imgs = files.map((f) => readFileSync(`${dir}/${f}`).toString("base64"));

async function gpt() {
  const content = [{ type: "input_text", text: prompt }, ...imgs.map((d) => ({ type: "input_image", image_url: `data:image/png;base64,${d}` }))];
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: OPENAI_MODEL, input: [{ role: "user", content }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`OpenAI ${r.status}`);
  return j.output_text ?? j.output.flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("\n");
}
async function gemini() {
  const parts = [{ text: prompt }, ...imgs.map((d) => ({ inline_data: { mime_type: "image/png", data: d } }))];
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ role: "user", parts }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`Gemini ${r.status}`);
  return j.candidates[0].content.parts.map((p) => p.text ?? "").join("");
}

const results = await Promise.allSettled([gpt(), gemini()]);
["gpt", "gemini"].forEach((w, i) => {
  const r = results[i];
  if (r.status === "rejected") return console.log(`${w}: 失敗（${r.reason.message}）`);
  writeFileSync(`${dir}/score-${w}-${role}.md`, r.value);
  const score = /最終点[^0-9]{0,20}(\d+(?:\.\d)?)/.exec(r.value)?.[1] ?? "?";
  console.log(`${w}: ${score}`);
});
