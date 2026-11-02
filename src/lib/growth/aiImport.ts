// ChatGPT・Claude・Gemini からの取り込み（docs/DECISIONS.md 2026-11-02）。
// 各社のAIは、ほかのサービスから会話を直接読み出す仕組みを公開していない。そこで、お客様がいつものAIに頼み文を貼り、
// 返ってきた「会社のまとめ」をこの画面に貼る。しおりがそれを読み取って会社の知識の候補にし、お客様が選んだものだけを覚える。

/** お客様がいつものAI（ChatGPT・Claude・Gemini）に貼る頼み文 */
export const IMPORT_PROMPT = `あなたとのこれまでの会話から、私の会社（仕事）について分かることを、次の見出しごとにまとめてください。
会話に出てきたことだけを書き、推測はしないでください。分からない見出しは「不明」と書いてください。
お客様の名前や連絡先は書かないでください。

【会社・お仕事の内容】
【主な商品・サービスと、価格や期間の目安】
【よく来るお客様の特徴】
【お仕事をしている地域】
【選ばれる理由・強み】
【比べられる相手と、その違い】
【お客様からよく聞かれる質問と、その答え】
【実際のお客様の事例（いつ・どんな相談・どう対応・結果）】
【これまでに書いたブログ記事のテーマ】
【使わない言葉・気をつけていること】`;

export const MAX_IMPORT_CHARS = 12000;
export const MAX_IMPORT_ITEMS = 20;

export interface ImportCandidate {
  label: string;
  text: string;
}

/** 試作（キーが無いとき）の読み取り：【見出し】ごとに分けるだけ。「不明」は捨てる */
export function splitByHeadings(text: string): ImportCandidate[] {
  const out: ImportCandidate[] = [];
  const re = /【([^】]{1,40})】([\s\S]*?)(?=【|$)/g;
  for (const m of text.matchAll(re)) {
    const body = m[2].trim().replace(/\n{2,}/g, "\n");
    if (!body || /^不明[。.]?$/.test(body)) continue;
    out.push({ label: m[1].trim().slice(0, 80), text: Array.from(body).slice(0, 600).join("") });
  }
  return out.slice(0, MAX_IMPORT_ITEMS);
}
