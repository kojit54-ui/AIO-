"use client";

import Link from "next/link";
import { Shiori, Wave } from "@/components/fun";
import { EmptyState, StatusBadge, formatDate } from "@/components/ui";
import { useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";

export default function CoachHome() {
  const { db, user, month } = useStore();
  if (!user) return null;
  if (user.role !== "coach") {
    return (
      <main className="page">
        <EmptyState title="この画面を表示する権限がありません" action={<Link href="/" className="btn-secondary">ホームへ戻る</Link>} />
      </main>
    );
  }

  const orgs = db.organizations.filter((o) => user.organizationIds.includes(o.id));
  const waiting = db.articles
    .filter((a) => a.status === "in_review" && user.organizationIds.includes(a.organizationId))
    .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));

  return (
    <main className="page space-y-6">
      <div className="flex animate-rise items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            {user.name}さん、おつかれさまです <Wave />
          </h1>
          <p className="text-muted">
            {waiting.length > 0 ? `確認を待っている記事が${waiting.length}件あります。古い順に並んでいます。` : "確認待ちの記事はありません。担当企業の様子を見ておきましょう。"}
          </p>
        </div>
        <Shiori mood={waiting.length > 0 ? "point" : "coffee"} className="hidden h-36 w-auto shrink-0 animate-float sm:block" />
      </div>

      <section aria-labelledby="waiting-heading">
        <h2 id="waiting-heading" className="mb-3 flex items-center gap-2 text-lg font-bold">
          確認待ちの記事
          <span className={`grid h-7 min-w-7 place-items-center rounded-full px-2 text-sm font-black ${waiting.length ? "animate-pop bg-sun text-ink" : "bg-line text-muted"}`}>{waiting.length}</span>
        </h2>
        {waiting.length === 0 ? (
          <EmptyState title="確認待ちの記事はありません" />
        ) : (
          <ul className="space-y-3">
            {waiting.map((a, i) => {
              const v = db.versions.find((x) => x.id === a.reviewRequestedVersionId);
              const org = db.organizations.find((o) => o.id === a.organizationId);
              return (
                <li key={a.id} className="animate-rise" style={{ animationDelay: `${i * 0.06}s` }}>
                  <Link href={`/articles/${a.id}`} className="card group flex flex-col gap-1 border-2 border-sun px-5 py-4 transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{v?.title}</span>
                      <span className="block text-sm text-muted">{org?.name}</span>
                    </span>
                    <span className="text-sm text-muted">依頼 {formatDate(a.updatedAt)}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-brand">
                      確認する
                      <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="orgs-heading">
        <h2 id="orgs-heading" className="mb-3 text-lg font-bold">
          担当企業
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.map((o, i) => {
            const articles = db.articles.filter((a) => a.organizationId === o.id);
            const ready = isOrgReady(db, o.id, month);
            return (
              <li key={o.id} className="animate-rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <Link href={`/coach/orgs/${o.id}`} className="card block h-full transition-transform hover:-translate-y-1 hover:border-brand">
                  <span className="block text-lg font-black">{o.name}</span>
                  {!ready && <span className="mt-1 inline-block rounded-full bg-warn-soft px-3 text-sm font-bold text-warn">初期設定が必要です</span>}
                  <span className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted">確認待ち</span>
                    <span>{articles.filter((a) => a.status === "in_review").length}件</span>
                    <span className="text-muted">公開済み</span>
                    <span>{articles.filter((a) => a.status === "published").length}件</span>
                    <span className="text-muted">今月の生成</span>
                    <span>
                      {o.generationsUsedThisMonth} / {o.monthlyGenerationLimit}回
                      <span className="mt-1 block h-2 overflow-hidden rounded-full bg-canvas" aria-hidden>
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-sun to-brand"
                          style={{ width: `${o.monthlyGenerationLimit ? Math.min(100, (o.generationsUsedThisMonth / o.monthlyGenerationLimit) * 100) : 0}%` }}
                        />
                      </span>
                    </span>
                    <span className="text-muted">確認依頼</span>
                    <span>{o.reviewPolicy === "required" ? "必須" : "任意"}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="all-heading">
        <h2 id="all-heading" className="mb-3 text-lg font-bold">
          最近の記事
        </h2>
        <ul className="space-y-3">
          {db.articles
            .filter((a) => user.organizationIds.includes(a.organizationId) && a.currentVersionId)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 8)
            .map((a, i) => (
              <li key={a.id} className="animate-rise" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                <Link href={`/articles/${a.id}`} className="card flex flex-col gap-1 px-5 py-4 transition-transform hover:-translate-y-0.5 hover:border-brand sm:flex-row sm:items-center sm:gap-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{db.versions.find((v) => v.id === a.currentVersionId)?.title}</span>
                    <span className="block text-sm text-muted">{db.organizations.find((o) => o.id === a.organizationId)?.name}</span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <StatusBadge status={a.status} />
                    {a.publishedWithoutApproval && <span className="text-warn">未承認で公開</span>}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
