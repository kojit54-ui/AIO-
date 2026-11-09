"use client";

// 読みものの出だし（src/lib/column.ts の intro）を、しおりが吹き出しで話す。
// 2026-11-09 田村さん「シンプルになりすぎた。出だしをしおりにしゃべらせて。吹き出しのような。いろんな表情も使おう。
// 画像を差し込むのではなく、しおりがしゃべってくれている感じの演出がほしい」。
// しおりの絵は動かさない（2026-11-02 田村さん）。吹き出しが口もとからぽんと出て、「…」のあと文が出る。
// 文は最初からページの中にある（検索とAIが読める）。場所も先に取るので、出てきても下の文章がずれない。
// 動きを減らす設定の人と印刷では最初から全部出す。絵は選んだ案内役によらず、スーツのしおり（ログイン前の人が見るページなので）。

import { useEffect, useState } from "react";
import { Shiori, type ShioriMood } from "@/components/fun";
import { useInView } from "@/components/landing";

export function ColumnIntro({ mood, children }: { mood: ShioriMood; children: React.ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  // 0: まだ 1: 吹き出しが出た（「…」） 2: 文が出た
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!seen || step >= 2) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setStep(reduce ? 2 : (s) => s + 1), reduce ? 0 : step === 0 ? 150 : 550);
    return () => clearTimeout(t);
  }, [seen, step]);

  return (
    <div ref={ref} className="mt-6 flex items-end gap-2 sm:gap-3">
      <Shiori as="shiori" mood={mood} className="h-28 w-auto shrink-0 sm:h-44" />
      <div
        className={`relative mb-3 min-w-0 flex-1 origin-bottom-left rounded-3xl rounded-bl-md border-2 border-indigo/25 bg-white px-4 py-3 shadow-sm transition-all duration-300 ease-out print:scale-100 print:opacity-100 sm:px-5 ${
          step >= 1 ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* 吹き出しのしっぽ（しおりの口もとへ） */}
        <span aria-hidden className="absolute -left-2 bottom-3 h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-indigo/25 bg-white" />
        <p className="text-xs font-bold text-sumi/60">しおり（AIOの案内役）</p>
        {step === 1 && (
          <span className="absolute left-4 top-8 text-lg font-bold tracking-widest text-indigo/70 print:hidden sm:left-5" aria-hidden>
            …
          </span>
        )}
        <p className={`mt-1 leading-loose transition-opacity duration-300 print:opacity-100 ${step >= 2 ? "opacity-100" : "opacity-0"}`}>{children}</p>
      </div>
    </div>
  );
}
