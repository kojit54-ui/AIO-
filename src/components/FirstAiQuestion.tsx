"use client";

// はじめてホームを開いたときに一度だけ聞く「ふだん使っているAIはありますか？」（2026-11-07 田村さん）。
// 使っているAIがあれば、そのAIが知っている会社のことを「しおりに教える」（/knowledge）へ、いっしょに進む。
// 答えはこのブラウザに覚え、二度は聞かない。会社の知識がもうあるときは聞かない。

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ShioriTalk } from "@/components/talk";
import { useGuideText } from "@/components/useGuide";

export const FIRST_AI_KEY = "cotam-first-ai-v1";
export const FIRST_AIS = ["ChatGPT", "Claude", "Gemini"] as const;
export type FirstAi = (typeof FIRST_AIS)[number];

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readAsked = () => {
  try {
    return window.localStorage.getItem(FIRST_AI_KEY) !== null;
  } catch {
    // 覚えられないブラウザでは、毎回聞かないように聞いたことにする
    return true;
  }
};
const remember = (v: string) => {
  try {
    window.localStorage.setItem(FIRST_AI_KEY, v);
  } catch {
    // 覚えられなくても進められる
  }
};

export function FirstAiQuestion({ hasKnowledge }: { hasKnowledge: boolean }) {
  const asked = useSyncExternalStore(subscribe, readAsked, () => true);
  const [closed, setClosed] = useState(false);
  const [picked, setPicked] = useState<FirstAi | "none" | null>(null);
  const g = useGuideText();
  // 答えを選んだあとは、覚えたあとでも続きの話を出す
  if (closed || (asked && picked === null) || (hasKnowledge && picked === null)) return null;

  const close = (v: string) => {
    remember(v);
    setClosed(true);
  };
  const pick = (v: FirstAi | "none") => {
    remember(v);
    setPicked(v);
  };

  // 画面の中の動き（transform）に重なり順を閉じこめられないよう、body の直下に出す（2026-11-08 下の文字が上に透けて見えた）
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/75 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="first-ai-title">
      <div className="card my-auto w-full max-w-lg animate-pop space-y-4">
        <h2 id="first-ai-title" className="sr-only">
          ふだん使っているAIはありますか
        </h2>
        {picked === null && (
          <>
            <ShioriTalk mood="ask" lines={[g("はじめまして、しおりです。記事づくりを始める前に、ひとつだけ聞かせてください。"), "ChatGPT などのAIを、使ったことはありますか？"]} />
            {/* 吹き出しは文字が順に出るので、答える理由は動かない文でも書いておく */}
            <p className="rounded-2xl bg-brand-soft/60 px-4 py-2 text-sm font-bold text-brand-dark">AIを知らなくても大丈夫です。説明をあなたに合わせるための質問で、どちらを選んでも記事づくりへ進みます。</p>
            <button type="button" className="btn-primary min-h-16 w-full flex-col gap-0 text-lg leading-tight" onClick={() => pick("none")}>
              <span>はじめて・よくわからない</span>
              <span className="text-sm font-bold opacity-90">このまま記事づくりへ</span>
            </button>
            <details className="rounded-2xl border-2 border-line px-3 py-2">
              <summary className="cursor-pointer text-center font-bold text-brand-dark">使ったことがある<span className="block text-sm font-bold text-muted">どのAIかを選んで、記事づくりへ</span></summary>
              <p className="mt-2 text-sm text-muted">そのAIに会社のことを話したことがあれば、その中身を使えるので、質問が少し減ります。</p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {FIRST_AIS.map((a) => (
                <button key={a} type="button" className="btn-secondary min-h-14 text-lg" onClick={() => pick(a)}>
                  {a}
                </button>
              ))}
            </div>
            </details>
          </>
        )}
        {picked && picked !== "none" && (
          <>
            <ShioriTalk
              mood="jersey-cheer"
              lines={[
                `${picked}を使っているんですね！ それなら、${picked}はもう会社のことを少し知っています。`,
                g(`それを、しおりにも教えてください。AIに選ばれるには「この会社ならでは」がいちばん大事です。最初の記事から、あなたの会社らしく書けます。`),
                `${picked}に頼み文を送って、返事を貼るだけ。5分ほどです。1つずつ、いっしょにやりましょう。`,
              ]}
            />
            <Link href={`/knowledge?mode=ask&ai=${picked}`} className="btn-primary min-h-16 w-full text-lg" onClick={() => setClosed(true)}>
              いっしょにやる（5分）
              <span className="inline-block animate-nudge" aria-hidden>
                →
              </span>
            </Link>
            <p className="text-center text-sm">
              <button type="button" className="font-semibold text-muted underline" onClick={() => close(picked)}>
                あとでやる
              </button>
              <span className="block text-xs text-muted">あとからでも、ホームの「お知らせ・今月の記録を見る」の中の「ChatGPT・Claude・Gemini やブログから取り込む」からできます。</span>
            </p>
          </>
        )}
        {picked === "none" && (
          <>
            <ShioriTalk mood="jersey-cheer" lines={["大丈夫です！ AIを使ったことがなくても、質問に答えるだけで記事になります。", g("わからないところは、しおりがいっしょに考えます。")]} />
            <button type="button" className="btn-primary min-h-14 w-full text-lg" onClick={() => close("none")}>
              はじめる
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
