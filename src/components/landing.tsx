"use client";

// 入口（/welcome）とログイン・招待の画面で使う部品。
// 2026-11-03 田村さん「登録したくなる、ワクワクする、ログインしたくなるページにしたい」。
// しおりの絵は動かさない。動くのは吹き出し・まわりの小物・スクロールで出てくるカード。

import { LegalLinks } from "@/components/LegalLinks";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Shiori, type ShioriMood } from "@/components/fun";
import { ChosenPath } from "@/components/ChosenPath";
import { ShioriTalk } from "@/components/talk";
import { SERVICE_NAME } from "@/lib/brand";

/** 画面に入ったら true になる（1回だけ） */
export function useInView<T extends Element>(threshold = 0.25): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setSeen(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen];
}

/** スクロールして見えたら、下からふわっと出す */
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} className={`${seen ? "animate-rise" : "opacity-0"} ${className}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

/** 時間帯のあいさつ。サーバーとブラウザで食い違わないよう、ブラウザで決める */
export function useGreeting(): string {
  const [text, setText] = useState("こんにちは");
  useEffect(() => {
    const h = new Date().getHours();
    const t = setTimeout(() => setText(h < 4 ? "おつかれさまです" : h < 11 ? "おはようございます" : h < 18 ? "こんにちは" : "こんばんは"), 0);
    return () => clearTimeout(t);
  }, []);
  return text;
}

/** ロゴ（ヘッダーの左）。public/brand/logo-horizontal.svg。使い方は /brand と docs/BRAND.md */
export function Logo({ href = "/welcome" }: { href?: string }) {
  return (
    <Link href={href} className="group flex shrink-0 items-center" aria-label={SERVICE_NAME}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 文字を輪郭にした固定のSVG。最適化は不要 */}
      <img src="/brand/logo-horizontal.svg" alt="" width={483} height={120} className="h-10 w-auto transition-transform group-hover:-translate-y-0.5" />
    </Link>
  );
}

/** ロゴのマーク（帳面＋しおり＋AIのきらめき） */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- 小さな固定のSVG。最適化は不要
  return <img src="/brand/logo-mark.svg" alt="" width={40} height={40} className={className} />;
}

const PERKS = [
  { icon: "✏️", text: "今月の記事を、質問に答えて書く" },
  { icon: "🎖️", text: "スタンプ帳にスタンプを集める" },
  { icon: "📰", text: "しおりのAIOニュースを読む" },
];

/**
 * ログイン・招待の画面の土台。左（スマホでは上）にしおりと「入るとできること」、右に入力。
 */
export function LoginStage({ mood, lines, title, children, compact = false }: { mood: ShioriMood; lines: string[]; title: React.ReactNode; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo />
        <Link href="/welcome" className="text-sm font-bold text-brand-dark underline-offset-4 hover:underline">
          サービスのご紹介
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-5xl items-start gap-6 px-4 pb-10 pt-2 sm:px-6 md:grid-cols-[1.05fr_1fr] md:gap-10 md:pt-8">
        <section className="relative animate-rise overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-5 text-white shadow-[0_8px_0_var(--color-brand-dark)] sm:p-7">
          <Sparkles />
          <h1 className="relative text-xl font-black leading-snug sm:text-3xl">{title}</h1>
          {/* compact：メールを送ったあと。スマホでは番号の欄を最初の画面に入れるため、しおりは出さない */}
          <div className={`relative mt-4 text-ink ${compact ? "hidden md:block" : ""}`}>
            <ShioriTalk mood={mood} lines={lines} size="lg" />
          </div>
          {/* スマホでは入力欄を最初の画面に入れるため、図は出さない */}
          <div className="relative mt-4 hidden md:block">
            <ChosenPath tone="onBlue" />
          </div>
          <ul className="relative mt-4 hidden space-y-2 md:block" aria-label="ログインするとできること">
            {PERKS.map((p, i) => (
              <li key={p.text} className="flex animate-rise items-center gap-3 rounded-2xl bg-white/15 px-4 py-2 font-bold" style={{ animationDelay: `${0.4 + i * 0.12}s` }}>
                <span className="text-xl" aria-hidden>
                  {p.icon}
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </section>
        <div className="animate-rise space-y-4 [animation-delay:.15s] md:pt-6">{children}</div>
      </main>
      <LegalLinks className="pb-6" />
    </div>
  );
}

/** 青い面の上で、ゆっくり光る星 */
function Sparkles() {
  const stars = [
    { left: "82%", top: "10%", size: "text-2xl", delay: "0s" },
    { left: "90%", top: "48%", size: "text-lg", delay: ".8s" },
    { left: "70%", top: "26%", size: "text-sm", delay: "1.4s" },
    { left: "6%", top: "88%", size: "text-lg", delay: "2s" },
  ];
  return (
    <span aria-hidden>
      {stars.map((s, i) => (
        <span key={i} className={`absolute ${s.size} animate-twinkle text-sun`} style={{ left: s.left, top: s.top, animationDelay: s.delay }}>
          ✦
        </span>
      ))}
    </span>
  );
}

/** しおりの絵だけを大きく（入口の最初の画面など） */
export function BigShiori({ mood, className = "" }: { mood: ShioriMood; className?: string }) {
  return <Shiori mood={mood} className={`h-64 w-auto drop-shadow-[0_10px_0_rgba(47,111,219,0.12)] sm:h-80 ${className}`} />;
}
