"use client";

// しおりが育つ（2026-11-02 田村さん「顧客が自分の管理画面でAIが育っている感じを演出したい」）。
// 理解度（レベル）は、実際にたまった会社の知識と使った回数から出す。作り話の演出にはしない。
// メモ帳は、記事を作るときにAIへ渡している「会社の知識」（src/lib/growth/knowledge.ts）と同じもの。

import Link from "next/link";
import { Shiori, type ShioriMood } from "@/components/fun";
import { KNOWLEDGE_SOURCE_LABEL, type KnowledgeItem, type KnowledgeSource } from "@/lib/growth/knowledge";
import { companyKnowledge, localHearing } from "@/lib/growth/localKnowledge";
import type { MockDb } from "@/mock/store";

export const SHIORI_LEVELS: { at: number; name: string; mood: ShioriMood }[] = [
  { at: 0, name: "はじめまして", mood: "bow" },
  { at: 40, name: "知り合い", mood: "ask" },
  { at: 120, name: "顔なじみ", mood: "point" },
  { at: 250, name: "相棒", mood: "cheer" },
  { at: 450, name: "右腕", mood: "jersey-cheer" },
  { at: 700, name: "専属ライター", mood: "jersey-done" },
  { at: 1000, name: "AIOの名パートナー", mood: "welldone" },
];

/** 経験値。答えた・書いた・確かめた分だけ増える */
export function shioriXp(db: MockDb, orgId: string): { xp: number; parts: { label: string; count: number; each: number }[] } {
  const hearing = db.hearing ?? localHearing();
  const answered = Object.values(hearing).filter((a) => a.text.trim() && !a.draft);
  const deep = answered.reduce((n, a) => n + a.followUps.filter((f) => f.answer.trim()).length, 0);
  const articles = db.articles.filter((a) => a.organizationId === orgId);
  const written = articles.filter((a) => db.versions.some((v) => v.id === a.currentVersionId && v.body.length > 0)).length;
  const published = articles.filter((a) => a.status === "published").length;
  const checks = db.aioChecks.filter((c) => c.organizationId === orgId);
  const checked = checks.filter((c) => c.status === "done").length;
  const told = checks.reduce((n, c) => n + c.answers.filter((a) => !a.unknown && a.text.trim()).length, 0);
  const parts = [
    { label: "会社のことに答えた", count: answered.length, each: 10 },
    { label: "深掘りに答えた", count: deep, each: 5 },
    { label: "書いた記事", count: written, each: 30 },
    { label: "公開した記事", count: published, each: 50 },
    { label: "AIOのチェック", count: checked, each: 20 },
    { label: "チェックで答えた", count: told, each: 5 },
  ];
  return { xp: parts.reduce((n, p) => n + p.count * p.each, 0), parts };
}

export function shioriLevel(xp: number) {
  let i = 0;
  while (i + 1 < SHIORI_LEVELS.length && xp >= SHIORI_LEVELS[i + 1].at) i++;
  const cur = SHIORI_LEVELS[i];
  const next = SHIORI_LEVELS[i + 1];
  return { level: i + 1, ...cur, next, progress: next ? (xp - cur.at) / (next.at - cur.at) : 1 };
}

const SOURCE_STYLE: Record<KnowledgeSource, string> = {
  imported: "bg-ok-soft text-ok",
  style: "bg-sky/40 text-ink",
  hearing: "bg-brand-soft text-brand-dark",
  aio_check: "bg-ok-soft text-ok",
  published: "bg-sun-soft text-ink",
  article: "bg-canvas text-muted",
};

function KnowledgeCard({ item, i }: { item: KnowledgeItem; i: number }) {
  return (
    <li className="animate-rise rounded-2xl border border-line bg-surface p-3" style={{ animationDelay: `${i * 0.05}s` }}>
      <span className={`mb-1 inline-block rounded-full px-2 text-xs font-bold ${SOURCE_STYLE[item.source]}`}>{KNOWLEDGE_SOURCE_LABEL[item.source]}</span>
      <b className="block text-sm">{item.label}</b>
      <span className="line-clamp-2 text-sm text-muted">{item.text}</span>
    </li>
  );
}

/** ホームの「しおりの理解度」と「しおりのメモ帳」 */
export function ShioriGrowth({ db, orgId }: { db: MockDb; orgId: string }) {
  const { xp, parts } = shioriXp(db, orgId);
  const lv = shioriLevel(xp);
  const notes = companyKnowledge(db, orgId);
  const shown = notes.slice(0, 6);
  return (
    <section className="card animate-rise space-y-4" aria-labelledby="shiori-growth-heading">
      <div className="flex flex-wrap items-end gap-4">
        <div className="relative shrink-0">
          <Shiori mood={lv.mood} className="h-32 w-auto" />
          <span className="absolute -right-2 top-0 animate-pop rounded-full bg-brand px-2.5 py-0.5 text-sm font-black text-white shadow">Lv.{lv.level}</span>
        </div>
        <div className="min-w-0 flex-1 basis-60 space-y-2">
          <h2 id="shiori-growth-heading" className="text-lg font-black">
            しおりの、あなたの会社の理解度：<span className="text-brand">{lv.name}</span>
          </h2>
          <div>
            <div className="h-4 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-label="次のレベルまで" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(lv.progress * 100)}>
              <div className="h-full rounded-full bg-gradient-to-r from-sun to-brand transition-[width] duration-1000" style={{ width: `${Math.max(4, lv.progress * 100)}%` }} />
            </div>
            <p className="mt-1 text-sm text-muted">
              {lv.next ? `次の「${lv.next.name}」まで あと${lv.next.at - xp}ポイント` : "最高のレベルです。いつもありがとうございます！"}（今 {xp}ポイント）
            </p>
          </div>
          <p className="text-sm">答えるほど、書くほど、しおりはあなたの会社に詳しくなり、次の記事があなたらしくなります。</p>
          <Link href="/knowledge" className="btn-secondary min-h-10 px-4 text-sm">
            ChatGPT・Claude・Gemini やブログから取り込む →
          </Link>
        </div>
      </div>

      <details className="rounded-2xl bg-canvas p-3 text-sm">
        <summary className="cursor-pointer font-bold text-brand-dark">ポイントのたまり方</summary>
        <ul className="mt-2 grid gap-1 sm:grid-cols-2">
          {parts.map((p) => (
            <li key={p.label} className="flex justify-between gap-2">
              <span>
                {p.label}（1つ{p.each}ポイント）
              </span>
              <b className="tabular-nums">{p.count}</b>
            </li>
          ))}
        </ul>
      </details>

      <div>
        <h3 className="mb-2 font-black">📒 しおりのメモ帳（覚えていること {notes.length}件）</h3>
        {notes.length === 0 ? (
          <p className="text-sm text-muted">
            まだあまり覚えていません。
            <Link href="/prototype/hearing" className="font-bold text-brand-dark underline">
              会社のことを教える
            </Link>
            と、ここに増えていきます。
          </p>
        ) : (
          <>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((n, i) => (
                <KnowledgeCard key={n.label} item={n} i={i} />
              ))}
            </ul>
            {notes.length > shown.length && <p className="mt-2 text-sm text-muted">ほかに{notes.length - shown.length}件を覚えています。記事を書くたびに、今回のテーマに合うものを使います。</p>}
          </>
        )}
      </div>
    </section>
  );
}

/** 記事の画面の「今回使った、あなたの会社の知識」 */
export function KnowledgeUsed({ labels }: { labels: string[] }) {
  if (!labels.length) return null;
  return (
    <section className="mb-4 flex animate-rise flex-wrap items-start gap-3 rounded-3xl border-2 border-brand-soft bg-surface/80 px-4 py-3" aria-label="今回使った会社の知識">
      <Shiori mood="idea" className="h-16 w-auto shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-bold">しおりが今回使った、あなたの会社の知識（{labels.length}件）</p>
        <ul className="mt-1 flex flex-wrap gap-1.5 text-xs">
          {labels.map((l, i) => (
            <li key={l} className="animate-pop rounded-full bg-brand-soft px-2.5 py-1 font-bold text-brand-dark" style={{ animationDelay: `${i * 0.05}s` }}>
              🧠 {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
