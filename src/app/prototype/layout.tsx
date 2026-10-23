"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PrototypeNotice } from "@/prototype/components";
import { growActions } from "@/prototype/store";

const NAV = [
  { href: "/prototype", label: "ホーム" },
  { href: "/prototype/hearing", label: "ヒアリング" },
  { href: "/prototype/plan", label: "記事の設計図" },
  { href: "/prototype/coach", label: "コタムの画面" },
];

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link href="/prototype" className="min-w-0 font-bold">
            <span className="block text-sm font-normal text-muted">コタム ブログ執筆支援（新しい流れの試作）</span>
            <span className="block truncate text-lg">さくら住まい工房（架空）</span>
          </Link>
          <button
            type="button"
            className="btn-secondary min-h-9 px-3 py-1 text-sm"
            onClick={() => {
              if (window.confirm("試作で入力した内容を消して、最初からやり直します。よろしいですか？")) growActions.reset();
            }}
          >
            最初からやり直す
          </button>
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
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <PrototypeNotice />
      </div>
      {children}
    </>
  );
}
