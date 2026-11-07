"use client";

// しおりがしゃべる吹き出し（ShioriTalk）と、手順を1つずつ進める案内（StepGuide）。docs/UI.md
// しおりの絵は動かさない（2026-11-02 田村さん）。吹き出しが口もとからぽんと出て、「…」のあと文字が1つずつ出る。
// 手順は一気に並べず、1つずつ「できた！」で進める。進み具合の星・スタンプ・お祝いで、ゲームのように進める。

import { useEffect, useState } from "react";
import { Confetti, Shiori, type ShioriMood } from "@/components/fun";
import { useGuideText } from "@/components/useGuide";

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** 文字を1つずつ出す。最初に少し「…」を見せてから */
export function Typed({ text, speed = 38, delay = 350, onDone }: { text: string; speed?: number; delay?: number; onDone?: () => void }) {
  const chars = Array.from(text);
  const [shown, setShown] = useState(-1);
  useEffect(() => {
    if (reduced()) {
      const t = setTimeout(() => {
        setShown(chars.length);
        onDone?.();
      }, 0);
      return () => clearTimeout(t);
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      n++;
      setShown(n);
      if (n < chars.length) timer = setTimeout(tick, /[、。！？!?]/.test(chars[n - 1]) ? speed * 5 : speed);
      else onDone?.();
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
    // 文が変わったときだけやり直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (shown < 0) {
    return (
      <span className="inline-flex gap-1 py-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 animate-dot rounded-full bg-brand" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
    );
  }
  return (
    <span aria-hidden>
      {chars.slice(0, shown).join("")}
      {shown < chars.length && <span className="ml-0.5 inline-block h-[1em] w-0.5 animate-caret bg-brand align-middle" />}
    </span>
  );
}

const SIZES = { sm: "h-16 sm:h-20", md: "h-20 sm:h-28", lg: "h-24 sm:h-36" } as const;

/**
 * しおりがしゃべる。lines は順番に吹き出しで出る（前の文を言い終えてから次）。
 * children は、言い終えたあとに吹き出しの下に出す（ボタンなど）
 */
export function ShioriTalk({
  mood,
  lines,
  size = "md",
  hideOnPhone = false,
  children,
  className = "",
}: {
  mood: ShioriMood;
  lines: string | string[];
  size?: keyof typeof SIZES;
  hideOnPhone?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  const named = useGuideText();
  // せりふの「しおり」は、選んだ案内役の名前で話す
  const list = (Array.isArray(lines) ? lines : [lines]).filter(Boolean).map(named);
  const key = list.join("\n");
  return <TalkInner key={key} mood={mood} list={list} size={size} hideOnPhone={hideOnPhone} className={className}>{children}</TalkInner>;
}

function TalkInner({ mood, list, size, hideOnPhone, children, className }: { mood: ShioriMood; list: string[]; size: keyof typeof SIZES; hideOnPhone: boolean; children?: React.ReactNode; className: string }) {
  const [line, setLine] = useState(0);
  const finished = line >= list.length;
  return (
    <div className={`space-y-3 ${className}`}>
    {/* スマホではしおりを小さくして、吹き出しの幅を取る。ボタンなどは下に全幅で出す */}
    <div className="flex items-end gap-2">
      <Shiori mood={mood} className={`${SIZES[size]} w-auto shrink-0 ${hideOnPhone ? "hidden sm:block" : ""}`} />
      <div className="min-w-0 flex-1 space-y-2 pb-2">
        <p className="sr-only">{list.join("")}</p>
        {list.slice(0, Math.min(line + 1, list.length)).map((t, i) => (
          <div key={i} className="relative w-fit max-w-full origin-bottom-left animate-bubble rounded-3xl rounded-bl-md border-2 border-brand-soft bg-surface px-4 py-2.5 font-bold leading-relaxed shadow-sm">
            {/* 吹き出しのしっぽ */}
            <span aria-hidden className="absolute -left-2 bottom-2 h-3 w-3 rotate-45 border-b-2 border-l-2 border-brand-soft bg-surface" />
            {i < line ? t : <Typed text={t} onDone={() => setLine((n) => n + 1)} />}
          </div>
        ))}
      </div>
    </div>
    {finished && children && <div className="animate-rise">{children}</div>}
    </div>
  );
}

export interface GuideStep {
  /** 星の下に出る短い名前 */
  title: string;
  /** しおりのせりふ */
  say: string | string[];
  mood?: ShioriMood;
  /** この手順でやること（ボタン・リンク・入力） */
  body?: React.ReactNode;
  /** 「できた！」の代わりの文字。null なら出さない（body の中のボタンで進む） */
  next?: string | null;
}

const PRAISE = ["ナイス！", "いい調子！", "その調子！", "すごい！", "あと少し！"];

function load(key: string | undefined): number {
  if (!key) return 0;
  try {
    return Number(window.localStorage.getItem(`guide:${key}`)) || 0;
  } catch {
    return 0;
  }
}
function save(key: string | undefined, n: number) {
  if (!key) return;
  try {
    window.localStorage.setItem(`guide:${key}`, String(n));
  } catch {
    // 覚えられなくても進められる
  }
}

/**
 * 手順を1つずつ進める。上に星（できた手順にスタンプ）、しおりが手順を話し、「できた！」で次へ。
 * 最後まで進むと紙吹雪。step と onStep を渡すと、外から進める（body のボタンで次へ進めたいとき）
 */
export function StepGuide({
  steps,
  storageKey,
  doneSay = "ぜんぶできました！おつかれさまでした",
  doneBody,
  step: controlled,
  onStep,
}: {
  steps: GuideStep[];
  storageKey?: string;
  doneSay?: string;
  doneBody?: React.ReactNode;
  step?: number;
  onStep?: (n: number) => void;
}) {
  const [own, setOwn] = useState(0);
  const [praise, setPraise] = useState<string | null>(null);
  // 前に途中までやっていたら、そこから
  useEffect(() => {
    if (controlled === undefined && storageKey) {
      const n = load(storageKey);
      if (n) {
        const t = setTimeout(() => setOwn(Math.min(n, steps.length)), 0);
        return () => clearTimeout(t);
      }
    }
  }, [controlled, storageKey, steps.length]);
  const step = controlled ?? own;
  const go = (n: number) => {
    const v = Math.max(0, Math.min(n, steps.length));
    if (v > step) setPraise(v >= steps.length ? null : PRAISE[(v - 1) % PRAISE.length]);
    else setPraise(null);
    save(storageKey, v);
    if (onStep) onStep(v);
    if (controlled === undefined) setOwn(v);
  };
  const done = step >= steps.length;
  const cur = steps[Math.min(step, steps.length - 1)];

  return (
    <div className="space-y-4">
      {done && <Confetti count={60} />}
      {/* 進み具合：星とスタンプ */}
      <ol className="flex items-center gap-1" aria-label={`${steps.length}つの手順のうち${Math.min(step, steps.length)}つできました`}>
        {steps.map((s, i) => (
          <li key={s.title} className="flex min-w-0 flex-1 items-center gap-1">
            <button
              type="button"
              onClick={() => i < step && go(i)}
              disabled={i >= step}
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 text-lg font-black transition-colors ${
                i < step ? "border-ok-bright bg-ok-soft" : i === step ? "animate-shine border-sun bg-sun-soft text-ink" : "border-line bg-surface text-muted"
              }`}
              aria-label={`${i + 1}. ${s.title}${i < step ? "（できた。押すと戻れます）" : ""}`}
            >
              {i < step ? (
                <span key={`ok-${i}`} className="animate-stamp">
                  ⭐
                </span>
              ) : (
                i + 1
              )}
            </button>
            <span className={`hidden min-w-0 truncate text-xs sm:block ${i === step ? "font-black text-ink" : "text-muted"}`}>{s.title}</span>
            {i < steps.length - 1 && <span className={`h-1 min-w-3 flex-1 rounded-full ${i < step ? "bg-ok-bright" : "bg-line"}`} aria-hidden />}
          </li>
        ))}
      </ol>

      {done ? (
        <div className="animate-pop space-y-3 rounded-3xl border-2 border-sun bg-sun-soft p-4">
          <ShioriTalk mood="jersey-done" lines={doneSay}>
            {doneBody}
          </ShioriTalk>
          <button type="button" className="text-sm text-brand-dark underline" onClick={() => go(0)}>
            はじめから見る
          </button>
        </div>
      ) : (
        <div key={step} className="animate-rise space-y-3 rounded-3xl border-2 border-brand-soft bg-surface p-3 sm:p-4">
          <p className="text-xs font-black text-brand-dark">
            ステップ {step + 1} / {steps.length}
            {praise && (
              <span key={praise + step} className="ml-2 inline-block animate-stamp rounded-full bg-sun px-2 py-0.5 text-ink">
                {praise} ⭐+1
              </span>
            )}
          </p>
          <ShioriTalk mood={cur.mood ?? "point"} lines={cur.say} size="md">
            <div className="space-y-3">
              {cur.body}
              <div className="flex flex-wrap items-center gap-3">
                {cur.next !== null && (
                  <button type="button" className="btn-primary" onClick={() => go(step + 1)}>
                    {cur.next ?? "できた！"}
                    <span className="inline-block animate-nudge" aria-hidden>
                      →
                    </span>
                  </button>
                )}
                {step > 0 && (
                  <button type="button" className="text-sm text-brand-dark underline" onClick={() => go(step - 1)}>
                    ひとつ前に戻る
                  </button>
                )}
              </div>
            </div>
          </ShioriTalk>
        </div>
      )}
    </div>
  );
}
