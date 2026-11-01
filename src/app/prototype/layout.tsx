"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { useStore } from "@/mock/store";
import { PrototypeNotice } from "@/prototype/components";
import { createGrowRemote } from "@/prototype/remote";
import { connectGrow, growActions, reloadGrow, useGrowSync } from "@/prototype/store";

const NAV = [
  { href: "/prototype", label: "ホーム" },
  { href: "/prototype/hearing", label: "会社のことを教える" },
  { href: "/prototype/plan", label: "書く記事を決める" },
  { href: "/prototype/keywords", label: "書く記事リスト" },
  { href: "/prototype/coach", label: "コタムの画面" },
];

const ORG_KEY = "cotam-grow-org-v1";

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const store = useStore();
  const remoteMode = store.mode === "remote";
  const orgs = useMemo(() => store.db.organizations.filter((o) => store.user?.organizationIds.includes(o.id)), [store.db.organizations, store.user]);
  // 会社の一覧はブラウザで読み込んでから出るので、サーバーの描画と食い違わない
  const [picked, setPicked] = useState<string | null>(() => {
    try {
      return typeof window === "undefined" ? null : window.localStorage.getItem(ORG_KEY);
    } catch {
      return null;
    }
  });
  const orgId = remoteMode ? (orgs.find((o) => o.id === picked)?.id ?? orgs[0]?.id ?? null) : null;
  const orgName = remoteMode ? (orgs.find((o) => o.id === orgId)?.name ?? "") : "さくら住まい工房（架空）";
  const sync = useGrowSync();

  useEffect(() => {
    const env = getSupabaseEnv();
    if (!remoteMode || !env) {
      connectGrow(null);
      return;
    }
    if (!orgId) return;
    // @supabase/ssr のブラウザ用は1つだけ作られ、ログインの状態を本体の画面と共有する
    connectGrow(createGrowRemote(createBrowserClient(env.url, env.anonKey), orgId));
  }, [remoteMode, orgId]);

  if (remoteMode && store.ready && !store.user) {
    return (
      <main className="page space-y-3">
        <h1 className="text-2xl font-bold">ログインしてください</h1>
        <p className="text-muted">会社のことや書く記事リストは、会社ごとに保存されます。ログインすると続きから始められます。</p>
        <Link href="/login" className="btn-primary inline-block">
          ログインする
        </Link>
      </main>
    );
  }
  if (remoteMode && store.ready && store.user && !orgId) {
    return (
      <main className="page space-y-3">
        <h1 className="text-2xl font-bold">会社の登録がまだです</h1>
        <p className="text-muted">このアカウントには、まだ会社がひもづいていません。コタムの担当者にお知らせください。</p>
      </main>
    );
  }

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link href="/prototype" className="min-w-0 font-bold">
            <span className="block text-sm font-normal text-muted">コタム ブログ執筆支援（新しい流れの試作）</span>
            <span className="block truncate text-lg">{orgName}</span>
          </Link>
          {remoteMode ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted" role="status" aria-live="polite">
                {sync.saving ? "保存しています…" : sync.loaded ? "保存しました" : sync.error ? "読み込めませんでした" : "読み込んでいます…"}
              </span>
              {orgs.length > 1 && (
                <label className="flex items-center gap-1 text-sm">
                  <span className="text-muted">会社</span>
                  <select
                    className="field min-h-9 w-auto py-1"
                    value={orgId ?? ""}
                    onChange={(e) => {
                      setPicked(e.target.value);
                      try {
                        window.localStorage.setItem(ORG_KEY, e.target.value);
                      } catch {
                        // 覚えられなくても切りかえはできる
                      }
                    }}
                  >
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="btn-secondary min-h-9 px-3 py-1 text-sm"
              onClick={() => {
                if (window.confirm("試作で入力した内容を消して、最初からやり直します。よろしいですか？")) growActions.reset();
              }}
            >
              最初からやり直す
            </button>
          )}
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6" aria-label="試作の画面">
          <ul className="flex gap-1">
            {NAV.map((n) => {
              const active = n.href === "/prototype" ? pathname === n.href : pathname.startsWith(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block whitespace-nowrap border-b-2 px-3 py-2 text-sm ${active ? "border-brand font-semibold text-brand-dark" : "border-transparent text-muted"}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
      <div className="mx-auto max-w-6xl space-y-2 px-4 pt-4 sm:px-6">
        <PrototypeNotice saved={remoteMode} />
        {sync.error && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-danger bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
            <span>{sync.error}</span>
            <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" onClick={reloadGrow}>
              読み込み直す
            </button>
          </div>
        )}
      </div>
      {/* 会社を切りかえたら画面を作り直し、前の会社の書きかけが新しい会社に保存されないようにする */}
      <Fragment key={orgId ?? "local"}>{children}</Fragment>
    </>
  );
}
