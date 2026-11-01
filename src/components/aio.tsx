"use client";

// AIO（AIに紹介されるための工夫）を書く人に伝える部品。docs/AIO.md。

import { useState } from "react";
import { AIO_POINTS } from "@/lib/aio";
import { AIO_NEWS_UPDATED, SOURCE_LABEL, aioNewsFor, formatNewsDate, latestAioNews, type AioNewsItem } from "@/lib/aioNews";
import type { AioPoint } from "@/types/domain";
import { Shiori, ShioriFace, Toast } from "./fun";

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
  const news = aioNewsFor(point);
  return (
    <div className="flex gap-3 rounded-2xl bg-ok-soft px-4 py-3 text-[0.95rem]">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 animate-nod items-center justify-center rounded-xl bg-ok-bright text-white">
        <AioIcon point={point} className="h-6 w-6" />
      </span>
      <p>
        <span className="block font-bold text-ok">なぜ聞くの？　「{p.label}」が集まるからです</span>
        <span className="block">{p.why}</span>
        {news && (
          <span className="mt-1.5 block rounded-xl bg-surface/80 px-3 py-1.5 text-sm">
            <span className="font-bold text-brand-dark">最新情報（{formatNewsDate(news.date)}）</span> {news.title}。<SourceTag item={news} />
          </span>
        )}
      </p>
    </div>
  );
}

/** 公式か報道かの小さな札。出典へのリンク付き */
function SourceTag({ item }: { item: AioNewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`ml-1 inline-block rounded-full px-2 text-xs font-bold underline-offset-2 hover:underline ${item.source === "official" ? "bg-ok-soft text-ok" : "bg-canvas text-muted"}`}
    >
      {item.sourceName}・{SOURCE_LABEL[item.source]}
    </a>
  );
}

/** しおりのAIOニュース。AI検索の最新の変化と、だから何を聞くのかを伝える。中身は src/lib/aioNews.ts */
export function AioNews({ count = 3 }: { count?: number }) {
  const items = latestAioNews(count);
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  // 見出しには公式の発表を優先する。報道は「ほかのニュース」へ
  const top = items.find((n) => n.source === "official") ?? items[0];
  const rest = items.filter((n) => n !== top);
  return (
    <section className="card animate-rise space-y-3" aria-labelledby="aio-news-heading">
      <div className="flex items-start gap-3">
        <Shiori mood="idea" className="h-16 w-auto shrink-0 animate-float sm:h-28" />
        <div className="min-w-0 space-y-1.5">
          <h2 id="aio-news-heading" className="inline-block rounded-full bg-sun-soft px-3 text-sm font-bold">
            しおりのAIOニュース
          </h2>
          <p className="text-lg font-black leading-snug">{top.title}</p>
          <p className="text-[0.95rem]">{top.forClient}</p>
          {top.point && top.soWeAsk && (
            <p className="flex items-start gap-2 rounded-2xl bg-ok-soft px-3 py-2 text-[0.95rem] font-bold text-ok">
              <AioIcon point={top.point} className="mt-0.5 h-5 w-5 shrink-0" />
              <span>だから、{top.soWeAsk}をくわしく聞いています。</span>
            </p>
          )}
          <p className="text-xs text-muted">
            {formatNewsDate(top.date)}
            <SourceTag item={top} />
          </p>
        </div>
      </div>
      {rest.length > 0 && (
        <div>
          <button type="button" className="text-sm font-bold text-brand-dark underline" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? "とじる" : `ほかのニュースも見る（${rest.length}件）`}
          </button>
          {open && (
            <ul className="mt-2 space-y-2">
              {rest.map((n) => (
                <li key={n.id} className="flex animate-rise gap-2 rounded-2xl bg-canvas p-3 text-[0.95rem]">
                  <ShioriFace className="h-8 w-8 shrink-0" />
                  <span>
                    <b className="block">{n.title}</b>
                    {n.forClient}
                    <span className="mt-1 block text-xs text-muted">
                      {formatNewsDate(n.date)}
                      <SourceTag item={n} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p className="text-xs text-muted">AI検索の情報は毎週確かめて、記事を書くAIへの指示にも反映しています（最終確認：{formatNewsDate(AIO_NEWS_UPDATED)}）。</p>
    </section>
  );
}

/** 答えるたびに集まる「AIに紹介される材料」。集まった材料はポンと黄色に変わる */
export function AioMeter({ points, collected }: { points: AioPoint[]; collected: AioPoint[] }) {
  const all = [...new Set(points)];
  const have = all.filter((p) => collected.includes(p)).length;
  return (
    <section className="card space-y-3" aria-labelledby="aio-meter-heading">
      <div>
        <h2 id="aio-meter-heading" className="text-lg font-bold">
          AIに紹介される材料
        </h2>
        <p className="text-sm text-muted">
          答えるたびに、ここに集まります（{have} / {all.length}）
        </p>
      </div>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
        {all.map((p) => {
          const ok = collected.includes(p);
          return (
            <li
              key={`${p}-${ok}`}
              className={`relative flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-2xl p-1.5 text-center text-xs leading-tight ${
                ok ? "animate-pop bg-sun font-bold text-ink" : "border-2 border-dashed border-line text-muted"
              }`}
            >
              {ok && <span className="absolute -inset-1 animate-ring rounded-[1.2rem] border-[3px] border-sun opacity-0" aria-hidden />}
              <AioIcon point={p} className="h-6 w-6" />
              {AIO_POINTS[p].label}
              <span className="sr-only">{ok ? "（集まった）" : "（まだ）"}</span>
            </li>
          );
        })}
      </ul>
      {all.length > 0 && have === all.length && (
        <div className="flex animate-pop items-center gap-3 rounded-2xl bg-sun-soft p-2">
          <Shiori mood="right" className="h-24 w-auto shrink-0" />
          <p className="font-bold">材料がぜんぶそろいました！AIに紹介されやすい記事になります。</p>
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-canvas" aria-hidden>
        <div className="h-full rounded-full bg-gradient-to-r from-sun to-brand transition-[width] duration-700" style={{ width: `${all.length ? (have / all.length) * 100 : 0}%` }} />
      </div>
    </section>
  );
}

/** 答えた直後のひとこと。画面の上にふわっと出て消える */
export function Cheer({ point }: { point: AioPoint }) {
  return <Toast>{AIO_POINTS[point].cheer}</Toast>;
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
            <li key={st.title} className="flex animate-rise gap-2 rounded-2xl bg-canvas p-3 sm:flex-col sm:items-center sm:text-center" style={{ animationDelay: `${i * 0.12}s` }}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
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
      <p className="font-bold text-brand-dark">1本書くごとに、AIに紹介される材料が増えていきます。一緒にがんばりましょう！</p>
    </section>
  );
}
