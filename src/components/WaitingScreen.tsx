"use client";

// AIを待つあいだの画面（2026-11-02 田村さん「待ちが長いので、ゲーム画面のように。ワンポイントコラムをポコッと」）。
// しおりが考えている動き、進んでいる感じの帯、経過時間、コラム（コタムのこだわりとAIOのワンポイントを交互に。自動で切り替わり、自分でもめくれる）。

import { useEffect, useState } from "react";
import { Shiori, type ShioriMood } from "@/components/fun";
import { AIO_TIPS, SERVICE_TIPS } from "@/lib/tips";

const MOODS: ShioriMood[] = ["think", "idea", "point", "cheer"];
const TIP_SECONDS = 7;

/** コタムのこだわりと、AIOのワンポイントを交互に並べる */
const COLUMNS: { kind: "service" | "aio"; title: string; body: string }[] = Array.from({ length: Math.max(SERVICE_TIPS.length, AIO_TIPS.length) }, (_, i) => [
  ...(SERVICE_TIPS[i] ? [{ kind: "service" as const, ...SERVICE_TIPS[i] }] : []),
  ...(AIO_TIPS[i] ? [{ kind: "aio" as const, ...AIO_TIPS[i] }] : []),
]).flat();

export function WaitingScreen({ label, note = "この画面を閉じても続きます。" }: { label: string; note?: string }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="alertdialog" aria-live="polite" aria-label={label}>
      <div className="card w-full max-w-md animate-pop space-y-4 p-5 text-center sm:p-6">
        <div className="relative mx-auto grid h-40 w-40 place-items-center">
          {/* しおりのうしろで回る輪 */}
          <span className="absolute inset-0 animate-spin-slow rounded-full border-4 border-dashed border-sun" aria-hidden />
          <span className="absolute inset-3 rounded-full bg-sun-soft" aria-hidden />
          <div key={mood} className="relative animate-pop">
            <div className="animate-float">
              <Shiori mood={mood} className="h-32 w-auto" />
            </div>
          </div>
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
        <p className="text-xs text-muted">{note}</p>
      </div>
    </div>
  );
}
