"use client";

// ホームの「次の1手」と、下の読み物を畳む箱（src/lib/nextStep.ts、2026-11-07 3AIの検討）

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { NextStep } from "@/lib/nextStep";

const ICON: Record<NextStep["kind"], string> = { fix: "🛠️", continue: "✏️", start: "🚀", more: "🌱" };

/** 押すボタンは1つ。逃げ道（新しく書く・記事の一覧）は小さく下に */
export function NextStepCard({ step, href }: { step: NextStep; href: string }) {
  return (
    <section aria-label="次にやること" className="card animate-rise space-y-3 border-brand bg-brand-soft/40">
      <p className="flex items-center gap-2 text-sm font-bold text-brand-dark">
        <span aria-hidden className="text-lg">{ICON[step.kind]}</span>
        {step.lead}
      </p>
      {step.title && <p className="text-lg font-black leading-snug">「{step.title}」</p>}
      <Link href={href} className="btn-primary min-h-16 w-full text-lg sm:text-xl">
        <span>{step.label}</span>
        <span className="inline-block animate-nudge" aria-hidden>
          →
        </span>
      </Link>
      <p className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
        {step.articleId && (
          <Link href="/articles/new" className="font-semibold text-muted underline">
            新しい記事を書く
          </Link>
        )}
        <a href="#list-heading" className="font-semibold text-muted underline">
          これまでの記事を見る
        </a>
      </p>
    </section>
  );
}

const KEY = "cotam-home-more-v1";
const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readOpen = () => {
  try {
    return window.localStorage.getItem(KEY) === "open";
  } catch {
    return false;
  }
};

/** ニュース・こぼれ話・メモ帳・今月の成長をまとめて畳む。開いたかどうかはこのブラウザに覚える */
export function MoreOnHome({ children }: { children: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribe, readOpen, () => false);
  const [override, setOverride] = useState<boolean | null>(null);
  const open = override ?? saved;
  const toggle = () => {
    const next = !open;
    setOverride(next);
    try {
      window.localStorage.setItem(KEY, next ? "open" : "closed");
    } catch {
      // 覚えられなくても開け閉めはできる
    }
  };
  return (
    <section aria-label="お知らせと記録" className="space-y-4">
      <button type="button" onClick={toggle} aria-expanded={open} className="btn-secondary min-h-14 w-full text-base">
        {open ? "お知らせ・記録をしまう ▲" : "お知らせ・今月の記録を見る ▼"}
      </button>
      {open && <div className="animate-rise space-y-6">{children}</div>}
    </section>
  );
}
