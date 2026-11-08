"use client";

// 読みものの「しおりに聞いてみた」（src/lib/column.ts の chat）。2026-11-08 田村さん「こういうところはアニメーションしてくれるといいな」。
// 枠が画面に入ったら、読んでいる方の質問 → しおりの「入力中…」 → しおりの答え、の順に吹き出しが出る。
// 文字は最初からページの中にある（検索とAIが読める）。場所も先に取っておき、出てきても下の文章がずれない。
// 動きを減らす設定の人には、最初から全部を出す。

import { useEffect, useState } from "react";
import { Shiori } from "@/components/fun";
import { useInView } from "@/components/landing";
import type { ChatTurn } from "@/lib/column";

const maru = "font-[family-name:var(--font-maru)]";
const Q_DELAY = 350; // 質問が出るまで
const TYPING = 1100; // 「入力中…」を見せる長さ
const NEXT = 700; // 答えのあと、次の質問まで

export function ColumnChat({ turns }: { turns: ChatTurn[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  // step：0 何も出ていない、2i+1 i番目の質問まで、2i+2 i番目の答えまで
  const [step, setStep] = useState(0);
  const last = turns.length * 2;

  useEffect(() => {
    if (!seen || step >= last) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setStep(last), 0);
      return () => clearTimeout(t);
    }
    const wait = step === 0 ? Q_DELAY : step % 2 === 1 ? TYPING : NEXT;
    const t = setTimeout(() => setStep((s) => s + 1), wait);
    return () => clearTimeout(t);
  }, [seen, step, last]);

  return (
    <aside ref={ref} aria-label="しおりに聞いてみた" className="border-2 border-sumi bg-[#eef3f8]">
      <p className="flex items-center gap-2 border-b-2 border-sumi bg-white px-4 py-2 text-xs font-bold">
        <span className={`inline-block h-2 w-2 rounded-full ${step > 0 && step < last ? "bg-emerald-500" : "bg-sumi/30"}`} aria-hidden />
        しおりに聞いてみた
      </p>
      <div className="space-y-4 px-3 py-4 sm:px-5">
        {turns.map((t, i) => {
          const showQ = step >= i * 2 + 1;
          const typing = step === i * 2 + 1;
          const showA = step >= i * 2 + 2;
          return (
            <div key={t.q} className="space-y-3">
              <div className="flex justify-end">
                <p className={`max-w-[85%] rounded-2xl rounded-br-sm border border-sumi/30 bg-white px-4 py-2.5 leading-relaxed shadow-sm ${showQ ? "animate-bubble-r" : "opacity-0"}`}>
                  <span className="mb-0.5 block text-xs font-bold text-sumi/60">読んでいる方</span>
                  {t.q}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className={`shrink-0 ${showA || typing ? "animate-bubble-l" : "opacity-0"}`}>
                  <Shiori mood={showA ? "joy" : "ask"} as="shiori" className="h-12 w-auto sm:h-14" />
                </span>
                <div className="relative max-w-[85%]">
                  <div className={`${maru} rounded-2xl rounded-bl-sm bg-indigo px-4 py-2.5 leading-relaxed text-white shadow-sm ${showA ? "animate-bubble-l" : "opacity-0"}`}>
                    <span className="mb-0.5 block text-xs font-bold text-white/70">しおり</span>
                    {t.a.map((x) => (
                      <p key={x} className="mt-1 first:mt-0">
                        {x}
                      </p>
                    ))}
                  </div>
                  {typing && (
                    <div className="absolute bottom-0 left-0 flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-indigo px-4 py-3 shadow-sm animate-bubble-l" role="status" aria-label="しおりが入力しています">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="h-2 w-2 rounded-full bg-white animate-typing" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
