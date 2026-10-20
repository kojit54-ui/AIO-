// 画面試作用のサンプル生成。AIは使わず、顧客の回答を並べ替えるだけ。
// 回答にない経験・実績・数値を足さないという本番の制約を、試作でも守る。
// T2-7 で AI 呼び出し層に置き換える。

import type { Answer, Block, CompanyProfile, FactCheck, FactCheckKind, Theme } from "@/types/domain";

const answerText = (answers: Answer[], id: string) => {
  const a = answers.find((x) => x.questionId === id);
  return a && !a.unknown && a.text.trim() ? a.text.trim() : null;
};

const sentence = (text: string) => (/[。！？!?]$/.test(text) ? text : `${text}。`);

/** 対応内容が短すぎるか未回答なら、生成前に具体的な場面を追加で聞く */
export function needsFollowUp(answers: Answer[]): boolean {
  if (answers.some((a) => a.questionId === "q2_followup")) return false;
  const q2 = answerText(answers, "q2");
  return !q2 || q2.length < 15;
}

export interface OutlineSection {
  heading: string;
  sourceQuestionIds: string[];
}

export function buildOutline(answers: Answer[]): OutlineSection[] {
  const sections: OutlineSection[] = [];
  if (answerText(answers, "q1")) sections.push({ heading: "ご相談の内容", sourceQuestionIds: ["q1"] });
  if (answerText(answers, "q2") || answerText(answers, "q2_followup"))
    sections.push({ heading: "行った対応", sourceQuestionIds: ["q2", "q2_followup"] });
  if (answerText(answers, "q3")) sections.push({ heading: "その後の様子", sourceQuestionIds: ["q3"] });
  if (answerText(answers, "q4")) sections.push({ heading: "気をつけたいこと", sourceQuestionIds: ["q4"] });
  sections.push({ heading: "ご相談はこちらから", sourceQuestionIds: ["q5"] });
  return sections;
}

export function buildTitleCandidates(theme: Theme): string[] {
  return [theme.title, `${theme.title}　実際のご相談から`, `${theme.readerProblem.replace(/人$/, "方")}へ`];
}

export function buildBody(answers: Answer[], headings: string[], theme: Theme, profile: CompanyProfile | null): Block[] {
  const outline = buildOutline(answers);
  const blocks: Block[] = [
    { type: "paragraph", text: `今回は「${theme.title}」について、実際にあったご相談をもとにご紹介します。` },
  ];
  outline.forEach((section, i) => {
    blocks.push({ type: "heading", level: 2, text: headings[i] ?? section.heading });
    const texts = section.sourceQuestionIds.map((id) => answerText(answers, id)).filter((t): t is string => !!t);
    if (section.sourceQuestionIds.includes("q5")) {
      const parts = [...texts.map(sentence)];
      if (profile?.contact) parts.push(`お問い合わせ：${profile.contact}`);
      blocks.push({ type: "paragraph", text: parts.join("") || "（問い合わせ先の案内を入れてください）" });
      return;
    }
    texts.forEach((t) => blocks.push({ type: "paragraph", text: sentence(t) }));
  });
  return blocks;
}

const FACT_PATTERNS: { kind: FactCheckKind; re: RegExp }[] = [
  { kind: "price", re: /[0-9０-９,，.]+\s*(?:万円|円)/g },
  { kind: "number", re: /[0-9０-９]+(?:\.[0-9]+)?\s*(?:%|％|度|年|日間|日|か月|ヶ月|件|社|人|名|倍|回|歳|代)/g },
  { kind: "customer_name", re: /[一-龯ァ-ヶ]{1,6}(?:様|さん)/g },
  { kind: "achievement", re: /(?:No\.?1|ナンバーワン|日本一|地域一番|最安|受賞|実績)/g },
];

/** 本文から要確認箇所の候補を抜き出す（試作用の簡易版） */
export function extractFactChecks(blocks: Block[], versionId: string): FactCheck[] {
  const texts = blocks.flatMap((b) => (b.type === "list" ? b.items : [b.text]));
  const found = new Map<string, FactCheckKind>();
  for (const t of texts) {
    for (const { kind, re } of FACT_PATTERNS) {
      for (const m of t.matchAll(re)) {
        // 前後を少し含めて、どの箇所か分かるようにする
        const start = Math.max(0, (m.index ?? 0) - 6);
        const excerpt = t.slice(start, (m.index ?? 0) + m[0].length + 4);
        if (![...found.keys()].some((k) => k.includes(m[0]))) found.set(excerpt, kind);
      }
    }
  }
  return [...found.entries()].map(([excerpt, kind], i) => ({
    id: `fc_${versionId}_${i + 1}`,
    versionId,
    excerpt,
    kind,
    status: "unchecked",
  }));
}

/** 「短くする」のサンプル：最初の文だけ残す */
export function sampleShorten(text: string): string {
  const first = text.match(/^.*?[。！？]/);
  return first && first[0] !== text ? first[0] : text.replace(/、[^、]*$/, "。");
}

/** 「伝わりやすくする」のサンプル：長い文を読点で区切って2文にする */
export function sampleClarify(text: string): string {
  return text
    .split(/(?<=。)/)
    .map((s) => {
      if (s.length < 40) return s;
      const i = s.indexOf("、", Math.floor(s.length / 3));
      return i > 0 ? `${s.slice(0, i)}。${s.slice(i + 1)}` : s;
    })
    .join("");
}
