// しおりのスタンプ帳（2026-11-03。田村さん「ゲーミフィケーションも忘れずに」）。
// どれも実際の記録（記事・チェック・取り込み・つながり）から出す。作り話の実績にはしない。

import type { MockDb } from "@/mock/store";
import { writingStreak } from "@/components/MonthlyGrowth";
import { localHearing } from "./localKnowledge";

export interface Badge {
  id: string;
  icon: string;
  title: string;
  /** 取る前に見せる、取り方 */
  how: string;
  got: boolean;
}

/** スタンプ帳のバッジ。並びは、取りやすい順 */
export function badges(db: MockDb, orgId: string, now = new Date()): Badge[] {
  const hearing = db.hearing ?? localHearing();
  const answered = Object.values(hearing).filter((a) => a.text.trim() && !a.draft).length;
  const articles = db.articles.filter((a) => a.organizationId === orgId);
  const ids = new Set(articles.map((a) => a.id));
  const written = new Set(db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0).map((v) => v.articleId)).size;
  const published = articles.filter((a) => a.status === "published").length;
  const checks = db.aioChecks.filter((c) => c.organizationId === orgId && c.status === "done");
  const perfect = checks.some((c) => c.items.length > 0 && c.items.every((i) => i.ok));
  const notes = (db.knowledgeNotes ?? []).filter((n) => n.organizationId === orgId).length;
  const blogs = db.referenceArticles.filter((r) => r.organizationId === orgId).length;
  const sc = (db.searchConsole ?? []).some((x) => x.organizationId === orgId && x.verifiedAt);
  const mentioned = (db.aioMentions ?? []).some((m) => m.organizationId === orgId && m.mentioned);
  const streak = writingStreak(db, orgId, now);
  const b = (id: string, icon: string, title: string, how: string, got: boolean): Badge => ({ id, icon, title, how, got });
  return [
    b("hello", "👋", "はじめまして", "会社のことに3つ答える", answered >= 3),
    b("first", "✏️", "はじめての1本", "記事を1本書く", written >= 1),
    b("publish", "🚀", "デビュー", "記事を1本ブログに載せる", published >= 1),
    b("check", "🔍", "AIOチェック", "AIOのチェックを1回する", checks.length >= 1),
    b("teach", "📒", "しおりの先生", "しおりに会社の知識を5つ教える", notes + blogs >= 5),
    b("search", "🌐", "検索とつながった", "Search Console をつなぐ", sc),
    b("perfect", "💯", "満点", "AIOのチェックで全部OKになる", perfect),
    b("streak3", "🔥", "3か月つづけた", "3か月つづけて記事を書く", streak >= 3),
    b("five", "📚", "5本の書き手", "記事を5本ブログに載せる", published >= 5),
    b("mention", "🏆", "AIに紹介された", "AIの答えに、あなたの会社が出てくる", mentioned),
  ];
}

/** 前に見たときから、新しく取ったバッジ（お祝いに使う） */
export function newlyGot(list: Badge[], seen: string[]): Badge[] {
  return list.filter((x) => x.got && !seen.includes(x.id));
}
