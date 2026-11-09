// 9人の採点（GPT・Gemini・Claude × 書く人・読む人・AIOの人）のうち、GPT と Gemini の6人を呼ぶ。Claude の3人は会話の中で同じ指示文で採点する。
// 使い方: node scripts/e2e/council.mjs <article.json> <出力フォルダ>
// 記事の本文はAIに渡すだけで、ログには出さない。
import { readFileSync, writeFileSync } from "node:fs";

const persona = JSON.parse(readFileSync(new URL(`./${process.env.PERSONA || "persona.json"}`, import.meta.url), "utf8"));

// 読む人の役は会社ごとに変える（persona.readerRole）。無ければ製造業の保全担当
export const ROLES = {
  writer: "あなたはWebライティングのプロの編集者（BtoBの製造業・ものづくりのブログを多数手がけた）です。構成（結論が先か、見出しがタイトルの約束に沿うか）、読みやすさ、独自性（この会社にしか書けない一次情報）、AIっぽい決まり文句がないか、作り話がないかを見てください。",
  reader: `あなたはこの記事の見込み客です：${persona.readerRole ?? "埼玉の食品工場で設備保全を担当する40代。古い機械の部品が壊れ、図面もメーカーもなく困って検索しました。ITやWebの言葉は苦手です。"}読んで、分かりやすいか、自分のことだと思えたか、この会社に頼みたいと思ったか、次に何をすればよいか分かったかを、正直に見てください。`,
  aio: "あなたはAIO（AI検索に選ばれるための最適化）の専門家です。ChatGPT検索・Google AI Overviews・Perplexity が、この記事を引用・紹介したくなるかを見てください：冒頭で質問に短く答えているか、見出しが検索される問いの形か、具体的な事実（地域・会社・数字・手順）がはっきりか、信頼できるか（誇張・根拠のない断定がないか）、紹介されたあと読んだ人に選ばれる形か。",
};

const materials = { ...persona.hearing, 深掘りの答え: persona.followUp, ...persona.article };

// 前回の指摘（PREV=前回の council.json と claude.json をまとめたファイル）。直ったかを先に確かめてもらう
const prev = process.env.PREV ? JSON.parse(readFileSync(process.env.PREV, "utf8")) : [];

export function brief(role, article) {
  const prevFixes = prev.filter((r) => r.role === role).flatMap((r) => (r.fixes ?? []).map((f) => f.problem));
  return `${ROLES[role]}

次の記事を、10点満点（小数1桁）で厳しく採点してください。9.5点は「プロが手を入れずにそのまま公開できる」水準です。

採点のきまり：
- 点数は「この材料から、どれだけ良い記事にできたか」で付ける。材料に無いこと（数字・日数・費用・写真・ほかの事例など）が足りない点は減点しない。fixes に入れず、ask（社長に聞けば記事が良くなること）に書く。
- 人によって好みが分かれること（見出しを全部問いの形にするか、専門用語をどこまで入れるか等）は減点しない。読み違い・作り話・言い切りすぎ・同じ話の繰り返し・答えになっていない見出しなど、誰が読んでも直したほうがよい点だけを fixes に書く。
${prevFixes.length ? `- 前回、次の指摘がありました。まず直ったかを確かめ、直っていれば減点しないでください：\n${prevFixes.map((x) => `  ・${x}`).join("\n")}\n` : ""}
記事は、町工場の社長がスマホで質問に答え、AIが下書きを書いたものです（架空の会社）。社長は文章を書くのが苦手なので、直す点は「この記事の文」だけでなく「AIへの指示や、社長への質問の仕方をどう変えればよいか」まで書いてください。

<materials>
${JSON.stringify(materials)}
</materials>

<article>
${JSON.stringify(article)}
</article>

<materials> は社長が答えた内容（記事の材料）です。材料に無い事実・数字・言葉を記事が作っていないかは、材料と見比べて判断してください。材料にあることを「作り話では」と減点しないでください。
${persona._reviewNote ?? "会社名「テスト製作所（自動テスト用）」と電話・メールは、テスト用の会社のため仮のものです。名前や連絡先が仮であることは減点しないでください（本番ではお客様の会社名が入ります）。"}
記事の「## 」は見出し、「1. 」は番号つきの箇条書き、「・」は箇条書きとして画面に表示されています。

次のJSONだけで返してください：
{"score": number, "good": [string, string], "fixes": [{"problem": string, "how": string}], "ask": [string]}
fixes は大事な順に最大5つ。how は具体的に（どの見出し・どの文をどう変えるか、AIへの指示に何を足すか）。`;
}

async function gpt(prompt) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.OPENAI_TEXT_MODEL || "gpt-6.1-sol", input: prompt }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`openai ${res.status} ${j.error?.message ?? ""}`);
  return j.output_text ?? j.output?.flatMap((o) => o.content ?? []).map((c) => c.text ?? "").join("") ?? "";
}

async function gemini(prompt) {
  const model = process.env.GEMINI_TEXT_MODEL || "gemini-4-argon";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": process.env.GEMINI_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`gemini ${res.status} ${j.error?.message ?? ""}`);
  return j.candidates?.[0]?.content?.parts?.map((x) => x.text ?? "").join("") ?? "";
}

function parse(text) {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  return JSON.parse(text.slice(s, e + 1));
}

if (process.argv[2]) {
  const article = JSON.parse(readFileSync(process.argv[2], "utf8"));
  const outDir = process.argv[3] || ".";
  const jobs = [];
  for (const [name, call] of [["gpt", gpt], ["gemini", gemini]])
    for (const role of Object.keys(ROLES))
      jobs.push(
        call(brief(role, { title: article.title, body: article.text }))
          .then((t) => ({ who: name, role, ...parse(t) }))
          .catch((e) => ({ who: name, role, error: e.message })),
      );
  const results = await Promise.all(jobs);
  writeFileSync(`${outDir}/council.json`, JSON.stringify(results, null, 2));
  for (const r of results) console.log(r.who, r.role, r.error ?? r.score);
  writeFileSync(`${outDir}/brief-claude.txt`, Object.keys(ROLES).map((r) => `=== ${r} ===\n${brief(r, { title: article.title, body: article.text })}`).join("\n\n"));
}
