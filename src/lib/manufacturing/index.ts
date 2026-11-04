// 製造業の知識表の使い方（docs/TASKS.md T6-5）。
// 知識表は「読む人の疑問の候補」「記事の案」「書き方のコツ」として使い、記事の中の事実（数字・実績）としては使わない。

import { MFG_COLLECTED_AT, MFG_ITEMS } from "./data";
import type { MfgItem, MfgKind } from "./types";

export { MFG_COLLECTED_AT, MFG_ITEMS };
export type { MfgItem, MfgKind };

export const MFG_KIND_LABEL: Record<MfgKind, string> = {
  pain: "経営の悩み",
  question: "発注する人の疑問",
  success: "Webでうまくいったやり方",
  buyer: "買い手の探し方・決め方",
  trend: "最近の動き",
};

/** 会社の説明に出てくる言葉から、業種を当てる */
const INDUSTRY_WORDS: [string, RegExp][] = [
  ["切削加工", /切削|旋盤|フライス|マシニング|NC加工|削り/],
  ["板金", /板金|曲げ|レーザー加工|レーザ加工|シャーリング/],
  ["溶接", /溶接|製缶|TIG|MIG/],
  ["プレス", /プレス|打ち抜き|絞り/],
  ["樹脂成形", /樹脂|射出|成形|プラスチック|ブロー/],
  ["金型", /金型/],
  ["鋳造", /鋳造|鋳物|ダイカスト/],
  ["鍛造", /鍛造/],
  ["表面処理", /めっき|メッキ|塗装|アルマイト|表面処理|コーティング/],
  ["熱処理", /熱処理|焼入れ|焼き入れ/],
  ["研磨", /研磨|研削|バフ/],
  ["放電加工", /放電/],
  ["3Dプリンタ", /3D ?プリ|積層造形/],
  ["印刷", /印刷|パッケージ|紙器|製本/],
  ["木工", /木工|家具|木材/],
  ["食品製造", /食品|菓子|惣菜|OEM/],
  ["金属加工", /金属|鉄工|部品加工|精密加工/],
  ["機械部品", /機械部品|部品|装置/],
];

/** 会社の説明（事業内容など）から業種を選ぶ。製造業らしくなければ空 */
export function detectIndustries(text: string | null | undefined): string[] {
  if (!text) return [];
  return INDUSTRY_WORDS.filter(([, re]) => re.test(text)).map(([name]) => name);
}

export function isManufacturing(text: string | null | undefined): boolean {
  return detectIndustries(text).length > 0 || /製造|加工|工場|町工場|ものづくり/.test(text ?? "");
}

function matches(item: MfgItem, industries: string[]): number {
  if (item.industries.some((i) => industries.includes(i))) return 2;
  return item.industries.includes("all") ? 1 : 0;
}

/** その会社に合う「発注する人の疑問」。業種が合うものを先に、最大 n 件 */
export function readerQuestionsFor(business: string | null | undefined, n = 8): MfgItem[] {
  const inds = detectIndustries(business);
  return MFG_ITEMS.filter((x) => x.kind === "question" && matches(x, inds) > 0)
    .sort((a, b) => matches(b, inds) - matches(a, inds))
    .slice(0, n);
}

/** 書く記事の案（業種が合うもの・どの業種にも合うもの） */
export function articleIdeasFor(business: string | null | undefined, n = 10): { title: string; why: string }[] {
  const inds = detectIndustries(business);
  return MFG_ITEMS.filter((x) => x.articleIdea && x.useFor.includes("article_idea") && x.kind !== "trend" && matches(x, inds) > 0)
    .sort((a, b) => matches(b, inds) - matches(a, inds))
    .slice(0, n)
    .map((x) => ({ title: x.articleIdea!, why: x.title }));
}

/**
 * 製造業の会社の記事を書くときに、書き手と点検役へ足すコツ。
 * 知識表の「買い手の決め方」「うまくいったやり方」から引き出した、書き方の決まりだけを書く（数字や他社の話は入れない）。
 */
export const MFG_WRITER_RULES = [
  "発注する人は、実績で判断します。素材にあれば、部品の名前・材質・加工方法・精度（公差）・数量・納期を具体的に書く。",
  "「1個からOK」「図面がなくても相談できる」「見積もりの出し方」など、問い合わせ前の不安に、素材の範囲で答える。",
  "できること（得意）と、できないこと・向かないこと（苦手）の両方を、素材にあれば正直に書く。比べている人とAIの両方に伝わる。",
  "不具合や困りごとが起きたときに、どう調べてどう直したかの流れは、信頼の材料になる。素材にあれば書く。",
  "専門用語は使ってよいが、初めて出すときに短い説明を添える。設計の人と購買の人の両方が読む。",
  "安さや早さを大げさに言わない。価格と条件の考え方（何で値段が決まるか）を、素材の範囲で分かりやすく書く。",
];

export function mfgWriterRules(business: string | null | undefined): string {
  if (!isManufacturing(business)) return "";
  return `\n\n製造業の会社の記事では、次のことも大切にしてください（読む人は発注する設計・購買の人が多い）：\n${MFG_WRITER_RULES.map((r) => `- ${r}`).join("\n")}`;
}

export function mfgReviewerRules(business: string | null | undefined): string {
  if (!isManufacturing(business)) return "";
  return "\n\n製造業の会社の記事では aio と originality の点検で、実績の具体さ（部品名・材質・加工方法・精度・数量・納期）、問い合わせ前の不安（小ロット・図面なし・見積もり）への答え、得意と苦手、不具合のときの対応が、素材の範囲で書かれているかも確かめる。";
}

/** しおりのひとことに使えるもの（その日で変わる） */
export function mfgTipOfDay(dayKey: string, business?: string | null): MfgItem | null {
  const inds = detectIndustries(business);
  const pool = MFG_ITEMS.filter((x) => (x.kind === "buyer" || x.kind === "success") && matches(x, inds) > 0);
  if (!pool.length) return null;
  let h = 0;
  for (const c of dayKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

export function mfgCounts(): Record<MfgKind, number> {
  const c = { pain: 0, question: 0, success: 0, buyer: 0, trend: 0 } as Record<MfgKind, number>;
  for (const x of MFG_ITEMS) c[x.kind] += 1;
  return c;
}
