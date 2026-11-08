"use client";

// 読みものの「しおりに聞いてみた」（src/lib/column.ts の chat）。
// 2026-11-08 田村さん「AIっぽさがすごく出る。しおりは控えめに、吹き出しにしゃべらせるくらいで」→ 3AI会議で、
// 水色のチャット画面・入力中「…」・大きな絵をやめ、生成りの紙に罫線の小さな相談欄にした。顔は小さなアイコンだけ。
// ただし田村さんが前に頼んだ「こういうところはアニメーションしてくれるといい」は残し、枠が画面に入ったら質問→答えの順に、そっと出す。
// 文字は最初からページの中にある（検索とAIが読める）。場所も先に取っておき、出てきても下の文章がずれない。動きを減らす設定の人には最初から出す。

import { useEffect, useState } from "react";
import { ShioriFace } from "@/components/fun";
import { useInView } from "@/components/landing";
import type { ChatTurn } from "@/lib/column";

const STEP = 450;

export function ColumnChat({ turns }: { turns: ChatTurn[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.3);
  const last = turns.length * 2;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!seen || step >= last) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setStep(reduce ? last : (s) => s + 1), reduce ? 0 : STEP);
    return () => clearTimeout(t);
  }, [seen, step, last]);

  const fade = (on: boolean) => `transition-all duration-500 ${on ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`;

  return (
    <aside ref={ref} aria-label="しおりに聞いてみた" className="border-y-2 border-sumi">
      <p className="border-b border-sumi/30 py-2 text-xs font-bold tracking-wider text-sumi/70">しおりに聞いてみた</p>
      <div className="divide-y divide-dashed divide-sumi/30">
        {turns.map((t, i) => (
          <div key={t.q} className="space-y-3 py-4">
            <p className={`leading-relaxed ${fade(step >= i * 2 + 1)}`}>
              <span className="mr-2 text-xs font-bold text-sumi/60">よくある疑問</span>
              <span className="font-bold">{t.q}</span>
            </p>
            <div className={`flex items-start gap-3 ${fade(step >= i * 2 + 2)}`}>
              <ShioriFace as="shiori" className="mt-0.5 h-9 w-9" />
              <div className="min-w-0 flex-1 border-l-2 border-indigo/60 pl-3 leading-relaxed">
                <span className="block text-xs font-bold text-sumi/60">しおり（案内役）</span>
                {t.a.map((x) => (
                  <p key={x} className="mt-1">
                    {x}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
