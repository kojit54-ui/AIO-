"use client";

// AIO（AIに紹介されるための工夫）を書く人に伝える部品。docs/AIO.md。

import { AIO_POINTS } from "@/lib/aio";
import type { AioPoint } from "@/types/domain";

const ICON_PATHS: Record<AioPoint, React.ReactNode> = {
  // 吹き出し
  experience: <path d="M4 5h16v10H9l-5 4z" />,
  // 棒グラフ
  numbers: (
    <>
      <path d="M4 20h16" />
      <path d="M7 17v-5M12 17V7M17 17v-8" />
    </>
  ),
  // 地図のピン
  entity: (
    <>
      <path d="M12 21s-6-6.2-6-11a6 6 0 0 1 12 0c0 4.8-6 11-6 11z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  // はてな
  qa: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01" />
    </>
  ),
  // 天びん
  comparison: <path d="M12 4v16M6 20h12M5 8h14M5 8l-2.5 5h5zM19 8l-2.5 5h5z" />,
  // 電球
  expertise: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />,
  // 矢印
  action: <path d="M4 12h14M13 6l6 6-6 6" />,
  // 盾
  trust: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
};

export function AioIcon({ point, className = "h-6 w-6" }: { point: AioPoint; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICON_PATHS[point]}
    </svg>
  );
}

/** 質問の横に出す「なぜ聞くの？」。AIOのどの材料のために聞いているかを伝える */
export function AioWhy({ point }: { point: AioPoint }) {
  const p = AIO_POINTS[point];
  return (
    <div className="flex gap-3 rounded-lg border border-line bg-canvas px-3 py-2 text-sm">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
        <AioIcon point={point} className="h-5 w-5" />
      </span>
      <p>
        <span className="font-semibold">なぜ聞くの？　AIOの「{p.label}」のためです。</span>
        <span className="block text-muted">{p.why}</span>
      </p>
    </div>
  );
}

/** 答えるたびに集まる「AIに紹介される材料」 */
export function AioMeter({ points, collected }: { points: AioPoint[]; collected: AioPoint[] }) {
  const all = [...new Set(points)];
  const have = all.filter((p) => collected.includes(p)).length;
  return (
    <section className="card space-y-2" aria-labelledby="aio-meter-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="aio-meter-heading" className="font-semibold">
          AIに紹介される材料
        </h2>
        <span className="text-sm text-muted">
          {have} / {all.length} 集まりました
        </span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {all.map((p) => {
          const ok = collected.includes(p);
          return (
            <li key={p} className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm ${ok ? "border-ok-soft bg-ok-soft font-semibold text-ok" : "border-line text-muted"}`}>
              <AioIcon point={p} className="h-4 w-4" />
              {AIO_POINTS[p].label}
              <span className="sr-only">{ok ? "（集まった）" : "（まだ）"}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** 答えた直後のひとこと */
export function Cheer({ point }: { point: AioPoint }) {
  return (
    <p className="flex items-center gap-2 rounded-lg bg-ok-soft px-3 py-2 text-sm font-semibold text-ok" role="status">
      <AioIcon point={point} className="h-5 w-5 shrink-0" />
      {AIO_POINTS[point].cheer}
    </p>
  );
}

/** なぜAIOが必要か。お客様がAIに聞く → AIが会社を紹介する → 問い合わせ → 売上 */
export function WhyAio({ compact = false }: { compact?: boolean }) {
  const steps = [
    { icon: "qa" as const, title: "お客様がAIに聞く", body: "「さくら市で断熱リフォームを頼むなら？」" },
    { icon: "entity" as const, title: "AIが答えの中で紹介する", body: "くわしく正直に書いている会社を選んで紹介" },
    { icon: "action" as const, title: "問い合わせが来る", body: "紹介を読んで、そのまま連絡" },
    { icon: "numbers" as const, title: "売上が上がる", body: "AI時代のウェブサイトの役目" },
  ];
  return (
    <section className="card space-y-3" aria-labelledby="why-aio-heading">
      <div>
        <h2 id="why-aio-heading" className="text-lg font-bold">
          なぜ、こんなにくわしく聞くの？
        </h2>
        <p className="text-muted">
          AI時代に、ウェブサイトで売上を上げるためです。いま、お客様は Google だけでなく AI にも相談します。AIに「この会社がおすすめ」と紹介されるための工夫を <strong>AIO</strong> といいます。AIが紹介したくなるのは、その会社にしかない体験や数字が書かれた記事です。だから、一問一答でくわしく聞いています。
        </p>
      </div>
      {!compact && (
        <ol className="grid gap-2 sm:grid-cols-4" aria-label="AIに紹介されて売上になるまで">
          {steps.map((st, i) => (
            <li key={st.title} className="flex gap-2 rounded-lg bg-canvas p-3 sm:flex-col sm:items-center sm:text-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                <AioIcon point={st.icon} />
              </span>
              <span>
                <span className="block font-semibold">
                  {i + 1}. {st.title}
                </span>
                <span className="block text-sm text-muted">{st.body}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="font-semibold text-brand-dark">1本書くごとに、AIに紹介される材料が増えていきます。一緒にがんばりましょう！</p>
    </section>
  );
}
