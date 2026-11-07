"use client";

// ブランドとロゴ（/brand）。2026-11-07 田村さん「ロゴ、ロゴガイドライン、ブランドコンセプト、理念、ミッションバリュー。サイトにもコンテンツとして掲載する」。
// 文面は src/lib/brandBook.ts、正本は docs/BRAND.md。ロゴは public/brand/。
// 不特定多数が見るページなので、動きは「見えたらふわっと出る」くらいにとどめる。

/* eslint-disable @next/next/no-img-element -- ロゴの見本は固定のSVG。拡大・崩しの見本をそのまま見せたい */

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/landing";
import { SiteFooter, SiteHeader } from "@/components/site";
import { Toast, useFlash } from "@/components/fun";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import {
  BRAND_COLORS,
  BRAND_CONCEPT,
  BRAND_FONTS,
  BRAND_MISSION,
  BRAND_NAME_PARTS,
  BRAND_PHILOSOPHY,
  BRAND_READING,
  BRAND_VALUES,
  BRAND_VOICE,
  LOGO_COLORWAYS,
  LOGO_DONTS,
  LOGO_PARTS,
  LOGO_RULES,
  LOGO_VARIANTS,
  type LogoFile,
} from "@/lib/brandBook";

const TOC = [
  { id: "concept", label: "コンセプト" },
  { id: "mission", label: "理念・ミッション" },
  { id: "values", label: "大切にすること" },
  { id: "logo", label: "ロゴ" },
  { id: "rules", label: "ロゴの使い方" },
  { id: "colors", label: "色と文字" },
  { id: "download", label: "ダウンロード" },
];

export function BrandBook() {
  const [copied, setCopied] = useState("");
  const [flash, fire] = useFlash();
  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).then(
      () => {
        setCopied(hex);
        fire();
      },
      () => undefined,
    );
  };

  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      {flash > 0 && <Toast key={flash}>{copied} をコピーしました</Toast>}
      <main className="mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6">
        {/* 表紙 */}
        <section className="relative overflow-hidden rounded-[2rem] bg-surface px-5 py-10 text-center shadow-[0_6px_0_var(--color-line)] sm:px-10 sm:py-14">
          <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-canvas-deep" aria-hidden />
          <span className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-canvas-deep" aria-hidden />
          <span className="pointer-events-none absolute right-8 top-6 animate-twinkle text-2xl text-sun" aria-hidden>
            ✦
          </span>
          <p className="relative text-sm font-black text-brand">ブランドブック</p>
          <h1 className="relative mx-auto mt-4 w-full max-w-md animate-pop">
            <img src="/brand/logo-vertical.svg" alt={SERVICE_NAME} width={393} height={240} className="mx-auto h-auto w-56 sm:w-72" />
          </h1>
          <p className="relative mt-3 text-sm text-muted">読み方：{BRAND_READING}</p>
          <p className="relative mx-auto mt-5 max-w-xl text-xl font-black leading-relaxed sm:text-2xl">
            <Phrases text={BRAND_CONCEPT.title} />
          </p>
          <nav aria-label="このページの目次" className="relative mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
            {TOC.map((t) => (
              <a key={t.id} href={`#${t.id}`} className="rounded-full bg-brand-soft px-3 py-1.5 text-sm font-bold text-brand-dark transition-transform hover:-translate-y-0.5">
                {t.label}
              </a>
            ))}
          </nav>
        </section>

        {/* コンセプト */}
        <Section id="concept" kicker="ブランドコンセプト" title={BRAND_CONCEPT.title}>
          <Reveal className="space-y-3 text-lg leading-loose">
            {BRAND_CONCEPT.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <h3 className="mt-8 text-lg font-black">名前に込めたこと</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {BRAND_NAME_PARTS.map((n, i) => (
              <Reveal key={n.word} delay={i * 0.1} className="card h-full">
                <b className={`block text-3xl font-black ${n.word === "AIO" ? "text-brand" : "text-ink"}`}>{n.word}</b>
                <p className="mt-2 text-sm leading-relaxed text-muted">{n.text}</p>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 理念・ミッション */}
        <Section id="mission" kicker="理念とミッション" title="何のために、何をするのか">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="h-full rounded-[1.75rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-6 text-white shadow-[0_6px_0_var(--color-brand-dark)]">
              <p className="text-sm font-black text-sun">理念（めざす世の中）</p>
              <p className="mt-2 text-2xl font-black leading-snug">{BRAND_PHILOSOPHY.title}</p>
              <p className="mt-3 leading-relaxed text-white/90">{BRAND_PHILOSOPHY.body}</p>
            </Reveal>
            <Reveal delay={0.1} className="h-full rounded-[1.75rem] bg-sun-soft p-6 shadow-[0_6px_0_var(--color-sun)]">
              <p className="text-sm font-black text-warn">ミッション（わたしたちの仕事）</p>
              <p className="mt-2 text-2xl font-black leading-snug">{BRAND_MISSION.title}</p>
              <p className="mt-3 leading-relaxed">{BRAND_MISSION.body}</p>
            </Reveal>
          </div>
        </Section>

        {/* バリュー */}
        <Section id="values" kicker="バリュー" title="大切にする5つのこと">
          <ol className="space-y-3">
            {BRAND_VALUES.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.06} className="card flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-3xl" aria-hidden>
                    {v.icon}
                  </span>
                  <span className="min-w-0">
                    <b className="block text-lg leading-snug">
                      <span className="mr-2 text-brand">{i + 1}</span>
                      {v.title}
                    </b>
                    <span className="mt-1 block leading-relaxed">{v.text}</span>
                    <span className="mt-2 block rounded-xl bg-canvas px-3 py-2 text-sm text-muted">
                      <b className="text-brand-dark">サービスでは：</b>
                      {v.inService}
                    </span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal className="mt-6 card">
            <h3 className="text-lg font-black">話し方</h3>
            <p className="mt-1 leading-relaxed">{BRAND_VOICE.summary}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <List title="こう話す" mark="○" tone="text-ok" items={BRAND_VOICE.dos} />
              <List title="こうは話さない" mark="×" tone="text-danger" items={BRAND_VOICE.donts} />
            </div>
          </Reveal>
        </Section>

        {/* ロゴ */}
        <Section id="logo" kicker="ロゴ" title="帳面に、しおりをはさむ">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <Reveal className="relative mx-auto w-full max-w-xs rounded-[2rem] bg-surface p-8 shadow-[0_6px_0_var(--color-line)]">
              <img src="/brand/logo-mark.svg" alt="ロゴのマーク" width={120} height={120} className="h-auto w-full" />
            </Reveal>
            <ul className="space-y-3">
              {LOGO_PARTS.map((p, i) => (
                <Reveal key={p.name} delay={i * 0.08}>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-6 w-6 shrink-0 rounded-full ring-2 ring-line" style={{ background: p.color }} aria-hidden />
                    <span>
                      <b className="block">{p.name}</b>
                      <span className="text-sm leading-relaxed text-muted">{p.text}</span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <p className="mt-6 leading-relaxed">
            たくさんのページの中から、お客様が「ここだ」としおりをはさむ1ページになる。AIのきらめきの先に、人との出会いがある。ロゴには、{SERVICE_NAME}がめざすことをそのまま込めました。
          </p>

          <h3 className="mt-8 text-lg font-black">ロゴの種類</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LOGO_VARIANTS.map((v, i) => (
              <LogoCard key={v.file} v={v} delay={i * 0.06} />
            ))}
          </div>

          <h3 className="mt-8 text-lg font-black">色の種類</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {LOGO_COLORWAYS.map((v, i) => (
              <LogoCard key={v.file} v={v} delay={i * 0.06} />
            ))}
          </div>
        </Section>

        {/* 使い方 */}
        <Section id="rules" kicker="ロゴガイドライン" title="ロゴの使い方">
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal className="card h-full">
              <h3 className="font-black">まわりの余白</h3>
              <div className="mt-4 grid place-items-center rounded-2xl bg-canvas p-4">
                <div className="relative border-2 border-dashed border-brand/60 p-[6%]">
                  <img src="/brand/logo-horizontal.svg" alt="" width={587} height={120} className="h-auto w-full max-w-[16rem]" />
                  <span className="absolute left-1/2 top-0 h-[6%] w-px -translate-x-1/2 bg-brand" aria-hidden />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{LOGO_RULES.clearSpace}</p>
            </Reveal>
            <Reveal delay={0.08} className="card h-full">
              <h3 className="font-black">いちばん小さいサイズ</h3>
              <ul className="mt-3 text-sm">
                {LOGO_RULES.minSize.map((m) => (
                  <li key={m.label} className="flex flex-wrap items-baseline gap-x-3 border-b border-line py-2 last:border-0">
                    <b className="w-14 shrink-0">{m.label}</b>
                    <span>{m.screen}</span>
                    <span className="text-muted">{m.print}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-5 font-black">名前の書き方</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {LOGO_RULES.writing.map((w) => (
                  <li key={w.text} className="flex gap-2">
                    <b className={w.ok ? "text-ok" : "text-danger"} aria-label={w.ok ? "よい" : "よくない"}>
                      {w.ok ? "○" : "×"}
                    </b>
                    <span className={w.ok ? "font-bold" : ""}>{w.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <h3 className="mt-8 text-lg font-black">やってはいけないこと</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {LOGO_DONTS.map((d, i) => (
              <Reveal key={d.label} delay={i * 0.05} className="card overflow-hidden p-3">
                <div className="grid h-24 place-items-center overflow-hidden rounded-xl bg-canvas px-3">
                  <img src="/brand/logo-horizontal.svg" alt="" width={587} height={120} className="h-auto w-full max-w-[11rem]" style={d.style} />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-danger text-xs text-white" aria-hidden>
                    ×
                  </span>
                  {d.label}
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">ほかにも、マークと文字の位置を入れかえる、文字だけ別の書体にする、マークの中に文字を入れる、などはしないでください。</p>
        </Section>

        {/* 色と文字 */}
        <Section id="colors" kicker="色と文字" title="さわやかな青と、しおりの黄色">
          <p className="leading-relaxed">背景はあかるく、青は大事なところに、黄色は少しだけ。目安は「背景 6・青 3・黄 1」です。色をおすと、色の番号をコピーできます。</p>
          <div className="mt-4 flex h-5 overflow-hidden rounded-full ring-1 ring-line" aria-hidden>
            <span className="w-[60%] bg-canvas" />
            <span className="w-[30%] bg-brand" />
            <span className="w-[10%] bg-sun" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {BRAND_COLORS.map((c, i) => (
              <Reveal key={c.hex} delay={i * 0.05}>
                <button type="button" onClick={() => copy(c.hex)} className="card block h-full w-full overflow-hidden !p-0 text-left transition-transform hover:-translate-y-0.5">
                  <span className={`flex h-20 items-end p-3 text-sm font-black ${c.dark ? "text-white" : "text-ink"}`} style={{ background: c.hex }}>
                    {c.hex}
                  </span>
                  <span className="block p-3">
                    <b className="block">{c.name}</b>
                    <span className="block text-xs text-muted">RGB {c.rgb}</span>
                    <span className="mt-1 block text-sm leading-snug">{c.role}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-black">文字</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {BRAND_FONTS.map((f) => (
              <Reveal key={f.weight} className="card">
                <p className={`text-2xl leading-snug ${f.className}`}>{f.sample}</p>
                <p className="mt-3 text-sm">
                  <b>{f.name}</b>
                  <span className="text-muted">　太さ {f.weight}・{f.use}</span>
                </p>
              </Reveal>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">
            Zen Maru Gothic は無料で使える書体です（
            <a href="https://fonts.google.com/specimen/Zen+Maru+Gothic" className="font-bold text-brand-dark underline" target="_blank" rel="noreferrer">
              Google Fonts
            </a>
            ）。パソコンに無いときは、ヒラギノ丸ゴ、メイリオの順で代わりに使います。
          </p>
        </Section>

        {/* ダウンロード */}
        <Section id="download" kicker="ダウンロード" title="ロゴのデータ">
          <Reveal className="rounded-[1.75rem] bg-brand-soft p-6 text-center">
            <p className="font-bold">すべての種類のロゴ（SVG・PNG）を、ひとつにまとめています。</p>
            <a href="/brand/aio-erabare-logo.zip" download className="btn-primary mt-4 inline-flex">
              ロゴをまとめてダウンロード（ZIP）
            </a>
            <p className="mt-3 text-sm text-muted">ホームページや資料にはSVG、WordやPowerPointにはPNGが便利です。</p>
          </Reveal>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {DOWNLOADS.map((d) => (
              <li key={d.file} className="flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2 ring-1 ring-line">
                <span className="font-bold">{d.label}</span>
                <span className="flex gap-3">
                  {d.formats.map((ext) => (
                    <a key={ext} href={`/brand/${d.file}.${ext}`} download className="font-bold text-brand-dark underline underline-offset-4">
                      {ext.toUpperCase()}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">
            ロゴは{SERVICE_OPERATOR}の{SERVICE_NAME}を紹介するときに使えます。ご利用の会社が「{SERVICE_NAME}で記事を書いています」と紹介してくださるときも、このページのルールでお使いください。わからないことは
            <Link href="/welcome#faq" className="font-bold text-brand-dark underline underline-offset-4">
              よくある質問
            </Link>
            から、お気軽にどうぞ。
          </p>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

const DOWNLOADS: { file: string; label: string; formats: string[] }[] = [
  { file: "logo-horizontal", label: "横組み（カラー）", formats: ["svg", "png"] },
  { file: "logo-horizontal-reverse", label: "横組み（カラー反転）", formats: ["svg", "png"] },
  { file: "logo-horizontal-white", label: "横組み（白1色）", formats: ["svg", "png"] },
  { file: "logo-horizontal-ink", label: "横組み（黒1色）", formats: ["svg"] },
  { file: "logo-vertical", label: "縦組み（カラー）", formats: ["svg", "png"] },
  { file: "logo-vertical-white", label: "縦組み（白1色）", formats: ["svg"] },
  { file: "logo-mark", label: "マーク（カラー）", formats: ["svg", "png"] },
  { file: "logo-mark-white", label: "マーク（白1色）", formats: ["svg", "png"] },
  { file: "logo-mark-ink", label: "マーク（黒1色）", formats: ["svg"] },
  { file: "app-icon", label: "アプリのアイコン", formats: ["svg", "png"] },
];

/** 「、」のあとで折り返す（「帳／面。」のような、ことばの途中の改行を防ぐ） */
function Phrases({ text }: { text: string }) {
  const parts = text.split(/(?<=、)/);
  return (
    <>
      {parts.map((t, i) => (
        <span key={i} className="inline-block max-w-full">
          {t}
        </span>
      ))}
    </>
  );
}

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-28">
      <Reveal>
        <p className="text-sm font-black text-brand">{kicker}</p>
        <h2 className="mt-1 text-2xl font-black leading-snug sm:text-3xl">
          <Phrases text={title} />
        </h2>
      </Reveal>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function LogoCard({ v, delay }: { v: LogoFile; delay: number }) {
  const bg = v.dark ? (v.file.includes("reverse") ? "bg-ink" : "bg-brand") : "bg-canvas";
  return (
    <Reveal delay={delay} className="card h-full overflow-hidden p-3">
      <div className={`grid h-36 place-items-center rounded-xl px-4 ${bg}`}>
        <img src={`/brand/${v.file}.svg`} alt={`${v.label}のロゴ`} className={`h-auto ${v.tall ? "max-h-28 w-auto" : v.file.includes("horizontal") ? "w-full max-w-[15rem]" : "w-20"}`} />
      </div>
      <p className="mt-2 font-black">{v.label}</p>
      <p className="text-sm leading-relaxed text-muted">{v.use}</p>
    </Reveal>
  );
}

function List({ title, mark, tone, items }: { title: string; mark: string; tone: string; items: string[] }) {
  return (
    <div>
      <p className={`font-black ${tone}`}>{title}</p>
      <ul className="mt-1 space-y-1 text-sm">
        {items.map((t) => (
          <li key={t} className="flex gap-2">
            <b className={tone} aria-hidden>
              {mark}
            </b>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
