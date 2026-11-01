"use client";

import Link from "next/link";
import { Notice, PageSkeleton } from "@/components/ui";
import { PillarDiagram, PillarExplainer } from "@/prototype/components";
import {
  REASON_LABEL,
  SAMPLE_LABEL,
  canPropose,
  planFromProposal,
  sampleProposals,
} from "@/prototype/growth";
import { growActions, useGrow } from "@/prototype/store";

export default function PlanPage() {
  const g = useGrow();
  if (!g.ready) return <PageSkeleton />;

  if (!canPropose(g.answers)) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">記事の設計図</h1>
        <Notice tone="info" title="先にヒアリングに答えてください">
          お仕事、売りたいサービス、お客様、地域の4つに答え終わる（「次へ」を押し、もう少し教えての質問にも答えるか飛ばす）と、キーワードと記事の組み立てを提案できます。
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
      <section className="card">
        <PillarDiagram rows={rows.filter((r) => !r.parked)} />
      </section>
      <PillarExplainer />

      <section className="card flex flex-wrap items-center justify-between gap-3" aria-labelledby="sheet-heading">
        <div>
          <h2 id="sheet-heading" className="text-lg font-bold">
            キーワード管理表
          </h2>
          <p className="text-muted">
            {rows.filter((r) => !r.parked).length}本のうち {rows.filter((r) => !r.parked && r.status === "published").length}本 やりました。やった・まだの管理と、次に書く1本は管理表で。
          </p>
        </div>
        <Link href="/prototype/keywords" className="btn-primary">
          キーワード管理表を開く
        </Link>
      </section>
    </main>
  );
}
