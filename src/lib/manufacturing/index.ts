// 製造業の知識表の使い方（docs/TASKS.md T6-5）。
// 知識表は「読む人の疑問の候補」「記事の案」「書き方のコツ」として使い、記事の中の事実（数字・実績）としては使わない。

import { MFG_COLLECTED_AT, MFG_ITEMS } from "./data";
import type { MfgItem, MfgKind } from "./types";

export { MFG_COLLECTED_AT, MFG_ITEMS };

/** 国内の知識（記事・しおり・入口のページに使うのはこちらだけ） */
export const MFG_DOMESTIC: MfgItem[] = MFG_ITEMS.filter((x) => x.region !== "overseas");
/** 海外の事例・調査（日本とは前提が違うので分けておく。今は管理画面で見るだけ） */
export const MFG_OVERSEAS: MfgItem[] = MFG_ITEMS.filter((x) => x.region === "overseas");
export type { MfgItem, MfgKind };

export { MFG_KIND_LABEL, detectIndustries, isManufacturing } from "./detect";
import { detectIndustries, isManufacturing } from "./detect";

function matches(item: MfgItem, industries: string[]): number {
  if (item.industries.some((i) => industries.includes(i))) return 2;
  return item.industries.includes("all") ? 1 : 0;
}

/** その会社に合う「発注する人の疑問」。業種が合うものを先に、最大 n 件 */
export function readerQuestionsFor(business: string | null | undefined, n = 8): MfgItem[] {
  const inds = detectIndustries(business);
  return MFG_DOMESTIC.filter((x) => x.kind === "question" && matches(x, inds) > 0)
    .sort((a, b) => matches(b, inds) - matches(a, inds))
    .slice(0, n);
}

/** 書く記事の案（業種が合うもの・どの業種にも合うもの） */
export function articleIdeasFor(business: string | null | undefined, n = 10): { title: string; why: string }[] {
  const inds = detectIndustries(business);
  return MFG_DOMESTIC.filter((x) => x.articleIdea && x.useFor.includes("article_idea") && x.kind !== "trend" && matches(x, inds) > 0)
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
  const all = MFG_DOMESTIC.filter((x) => (x.kind === "buyer" || x.kind === "success" || x.kind === "term") && matches(x, inds) > 0);
  if (!all.length) return null;
  let h = 0;
  for (const c of dayKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  // 3回のうち2回は、その会社の業種の話にする（どの業種にも合う話は数が多く、それだけになりやすい）
  const own = all.filter((x) => matches(x, inds) === 2);
  const pool = own.length >= 5 && h % 3 !== 0 ? own : all;
  return pool[(h >>> 2) % pool.length];
}

/** 読む人がつまずきそうな言葉（業種が合うもの・どの業種にも合うもの）。記事で言葉に短い説明を添える参考 */
export function readerTermsFor(business: string | null | undefined, n = 6): MfgItem[] {
  const inds = detectIndustries(business);
  return MFG_DOMESTIC.filter((x) => x.kind === "term" && matches(x, inds) > 0)
    .sort((a, b) => matches(b, inds) - matches(a, inds))
    .slice(0, n);
}

export function mfgCounts(items: MfgItem[] = MFG_DOMESTIC): Record<MfgKind, number> {
  const c = { pain: 0, question: 0, success: 0, buyer: 0, trend: 0, term: 0 } as Record<MfgKind, number>;
  for (const x of items) c[x.kind] += 1;
  return c;
}

/** 入口のページに見せる数字と例。サーバーで作って、データ全体はブラウザに送らない */
export interface MfgShowcase {
  total: number;
  industries: number;
  counts: Record<MfgKind, number>;
  samples: { id: string; title: string }[];
}

export function mfgShowcase(): MfgShowcase {
  // 発注する人の疑問から、業種ごとの加工の相談らしいものを、業種が重ならないように見せる
  const seen = new Set<string>();
  const samples: { id: string; title: string }[] = [];
  for (const x of MFG_DOMESTIC) {
    if (x.kind !== "question" || x.industries.includes("all") || seen.has(x.industries[0])) continue;
    seen.add(x.industries[0]);
    samples.push({ id: x.id, title: x.title });
    if (samples.length >= 12) break;
  }
  return {
    total: MFG_DOMESTIC.length,
    industries: new Set(MFG_DOMESTIC.flatMap((x) => x.industries).filter((i) => i !== "all")).size,
    counts: mfgCounts(),
    samples,
  };
}
