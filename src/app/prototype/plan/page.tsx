"use client";

import Link from "next/link";
import { WaitingScreen } from "@/components/WaitingScreen";
import { useEffect } from "react";
import { Notice, PageSkeleton } from "@/components/ui";
import { PillarDiagram, PillarExplainer } from "@/prototype/components";
import {
  KIND_LABEL,
  REASON_LABEL,
  SAMPLE_LABEL,
  canPropose,
  planFromProposal,
  sampleProposals,
} from "@/prototype/growth";
import { growActions, useGrow, useGrowSync } from "@/prototype/store";

export default function PlanPage() {
  const g = useGrow();
  const sync = useGrowSync();
  const remote = sync.mode === "remote";
  const ready = g.ready && canPropose(g.answers);
  // 本物のデータでは、答えがそろって提案がまだ無ければ、開いただけでコタムからの提案を作ってもらう（人の手を介さない）
  useEffect(() => {
    if (remote && ready && !g.plan && !g.proposals) growActions.requestProposals({ auto: true });
  }, [remote, ready, g.plan, g.proposals]);
  if (!g.ready) return <PageSkeleton />;
  const propose = () => (remote ? growActions.requestProposals() : growActions.setProposals(sampleProposals(g.answers)));

  if (!canPropose(g.answers)) {
    return (
      <main className="page max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">書く記事を決める</h1>
        <Notice tone="info" title="先に会社のことを教えてください">
          お仕事、売りたいサービス、お客様、地域の4つに答えると、しおりが書く記事をおすすめできます。
        </Notice>
        <Link href="/prototype/hearing" className="btn-primary">
          会社のことを教える
        </Link>
      </main>
    );
  }

  if (!g.plan) {
    return (
      <main className="page space-y-5">
        <div>
          <h1 className="text-2xl font-bold">書く記事を決める</h1>
          <p className="text-muted">教えてもらった内容から、記事のセットを3つおすすめします。いちばん「書けそう」「売りたい」に近いものを選んでください。</p>
        </div>
        <PillarExplainer />
        {sync.proposing && <WaitingScreen label="しおりがおすすめを考えています" note="教えてもらった内容と、実際に検索されている言葉から考えています。1分ほどお待ちください。" />}
        {sync.proposing ? (
          <div className="card flex items-center gap-3" role="status" aria-live="polite">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
            <p>しおりが、教えてもらった内容と、実際に検索されている言葉からおすすめを考えています。1分ほどお待ちください。</p>
          </div>
        ) : !g.proposals ? (
          <button type="button" className="btn-primary" onClick={propose}>
            しおりにおすすめを出してもらう
          </button>
        ) : (
          <>
            {remote && g.proposalInfo && !g.proposalInfo.isSample ? (
              <div>
                <h2 className="text-lg font-bold">コタムからの提案</h2>
                <p className="text-sm text-muted">
                  教えてもらった内容{g.proposalInfo.usedResearch ? "と、実際に検索されている言葉" : ""}をもとに、AIが作りました。
                </p>
              </div>
            ) : (
              <p className="text-sm text-warn">おすすめは{SAMPLE_LABEL}。本番では、AIが教えてもらった内容を全部読んで作り、実際に Google で探されている言葉も使います。</p>
            )}
            <ul className="grid gap-3 lg:grid-cols-3">
              {g.proposals.map((p) => (
                <li key={p.id} className="card flex flex-col gap-3">
                  <ul className="flex flex-wrap gap-1" aria-label="このセットのねらい">
                    {p.reasons.map((r) => (
                      <li key={r} className="rounded-full bg-brand-soft px-2 py-0.5 text-sm font-semibold text-brand-dark">
                        {REASON_LABEL[r]}
                      </li>
                    ))}
                  </ul>
                  <div>
                    <p className="text-sm text-muted">{KIND_LABEL.pillar}</p>
                    <p className="text-lg font-bold">{p.pillar.keyword}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted">{KIND_LABEL.cluster}（{p.clusters.length}本）</p>
                    <ul className="list-disc pl-5">
                      {p.clusters.map((c) => (
                        <li key={c.id}>{c.keyword}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-muted">{p.why}</p>
                  <button type="button" className="btn-primary" onClick={() => growActions.choosePlan(planFromProposal(p), p)}>
                    このセットで書いていく
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-secondary" onClick={propose}>
              おすすめを出し直す
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
          <h1 className="text-2xl font-bold">書いていく記事</h1>
          <p className="text-muted">真ん中がまとめ記事、まわりが細かい疑問に答えるくわしい記事です。書いた記事から色が変わります。</p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            if (window.confirm("いまの記事のセットと進み具合を消して、おすすめから選び直します。よろしいですか？")) growActions.choosePlan(null);
          }}
        >
          記事のセットを選び直す
        </button>
      </div>
      <section className="card">
        <PillarDiagram rows={rows.filter((r) => !r.parked)} />
      </section>
      <PillarExplainer />

      <section className="card flex flex-wrap items-center justify-between gap-3" aria-labelledby="sheet-heading">
        <div>
          <h2 id="sheet-heading" className="text-lg font-bold">
            書く記事リスト
          </h2>
          <p className="text-muted">
            {rows.filter((r) => !r.parked).length}本のうち {rows.filter((r) => !r.parked && r.status === "published").length}本 やりました。やった・まだを見ながら、次に書く1本を決められます。
          </p>
        </div>
        <Link href="/prototype/keywords" className="btn-primary">
          書く記事リストを開く
        </Link>
      </section>
    </main>
  );
}
