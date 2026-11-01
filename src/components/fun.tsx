"use client";

// 書く人のやる気を保つための、動きのある部品（docs/UI.md「見た目」）。
// 動きは prefers-reduced-motion で止まる（globals.css）。

import { useEffect, useState } from "react";
import type { AioPoint } from "@/types/domain";

/** ゴールまでの道のり。えんぴつが1問ずつ進む */
export function Road({ total, current, label }: { total: number; current: number; label: string }) {
  const done = Math.min(current, total);
  const rest = total - done;
  return (
    <div className="card px-5 pb-3 pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 font-bold">
        <span>
          ゴールまで{" "}
          <b className="text-xl text-brand">{rest <= 1 ? (rest === 1 ? "これが最後！" : "あと少し！") : `あと${rest}問`}</b>
        </span>
        <span className="hidden text-sm font-medium text-muted sm:inline">{label}</span>
      </div>
      <div
        className="relative mt-2 h-11"
        role="progressbar"
        aria-label="回答の進み具合"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done + 1 > total ? total : done + 1}
      >
        <div className="absolute inset-x-4 top-[19px] h-1.5 rounded-full bg-[repeating-linear-gradient(90deg,var(--color-line)_0_10px,transparent_10px_18px)]" />
        <div className="absolute left-4 top-[19px] h-1.5 rounded-full bg-brand transition-[width] duration-700 ease-[cubic-bezier(.3,1.4,.5,1)]" style={{ width: `calc((100% - 2rem) * ${done / total})` }} />
        <ol className="absolute inset-0 flex justify-between" aria-hidden>
          {Array.from({ length: total + 1 }, (_, i) => {
            const goal = i === total;
            const state = i < done ? "done" : i === done ? "now" : "todo";
            return (
              <li
                key={i}
                className={`z-10 grid h-8 w-8 place-items-center rounded-full border-[3px] text-sm font-black transition-all duration-500 sm:h-9 sm:w-9 ${
                  state === "done"
                    ? "border-brand bg-brand text-white"
                    : state === "now"
                      ? "scale-110 border-brand bg-surface text-brand shadow-[0_0_0_6px_var(--color-brand-soft)]"
                      : "border-line bg-surface text-muted"
                } ${goal ? "border-dashed" : ""}`}
              >
                {goal ? "🏁" : state === "done" ? "✓" : i + 1}
              </li>
            );
          })}
        </ol>
        <span
          className="absolute -top-5 z-20 text-2xl transition-[left] duration-700 ease-[cubic-bezier(.3,1.4,.5,1)]"
          style={{ left: `calc(1rem + (100% - 2rem) * ${done / total} - 0.6rem)` }}
          aria-hidden
        >
          <span className="inline-block animate-hop">✏️</span>
        </span>
      </div>
    </div>
  );
}

/** 画面の上にふわっと出て消える、ほめる言葉。key を変えると出し直す */
export function Toast({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="fixed left-1/2 top-3 z-50 flex w-max max-w-[min(calc(100vw-2rem),36rem)] animate-toast items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm font-bold leading-snug text-white shadow-lg sm:px-5 sm:text-base"
    >
      <span className="inline-block animate-pop text-xl text-sun" aria-hidden>
        ★
      </span>
      {children}
    </p>
  );
}

const CONFETTI_COLORS = ["var(--color-brand)", "var(--color-sun)", "var(--color-ok-bright)", "var(--color-sky)"];

/** 紙吹雪。表示しているあいだ1回だけ降る */
export function Confetti({ count = 70 }: { count?: number }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 1.8 + Math.random() * 1.4,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      round: i % 3 === 0,
    })),
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <i
          key={i}
          className={`absolute -top-5 block h-4 w-2.5 animate-fall ${p.round ? "rounded-full" : "rounded-sm"}`}
          style={{ left: `${p.left}vw`, background: p.color, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}
        />
      ))}
    </div>
  );
}

/** 一定時間だけ true になる。ほめる言葉や紙吹雪を出すのに使う */
export function useFlash(ms = 3200): [number, () => void] {
  const [stamp, setStamp] = useState(0);
  useEffect(() => {
    if (!stamp) return;
    const t = setTimeout(() => setStamp(0), ms);
    return () => clearTimeout(t);
  }, [stamp, ms]);
  return [stamp, () => setStamp(Date.now())];
}

/** 手を振る絵文字 */
export function Wave() {
  return (
    <span className="inline-block origin-[70%_80%] animate-wave" aria-hidden>
      👋
    </span>
  );
}

// 案内役の秘書。質問ごとの絵と「コタムより」に出す（2026-11-01 田村さん「女性の秘書的なかわいいのに」）
const HAIR = "#5b3a2e";
const SKIN = "#ffe3d0";

/** 顔だけ。0〜80 の正方形に描く */
function SecretaryHead() {
  return (
    <>
      {/* 後ろ髪（ボブ） */}
      <path d="M14 40c0-18 12-30 26-30s26 12 26 30v20c0 6-4 9-8 9H22c-4 0-8-3-8-9z" fill={HAIR} />
      <circle cx={40} cy={40} r={21} fill={SKIN} />
      {/* 前髪 */}
      <path d="M18 38c0-15 10-24 22-24s22 9 22 24c-6-2-11-7-13-13-3 7-12 12-24 13z" fill={HAIR} />
      {/* 髪かざり */}
      <g fill="var(--color-sun)">
        <path d="M54 20l8-5v10z" />
        <path d="M54 20l-6-6v10z" />
        <circle cx={54} cy={20} r={2.6} />
      </g>
      {/* 目・ほお・口 */}
      <ellipse cx={32} cy={42} rx={2.8} ry={3.6} fill="#3a2a25" />
      <ellipse cx={48} cy={42} rx={2.8} ry={3.6} fill="#3a2a25" />
      <circle cx={33} cy={40.6} r={1} fill="#fff" />
      <circle cx={49} cy={40.6} r={1} fill="#fff" />
      <ellipse cx={26} cy={49} rx={4} ry={2.4} fill="#ffb3b3" opacity={0.75} />
      <ellipse cx={54} cy={49} rx={4} ry={2.4} fill="#ffb3b3" opacity={0.75} />
      <path d="M36 50q4 4 8 0" stroke="#c0605a" strokeWidth={1.8} fill="none" strokeLinecap="round" />
    </>
  );
}

type Pose = "listen" | "note" | "point" | "wave";

/** 秘書の全身。x, y は左上、0〜80 × 0〜130 の大きさ */
function Secretary({ x, y = 0, pose = "listen", delay = 0 }: { x: number; y?: number; pose?: Pose; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="animate-float" style={{ animationDelay: `${delay}s`, transformBox: "fill-box" }}>
        {/* 体：紺のジャケットに白いブラウス、黄色いリボン */}
        <path d="M14 130v-30c0-16 11-26 26-26s26 10 26 26v30z" fill="var(--color-brand)" />
        <path d="M30 75l10 22 10-22z" fill="#fff" />
        <path d="M40 84l-6-4v8zM40 84l6-4v8z" fill="var(--color-sun)" />
        <rect x={36} y={62} width={8} height={10} rx={3} fill={SKIN} />
        <SecretaryHead />
        {pose === "note" && (
          <g>
            <rect x={44} y={92} width={26} height={32} rx={4} fill="#fff" stroke="var(--color-line)" strokeWidth={2} />
            <rect x={51} y={89} width={12} height={6} rx={2} fill="var(--color-sun)" />
            <path d="M49 104h16M49 111h16M49 118h10" stroke="var(--color-ok-bright)" strokeWidth={2.5} strokeLinecap="round" />
            <circle cx={46} cy={112} r={5} fill={SKIN} />
          </g>
        )}
        {pose === "point" && (
          <g>
            <path d="M60 96q12-8 18-22" stroke="var(--color-brand)" strokeWidth={10} fill="none" strokeLinecap="round" />
            <circle cx={78} cy={72} r={5} fill={SKIN} />
          </g>
        )}
        {pose === "wave" && (
          <g className="animate-wave" style={{ transformBox: "fill-box", transformOrigin: "0% 100%" }}>
            <path d="M60 96q10-10 12-26" stroke="var(--color-brand)" strokeWidth={10} fill="none" strokeLinecap="round" />
            <circle cx={72} cy={66} r={5.5} fill={SKIN} />
          </g>
        )}
        {(pose === "listen" || pose === "note") && <circle cx={22} cy={112} r={5} fill={SKIN} />}
      </g>
    </g>
  );
}

/** 「コタムより」などに出す、秘書の顔のアイコン */
export function SecretaryFace({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="4 4 72 72" className={`${className} shrink-0 rounded-full bg-sky`} aria-hidden>
      <SecretaryHead />
      <path d="M14 80c0-10 11-16 26-16s26 6 26 16z" fill="var(--color-brand)" />
    </svg>
  );
}

function Bubble({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g className="animate-float" style={{ animationDelay: ".6s", transformBox: "fill-box" }}>
      <rect x={x} y={y} width={62} height={32} rx={14} fill="#fff" stroke="var(--color-line)" strokeWidth={2} />
      <text x={x + 31} y={y + 22} fontSize={15} textAnchor="middle" fill="var(--color-ink)">
        {text}
      </text>
    </g>
  );
}

const BLUE = "var(--color-brand)";
const GREEN = "var(--color-ok-bright)";
const SUN = "var(--color-sun)";
const SKY = "var(--color-sky)";

const SCENES: Record<AioPoint, React.ReactNode> = {
  experience: (
    <>
      <Secretary x={84} pose="note" />
      <Bubble x={8} y={20} text="実は…" />
    </>
  ),
  qa: (
    <>
      <Secretary x={14} pose="point" />
      <g className="animate-float" style={{ animationDelay: ".3s", transformBox: "fill-box" }}>
        <rect x={98} y={40} width={58} height={72} rx={10} fill="#fff" stroke="var(--color-line)" strokeWidth={2} />
        <path d="M108 58h38M108 72h38M108 86h26" stroke={GREEN} strokeWidth={4} strokeLinecap="round" />
      </g>

    </>
  ),
  numbers: (
    <>
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <rect x={24} y={78} width={22} height={40} rx={5} fill="var(--color-line)" />
        <rect x={56} y={58} width={22} height={60} rx={5} fill={SKY} />
        <rect x={88} y={34} width={22} height={84} rx={5} fill={BLUE} />
      </g>
      <text x={124} y={48} fontSize={34} className="animate-float" style={{ transformBox: "fill-box" }}>
        ✨
      </text>
    </>
  ),
  expertise: (
    <>
      <Secretary x={46} pose="listen" />
      <text x={128} y={52} fontSize={40} fontWeight={900} fill={BLUE} className="animate-float" style={{ transformBox: "fill-box" }}>
        !
      </text>
      <text x={18} y={50} fontSize={30} className="animate-float" style={{ animationDelay: ".5s", transformBox: "fill-box" }}>
        💡
      </text>
    </>
  ),
  action: (
    <>
      <Secretary x={10} pose="wave" />
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <rect x={96} y={50} width={58} height={44} rx={10} fill={SUN} />
        <path d="M104 62l21 14 21-14" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </>
  ),
  entity: (
    <>
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <path d="M30 118V70l34-26 34 26v48z" fill="#fff" stroke="var(--color-line)" strokeWidth={3} />
        <rect x={54} y={88} width={20} height={30} rx={4} fill={SKY} />
      </g>
      <g className="animate-float" style={{ animationDelay: ".4s", transformBox: "fill-box" }}>
        <path d="M128 92s-18-18.6-18-33a18 18 0 0 1 36 0c0 14.4-18 33-18 33z" fill={BLUE} />
        <circle cx={128} cy={58} r={7} fill="#fff" />
      </g>
    </>
  ),
  comparison: (
    <>
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <path d="M85 26v88M55 114h60M35 44h100" stroke="var(--color-ink)" strokeWidth={4} strokeLinecap="round" />
        <path d="M35 44l-16 32h32zM135 44l-16 32h32z" fill={SUN} />
      </g>
    </>
  ),
  trust: (
    <>
      <g className="animate-float" style={{ transformBox: "fill-box" }}>
        <path d="M85 14l42 18v34c0 26-18 44-42 54-24-10-42-28-42-54V32z" fill={GREEN} />
        <path d="M66 66l13 13 26-27" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  ),
};

/** 質問の上に出す絵。aio が無い質問は、話している2人 */
export function Scene({ point, className = "" }: { point?: AioPoint; className?: string }) {
  return (
    <svg viewBox="0 0 170 130" className={className} aria-hidden>
      {SCENES[point ?? "experience"]}
    </svg>
  );
}
