// 会社の知識（2026-11-02 田村さん「しおりが育つ。一度使ったらやめられなくしたい」）。
// AIは会社ごとに学習しない。その代わり、これまでに聞いたこと（ヒアリング・前の記事の答え・AIOのチェックの答え・公開した記事）を
// 「会社の知識」としてまとめ、記事を書くたびに素材として渡す。使った知識は版に残し、画面で「今回使った知識」として見せる。
// 画面（試作）とサーバーの両方で使うので、DBに触れない純粋な関数だけにする。

import { HEARING_QUESTIONS, type HearingAnswer } from "@/prototype/growth";
import type { Answer, Block, Question } from "@/types/domain";

export type KnowledgeSource = "hearing" | "article" | "aio_check" | "published" | "style" | "imported";

export interface KnowledgeItem {
  /** 何から来た知識か。画面のしるしに使う */
  source: KnowledgeSource;
  /** 画面とAIに見せる見出し（例：「選ばれる理由（会社のこと）」） */
  label: string;
  text: string;
}

/** AIに渡す会社の知識の合計の目安（入力全体は8,000字まで） */
export const MAX_KNOWLEDGE_CHARS = 3600;
const ITEM_CHARS = 320;

/** 会社のこと（ヒアリング）の問いの短い名前。画面のメモ帳と「今回使った知識」に出す */
const HEARING_SHORT: Record<string, string> = {
  business: "お仕事",
  services: "売りたいもの",
  customers: "よく来るお客様",
  area: "地域",
  strengths: "選ばれる理由",
  competitors: "比べられる会社",
  faq: "よく聞かれる質問",
  avoid: "気をつけること",
};

const cut = (s: string, n = ITEM_CHARS) => {
  const a = Array.from(s.trim().replace(/\s+/g, " "));
  return a.length > n ? `${a.slice(0, n - 1).join("")}…` : a.join("");
};

export interface PastArticle {
  articleId: string;
  title: string;
  published: boolean;
  answers: Answer[];
  body: Block[];
}

/** 記事の版（言い回しを覚えるのに使う）。aiMade＝AIが作った版、そうでなければお客様が直して保存した版 */
export interface VersionForStyle {
  articleId: string;
  versionNo: number;
  aiMade: boolean;
  body: Block[];
}

/** AIが作った版と、その直後にお客様が直した版を比べ、書き直した段落の組を新しい順に返す */
export function editPairs(versions: VersionForStyle[], max = 4): { before: string; after: string }[] {
  const byArticle = new Map<string, VersionForStyle[]>();
  for (const v of versions) byArticle.set(v.articleId, [...(byArticle.get(v.articleId) ?? []), v]);
  const pairs: { before: string; after: string; order: number }[] = [];
  for (const list of byArticle.values()) {
    const sorted = [...list].sort((a, b) => a.versionNo - b.versionNo);
    for (let i = 0; i + 1 < sorted.length; i++) {
      const ai = sorted[i];
      const mine = sorted[i + 1];
      if (!ai.aiMade || mine.aiMade) continue;
      const before = ai.body.flatMap((b) => (b.type === "paragraph" ? [b.text.trim()] : []));
      const after = mine.body.flatMap((b) => (b.type === "paragraph" ? [b.text.trim()] : []));
      // 同じ位置の段落で、言い回しを直したもの（中身を丸ごと変えたものは除く）
      before.forEach((t, k) => {
        const u = after[k];
        if (!u || t === u) return;
        const ratio = Math.min(t.length, u.length) / Math.max(t.length, u.length);
        if (ratio < 0.5 || t.length < 15) return;
        pairs.push({ before: t, after: u, order: mine.versionNo });
      });
    }
  }
  return pairs
    .sort((a, b) => b.order - a.order)
    .slice(0, max)
    .map(({ before, after }) => ({ before, after }));
}

export interface PastAioAnswer {
  question: string;
  answer: string;
}

/**
 * 会社の知識を、大事な順に並べて作る。今の記事は除く（呼び出し側で渡さない）。
 * 順番：会社のこと（ヒアリング）→ AIOのチェックで足した答え → 公開した記事 → 前の記事で答えたこと
 */
export function buildKnowledge(input: {
  hearing: Record<string, HearingAnswer>;
  aioAnswers: PastAioAnswer[];
  pastArticles: PastArticle[];
  questions: Question[];
  /** お客様がAIの文を直した組（editPairs） */
  edits?: { before: string; after: string }[];
  /** ChatGPT などから取り込んだ知識（新しい順） */
  notes?: { label: string; text: string }[];
}): KnowledgeItem[] {
  const items: KnowledgeItem[] = [];
  // 言い回しの好みは、どの記事にも効くので先頭に置く
  if (input.edits?.length) {
    items.push({ source: "style", label: "直してもらった言い回し", text: cut(input.edits.map((e) => `「${cut(e.before, 70)}」→「${cut(e.after, 70)}」`).join("／"), 480) });
  }
  for (const q of HEARING_QUESTIONS) {
    const a = input.hearing[q.id];
    if (!a?.text.trim() || a.draft) continue;
    // 答えと深掘りの答えを別にする。1つにまとめて切ると、長い答えのあとの深掘り（別の事例など）が落ちていた（2026-11-10 クロップオザキの採点で判明）
    const label = HEARING_SHORT[q.id] ?? q.label.replace(/[？?]$/, "");
    items.push({ source: "hearing", label, text: cut(a.text, 480) });
    const deep = a.followUps.filter((f) => f.answer.trim()).map((f) => `${f.question}→${f.answer.trim()}`);
    if (deep.length) items.push({ source: "hearing", label: `${label}（深掘りの答え）`, text: cut(deep.join("／"), 480) });
  }
  for (const n of input.notes ?? []) {
    items.push({ source: "imported", label: cut(n.label, 40), text: cut(n.text) });
  }
  for (const x of input.aioAnswers) {
    if (!x.answer.trim()) continue;
    items.push({ source: "aio_check", label: `AIOのチェック：${cut(x.question.replace(/[？?]$/, ""), 24)}`, text: cut(x.answer) });
  }
  for (const p of input.pastArticles.filter((p) => p.published)) {
    const lead = p.body.find((b) => b.type === "paragraph");
    items.push({ source: "published", label: `公開した記事「${cut(p.title, 40)}」`, text: cut(lead && lead.type === "paragraph" ? lead.text : p.title, 160) });
  }
  for (const p of input.pastArticles) {
    const said = p.answers
      .filter((a) => !a.unknown && a.text.trim())
      .map((a) => `${input.questions.find((q) => q.id === a.questionId)?.label ?? a.questionId}→${a.text.trim()}`);
    if (!said.length) continue;
    items.push({ source: "article", label: `前の記事「${cut(p.title, 40)}」で答えたこと`, text: cut(said.join("／")) });
  }
  return items;
}

/** 文字数の目安に収まる分だけ、前から選ぶ */
export function pickKnowledge(items: KnowledgeItem[], budget = MAX_KNOWLEDGE_CHARS): KnowledgeItem[] {
  const out: KnowledgeItem[] = [];
  let used = 0;
  for (const it of items) {
    const n = it.label.length + it.text.length + 20;
    if (used + n > budget) continue;
    out.push(it);
    used += n;
  }
  return out;
}

export const KNOWLEDGE_SOURCE_LABEL: Record<KnowledgeSource, string> = {
  imported: "取り込み",
  style: "言い回し",
  hearing: "会社のこと",
  aio_check: "AIOのチェック",
  published: "公開した記事",
  article: "前の記事",
};
