// 取り込んだ会社の知識（ChatGPT・Claude・Gemini のまとめ）で、会社のことを聞く質問の答えが分かるものは飛ばす（2026-11-07 田村さん）。
// 頼み文（aiImport.ts の IMPORT_PROMPT）の見出しと、ヒアリングの質問を言葉で結びつける。分からない・短すぎるものは使わない。

import type { KnowledgeNote } from "@/types/domain";
import type { HearingAnswer } from "@/prototype/growth";

/** 質問ごとに、見出しに含まれていれば結びつける言葉。上から順に、まだ使っていない見出しを探す */
const MATCH: { id: string; words: string[] }[] = [
  { id: "faq", words: ["よく聞かれる", "質問"] },
  { id: "competitors", words: ["比べられる", "比較", "競合"] },
  { id: "avoid", words: ["使わない言葉", "気をつけ", "NG"] },
  { id: "customers", words: ["お客様の特徴", "よく来るお客様", "顧客"] },
  { id: "area", words: ["地域", "エリア"] },
  { id: "strengths", words: ["選ばれる理由", "強み"] },
  { id: "services", words: ["商品", "サービス"] },
  { id: "business", words: ["会社・お仕事", "お仕事の内容", "事業内容", "会社の概要"] },
];

/** これより短い答えは、聞き直したほうがよい（地名は短くてよい） */
const minChars = (id: string) => (id === "area" ? 2 : 4);

export interface HearingFill {
  questionId: string;
  text: string;
  /** 取り込んだときの見出し */
  from: string;
}

/** まだ答えていない質問のうち、取り込んだ知識で答えが分かるもの */
export function hearingFillsFromKnowledge(notes: Pick<KnowledgeNote, "label" | "text">[], answers: Record<string, HearingAnswer | undefined>): HearingFill[] {
  const used = new Set<number>();
  const out: HearingFill[] = [];
  for (const m of MATCH) {
    const i = notes.findIndex((n, k) => !used.has(k) && m.words.some((w) => n.label.includes(w)));
    if (i === -1) continue;
    used.add(i);
    const text = notes[i].text.trim();
    if (Array.from(text).length < minChars(m.id) || /^(不明|わからない|分からない|なし|特になし)[。.]?$/.test(text)) continue;
    const a = answers[m.id];
    if (a && a.text.trim() && !a.draft) continue;
    out.push({ questionId: m.id, text, from: notes[i].label });
  }
  // 画面では質問の順に並べる
  const order = ["business", "services", "customers", "area", "strengths", "competitors", "faq", "avoid"];
  return out.sort((a, b) => order.indexOf(a.questionId) - order.indexOf(b.questionId));
}
