"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AioNews } from "@/components/aio";
import { Wave } from "@/components/fun";
import { ShioriTalk } from "@/components/talk";
import { ChosenPath } from "@/components/ChosenPath";
import { MonthlyGrowth } from "@/components/MonthlyGrowth";
import { SearchConsoleCard } from "@/components/SearchConsoleCard";
import { ShioriGrowth } from "@/components/ShioriGrowth";
import { StampBook } from "@/components/StampBook";
import { TownBoard } from "@/components/TownBoard";
import { WhatsNew } from "@/components/WhatsNew";
import { MfgTip } from "@/components/MfgTip";
import { MoreOnHome, NextStepCard } from "@/components/NextStep";
import { NextWritingDay } from "@/components/NextWritingDay";
import { FirstAiQuestion } from "@/components/FirstAiQuestion";
import { nextStep } from "@/lib/nextStep";
import { useShioriTone } from "@/components/useShioriTone";
import { FIX_LINES, homeLines, homeMood, referenceTime } from "@/lib/shioriTone";
import { EmptyState, Notice, StatusBadge, formatDate, monthLabel } from "@/components/ui";
import { useStore } from "@/mock/store";
import { articleHref, articleSummaries } from "@/lib/selectors";

export default function HomePage() {
  const { db, user, month } = useStore();
  const router = useRouter();
  const [tone] = useShioriTone();
  const [nowMs] = useState(() => Date.now());

  useEffect(() => {
    if (user?.role === "coach") router.replace("/coach");
  }, [user, router]);
  if (!user || user.role === "coach") return null;

  const orgId = user.organizationIds[0];
  const note = db.coachingNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
  const list = articleSummaries(db, orgId);
  const inProgress = list.find((a) => a.status === "drafting" || a.status === "changes_requested");
  const org = db.organizations.find((o) => o.id === orgId);
  const mine = db.articles.filter((a) => a.organizationId === orgId);
  const lastWork = mine.reduce((m, a) => Math.max(m, new Date(a.updatedAt).getTime() || 0), 0);
  const situation = {
    publishedThisMonth: mine.filter((a) => a.publishedAt?.startsWith(month)).length,
    workedThisMonth: mine.filter((a) => a.updatedAt.startsWith(month)).length,
    inProgress: !!inProgress,
    totalArticles: mine.length,
    daysSinceLastWork: lastWork ? Math.max(0, Math.floor((referenceTime(month, nowMs) - lastWork) / 86_400_000)) : null,
  };
  const step = nextStep(list, situation.publishedThisMonth);
  // 案内役のひとことは、下の「次にやること」ボタンと同じことを話す
  const lines = step.kind === "fix" ? FIX_LINES[tone] : homeLines(tone, situation);

  return (
    <main className="page space-y-6">
      <FirstAiQuestion hasKnowledge={(db.knowledgeNotes ?? []).some((n) => n.organizationId === orgId)} />
      {org?.profile && !org.profileApprovedAt && (
        <Notice tone="warn" title="まず、会社の情報を確かめてください">
          記事を書き始める前に、コタムが登録した会社の情報に間違いがないか見てください。{" "}
          <Link href="/profile" className="font-semibold underline">
            確認する
          </Link>
        </Notice>
      )}
      <div className="animate-rise space-y-1">
        <h1 className="text-2xl font-black leading-snug sm:text-3xl">
          {user.name}さん、こんにちは <Wave />
        </h1>
        <ShioriTalk mood={homeMood(tone, situation)} size="lg" lines={lines} />
        <ChosenPath className="mt-2" />
      </div>
      <NextStepCard step={step} href={step.articleId ? articleHref(db, step.articleId) : "/articles/new"} />
      <NextWritingDay orgId={orgId} nowMs={nowMs} />
      <WhatsNew />
      {/* コタムの方針は、あるときだけ出す（無いときに「準備中」と出して待たせない。2026-11-03） */}
      {note && (
        <section className="card animate-rise [animation-delay:.1s]" aria-labelledby="policy-heading">
          <h2 id="policy-heading" className="inline-block rounded-full bg-sun-soft px-3 text-sm font-bold">
            {monthLabel(month)}の方針（コタムより）
          </h2>
          <p className="mt-1 text-xl font-bold">{note.focus}</p>
          <p className="mt-2">{note.clientVisibleNote}</p>
        </section>
      )}


      <TownBoard db={db} orgId={orgId} orgName={org?.name ?? ""} />

      {/* 読み物と記録は畳む（3AIの検討：ホームが長くて「次の1手」が埋もれる。2026-11-07） */}
      <MoreOnHome>
        <AioNews />
        <MfgTip business={org?.profile?.business} />
        <StampBook db={db} orgId={orgId} />
        <ShioriGrowth db={db} orgId={orgId} />
        <MonthlyGrowth db={db} orgId={orgId} month={month} />
        <SearchConsoleCard db={db} orgId={orgId} />
      </MoreOnHome>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading" className="mb-3 text-lg font-bold">
          これまでの記事
        </h2>
        {list.length === 0 ? (
          <EmptyState mood="jersey-cheer" title="まだ記事はありません">「今月の記事を書く」から始めましょう。</EmptyState>
        ) : (
          <ul className="space-y-3">
            {list.map((a, i) => (
              <li key={a.id} className="animate-rise" style={{ animationDelay: `${0.15 + i * 0.06}s` }}>
                <Link href={articleHref(db, a.id)} className="card flex flex-col gap-1 px-5 py-4 transition-transform hover:-translate-y-0.5 hover:border-brand sm:flex-row sm:items-center sm:gap-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{a.title}</span>
                    <span className="block text-sm text-muted">テーマ：{a.themeTitle}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-3 text-sm">
                    <StatusBadge status={a.status} />
                    {a.hasCoachComment && <span className="text-brand-dark">コメントあり</span>}
                    <span className="text-muted">更新 {formatDate(a.updatedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
