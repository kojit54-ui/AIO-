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

// 案内役の秘書。田村さんが用意した絵（public/guide/、背景を抜いたもの）。質問ごとの絵と「コタムより」に出す
/** 秘書の上半身。x, y は左上、高さ130に収まる大きさ */
function Secretary({ x, y = 0, delay = 0 }: { x: number; y?: number; delay?: number }) {
  return (
    <g className="animate-float" style={{ animationDelay: `${delay}s`, transformBox: "fill-box" }}>
      <image href="/guide/secretary-upper.webp" x={x} y={y} width={71} height={130} />
    </g>
  );
}

/** 「コタムより」などに出す、秘書の顔のアイコン */
export function SecretaryFace({ className = "h-10 w-10" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 小さな固定の絵。最適化は不要
    <img src="/guide/secretary-face.webp" alt="" className={`${className} shrink-0 rounded-full bg-sky object-cover`} aria-hidden />
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
      <Secretary x={84} />
      <Bubble x={8} y={20} text="実は…" />
    </>
  ),
  qa: (
    <>
      <Secretary x={14} />
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
      <Secretary x={46} />
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
      <Secretary x={10} />
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
