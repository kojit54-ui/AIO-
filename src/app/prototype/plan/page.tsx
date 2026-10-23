"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice, PageSkeleton } from "@/components/ui";
import { PillarDiagram, PillarExplainer } from "@/prototype/components";
import {
  REASON_LABEL,
  ROW_STATUS_LABEL,
  type RowStatus,
  SAMPLE_LABEL,
  canPropose,
  computeGrowth,
  planFromProposal,
  sampleProposals,
} from "@/prototype/growth";
import { growActions, useGrow } from "@/prototype/store";

export default function PlanPage() {
  const g = useGrow();
  const [levelUp, setLevelUp] = useState<string | null>(null);
  if (!g.ready) return <PageSkeleton />;

  if (!canPropose(g.answers)) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">記事の設計図</h1>
        <Notice tone="info" title="先にヒアリングに答えてください">
          お仕事、売りたいサービス、お客様、地域の4つが分かると、キーワードと記事の組み立てを提案できます。
        </Notice>
        <Link href="/prototype/hearing" className="btn-primary">
          ヒアリングに答える
        </Link>
      </main>
    );
  }

  if (!g.plan) {
    return (
      <main className="page space-y-5">
        <div>
          <h1 className="text-2xl font-bold">記事の設計図を選ぶ</h1>
          <p className="text-muted">ヒアリングの答えから、記事の組み立てを3つ提案します。いちばん「書けそう」「売りたい」に近いものを選んでください。</p>
        </div>
        <PillarExplainer />
        {!g.proposals ? (
          <button type="button" className="btn-primary" onClick={() => growActions.setProposals(sampleProposals(g.answers))}>
            キーワードの提案を作る
          </button>
        ) : (
          <>
            <p className="text-sm text-warn">提案は{SAMPLE_LABEL}。本物では、AIがヒアリング全体を読んで作り、第2段階から Search Console の実際の検索語、第3段階からキーワードツールの検索回数を加えます。</p>
            <ul className="grid gap-3 lg:grid-cols-3">
              {g.proposals.map((p) => (
                <li key={p.id} className="card flex flex-col gap-3">
                  <ul className="flex flex-wrap gap-1" aria-label="この提案のねらい">
                    {p.reasons.map((r) => (
                      <li key={r} className="rounded-full bg-brand-soft px-2 py-0.5 text-sm font-semibold text-brand-dark">
                        {REASON_LABEL[r]}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="text-sm text-muted">柱の記事</p>
                    <p className="text-lg font-bold">{p.pillar.keyword}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted">周りの記事（{p.clusters.length}本）</p>
                    <ul className="list-disc pl-5">
                      {p.clusters.map((c) => (
                        <li key={c.id}>{c.keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-muted">{p.why}</p>
                  <button type="button" className="btn-primary" onClick={() => growActions.choosePlan(planFromProposal(p))}>
                    この設計図にする
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-secondary" onClick={() => growActions.setProposals(sampleProposals(g.answers))}>
              提案を作り直す
            </button>
          </>
        )}
      </main>
    );
  }

  const rows = g.plan.rows;
  function setStatus(rowId: string, status: RowStatus) {
    const before = computeGrowth(g.answers, g.plan).level;
    growActions.setRowStatus(rowId, status);
    const after = computeGrowth(g.answers, { ...g.plan!, rows: rows.map((r) => (r.id === rowId ? { ...r, status } : r)) });
    setLevelUp(after.level > before ? `レベル ${after.level}「${after.name}」に上がりました！` : null);
  }

  return (
    <main className="page space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">記事の設計図</h1>
          <p className="text-muted">真ん中が柱の記事、周りが細かい疑問に答える記事です。書いた記事から色が変わります。</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (window.confirm("いまの設計図と進み具合を消して、提案から選び直します。よろしいですか？")) growActions.choosePlan(null);
          }}
        >
          設計図を選び直す
        </button>
      </div>
      {levelUp && <Notice tone="ok" title={levelUp}>この調子で、周りの記事も1本ずつ増やしていきましょう。</Notice>}
      <section className="card">
        <PillarDiagram rows={rows} />
      </section>
      <PillarExplainer />

      <section aria-labelledby="sheet-heading" className="space-y-2">
        <h2 id="sheet-heading" className="text-lg font-bold">
          キーワード管理表
        </h2>
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {rows.map((r) => (
            <li key={r.id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  <span className="mr-2 rounded bg-canvas px-1.5 py-0.5 text-xs font-normal text-muted">{r.kind === "pillar" ? "柱" : "周り"}</span>
                  {r.keyword}
                </p>
                <p className="text-sm text-muted">読む人が知りたいこと：{r.question}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="sr-only" htmlFor={`status-${r.id}`}>
                  {r.keyword}の状態
                </label>
                <select id={`status-${r.id}`} className="field w-auto py-1" value={r.status} onChange={(e) => setStatus(r.id, e.target.value as RowStatus)}>
                  {(Object.keys(ROW_STATUS_LABEL) as RowStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {ROW_STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                {r.status !== "published" && (
                  <Link href={`/prototype/write/${r.id}`} className="btn-primary min-h-9 px-3 py-1">
                    {r.status === "writing" ? "続きを書く" : "書く"}
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">第3段階でキーワードツールをつなぐと、この表に毎月の検索回数が加わります。</p>
      </section>
    </main>
  );
}
