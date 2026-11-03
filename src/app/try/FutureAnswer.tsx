"use client";

// 案3「未来のAIの答えをのぞく」（2026-11-03）。30秒でためすの最後に、1年後にお客様がAIに相談したときのイメージを見せる。
// AIに選ばれる（答えに会社が出る）→ 人に選ばれる（記事を読んでお問い合わせ）まで、自動で流れる。
// 入力した言葉だけで作るイメージで、AIは使わない。「イメージ」「そう答えるとは限らない」と必ず書く。

import { useEffect, useRef, useState } from "react";
import { Confetti } from "@/components/fun";
import { Typed } from "@/components/talk";
import type { FutureScene } from "@/lib/tryout";

// 0:時間がすすむ 1:お客様が打つ 2:AIが考える 3:AIが答える 4:AIに選ばれた 5:記事を読む 6:人に選ばれた
export function FutureAnswer({ scene, title }: { scene: FutureScene; title: string }) {
  const [step, setStep] = useState(0);
  const [months, setMonths] = useState(0);
  const [round, setRound] = useState(0);
  const [shared, setShared] = useState<"" | "shared" | "copied" | "failed">("");
  const ref = useRef<HTMLElement>(null);
  // 開いたら、見えるところまで動かす
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // カレンダーが1年分めくれる
  useEffect(() => {
    if (step !== 0) return;
    if (months >= 12) {
      const t = setTimeout(() => setStep(1), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setMonths((m) => m + 1), months === 0 ? 300 : 110);
    return () => clearTimeout(t);
  }, [step, months]);
  useEffect(() => {
    if (step !== 2 && step !== 4) return;
    const t = setTimeout(() => setStep(step + 1), step === 2 ? 1200 : 1300);
    return () => clearTimeout(t);
  }, [step]);

  const share = async () => {
    // 入力した会社のことは送らない。サービスの紹介とリンクだけ
    const data = { title: "30秒でためす", text: "AIに選ばれて、人に選ばれる会社へ。会社の準備度を30秒で診断できます。", url: `${window.location.origin}/try` };
    try {
      if (navigator.share) {
        await navigator.share(data);
        setShared("shared");
      } else {
        await navigator.clipboard.writeText(`${data.text} ${data.url}`);
        setShared("copied");
      }
    } catch (e) {
      // 共有の画面を閉じただけのときは何も出さない
      if (e instanceof DOMException && e.name === "AbortError") return;
      setShared("failed");
    }
  };

  return (
    <section ref={ref} className="relative scroll-mt-20 overflow-hidden rounded-[2rem] border-2 border-ink/80 bg-ink p-4 text-white shadow-[0_8px_0_rgba(0,0,0,.25)] sm:p-6" aria-labelledby="future-title">
      {step >= 6 && <Confetti count={60} />}
      <span className="absolute right-5 top-4 animate-twinkle text-sun" aria-hidden>
        ✦
      </span>
      <span className="absolute left-8 top-16 animate-twinkle text-sm text-sun [animation-delay:1s]" aria-hidden>
        ✦
      </span>
      <h2 id="future-title" className="text-center text-xl font-black sm:text-2xl">
        🔮 1年後の、ある日（イメージ）
      </h2>
      <p className="sr-only">
        お客様：{scene.ask} AI：{scene.before}
        {scene.company}
        {scene.after} 記事「{title}」を読んだ人：{scene.readerThinks}
      </p>

      <div className="mt-4 space-y-3" aria-hidden key={round}>
        {step === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <span className="relative grid h-28 w-28 place-items-center rounded-3xl bg-surface text-ink shadow-[0_6px_0_var(--color-line)]">
              <span className="absolute inset-x-0 top-0 h-7 rounded-t-3xl bg-danger" />
              <span key={months} className="mt-5 animate-pop text-4xl font-black">
                +{months}
              </span>
              <span className="absolute bottom-2 text-xs font-black text-muted">か月</span>
            </span>
            <p className="font-black">記事を書きつづけて…</p>
          </div>
        ) : (
          <div className="space-y-3 rounded-3xl bg-surface p-3 text-ink sm:p-4">
            <p className="text-xs font-black text-muted">{step >= 5 ? "記事を読んでいる人" : "お客様がAIに相談している画面"}</p>
            <div className="ml-auto w-fit max-w-[88%] origin-bottom-right animate-bubble rounded-3xl rounded-br-md bg-brand px-4 py-2.5 font-bold text-white">
              {step === 1 ? <Typed text={scene.ask} speed={50} delay={150} onDone={() => setTimeout(() => setStep(2), 350)} /> : scene.ask}
            </div>
            {step >= 2 && (
              <div className="flex items-start gap-2">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white">✦</span>
                <div className="min-w-0 origin-top-left animate-bubble rounded-3xl rounded-tl-md border-2 border-line bg-surface px-4 py-2.5 leading-relaxed">
                  {step === 2 ? (
                    <span className="inline-flex gap-1 py-1">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-2 w-2 animate-dot rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  ) : step === 3 ? (
                    <Typed text={scene.before + scene.company + scene.after} speed={30} delay={80} onDone={() => setTimeout(() => setStep(4), 300)} />
                  ) : (
                    <>
                      {scene.before}
                      <mark className="rounded-md bg-sun/70 px-1 font-black text-ink">{scene.company}</mark>
                      {scene.after}
                    </>
                  )}
                </div>
              </div>
            )}
            {step >= 4 && (
              <p className="text-center">
                <span className="inline-block animate-stamp rounded-full border-2 border-brand bg-brand-soft px-4 py-1 font-black text-brand-dark">🤖 1. AIに選ばれた！</span>
              </p>
            )}
            {step >= 5 && (
              <div className="animate-rise space-y-2 rounded-3xl border-2 border-line p-3">
                <p className="text-xs font-black text-muted">{scene.company}のブログ</p>
                <p className="font-black leading-snug">{title}</p>
                <div className="ml-auto w-fit max-w-[92%] origin-bottom-right animate-bubble rounded-3xl rounded-br-md bg-sun-soft px-4 py-2 text-sm font-bold">
                  💭 {step === 5 ? <Typed text={scene.readerThinks} speed={45} delay={250} onDone={() => setTimeout(() => setStep(6), 350)} /> : scene.readerThinks}
                </div>
              </div>
            )}
            {step >= 6 && (
              <p className="text-center">
                <span className="inline-block animate-stamp rounded-full border-2 border-sun-dark bg-sun px-4 py-1.5 font-black text-ink shadow-[0_4px_0_var(--color-sun-dark)]">
                  🤝 2. 人に選ばれた！ お問い合わせが来ました
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-white/75">
        記事を書きつづけたときのイメージです。AIが実際にこう答えるとは限りません。紹介するかどうかはAIが、頼むかどうかは読んだ人が決めます。
      </p>
      {step >= 6 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="rounded-full bg-sun px-4 py-2 font-black text-ink" onClick={share}>
            📣 この体験を人にすすめる
          </button>
          <button
            type="button"
            className="text-sm font-bold text-white underline"
            onClick={() => {
              setRound((r) => r + 1);
              setMonths(0);
              setStep(0);
            }}
          >
            もう一度見る
          </button>
          {shared && (
            <p className="w-full text-center text-sm font-bold" role="status">
              {shared === "copied" ? "リンクをコピーしました。会社の名前などは入っていません。" : shared === "shared" ? "ありがとうございます！" : "うまく送れませんでした。"}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
