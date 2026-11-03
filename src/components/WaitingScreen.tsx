"use client";

// AIを待つあいだの画面（2026-11-02 田村さん「待ちが長いので、ゲーム画面のように。ワンポイントコラムをポコッと」）。
// しおりが考えている動き、進んでいる感じの帯、経過時間、コラム（コタムのこだわりとAIOのワンポイントを交互に。自動で切り替わり、自分でもめくれる）。

import { useEffect, useState } from "react";
import { Shiori, type ShioriMood } from "@/components/fun";
import { AIO_POINTS } from "@/lib/aio";
import type { AioPoint } from "@/types/domain";
import { AIO_QUIZ, AIO_TIPS, SERVICE_TIPS } from "@/lib/tips";

const MOODS: ShioriMood[] = ["think", "idea", "point", "cheer"];
const TIP_SECONDS = 7;

/** コタムのこだわりと、AIOのワンポイントを交互に並べる */
const COLUMNS: { kind: "service" | "aio"; title: string; body: string }[] = Array.from({ length: Math.max(SERVICE_TIPS.length, AIO_TIPS.length) }, (_, i) => [
  ...(SERVICE_TIPS[i] ? [{ kind: "service" as const, ...SERVICE_TIPS[i] }] : []),
  ...(AIO_TIPS[i] ? [{ kind: "aio" as const, ...AIO_TIPS[i] }] : []),
]).flat();

/**
 * ヒアリングの待ち時間に見せる中身。コラムの代わりに「いまの答えが何に使われるか」と、○×クイズで点を集める仕掛けを出す
 * （2026-11-03 田村さん「コラムじゃなくて、聞いている意味とモチベーションを上げる仕掛けがほしい」）
 */
export type WaitingFocus = { question: string; point: AioPoint; progress: string; remaining: number };

export function WaitingScreen({ label, note = "この画面を閉じても続きます。", focus }: { label: string; note?: string; focus?: WaitingFocus }) {
  // 毎回ちがうコラムから始める（この画面は操作のあとにだけ出るので、サーバーの描画とは食い違わない）
  // コタムのこだわりから始める
  const [start] = useState(() => {
    const services = COLUMNS.flatMap((c, i) => (c.kind === "service" ? [i] : []));
    return services[Math.floor(Math.random() * services.length)] ?? 0;
  });
  // 「次のコラム」で自分でめくった数
  const [flipped, setFlipped] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const tip = (start + flipped + Math.floor(seconds / TIP_SECONDS)) % COLUMNS.length;
  const t = COLUMNS[tip];
  const service = t.kind === "service";
  const mood = MOODS[Math.floor(seconds / TIP_SECONDS) % MOODS.length];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 sm:items-center" role="alertdialog" aria-live="polite" aria-label={label}>
      <div className="card my-auto w-full max-w-md animate-pop space-y-4 p-5 text-center sm:p-6">
        <div className={`relative mx-auto grid place-items-center ${focus ? "h-28 w-28" : "h-40 w-40"}`}>
          {/* しおりのうしろで回る輪 */}
          <span className="absolute inset-0 animate-spin-slow rounded-full border-4 border-dashed border-sun" aria-hidden />
          <span className="absolute inset-3 rounded-full bg-sun-soft" aria-hidden />
          {/* しおりは動かさず、表情だけ変える */}
          <Shiori mood={mood} className={`relative w-auto ${focus ? "h-24" : "h-32"}`} />
        </div>
        <div>
          <p className="text-lg font-black">{label}</p>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted">
            AIががんばっています
            <span className="inline-flex gap-0.5" aria-hidden>
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand" />
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.15s]" />
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.3s]" />
            </span>
            <span className="tabular-nums">（{seconds}秒）</span>
          </p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-canvas" aria-hidden>
          <div className="h-full w-full animate-stripe rounded-full bg-[length:28px_100%] bg-[repeating-linear-gradient(45deg,var(--color-brand)_0_7px,var(--color-sky)_7px_14px)]" />
        </div>

        {focus ? (
          <HearingFocus focus={focus} />
        ) : (
          <>
        <div key={tip} className={`animate-enter rounded-2xl border-2 p-4 text-left ${service ? "border-brand bg-brand-soft" : "border-sun bg-sun-soft"}`}>
          <p className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
            <span className={`rounded-full px-2.5 py-0.5 ${service ? "bg-brand text-white" : "bg-sun text-ink"}`}>{service ? "✨ コタムのこだわり" : "💡 AIOワンポイント"}</span>
            <span className="tabular-nums text-muted">
              {tip + 1} / {COLUMNS.length}
            </span>
          </p>
          <p className="font-black">{t.title}</p>
          <p className="text-sm">{t.body}</p>
          <div className="mt-2 flex justify-end">
            <button type="button" className="text-sm font-bold text-brand-dark underline" onClick={() => setFlipped((n) => n + 1)}>
              次のコラム →
            </button>
          </div>
        </div>
          </>
        )}
        <p className="text-xs text-muted">{note}</p>
      </div>
    </div>
  );
}

/** いまの答えの使いみち（AIに・読んだ人に）と、○×クイズ。正解するとポイントが増える */
function HearingFocus({ focus }: { focus: WaitingFocus }) {
  const p = AIO_POINTS[focus.point];
  const [quizStart] = useState(() => Math.floor(Math.random() * AIO_QUIZ.length));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const quiz = AIO_QUIZ[(quizStart + n) % AIO_QUIZ.length];
  const right = picked !== null && picked === quiz.answer;

  return (
    <div className="space-y-3 text-left">
      <div className="animate-enter rounded-2xl border-2 border-brand bg-brand-soft p-4">
        <p className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-white">🎯 いまの答えの使いみち</span>
          <span className="text-muted">{focus.progress}</span>
        </p>
        <p className="text-sm text-muted">「{focus.question}」への答えは、記事の</p>
        <p className="font-black">「{p.label}」の材料になります</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <span className="font-bold">🤖 AIには：</span>
            {p.why}
          </li>
          <li>
            <span className="font-bold">🙋 読んだ人には：</span>
            {p.people}
          </li>
        </ul>
        <p className="mt-2 text-sm font-bold text-brand-dark">
          {focus.remaining <= 1 ? "これが最後の質問です。もうひと息！" : `あと${focus.remaining}問で、記事を書く材料がそろいます。`}
        </p>
      </div>

      <div className="rounded-2xl border-2 border-sun bg-sun-soft p-4">
        <p className="mb-1 flex items-center justify-between gap-2 text-xs font-bold">
          <span className="rounded-full bg-sun px-2.5 py-0.5 text-ink">⭕❌ 待つあいだにクイズ</span>
          <span key={score} className="animate-pop rounded-full bg-surface px-2 py-0.5 tabular-nums">
            {score}点
          </span>
        </p>
        <p className="font-black">{quiz.q}</p>
        {picked === null ? (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                className="btn-secondary min-h-11 text-lg"
                onClick={() => {
                  setPicked(v);
                  if (v === quiz.answer) setScore((x) => x + 10);
                }}
              >
                {v ? "⭕" : "❌"}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-2 animate-enter space-y-2">
            <p className="font-bold">{right ? "🎉 正解！ +10点" : `ざんねん、答えは${quiz.answer ? "⭕" : "❌"}です`}</p>
            <p className="text-sm">{quiz.why}</p>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-bold text-brand-dark underline"
                onClick={() => {
                  setN((x) => x + 1);
                  setPicked(null);
                }}
              >
                次のクイズ →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
