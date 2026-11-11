// AIに紹介されたかのチェックで聞く質問（画面とサーバーの両方で使う）。src/lib/growth/mentions.ts

import type { HearingAnswer } from "@/prototype/growth";

/** 1社が1か月に調べられる回数（1回で質問を最大3つ） */
export const MONTHLY_MENTION_CHECKS = 4;
export const MAX_MENTION_QUESTIONS = 3;

const first = (s: string) => s.split(/[\n、。,／/]/).map((x) => x.trim()).find(Boolean) ?? "";

/** ヒアリングの答えから、お客様がAIに聞きそうな質問を作る（AIは使わない） */
export function mentionQuestions(hearing: Record<string, HearingAnswer>): string[] {
  const t = (id: string) => (hearing[id] && !hearing[id].draft ? hearing[id].text.trim() : "");
  const clean = (x: string) => x.replace(/^例：/, "").trim();
  // 地域は最初の1つだけ（「さくら市と南町」→「さくら市」）。長いものは地名ではないので使わない
  const areaRaw = clean(first(t("area"))).split(/と|・/)[0].trim();
  const area = areaRaw.length <= 12 ? areaRaw : "";
  const services = t("services")
    .split(/[\n、,／/。]/)
    .map(clean)
    .filter((x) => x && x.length <= 24)
    .slice(0, 2);
  const business = clean(first(t("business")));
  const where = area ? `${area}で` : "";
  const out = services.map((s) => `${where}${s}を頼むなら、どこがおすすめ？`);
  if (business && business.length <= 20) out.push(`${where}${business}でおすすめのところは？`);
  return [...new Set(out)].slice(0, MAX_MENTION_QUESTIONS);
}


/** 会社名から、AIの答えに出てきそうな呼び方を作る（「株式会社さくら工房」→「さくら工房」も探す） */
export function companyNameVariants(name: string): string[] {
  const base = name.trim();
  const stripped = base.replace(/^(株式会社|有限会社|合同会社|合資会社|（株）|\(株\)|㈱|（有）|\(有\)|㈲)\s*/, "").replace(/\s*(株式会社|有限会社|合同会社|（株）|\(株\)|㈱)$/, "").trim();
  return [...new Set([base, stripped, ...base.split(/[\s　]/)])].filter((n) => n.length >= 2 && !/^(株式会社|有限会社|合同会社)$/.test(n));
}

/** サイトのアドレスから、出典と比べる名前（ドメイン）を取り出す。Search Console の sc-domain: にも対応 */
export function siteDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  const s = url.trim();
  if (s.startsWith("sc-domain:")) return s.slice("sc-domain:".length).replace(/^www\./, "") || null;
  try {
    return new URL(s).hostname.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
}

export interface QuestionToWrite {
  question: string;
  /** AIがその答えで参考にしたサイト（ドメイン、2つまで） */
  citedSites: string[];
}

/**
 * AIに聞いても、まだ会社が出てこない質問。いちばん新しい結果だけで判断し、
 * 同じ質問をテーマにした記事があるものと、サンプルは外す。記事を書くきっかけに使う
 */
export function questionsToWrite(
  mentions: { question: string; mentioned: boolean; isSample: boolean; createdAt: string; sources: { url: string }[] }[],
  writtenThemes: string[],
  max = 3,
): QuestionToWrite[] {
  const latest = new Map<string, (typeof mentions)[number]>();
  for (const m of [...mentions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) if (!latest.has(m.question)) latest.set(m.question, m);
  const written = new Set(writtenThemes.map((t) => t.trim()));
  return [...latest.values()]
    .filter((m) => !m.mentioned && !m.isSample && !written.has(m.question.trim()))
    .slice(0, max)
    .map((m) => ({ question: m.question, citedSites: [...new Set(m.sources.map((s) => siteDomain(s.url)).filter((d): d is string => !!d))].slice(0, 2) }));
}

/** 質問から記事を始めるときの「誰のどんな悩み」 */
export const readerProblemForQuestion = (question: string) => `AIに「${question}」と聞いて、頼み先を探している人`;
