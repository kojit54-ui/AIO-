"use client";

// ホームの「検索での見られ方」（Search Console、docs/DECISIONS.md 2026-11-02）。
// つながっていなければ、つなぐ画面への案内だけを出す。数字は28日分。公開した記事ごとの表示回数も出す。

import Link from "next/link";
import { useEffect } from "react";
import { Shiori } from "@/components/fun";
import { type MockDb, useStore } from "@/mock/store";

const num = (n: number) => n.toLocaleString("ja-JP");
const md = (d: string) => `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`;
// 末尾の / や http/https の違いでずれないように比べる
const sameUrl = (a: string, b: string) => a.replace(/^https?:\/\//, "").replace(/\/+$/, "") === b.replace(/^https?:\/\//, "").replace(/\/+$/, "");

export function SearchConsoleCard({ db, orgId }: { db: MockDb; orgId: string }) {
  const { api } = useStore();
  const link = (db.searchConsole ?? []).find((x) => x.organizationId === orgId);
  const connected = !!link?.verifiedAt;

  useEffect(() => {
    if (connected) api.refreshSearchConsole(orgId).catch(() => undefined);
  }, [api, orgId, connected]);

  if (!connected || !link?.snapshot) {
    return (
      <section className="card animate-rise flex flex-wrap items-center gap-3" aria-labelledby="sc-heading">
        <Shiori mood="idea" className="h-20 w-auto shrink-0 animate-float" />
        <div className="min-w-0 flex-1 basis-56">
          <h2 id="sc-heading" className="font-black">
            🔍 検索での見られ方を、しおりに見せてもらえませんか？
          </h2>
          <p className="text-sm text-muted">Search Console をつなぐと、記事がどんな言葉で検索に出ているかがここに出ます。見るだけの権限で、3分ほどでつなげます。</p>
          {link?.lastError && <p className="mt-1 text-sm text-warn">{link.lastError}</p>}
        </div>
        <Link href="/search-console" className="btn-primary">
          つなぐ
        </Link>
      </section>
    );
  }

  const s = link.snapshot;
  const published = db.articles.filter((a) => a.organizationId === orgId && a.status === "published" && a.publishedUrl);
  const perArticle = published.map((a) => ({ a, p: s.pages.find((p) => sameUrl(p.page, a.publishedUrl as string)) }));
  const titleOf = (versionId: string | null, themeId: string) => db.versions.find((v) => v.id === versionId)?.title ?? db.themes.find((t) => t.id === themeId)?.title ?? "（無題）";
  const totals = [
    { label: "検索に出た回数", value: num(s.totals.impressions) },
    { label: "クリックされた回数", value: num(s.totals.clicks) },
    { label: "クリックされた割合", value: `${s.totals.ctr}%` },
    { label: "平均の順位", value: s.totals.position ? `${s.totals.position}位` : "—" },
  ];

  return (
    <section className="card animate-rise space-y-4" aria-labelledby="sc-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="sc-heading" className="text-lg font-black">
          🔍 検索での見られ方
        </h2>
        <p className="text-xs text-muted">
          {md(s.range.start)}〜{md(s.range.end)}の28日間{link.isSample ? "（サンプルの数字）" : ""}・Search Console より
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {totals.map((x, i) => (
          <li key={x.label} className="animate-pop rounded-2xl bg-canvas p-3 text-center" style={{ animationDelay: `${i * 0.06}s` }}>
            <span className="block text-2xl font-black tabular-nums text-brand">{x.value}</span>
            <span className="text-xs text-muted">{x.label}</span>
          </li>
        ))}
      </ul>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-black">どんな言葉で見つけてもらえたか（検索に出た回数の多い順）</h3>
          {s.queries.length === 0 ? (
            <p className="text-sm text-muted">まだデータがありません。記事が増えると出てきます。</p>
          ) : (
            <ol className="space-y-1 text-sm">
              {[...s.queries].sort((a, b) => b.impressions - a.impressions).slice(0, 5).map((q, i) => (
                <li key={q.query} className="flex items-baseline gap-2">
                  <span className="w-5 shrink-0 font-black text-brand">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">{q.query}</span>
                  <span className="shrink-0 tabular-nums text-muted">{num(q.impressions)}回</span>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div>
          <h3 className="mb-1 text-sm font-black">公開した記事ごと</h3>
          {perArticle.length === 0 ? (
            <p className="text-sm text-muted">記事を公開して、公開先のURLを入れると、ここに記事ごとの数字が出ます。</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {perArticle.slice(0, 5).map(({ a, p }) => (
                <li key={a.id} className="flex items-baseline gap-2">
                  <span className="min-w-0 flex-1 truncate">{titleOf(a.currentVersionId, a.themeId)}</span>
                  <span className="shrink-0 tabular-nums text-muted">{p ? `${num(p.impressions)}回・${p.position}位` : "まだ出ていません"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="text-xs text-muted">検索に出た回数が増えている記事は、AIにも読まれやすくなります。出ていない言葉は、次のテーマの候補になります。</p>
    </section>
  );
}
