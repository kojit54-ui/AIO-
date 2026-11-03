"use client";

// 無料ご招待の招待状（2026-11-03 田村さん「無料で使わせたい顧客へ招待をするのだけど、それようの専用ページも欲しい」）。
// 封筒が届いて、開くと「〇〇様 専用」の招待状が出てくる。担当からのひとこと、無料の札、しおりのあいさつ。
// 招待のページ（/invite/[token]）と、管理画面の見え方の確認（プレビュー）で同じものを使う。

import { useEffect, useState } from "react";
import { Confetti, ShioriFace } from "@/components/fun";
import { Logo } from "@/components/landing";
import { ChosenPath } from "@/components/ChosenPath";
import { ShioriTalk } from "@/components/talk";

export const DEFAULT_INVITE_MESSAGE = "いつもありがとうございます。AIに選ばれて、人に選ばれる会社づくりを、いっしょに始めませんか。";

const WHAT = [
  { icon: "💬", text: "しおりの質問に答えるだけで、記事ができる" },
  { icon: "✨", text: "AIに紹介されやすく、読んだ人に伝わる形にAIが整える" },
  { icon: "🎖️", text: "書くたびにスタンプが増える" },
];

export interface InviteLetterProps {
  organizationName: string;
  recipientName?: string | null;
  message?: string | null;
  isFree?: boolean;
  /** 管理画面の見え方の確認。封筒は最初から開き、紙吹雪も出さない */
  preview?: boolean;
  /** 同意のボタンなど */
  children?: React.ReactNode;
}

export function InviteLetter({ organizationName, recipientName, message, isFree = false, preview = false, children }: InviteLetterProps) {
  const [open, setOpen] = useState(preview);
  // 少し待ってから、自動で封筒を開ける（押しても開く）
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, [open]);
  const to = recipientName?.trim() ? `${recipientName.trim()}様` : "ご担当者様";

  return (
    <div className={preview ? "" : "min-h-dvh"}>
      {!preview && (
        <header className="mx-auto flex max-w-3xl items-center px-4 py-3 sm:px-6">
          <Logo />
        </header>
      )}
      <main className={`mx-auto w-full max-w-2xl space-y-5 px-4 ${preview ? "py-2" : "pb-10 pt-2 sm:px-6"}`}>
        {!open ? (
          <button type="button" onClick={() => setOpen(true)} className="group mx-auto block w-full max-w-md pt-10" aria-label="招待状をひらく">
            <Envelope organizationName={organizationName} to={to} />
            <span className="mt-4 block animate-hop text-center font-black text-brand-dark">タップしてひらく</span>
          </button>
        ) : (
          <>
            {!preview && <Confetti count={60} />}
            <article className="relative animate-rise overflow-hidden rounded-[2rem] border-2 border-sun bg-surface shadow-[0_10px_0_var(--color-sun-dark)]">
              {/* 便箋の上の飾り */}
              <div className="relative bg-gradient-to-br from-brand to-[#4f8ff0] px-5 pb-6 pt-5 text-center text-white sm:px-8">
                <span className="absolute left-4 top-3 animate-twinkle text-sun" aria-hidden>
                  ✦
                </span>
                <span className="absolute right-6 top-8 animate-twinkle text-lg text-sun [animation-delay:1s]" aria-hidden>
                  ✦
                </span>
                <p className="text-sm font-black tracking-[0.3em] text-white/85">INVITATION</p>
                <h1 className="mt-1 text-3xl font-black sm:text-4xl">ご招待状</h1>
                <p className="mt-2 text-lg font-bold">
                  {organizationName}
                  <br />
                  <span className="text-2xl font-black">{to}</span>
                </p>
                <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-0.5 text-sm font-black">あなた専用の招待状です</span>
              </div>
              {isFree && (
                <span className="absolute -right-12 top-6 rotate-45 bg-sun px-12 py-1 text-sm font-black text-ink shadow" aria-label="無料でご招待">
                  無料ご招待
                </span>
              )}

              <div className="space-y-5 p-5 sm:p-8">
                <div className="relative rounded-3xl border-2 border-dashed border-line bg-canvas px-5 py-4">
                  <p className="mb-1 text-xs font-black text-brand-dark">コタムより</p>
                  <p className="whitespace-pre-wrap font-bold leading-loose">{message?.trim() || DEFAULT_INVITE_MESSAGE}</p>
                </div>

                <ShioriTalk
                  mood="bow"
                  lines={[`${to}、はじめまして！案内役のしおりです。`, "お会いできるのを楽しみにしていました。いっしょに、AIにも人にも選ばれる会社になりましょう！"]}
                />

                <ChosenPath />

                {isFree && (
                  <div className="flex items-center gap-3 rounded-3xl border-2 border-sun bg-sun-soft px-4 py-3">
                    <span className="text-3xl" aria-hidden>
                      🎁
                    </span>
                    <p className="font-bold">
                      コタムのお客様として、<b className="text-lg">無料</b>でご利用いただけます。
                    </p>
                  </div>
                )}

                <ul className="space-y-2" aria-label="はじめるとできること">
                  {WHAT.map((w, i) => (
                    <li key={w.text} className="flex animate-rise items-center gap-3 rounded-2xl bg-brand-soft/60 px-3 py-2 font-bold" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
                      <span className="text-xl" aria-hidden>
                        {w.icon}
                      </span>
                      {w.text}
                    </li>
                  ))}
                </ul>

                {children}
              </div>
            </article>
          </>
        )}
      </main>
    </div>
  );
}

/** 閉じた封筒。しおりの封ろう */
function Envelope({ organizationName, to }: { organizationName: string; to: string }) {
  return (
    <span className="relative block aspect-[3/2] w-full animate-pop">
      <span className="absolute inset-0 rounded-3xl border-2 border-sun-dark bg-sun-soft shadow-[0_8px_0_var(--color-sun-dark)]" />
      {/* ふた */}
      <span className="absolute inset-x-0 top-0 h-3/5 origin-top bg-sun [clip-path:polygon(0_0,100%_0,50%_100%)] transition-transform duration-300 group-hover:[transform:rotateX(25deg)]" />
      <span className="absolute left-1/2 top-[42%] -translate-x-1/2 rounded-full border-4 border-danger/70 bg-danger p-1 shadow-lg">
        <ShioriFace className="h-12 w-12" />
      </span>
      <span className="absolute inset-x-4 bottom-4 text-center font-black text-ink">
        <span className="block text-xs text-muted">{organizationName}</span>
        {to}へ
      </span>
    </span>
  );
}
