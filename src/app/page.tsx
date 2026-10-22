"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
        <Notice tone="warn" title="会社プロフィールの確認をお願いします">
          記事を作り始める前に、コタムが登録した会社の情報をご確認ください。{" "}
          <Link href="/profile" className="font-semibold underline">
            確認する
          </Link>
        </Notice>
      )}
      <section className="card" aria-labelledby="policy-heading">
        <h1 id="policy-heading" className="text-sm font-semibold text-muted">
          {monthLabel(month)}の指導方針
        </h1>
        {note ? (
          <>
            <p className="mt-1 text-xl font-bold">{note.focus}</p>
            <p className="mt-2">{note.clientVisibleNote}</p>
          </>
        ) : (
          <p className="mt-1">今月の指導方針は、コタムが準備中です。</p>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2" aria-label="記事を書く">
        <Link href="/articles/new" className="btn-primary min-h-16 text-lg">
          今月の記事を書く
        </Link>
        {inProgress ? (
          <Link href={articleHref(db, inProgress.id)} className="btn-secondary min-h-16 text-lg">
            書きかけの記事を続ける
          </Link>
        ) : (
          <p className="flex min-h-16 items-center justify-center rounded-lg border border-dashed border-line px-4 text-muted">
            書きかけの記事はありません
          </p>
        )}
      </section>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading" className="mb-3 text-lg font-bold">
          記事一覧
        </h2>
        {list.length === 0 ? (
          <EmptyState title="まだ記事はありません">「今月の記事を書く」から始めましょう。</EmptyState>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
            {list.map((a) => (
              <li key={a.id}>
                <Link href={articleHref(db, a.id)} className="flex flex-col gap-1 px-4 py-3 hover:bg-canvas sm:flex-row sm:items-center sm:gap-4">
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
