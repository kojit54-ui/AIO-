"use client";

// コタムの方の画面で共通のメニュー（2026-11-08 管理者役の採点「画面の行き来ができない・並びがばらばら」）。
// /admin の全画面（app/admin/layout.tsx）と担当者のトップ（/coach）に同じ並びで出す。

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADMIN_LINKS = [
  { href: "/coach", label: "担当のトップ" },
  { href: "/admin/invitations", label: "招待と所属" },
  { href: "/admin/usage", label: "利用金額と利用頻度" },
  { href: "/admin/trial", label: "30秒でためす" },
  { href: "/admin/knowledge", label: "製造業の知識表" },
  { href: "/admin/waitlist", label: "新規受付の案内" },
] as const;

export function isAdminLinkActive(pathname: string, href: string): boolean {
  return href === "/coach" ? pathname === "/coach" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="管理の画面" className={`-mx-1 flex gap-1 overflow-x-auto pb-1 text-sm font-bold ${className}`}>
      {ADMIN_LINKS.map((l) => {
        const active = isAdminLinkActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 transition-colors ${active ? "bg-brand text-white" : "text-brand-dark hover:bg-brand-soft"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
