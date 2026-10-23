"use client";

export { AioIcon, AioMeter, AioWhy, Cheer, WhyAio } from "@/components/aio";

import { type Growth, type KeywordRow, ROW_STATUS_LABEL, type RowStatus, SAMPLE_LABEL } from "./growth";

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
