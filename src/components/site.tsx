"use client";

// ログインしなくても見られるページ（入口・読みもの・しおりの自己紹介）の、上のメニューと下の案内。
// 2026-11-07 田村さん「LPと付随するページを充実していきたい」。どのページからも、ほかのページへ1回で行けるようにする。

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LegalLinks } from "@/components/LegalLinks";
import { Logo } from "@/components/landing";
import { SERVICE_OPERATOR } from "@/lib/brand";
import { BRAND_LINE } from "@/lib/brandBook";
import { useStore } from "@/mock/store";

/** 上のメニュー。スマホでは2段目に小さく並べる */
const NAV = [
  { href: "/welcome#how", label: "使い方", short: "使い方" },
  { href: "/welcome#faq", label: "よくある質問", short: "質問" },
  { href: "/column", label: "AIOの読みもの", short: "読みもの" },
  { href: "/shiori", label: "しおりって？", short: "しおり" },
];

/** ログイン中なら「続きから」、まだなら「ログイン」 */
export function useStartLink() {
  const { ready, user } = useStore();
  const signedIn = ready && !!user;
  const href = signedIn ? (user?.role === "coach" ? "/coach" : "/") : "/login";
  return { signedIn, href };
}

export function SiteHeader() {
  const { signedIn, href } = useStartLink();
  const pathname = usePathname();
  const current = (h: string) => !h.includes("#") && (pathname === h || pathname.startsWith(`${h}/`));
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Logo />
        <nav aria-label="ページの案内" className="hidden items-center gap-5 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={current(n.href) ? "page" : undefined} className={`text-sm font-bold underline-offset-4 hover:underline ${current(n.href) ? "text-brand" : "text-ink"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href={href} className="btn-primary min-h-10 whitespace-nowrap px-4 py-1.5 text-sm">
          {signedIn ? "続きから" : "ログイン"}
        </Link>
      </div>
      <nav aria-label="ページの案内" className="mx-auto flex max-w-6xl justify-around gap-1 px-3 pb-2 md:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-bold ${current(n.href) ? "bg-brand-soft text-brand-dark" : "text-ink"}`}>
            {n.short}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-line bg-surface/70">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted">{BRAND_LINE}</p>
          <p className="text-sm text-muted">運営：{SERVICE_OPERATOR}</p>
        </div>
        <FooterList
          title="サービス"
          links={[
            { href: "/welcome", label: "サービスのご紹介" },
            { href: "/try", label: "30秒でためす（登録なし）" },
            { href: "/shiori", label: "案内役「しおり」の自己紹介" },
            { href: "/login", label: "ログイン" },
          ]}
        />
        <FooterList
          title="読みもの"
          links={[
            { href: "/column", label: "AIOの読みもの" },
            { href: "/welcome#faq", label: "よくある質問" },
            { href: "/brand", label: "ブランドとロゴ" },
          ]}
        />
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-sm text-muted">
        <LegalLinks className="mb-1" />
        <p>© {SERVICE_OPERATOR}</p>
      </div>
    </footer>
  );
}

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black text-brand">{title}</p>
      <ul className="space-y-1.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-bold text-ink underline-offset-4 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
