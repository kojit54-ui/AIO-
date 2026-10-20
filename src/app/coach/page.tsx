"use client";

import Link from "next/link";
import { EmptyState, StatusBadge, formatDate } from "@/components/ui";
import { CURRENT_MONTH } from "@/mock/data";
import { useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";

export default function CoachHome() {
  const { db, user } = useStore();
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
      <h1 className="text-2xl font-bold">コタム管理画面</h1>

      <section aria-labelledby="waiting-heading">
        <h2 id="waiting-heading" className="mb-3 text-lg font-bold">
          確認待ちの記事（{waiting.length}件）
        </h2>
        {waiting.length === 0 ? (
          <EmptyState title="確認待ちの記事はありません" />
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {waiting.map((a) => {
              const v = db.versions.find((x) => x.id === a.reviewRequestedVersionId);
              const org = db.organizations.find((o) => o.id === a.organizationId);
              return (
                <li key={a.id}>
                  <Link href={`/articles/${a.id}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-canvas sm:flex-row sm:items-center sm:gap-4">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{v?.title}</span>
                      <span className="block text-sm text-muted">{org?.name}</span>
                    </span>
                    <span className="text-sm text-muted">依頼 {formatDate(a.updatedAt)}</span>
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
          {orgs.map((o) => {
            const articles = db.articles.filter((a) => a.organizationId === o.id);
            const ready = isOrgReady(db, o.id, CURRENT_MONTH);
            return (
              <li key={o.id}>
                <Link href={`/coach/orgs/${o.id}`} className="card block h-full hover:border-brand">
                  <span className="block text-lg font-bold">{o.name}</span>
                  {!ready && <span className="mt-1 inline-block rounded bg-warn-soft px-2 text-sm text-warn">初期設定が必要です</span>}
                  <span className="mt-2 grid grid-cols-2 gap-1 text-sm">
                    <span className="text-muted">確認待ち</span>
                    <span>{articles.filter((a) => a.status === "in_review").length}件</span>
                    <span className="text-muted">公開済み</span>
                    <span>{articles.filter((a) => a.status === "published").length}件</span>
                    <span className="text-muted">今月の生成</span>
                    <span>
                      {o.generationsUsedThisMonth} / {o.monthlyGenerationLimit}回
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
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {db.articles
            .filter((a) => user.organizationIds.includes(a.organizationId) && a.currentVersionId)
            .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            .slice(0, 8)
            .map((a) => (
              <li key={a.id}>
                <Link href={`/articles/${a.id}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-canvas sm:flex-row sm:items-center sm:gap-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{db.versions.find((v) => v.id === a.currentVersionId)?.title}</span>
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
