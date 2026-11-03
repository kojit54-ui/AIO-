"use client";

import Link from "next/link";
import { Shiori, Wave } from "@/components/fun";
import { EmptyState, StatusBadge, formatDate } from "@/components/ui";
import { useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";
import { writingStreak } from "@/lib/growth/monthly";
import { badges } from "@/lib/growth/badges";

export default function CoachHome() {
  const { db, user, month } = useStore();
  if (!user) return null;
  if (user.role !== "coach") {
    return (
      <main className="page">
        <EmptyState mood="sad" title="この画面を表示する権限がありません" action={<Link href="/" className="btn-secondary">ホームへ戻る</Link>} />
      </main>
    );
  }

  const orgs = db.organizations.filter((o) => user.organizationIds.includes(o.id));
  // 記事ごとの最新のAIOのチェック（人の確認の代わり。docs/DECISIONS.md 2026-11-02）
  const latestChecks = [...db.aioChecks]
    .filter((c) => user.organizationIds.includes(c.organizationId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((c, i, all) => all.findIndex((x) => x.articleId === c.articleId) === i)
    .slice(0, 10);
  const commentedAfter = (articleId: string, at: string) => db.reviews.some((r) => r.articleId === articleId && r.createdAt >= at);

  return (
    <main className="page space-y-6">
      <div className="flex animate-rise items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            {user.name}さん、おつかれさまです <Wave />
          </h1>
          <p className="text-muted">
            {latestChecks.length > 0
              ? "お客様の記事は、AIがチェックしています。結果とやり取りを見て、気になる所があればコメントを残せます。"
              : "まだAIOのチェックをした記事はありません。担当企業の様子を見ておきましょう。"}
          </p>
        </div>
        <Shiori mood={latestChecks.length > 0 ? "point" : "coffee"} className="hidden h-36 w-auto shrink-0 sm:block" />
      </div>

      <section aria-labelledby="checks-heading">
        <h2 id="checks-heading" className="mb-3 text-lg font-bold">
          最近のAIOのチェック
        </h2>
        {latestChecks.length === 0 ? (
          <EmptyState mood="coffee" title="AIOのチェックをした記事はまだありません" />
        ) : (
          <ul className="space-y-3">
            {latestChecks.map((c, i) => {
              const article = db.articles.find((a) => a.id === c.articleId);
              const title = db.versions.find((v) => v.id === (article?.currentVersionId ?? c.versionId))?.title;
              const org = db.organizations.find((o) => o.id === c.organizationId);
              const good = c.items.filter((x) => x.ok).length;
              return (
                <li key={c.id} className="animate-rise" style={{ animationDelay: `${i * 0.06}s` }}>
                  <Link href={`/articles/${c.articleId}`} className="card group flex flex-col gap-2 px-5 py-4 transition-transform hover:-translate-y-0.5 hover:border-brand sm:flex-row sm:items-center sm:gap-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold">{title}</span>
                      <span className="block text-sm text-muted">
                        {org?.name}・{formatDate(c.createdAt)}
                      </span>
                    </span>
                    <span className="w-full sm:w-36">
                      <span className="block text-sm">
                        {good} / {c.items.length} 項目OK
                      </span>
                      <span className="mt-1 block h-2 overflow-hidden rounded-full bg-canvas" aria-hidden>
                        <span className="block h-full rounded-full bg-gradient-to-r from-sun to-ok-bright" style={{ width: `${c.items.length ? (good / c.items.length) * 100 : 0}%` }} />
                      </span>
                    </span>
                    <span className="flex flex-wrap items-center gap-2 text-sm">
                      <span className={`rounded-full px-2.5 font-bold ${c.status === "done" ? "bg-ok-soft text-ok" : "bg-sun-soft"}`}>{c.status === "done" ? "チェック済み" : "答え待ち"}</span>
                      {commentedAfter(c.articleId, c.createdAt) && <span className="rounded-full bg-brand-soft px-2.5 font-bold text-brand-dark">コメント済み</span>}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-brand">
                      見る
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
            const ready = isOrgReady(db, o.id);
            // 続けてもらうための目印（2026-11-03）。最近書いていない会社は、声をかけるきっかけにする
            const ids = new Set(articles.map((a) => a.id));
            const lastWrite = db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0).reduce((m, v) => (v.createdAt > m ? v.createdAt : m), "");
            const quiet = !lastWrite || lastWrite.slice(0, 7) < month;
            const streak = writingStreak(db, o.id);
            const stamps = badges(db, o.id);
            const sc = (db.searchConsole ?? []).find((x) => x.organizationId === o.id && x.verifiedAt);
            return (
              <li key={o.id} className="animate-rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <Link href={`/coach/orgs/${o.id}`} className="card block h-full transition-transform hover:-translate-y-1 hover:border-brand">
                  <span className="block text-lg font-black">{o.name}</span>
                  {!ready && <span className="mt-1 inline-block rounded-full bg-warn-soft px-3 text-sm font-bold text-warn">初期設定が必要です</span>}
                  {ready && quiet && <span className="mt-1 inline-block rounded-full bg-sun-soft px-3 text-sm font-bold">今月はまだ書いていません（声をかけるきっかけに）</span>}
                  <span className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
                    <span className={`rounded-full px-2 py-0.5 ${streak >= 2 ? "bg-sun text-ink" : "bg-canvas text-muted"}`}>🔥 {streak}か月つづけて</span>
                    <span className="rounded-full bg-canvas px-2 py-0.5">🎖️ スタンプ {stamps.filter((b) => b.got).length}/{stamps.length}</span>
                    <span className={`rounded-full px-2 py-0.5 ${sc ? "bg-ok-soft text-ok" : "bg-canvas text-muted"}`}>
                      🔍 {sc ? `検索に出た ${(sc.snapshot?.totals.impressions ?? 0).toLocaleString("ja-JP")}回` : "Search Console 未接続"}
                    </span>
                  </span>
                  <span className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted">AIOチェック済み</span>
                    <span>{articles.filter((a) => db.aioChecks.some((c) => c.status === "done" && (c.versionId === a.currentVersionId || c.resultVersionId === a.currentVersionId))).length}件</span>
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
