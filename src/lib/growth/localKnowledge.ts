// 画面で使う「会社の知識」。本物のデータでは読み込んだヒアリングの答え（db.hearing）、試作ではブラウザの中のヒアリングを使う。
// 記事を作るときにAIへ渡す知識（src/lib/generation/server.ts）と同じ組み立て方にする。

import { FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION, QUESTIONS } from "@/mock/data";
import type { MockDb } from "@/mock/store";
import type { HearingAnswer } from "@/prototype/growth";
import { buildKnowledge, type KnowledgeItem, type PastArticle } from "./knowledge";

const PROTOTYPE_KEY = "cotam-grow-prototype-v1";

/** 試作のヒアリングの答え（ブラウザの中）。読めなければ空 */
export function localHearing(): Record<string, HearingAnswer> {
  try {
    const raw = typeof window === "undefined" ? null : window.localStorage.getItem(PROTOTYPE_KEY);
    return (raw ? (JSON.parse(raw) as { answers?: Record<string, HearingAnswer> }).answers : undefined) ?? {};
  } catch {
    return {};
  }
}

export function companyKnowledge(db: MockDb, orgId: string, excludeArticleId?: string): KnowledgeItem[] {
  const hearing = db.hearing ?? localHearing();
  const aioAnswers = db.aioChecks
    .filter((c) => c.organizationId === orgId)
    .flatMap((c) =>
      c.questions.flatMap((q) => {
        const a = c.answers.find((x) => x.questionId === q.id);
        return a && !a.unknown && a.text.trim() ? [{ question: q.text, answer: a.text }] : [];
      }),
    );
  const pastArticles: PastArticle[] = db.articles
    .filter((a) => a.organizationId === orgId && a.id !== excludeArticleId && a.currentVersionId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8)
    .flatMap((a) => {
      const v = db.versions.find((x) => x.id === a.currentVersionId);
      return v ? [{ articleId: a.id, title: v.title, published: a.status === "published", answers: v.answers, body: v.body }] : [];
    });
  const notes = (db.knowledgeNotes ?? []).filter((n) => n.organizationId === orgId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return buildKnowledge({ hearing, aioAnswers, pastArticles, questions: [...QUESTIONS, FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION], notes });
}
