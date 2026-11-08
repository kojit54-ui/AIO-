"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CallListItem } from "@/app/api/admin/call-list/route";
import { AdminNav } from "@/components/admin/AdminNav";
import { ContactButton } from "@/components/admin/ContactButton";
import { ContactInfo } from "@/components/admin/ContactInfo";
import { jstToday, sortCalls } from "@/lib/admin/callOrder";
import { Shiori, Wave } from "@/components/fun";
import { EmptyState, StatusBadge, formatDate } from "@/components/ui";
import { useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";
import { writingStreak } from "@/lib/growth/monthly";
import { townPosition, townSteps } from "@/lib/growth/town";

export default function CoachHome() {
  const { db, user, month } = useStore();
  // 全社管理者なら「利用金額と利用頻度」と同じ判定（質問の進み具合・最後に使った日つき）を使う。読めなければ画面の中のデータで出す
  const [serverCalls, setServerCalls] = useState<CallListItem[] | null>(null);
  const [contactsEnabled, setContactsEnabled] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    let alive = true;
    fetch("/api/admin/call-list", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { orgs?: CallListItem[]; contactsEnabled?: boolean } | null) => {
        if (!alive || !j?.orgs) return;
        setServerCalls(j.orgs);
        setContactsEnabled(Boolean(j.contactsEnabled));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);
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
    .slice(0, 10)
    // 答え待ち（お客様の返事が要るもの）を上に
    .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"));
  const waitingChecks = latestChecks.filter((c) => c.status !== "done").length;
  // 声をかけたい会社（2026-11-08 管理者役の採点「声をかける順がトップで分からない」）
  const callList = orgs
    .map((o) => {
      const articles = db.articles.filter((a) => a.organizationId === o.id);
      const ids = new Set(articles.map((a) => a.id));
      const lastWrite = db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0).reduce((m, v) => (v.createdAt > m ? v.createdAt : m), "");
      const reasons: string[] = [];
      if (!isOrgReady(db, o.id)) reasons.push("初期設定が途中");
      else if (!lastWrite || lastWrite.slice(0, 7) < month) reasons.push("今月はまだ書いていない");
      if (articles.length > 0 && !articles.some((a) => a.status === "published")) reasons.push("記事をまだ1本も載せていない");
      return { org: o, reasons };
    })
    .filter((x) => x.reasons.length > 0)
    .map((x) => ({ id: x.org.id, name: x.org.name, reasons: x.reasons }));
  // AIOのチェックで、お客様の答え待ちがある会社も「声をかけたい」に入れる（理由に付ける）
  const waitingOrgIds = new Set(latestChecks.filter((c) => c.status !== "done").map((c) => c.organizationId));
  const withChecks = (list: CallListItem[]): CallListItem[] => {
    const out = list.map((x) => (waitingOrgIds.has(x.id) ? { ...x, reasons: [...x.reasons, "AIOのチェックの答え待ち"] } : x));
    for (const id of waitingOrgIds) {
      const org = orgs.find((o) => o.id === id);
      if (org && !out.some((x) => x.id === id)) out.push({ id, name: org.name, reasons: ["AIOのチェックの答え待ち"] });
    }
    // 次に連絡する日が来た会社 → まだ声をかけていない会社 → …（src/lib/admin/callOrder.ts）
    return sortCalls(out, jstToday());
  };
  const calls: CallListItem[] = withChecks(serverCalls ?? callList);
  const commentedAfter = (articleId: string, at: string) => db.reviews.some((r) => r.articleId === articleId && r.createdAt >= at);

  return (
    <main className="page space-y-6">
      <AdminNav />
      <div className="flex animate-rise items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            {/* 名前を入れていない人はメールアドレスが入るので、そのときは出さない */}
            {user.name && !user.name.includes("@") ? `${user.name}さん、` : ""}おつかれさまです <Wave />
          </h1>
          <p className="text-muted">
            {latestChecks.length > 0
              ? "お客様の記事は、AIがチェックしています。結果とやり取りを見て、気になる所があればコメントを残せます。"
              : "まだAIOのチェックをした記事はありません。担当企業の様子を見ておきましょう。"}
          </p>
        </div>
        <Shiori mood={latestChecks.length > 0 ? "point" : "coffee"} className="hidden h-36 w-auto shrink-0 sm:block" />
      </div>

      <section aria-labelledby="call-heading" className="card space-y-3 border-warn">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="call-heading" className="text-lg font-bold">
            声をかけたい会社 {calls.length}社
          </h2>
          <Link href="/admin/usage" className="text-sm font-bold text-brand-dark underline">
            質問の進み具合・費用・使った日を見る →
          </Link>
        </div>
        {calls.length === 0 ? (
          <p className="text-muted">いまはありません。どの会社も進んでいます。</p>
        ) : (
          <ul className="space-y-2">
            {calls.map(({ id, name, reasons, daysSinceActive, lastContact, emails, info }) => (
              <li key={id} className="space-y-2 rounded-2xl bg-canvas p-2">
                <Link href={`/coach/orgs/${id}`} className="group flex flex-wrap items-center gap-2 rounded-xl px-2 py-1 hover:bg-brand-soft">
                  <b className="mr-1">{name}</b>
                  {reasons.map((r) => (
                    <span key={r} className="rounded-full bg-warn-soft px-2.5 py-0.5 text-xs font-bold text-warn">
                      {r}
                    </span>
                  ))}
                  {serverCalls && daysSinceActive !== undefined && (
                    <span className="text-xs text-muted">最後に使った日：{daysSinceActive === null ? "まだ" : daysSinceActive === 0 ? "今日" : `${daysSinceActive}日前`}</span>
                  )}
                  <span className="ml-auto text-sm font-bold text-brand">
                    見る <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </span>
                </Link>
                {contactsEnabled && info !== undefined && (
                  <div className="px-2">
                    <ContactInfo
                      organizationId={id}
                      info={info}
                      onSaved={(i) => setServerCalls((list) => list?.map((x) => (x.id === id ? { ...x, info: i } : x)) ?? list)}
                    />
                  </div>
                )}
                {emails && emails.length > 0 && (
                  <p className="flex flex-wrap gap-x-3 gap-y-1 px-2 text-sm">
                    <span className="text-muted">連絡先：</span>
                    {emails.map((e) => (
                      <a key={e} href={`mailto:${e}`} className="break-all font-bold text-brand-dark underline">
                        {e}
                      </a>
                    ))}
                    <Link href={`/admin/invitations?org=${id}`} className="text-brand-dark underline">
                      招待と所属を開く
                    </Link>
                  </p>
                )}
                {contactsEnabled && (
                  <div className="px-2 pb-1">
                    <ContactButton
                      organizationId={id}
                      last={lastContact ?? null}
                      onSaved={(c) => setServerCalls((list) => list?.map((x) => (x.id === id ? { ...x, lastContact: c } : x)) ?? list)}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="checks-heading">
        <h2 id="checks-heading" className="mb-3 text-lg font-bold">
          最近のAIOのチェック{waitingChecks > 0 && <span className="ml-2 rounded-full bg-sun-soft px-2.5 text-sm">答え待ち {waitingChecks}件</span>}
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
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="orgs-heading" className="text-lg font-bold">
            担当企業 {orgs.length}社
          </h2>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="会社名でさがす" aria-label="会社名でさがす" className="field min-h-10 max-w-xs py-1" />
        </div>
        {query && !orgs.some((o) => o.name.includes(query.trim())) && <p className="text-muted">「{query}」の会社は見つかりませんでした。</p>}
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgs.filter((o) => !query.trim() || o.name.includes(query.trim())).map((o, i) => {
            const articles = db.articles.filter((a) => a.organizationId === o.id);
            const ready = isOrgReady(db, o.id);
            // 続けてもらうための目印（2026-11-03）。最近書いていない会社は、声をかけるきっかけにする
            const ids = new Set(articles.map((a) => a.id));
            const lastWrite = db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0).reduce((m, v) => (v.createdAt > m ? v.createdAt : m), "");
            const quiet = !lastWrite || lastWrite.slice(0, 7) < month;
            const streak = writingStreak(db, o.id);
            const town = townSteps(db, o.id, false);
            const sc = (db.searchConsole ?? []).find((x) => x.organizationId === o.id && x.verifiedAt);
            return (
              <li key={o.id} className="animate-rise" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <Link href={`/coach/orgs/${o.id}`} className="card block h-full transition-transform hover:-translate-y-1 hover:border-brand">
                  <span className="block text-lg font-black">{o.name}</span>
                  {!ready && <span className="mt-1 inline-block rounded-full bg-warn-soft px-3 text-sm font-bold text-warn">初期設定が必要です</span>}
                  {ready && quiet && <span className="mt-1 inline-block rounded-full bg-sun-soft px-3 text-sm font-bold">今月はまだ書いていません（声をかけるきっかけに）</span>}
                  <span className="mt-2 flex flex-wrap gap-1.5 text-xs font-bold">
                    <span className={`rounded-full px-2 py-0.5 ${streak >= 2 ? "bg-sun text-ink" : "bg-canvas text-muted"}`}>🔥 {streak}か月つづけて</span>
                    <span className="rounded-full bg-canvas px-2 py-0.5">🏘️ すごろく {townPosition(town)}/{town.length}マス</span>
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
                  <span className="mt-3 block text-sm font-bold text-brand">この会社の記事とやり取りを見る →</span>
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
                    <span className="block text-sm text-muted">
                      {db.organizations.find((o) => o.id === a.organizationId)?.name}・{formatDate(a.updatedAt)}に更新
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <StatusBadge status={a.status} />
                    {a.publishedWithoutApproval && <span className="text-warn">未承認で公開</span>}
                    <span className="font-bold text-brand">見る →</span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
