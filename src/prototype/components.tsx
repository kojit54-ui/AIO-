"use client";

import { AIO_POINTS, type AioPoint, type Growth, type KeywordRow, ROW_STATUS_LABEL, type RowStatus, SAMPLE_LABEL } from "./growth";

export function PrototypeNotice() {
  return (
    <p className="rounded-lg border border-warn-soft bg-warn-soft px-3 py-2 text-sm text-warn" role="note">
      新しい流れの画面試作です。架空の会社で動かしていて、{SAMPLE_LABEL}。入力はこのブラウザの中だけに保存され、本物の記事には反映されません。
    </p>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label}>
      <div className="h-full bg-brand transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** サイトのレベルとバッジ。書いて公開するほど上がる */
export function GrowthCard({ growth }: { growth: Growth }) {
  const span = growth.nextAt === null ? 1 : growth.nextAt - growth.levelStart;
  const into = growth.nextAt === null ? 1 : growth.points - growth.levelStart;
  return (
    <section className="card space-y-3" aria-labelledby="growth-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="growth-heading" className="text-sm font-semibold text-muted">
            あなたのサイトの育ち具合
          </h2>
          <p className="text-2xl font-bold">
            レベル {growth.level}：{growth.name}
          </p>
        </div>
        <p className="text-sm text-muted">
          {growth.nextAt === null ? "最高レベルです" : `次のレベルまで あと ${growth.nextAt - growth.points} 点`}
        </p>
      </div>
      <ProgressBar value={into} max={span} label="次のレベルまでの進み具合" />
      <ul className="flex flex-wrap gap-2" aria-label="バッジ">
        {growth.badges.map((b) => (
          <li
            key={b.id}
            className={`rounded-full border px-3 py-0.5 text-sm ${b.earned ? "border-ok-soft bg-ok-soft font-semibold text-ok" : "border-line text-muted"}`}
          >
            {b.earned ? "★ " : "☆ "}
            {b.label}
            <span className="sr-only">{b.earned ? "（獲得済み）" : "（まだ）"}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted">点の付け方：ヒアリング 5点、書き始めた記事 2点、公開した周りの記事 10点、公開した柱の記事 30点</p>
    </section>
  );
}

const NODE_STYLE: Record<RowStatus, string> = {
  todo: "border-line bg-surface text-ink",
  writing: "border-brand bg-brand-soft text-brand-dark",
  published: "border-ok bg-ok-soft text-ok",
};

function StatusLegend() {
  return (
    <ul className="flex flex-wrap gap-3 text-sm" aria-label="色の意味">
      {(Object.keys(ROW_STATUS_LABEL) as RowStatus[]).map((s) => (
        <li key={s} className="flex items-center gap-1">
          <span className={`inline-block h-3 w-3 rounded-sm border ${NODE_STYLE[s]}`} aria-hidden />
          {ROW_STATUS_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}

/**
 * ピラーとクラスターの図。柱の記事を真ん中に、周りの記事を放射状に置く。
 * 幅の狭い画面では、柱の下に周りの記事を並べる
 */
export function PillarDiagram({ rows }: { rows: KeywordRow[] }) {
  const pillar = rows.find((r) => r.kind === "pillar");
  const clusters = rows.filter((r) => r.kind === "cluster");
  if (!pillar) return null;
  const pos = clusters.map((_, i) => {
    const a = (Math.PI * 2 * i) / clusters.length - Math.PI / 2;
    return { x: 50 + 36 * Math.cos(a), y: 50 + 38 * Math.sin(a) };
  });
  const node = (r: KeywordRow, big: boolean) => (
    <>
      <span className={`block font-semibold ${big ? "text-base" : "text-sm"}`}>{r.keyword}</span>
      <span className="block text-xs">{ROW_STATUS_LABEL[r.status]}</span>
    </>
  );
  return (
    <figure className="space-y-3">
      <div className="relative hidden aspect-[16/10] w-full sm:block" role="img" aria-label={`柱の記事「${pillar.keyword}」と、その周りの記事${clusters.length}本の図`}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {pos.map((p, i) => (
            <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} stroke="var(--color-line)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className={`absolute left-1/2 top-1/2 w-48 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 px-3 py-3 text-center shadow-sm ${NODE_STYLE[pillar.status]}`}>
          <span className="block text-xs">柱の記事</span>
          {node(pillar, true)}
        </div>
        {clusters.map((c, i) => (
          <div
            key={c.id}
            className={`absolute w-40 -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1.5 text-center ${NODE_STYLE[c.status]}`}
            style={{ left: `${pos[i].x}%`, top: `${pos[i].y}%` }}
          >
            {node(c, false)}
          </div>
        ))}
      </div>
      <div className="space-y-2 sm:hidden">
        <div className={`rounded-xl border-2 px-3 py-3 text-center ${NODE_STYLE[pillar.status]}`}>
          <span className="block text-xs">柱の記事</span>
          {node(pillar, true)}
        </div>
        <ul className="ml-4 space-y-2 border-l-2 border-line pl-4" aria-label="周りの記事">
          {clusters.map((c) => (
            <li key={c.id} className={`rounded-lg border px-3 py-2 ${NODE_STYLE[c.status]}`}>
              {node(c, false)}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="space-y-2">
        <StatusLegend />
      </figcaption>
    </figure>
  );
}

/** ピラーとクラスターの考え方の説明。初めての人向け */
export function PillarExplainer() {
  return (
    <details className="card">
      <summary className="cursor-pointer font-semibold">「柱の記事」と「周りの記事」とは？</summary>
      <div className="mt-3 space-y-2">
        <p>
          <strong>柱の記事（ピラー）</strong>は、大きなテーマをひととおり説明する記事です。例えば「さくら市の断熱リフォーム」。
        </p>
        <p>
          <strong>周りの記事（クラスター）</strong>は、そのテーマの細かい疑問に1つずつ答える記事です。例えば「断熱リフォームの費用」「工事の期間」。
        </p>
        <p>
          柱と周りの記事をリンクでつなぐと、Google や AI に「この会社はこのテーマにくわしい」と伝わりやすくなります。AIO（AIに紹介されるための工夫）の土台になる組み立て方です。1本ずつ書いていくと、図の色が変わっていきます。
        </p>
      </div>
    </details>
  );
}

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
