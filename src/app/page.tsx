"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AioNews } from "@/components/aio";
import { Shiori, Wave } from "@/components/fun";
import { MonthlyGrowth } from "@/components/MonthlyGrowth";
import { ShioriGrowth } from "@/components/ShioriGrowth";
import { EmptyState, Notice, StatusBadge, formatDate, monthLabel } from "@/components/ui";
import { useStore } from "@/mock/store";
import { articleHref, articleSummaries } from "@/lib/selectors";

export default function HomePage() {
  const { db, user, month } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "coach") router.replace("/coach");
  }, [user, router]);
  if (!user || user.role === "coach") return null;

  const orgId = user.organizationIds[0];
  const note = db.coachingNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
  const list = articleSummaries(db, orgId);
  const inProgress = list.find((a) => a.status === "drafting" || a.status === "changes_requested");
  const org = db.organizations.find((o) => o.id === orgId);

  return (
    <main className="page space-y-6">
      {org?.profile && !org.profileApprovedAt && (
        <Notice tone="warn" title="まず、会社の情報を確かめてください">
          記事を書き始める前に、コタムが登録した会社の情報に間違いがないか見てください。{" "}
          <Link href="/profile" className="font-semibold underline">
            確認する
          </Link>
        </Notice>
      )}
      <div className="flex animate-rise items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            {user.name}さん、こんにちは <Wave />
          </h1>
          <p className="text-muted">今月も1本、いっしょに書きましょう。質問に答えるだけで記事になります。</p>
        </div>
        <Shiori mood="jersey-cheer" className="hidden h-36 w-auto shrink-0 animate-float sm:block" />
      </div>
      <section className="card animate-rise [animation-delay:.1s]" aria-labelledby="policy-heading">
        <h2 id="policy-heading" className="inline-block rounded-full bg-sun-soft px-3 text-sm font-bold">
          {monthLabel(month)}の方針（コタムより）
        </h2>
        {note ? (
          <>
            <p className="mt-1 text-xl font-bold">{note.focus}</p>
            <p className="mt-2">{note.clientVisibleNote}</p>
          </>
        ) : (
          <p className="mt-1">今月の方針は、コタムが準備中です。</p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2" aria-label="記事を書く">
        <Link href="/articles/new" className="btn-primary min-h-16 text-xl">
          今月の記事を書く
          <span className="inline-block animate-nudge" aria-hidden>
            →
          </span>
        </Link>
        {inProgress ? (
          <Link href={articleHref(db, inProgress.id)} className="btn-secondary min-h-16 text-lg">
            書きかけの記事を続ける
          </Link>
        ) : (
          <p className="flex min-h-16 items-center justify-center rounded-full border-2 border-dashed border-line px-4 text-muted">
            書きかけの記事はありません
          </p>
        )}
      </section>

      <AioNews />

      <ShioriGrowth db={db} orgId={orgId} />
      <MonthlyGrowth db={db} orgId={orgId} month={month} />

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
