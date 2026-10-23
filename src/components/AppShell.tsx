"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/mock/store";
import { EmptyState, PageSkeleton } from "./ui";

/** ログイン必須の画面を包む。未ログインならログイン画面へ */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, user, db, logout, mode, loadError } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  // ログイン・招待・認証の処理と、全社管理者の画面は架空データのログインを使わない
  const isLogin = pathname === "/login" || pathname.startsWith("/invite/") || pathname.startsWith("/auth/") || pathname.startsWith("/admin/");
  // 新しい流れの画面試作は、ログインせずに架空の会社で見られる（データはブラウザの中だけ）
  const isPrototype = pathname === "/prototype" || pathname.startsWith("/prototype/");
  // 明示的なログアウトでは戻り先を付けない
  const loggingOut = useRef(false);

  useEffect(() => {
    if (!ready || user || isLogin || isPrototype || loadError) return;
    router.replace(loggingOut.current ? "/login" : `/login?next=${encodeURIComponent(pathname)}`);
    loggingOut.current = false;
  }, [ready, user, isLogin, isPrototype, loadError, pathname, router]);

  const demo = mode === "mock" ? <DemoPanel /> : null;
  if (isPrototype) return <>{children}</>;
  if (isLogin) return <>{children}{demo}</>;
  if (ready && !user && loadError) {
    return (
      <main className="page max-w-xl">
        <EmptyState title="表示できません" action={<button type="button" className="btn-secondary" onClick={logout}>ログアウト</button>}>
          {loadError}
        </EmptyState>
      </main>
    );
  }
  if (!ready || !user) return <PageSkeleton />;

  const org = user.role === "client_member" ? db.organizations.find((o) => o.id === user.organizationIds[0]) : null;

  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link href={user.role === "coach" ? "/coach" : "/"} className="min-w-0 font-bold">
            <span className="block text-sm font-normal text-muted">コタム ブログ執筆支援</span>
            <span className="block truncate text-lg">{org ? org.name : "コタム管理画面"}</span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">{user.name}</span>
            <button
              type="button"
              className="btn-secondary min-h-9 px-3 py-1 text-sm"
              onClick={() => {
                loggingOut.current = true;
                logout();
              }}
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>
      {children}
      {demo}
    </>
  );
}

/** 試作確認用のパネル。保存失敗や生成失敗などの状態を再現する。本番には含めない */
function DemoPanel() {
  const { sim, setSim, resetDemo } = useStore();
  const [open, setOpen] = useState(false);
  const toggles: { key: keyof typeof sim; label: string }[] = [
    { key: "saveError", label: "次の保存を失敗させる" },
    { key: "generationError", label: "次の生成を失敗させる" },
    { key: "conflict", label: "次の保存で編集競合を起こす" },
    { key: "sessionExpired", label: "次の操作でセッション切れにする" },
    { key: "slow", label: "通信を遅くする" },
  ];
  return (
    <div className="fixed bottom-3 right-3 z-40 text-sm">
      {open ? (
        <div className="card w-72 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">試作の確認用</p>
            <button type="button" className="text-muted underline" onClick={() => setOpen(false)}>
              閉じる
            </button>
          </div>
          <ul className="space-y-1">
            {toggles.map((t) => (
              <li key={t.key}>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={sim[t.key]} onChange={(e) => setSim({ [t.key]: e.target.checked })} />
                  {t.label}
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn-secondary mt-3 w-full min-h-9 py-1 text-sm"
            onClick={() => {
              if (window.confirm("架空データを最初の状態に戻します。よろしいですか？")) resetDemo();
            }}
          >
            架空データを初期状態に戻す
          </button>
        </div>
      ) : (
        <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm shadow" onClick={() => setOpen(true)}>
          試作の確認用
        </button>
      )}
    </div>
  );
}
