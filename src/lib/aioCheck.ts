// AIOのチェック。人（コタム）の確認の代わりに、AIが記事を点検して足りない所を聞き返す（docs/DECISIONS.md 2026-11-02）。
// 見る項目は画面の「こんなチェックをします」、AIへの指示（src/lib/ai/aioCheckPrompt.ts）、試作のサンプルで同じものを使う。

import { AIO_POINTS } from "@/lib/aio";
import type { AioCheck, AioCheckItem, AioCheckKey, AioCheckQuestion, AioPoint, Answer, Block, CompanyProfile, FactCheck } from "@/types/domain";

// AIOの材料ごとの聞き返し（試作のサンプルと、AIが質問を作れなかったときの控え）
const ASK: Record<AioPoint, { ask: string; example: string }> = {
  experience: { ask: "このご相談で、お客様が一番困っていたことは何でしたか", example: "例：冬の朝、脱衣所が寒くてお風呂に入るのがつらかった" },
  numbers: { ask: "費用・日数・件数など、分かる数字を1つ教えてください", example: "例：工事は2日、費用は約45万円" },
  entity: { ask: "どの地域のお客様からのご相談でしたか", example: "例：さくら市内、築30年の戸建て" },
  qa: { ask: "お客様からよく聞かれる質問と、そのときの答えを1つ教えてください", example: "例：「住みながら工事できる？」→「できます。1部屋ずつ進めます」" },
  comparison: { ask: "ほかの頼み先や方法と比べて、選ばれる理由は何ですか", example: "例：現地調査から工事まで同じ一級建築士が担当する" },
  expertise: { ask: "プロとして、よくある誤解や注意点を1つ教えてください", example: "例：暖房を強くするだけでは、床からの冷えは残る" },
  action: { ask: "読んだ人に、次に何をしてほしいですか", example: "例：無料の住まい点検に申し込んでほしい（電話かフォーム）" },
  trust: { ask: "書いた内容の裏付けになること（資格・年数・お客様の声など）はありますか", example: "例：創業25年、一級建築士が2名" },
};

/** チェックする項目。上から画面に並べる */
export const AIO_CHECK_LIST: { key: AioCheckKey; label: string; what: string; ask: string; example: string }[] = [
  ...(Object.keys(AIO_POINTS) as AioPoint[]).map((k) => ({
    key: k,
    label: AIO_POINTS[k].label,
    what: AIO_POINTS[k].why,
    ...ASK[k],
  })),
  {
    key: "facts",
    label: "数字・実績の確かさ",
    what: "価格・期間・件数・実績が、実際の話どおりか。間違った数字はAIにも読む人にも信頼を失います。",
    ask: "記事の中の数字や実績で、確かめておきたいものはありますか。正しい数字を教えてください",
    example: "例：費用は45万円ではなく、48万円でした",
  },
  {
    key: "words",
    label: "使ってほしくない言葉",
    what: "会社で決めた「使わない言葉」や、根拠を示せない言い切り（業界最安・絶対に など）が入っていないか。",
    ask: "言い切りすぎている所を、実際の言い方に直すとどうなりますか",
    example: "例：「絶対に寒くならない」→「寒さがかなり和らいだと言っていただけた」",
  },
  {
    key: "ai_tone",
    label: "AIっぽさ",
    what: "どこかで見たような決まり文句や、中身のないまとめになっていないか。その会社の人の言葉で書かれているか。",
    ask: "お客様にいつも話している言い方で、ひとこと添えるなら何と言いますか",
    example: "例：「冬の朝、脱衣所でヒヤッとしたら一度ご相談ください」",
  },
];

export const aioCheckLabel = (key: AioCheckKey) => AIO_CHECK_LIST.find((c) => c.key === key)?.label ?? key;

/** 一度に聞き返す質問の数。答える負担を増やさない */
export const MAX_AIO_QUESTIONS = 3;

const plain = (blocks: Block[]) => blocks.flatMap((b) => (b.type === "list" ? b.items : [b.text])).join("\n");
const answered = (answers: Answer[], id: string) => answers.some((a) => a.questionId === id && !a.unknown && a.text.trim());

const AI_TONE = /いかがでしたか|と言えるでしょう|ではないでしょうか|重要です。|まとめると|魅力的/;

/**
 * 試作用のチェック（AIは使わない）。記事の文字と回答から、項目ごとに書けているかを簡単に見る。
 * 本物のチェックはAI（src/lib/ai/aioCheckPrompt.ts）が行い、同じ形で返す
 */
export function sampleAioCheck(input: { body: Block[]; answers: Answer[]; profile: CompanyProfile | null; facts: FactCheck[] }): Pick<AioCheck, "summary" | "items" | "questions"> {
  const text = plain(input.body);
  const banned = (input.profile?.bannedExpressions ?? "")
    .split(/[、,「」『』\s]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !/^(など|根拠|示せない|表現)$/.test(w));
  const usedBanned = banned.filter((w) => text.includes(w));
  const unchecked = input.facts.filter((f) => f.status === "unchecked").length;
  const ok: Record<AioCheckKey, [boolean, string]> = {
    experience: answered(input.answers, "q1") ? [true, "実際のご相談が書けています"] : [false, "実際にあったご相談の話がまだありません"],
    numbers: /[0-9０-９]/.test(text) ? [true, "数字が入っています"] : [false, "費用や日数などの数字がありません"],
    entity: input.profile ? [true, "会社のことが分かります"] : [false, "どこの会社の話かが分かりません"],
    qa: answered(input.answers, "q2") || answered(input.answers, "q2_followup") ? [true, "お客様の質問に答える形になっています"] : [false, "お客様の質問と答えがありません"],
    comparison: /比べ|違い|選び|ほかの/.test(text) ? [true, "選ぶときの材料があります"] : [false, "ほかの頼み先と比べた違いがありません"],
    expertise: answered(input.answers, "q4") ? [true, "プロならではの注意点があります"] : [false, "注意点やよくある誤解がありません"],
    action: answered(input.answers, "q5") || (!!input.profile?.contact && text.includes(input.profile.contact)) ? [true, "問い合わせ先があります"] : [false, "読んだ人が次にすることがありません"],
    trust: usedBanned.length === 0 ? [true, "大げさな言い切りはありません"] : [false, "根拠を示しにくい言い切りがあります"],
    facts: unchecked === 0 ? [true, "数字や実績は確認済みです"] : [false, `数字や実績が${unchecked}か所、まだ確認されていません（「確かめる」から確かめられます）`],
    words: usedBanned.length === 0 ? [true, "使ってほしくない言葉は入っていません"] : [false, `「${usedBanned.join("」「")}」が入っています`],
    ai_tone: AI_TONE.test(text) ? [false, "決まり文句のような言い回しがあります"] : [true, "決まり文句は見当たりません"],
  };
  const items: AioCheckItem[] = AIO_CHECK_LIST.map((c) => ({ key: c.key, ok: ok[c.key][0], note: ok[c.key][1] }));
  // 確かめ方が別にある項目（要確認タブ）は聞き返さない
  const questions: AioCheckQuestion[] = items
    .filter((i) => !i.ok && i.key !== "facts")
    .slice(0, MAX_AIO_QUESTIONS)
    .map((i, n) => {
      const c = AIO_CHECK_LIST.find((x) => x.key === i.key)!;
      return { id: `aq${n + 1}`, key: i.key, text: c.ask, example: c.example };
    });
  const good = items.filter((i) => i.ok).length;
  const summary =
    questions.length === 0
      ? `${items.length}項目のうち${good}項目が書けています。AIに紹介されやすい記事です。`
      : `${items.length}項目のうち${good}項目が書けています。あと${questions.length}つ教えてもらえると、もっと紹介されやすくなります。`;
  return { summary, items, questions };
}

/**
 * 試作用の反映（AIは使わない）。聞き返しの答えを「補足」として本文の終わりの前に足す。
 * 本物はAIの書き手が、答えを本文の合う場所に書き込む
 */
export function sampleApplyAnswers(body: Block[], questions: AioCheckQuestion[], answers: Answer[]): Block[] {
  const add = questions
    .map((q) => answers.find((a) => a.questionId === q.id))
    .filter((a): a is Answer => !!a && !a.unknown && !!a.text.trim())
    .map((a) => ({ type: "paragraph" as const, text: /[。！？]$/.test(a.text.trim()) ? a.text.trim() : `${a.text.trim()}。` }));
  if (add.length === 0) return body;
  const lastHeading = body.map((b) => b.type).lastIndexOf("heading");
  const at = lastHeading > 0 ? lastHeading : body.length;
  return [...body.slice(0, at), { type: "heading", level: 2, text: "補足" }, ...add, ...body.slice(at)];
}
