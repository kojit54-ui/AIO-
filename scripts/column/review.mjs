// 読みもの（/column）を GPT と Gemini に校閲・採点してもらう（docs/COLUMN_BACKLOG.md の手順4）。
// 使い方：COLUMN_DUMP=llmo,equipment npx vitest run src/lib/columnDump.test.ts  → /tmp/column-review/articles.md
//         node scripts/column/review.mjs /tmp/column-review/articles.md /tmp/column-review/r1
//         → r1-gpt.md・r1-gemini.md（キーは OPENAI_API_KEY・GEMINI_API_KEY。値は表に出さない）
// 採点は 10点満点で、9.5点に届くまで直してから公開する。

import fs from "node:fs";

const [articlesPath, out, extra = ""] = process.argv.slice(2);
if (!articlesPath || !out) {
  console.error("使い方：node scripts/column/review.mjs <記事.md> <出力の頭> [前回の指摘の要約]");
  process.exit(1);
}
const facts = `サービスの事実（料金ページ・FAQ・利用規約と同じ）：AIOえらばれ帳（株式会社コタム）。月額50,000円（税抜。税込55,000円）、記事は最低1本、毎月10本まで（「毎月1本」とは書かない）。はじめての方は7日間無料、申し込み時にクレジットカード登録、お試しが終わった日に初回請求・毎月自動更新・初回請求の前日にメール、マイページからいつでも解約・お試し中の解約は無料。いまは新規申し込み準備中。登録せずに試せるページあり。含まれるもの：記事（案内役の質問・AIの記事づくり・AIOのチェック13項目）、画面で確認・修正、強みの帳面、掲載手順の案内（自動投稿ではない）、製造業の知識（公開情報7,000件超を参考）、毎月のお知らせ。Search Console を閲覧のみでつなぐと直近28日の数字と記事ごとの表示回数を見られる。含まれないもの：対面での聞き取り、ホームページの技術的な直し、AIの回答での表示の計測。質問は文字・声・写真1枚から答えられ、わからない質問は飛ばせる。案内役は、なぜ聞くのかを添えて1問ずつ聞く。`;
const rules = `書いてはいけないこと：他社の料金や比較、「〇〇すれば紹介・引用される」の言い切り、問い合わせ増の約束、確かめられない画面名や手順、Googleの見解をほかのAIへ広げること、架空の例を実績に見せること、既存のお客様の扱い（招待・無料）に触れること、料金ページとの食い違い。型：答え3行（画面では番号つきの3行。書き出しでは／でつないでいる）→しおり（案内役）の問い→見出しは問い・最初に短い答え→地の文中心→しおりのひとこと。節の中に、「架空の例」と明記した聞き書き（任意）と「しおりに聞いてみた」（読者の素朴な質問にしおりが短く答えるチャット、1〜2か所）を入れる。聞き書きとチャットの順番や位置は自由。写真は「写真はイメージです（実在の会社・製品ではありません）」と画面に出る。`;
const brief = `あなたは、小さな製造業の社長に向けたAIOの読みものの校閲者です。あなた自身の意見だけで答えてください（他のAIの発言を想像しないでください）。

${facts}

${rules}
${extra ? `\n前回の指摘と直したこと：${extra}\n` : ""}
次を、短く具体的に答えてください。
1. 事実の誤り・言い過ぎ（直す文の案も）
2. サービスの事実との食い違い
3. 社長（製造業、ITが得意でない）が読んで分かりにくい所
4. 1本ずつ10点満点の採点（AIOとして／読者にとって）と、9.5点に届かない理由
5. 公開してよいか（はい／直してから／いいえ）

--- 記事 ---
${fs.readFileSync(articlesPath, "utf8")}`;

async function gpt() {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.REVIEW_GPT_MODEL || "gpt-6.1-sol", input: brief, store: false }),
  });
  const j = await r.json();
  if (!r.ok) return `ERROR ${r.status} ${JSON.stringify(j).slice(0, 300)}`;
  return j.output_text ?? j.output?.flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("\n");
}
async function gemini() {
  const model = process.env.REVIEW_GEMINI_MODEL || "gemini-4-argon";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: brief }] }] }),
  });
  const j = await r.json();
  if (!r.ok) return `ERROR ${r.status} ${JSON.stringify(j).slice(0, 300)}`;
  return j.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
}
const [a, b] = await Promise.all([gpt(), gemini()]);
fs.writeFileSync(`${out}-gpt.md`, a);
fs.writeFileSync(`${out}-gemini.md`, b);
console.log(`保存しました：${out}-gpt.md（${a.length}字）、${out}-gemini.md（${b.length}字）`);
