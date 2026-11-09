"use client";

// ロゴの使い方（/brand/logo）。ロゴを使う人（コタム社内・制作会社・取材・ご利用の会社）向けの作業用ページ。検索には出さない。
// 2026-11-08 田村さん「このコンテンツは誰向け？」→ /brand は社長向けにし、ロゴの種類・決まり・色番号・書体・ダウンロード一覧をここへ移した。

/* eslint-disable @next/next/no-img-element -- ロゴの見本は固定のSVG。崩しの見本もそのまま見せたい */

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/landing";
import { SiteFooter, SiteHeader } from "@/components/site";
import { Toast, useFlash } from "@/components/fun";
import { SERVICE_NAME } from "@/lib/brand";
import { BRAND_COLORS, BRAND_FONTS, BRAND_VOICE, LOGO_COLORWAYS, LOGO_DONTS, LOGO_RULES, LOGO_VARIANTS, type LogoFile } from "@/lib/brandBook";

const kaku = "font-[family-name:var(--font-kaku)]";
const num = "font-[family-name:var(--font-barlow)] tracking-wide";

export function LogoGuide() {
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
    <div className="overflow-x-clip bg-paper text-sumi">
      <SiteHeader />
      {flash > 0 && <Toast key={flash}>{copied} をコピーしました</Toast>}
      <main className={`${kaku} mx-auto max-w-5xl px-4 pb-16 pt-6 font-medium sm:px-6 sm:pt-10`}>
        <p className="text-sm font-bold">
          <Link href="/brand" className="text-indigo underline underline-offset-4">
            えらばれ帳が大切にしていること
          </Link>
          <span className="mx-2 text-sumi/50">/</span>ロゴの使い方
        </p>
        <h1 className={`${kaku} mt-4 text-[1.9rem] font-black leading-snug sm:text-5xl`}>ロゴの使い方</h1>
        <p className="mt-4 max-w-3xl leading-loose">チラシ・資料・ホームページ・記事などに{SERVICE_NAME}のロゴを使う方のためのページです。種類・決まり・色・書体と、データのダウンロードをまとめています。</p>

        <Section id="variants" no="01" kicker="種類" title="ロゴの種類と色">
          <h3 className="text-lg font-black">ロゴの種類</h3>
          <LogoGrid items={LOGO_VARIANTS} />
          <h3 className="mt-10 text-lg font-black">色の種類</h3>
          <LogoGrid items={LOGO_COLORWAYS} />
        </Section>

        {/* 07 ロゴの使い方 */}
        <Section id="rules" no="02" kicker="決まり" title="余白・大きさ・名前の書き方">
          <div className="grid border-2 border-sumi md:grid-cols-2">
            <div className="border-b-2 border-sumi p-5 md:border-b-0 md:border-r-2">
              <h3 className="font-black">まわりの余白</h3>
              <div className="mt-4 bg-white p-4">
                <div className="relative mx-auto max-w-[18rem] border border-dashed border-indigo p-[7%]">
                  <img src="/brand/logo-horizontal.svg" alt="" width={483} height={120} className="h-auto w-full" />
                  <span className={`${num} absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo`}>x</span>
                  <span className={`${num} absolute -left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo`}>x</span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{LOGO_RULES.clearSpace}（図の x）</p>
            </div>
            <div className="p-5">
              <h3 className="font-black">いちばん小さいサイズ</h3>
              <ul className="mt-2 text-sm">
                {LOGO_RULES.minSize.map((m) => (
                  <li key={m.label} className="flex flex-wrap gap-x-3 border-b border-sumi/30 py-2 last:border-0">
                    <b className="w-14 shrink-0">{m.label}</b>
                    <span>画面で{m.screen}</span>
                    <span className="text-sumi/70">印刷で{m.print}</span>
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
            </div>
          </div>

          <h3 className="mt-10 text-lg font-black">やってはいけないこと</h3>
          <div className="mt-3 grid grid-cols-2 border-l border-t border-sumi md:grid-cols-3">
            {LOGO_DONTS.map((d) => (
              <div key={d.label} className="border-b border-r border-sumi p-3">
                <div className="grid h-24 place-items-center overflow-hidden bg-white px-3">
                  <img src="/brand/logo-horizontal.svg" alt="" width={483} height={120} className="h-auto w-full max-w-[10rem]" style={d.style} />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-sm font-bold">
                  <span className="text-danger" aria-hidden>
                    ×
                  </span>
                  {d.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed">ほかにも、マークと文字の位置を入れかえる、文字だけ別の書体にする、マークにきらめきや星を足す、などはしないでください。</p>
        </Section>

        {/* 08 色と書体 */}
        <Section id="colors" no="03" kicker="色と書体" title="藍と真鍮と、生成りの紙。">
          <p className="leading-relaxed">ブランドの骨格は藍、しおりと「確かめてほしい所」だけが真鍮。サービスの画面では、押すボタンとリンクに明るい青を使います。2つの青は役目を分け、となりに並べるときは間に白か生成りをはさみます。色をおすと、色の番号をコピーできます。</p>
          <div className="mt-5 grid grid-cols-2 border-l border-t border-sumi sm:grid-cols-3 lg:grid-cols-5">
            {BRAND_COLORS.map((c) => (
              <button key={c.hex} type="button" onClick={() => copy(c.hex)} className="border-b border-r border-sumi text-left transition-opacity hover:opacity-90">
                <span className={`${num} flex h-24 items-end p-3 text-sm font-bold`} style={{ background: c.hex, color: c.text }}>
                  {c.hex.toUpperCase()}
                </span>
                <span className="block bg-white p-3">
                  <b className="block">{c.name}</b>
                  <span className={`${num} block text-xs text-sumi/70`}>RGB {c.rgb}</span>
                  <span className="mt-1 block text-sm leading-snug">{c.role}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 border-t-2 border-sumi">
            {BRAND_FONTS.map((f) => (
              <div key={f.name} className="grid gap-2 border-b border-sumi/30 py-4 md:grid-cols-[1fr_16rem] md:items-end">
                <p className={`text-2xl leading-snug sm:text-3xl ${f.font === "kaku" ? `${kaku} font-black` : f.font === "barlow" ? `${num} font-bold` : "font-bold font-[family-name:var(--font-maru)]"}`}>{f.sample}</p>
                <p className="text-sm">
                  <b className="block">{f.name}</b>
                  <span className="text-sumi/70">
                    {f.weight}・{f.use}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-sumi/80">本文の大きさの目安：ブランドの紙面 16px・行の高さ 1.8〜1.9、記事 16〜18px・1.8、案内役のせりふ 16px・1.7。どれも無料で使える書体です（Google Fonts）。</p>
        </Section>

        {/* 09 ダウンロード */}
        <Section id="download" no="04" kicker="ダウンロード" title="ロゴのデータ">
          <div className="flex flex-col items-start gap-4 border-2 border-sumi bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bold">すべての種類のロゴ（SVG・PNG）を1つにまとめています。</p>
            <a href="/brand/aio-erabare-logo.zip" download className="inline-flex min-h-12 items-center bg-indigo px-5 font-bold text-white shadow-[0_3px_0_var(--color-sumi)] transition-transform active:translate-y-0.5">
              まとめてダウンロード（ZIP）
            </a>
          </div>
          <ul className="mt-4 border-t border-sumi text-sm">
            {DOWNLOADS.map((d) => (
              <li key={d.file} className="flex items-center justify-between gap-2 border-b border-sumi/30 py-2.5">
                <span className="font-bold">{d.label}</span>
                <span className="flex gap-4">
                  {d.formats.map((ext) => (
                    <a key={ext} href={`/brand/${d.file}.${ext}`} download className={`${num} font-bold text-indigo underline underline-offset-4`}>
                      {ext.toUpperCase()}
                    </a>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed">
            ホームページや資料にはSVG、WordやPowerPointにはPNGが便利です。ご利用の会社が「{SERVICE_NAME}で記事を書いています」と紹介してくださるときも、このページの決まりでお使いください。わからないことは
            <Link href="/about" className="font-bold text-indigo underline underline-offset-4">
              運営会社
            </Link>
            までお問い合わせください。
          </p>
          <p className={`${num} mt-8 border-t border-sumi/30 pt-3 text-sm text-sumi/70`}>第3版　2026年11月</p>
        </Section>

        <Section id="voice" no="05" kicker="文章" title="ロゴと一緒に書く文章">
          <p className="leading-relaxed">{BRAND_VOICE.summary}</p>
          <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
            <List title="こう書く" mark="○" items={BRAND_VOICE.dos} tone="text-ok" />
            <List title="使わない" mark="×" items={BRAND_VOICE.donts} tone="text-danger" />
          </div>
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
  { file: "logo-horizontal-ink", label: "横組み（墨1色）", formats: ["svg", "png"] },
  { file: "logo-vertical", label: "縦組み（カラー）", formats: ["svg", "png"] },
  { file: "logo-vertical-white", label: "縦組み（白1色）", formats: ["svg", "png"] },
  { file: "logo-vertical-ink", label: "縦組み（墨1色）", formats: ["svg", "png"] },
  { file: "logo-mark", label: "マーク（カラー）", formats: ["svg", "png"] },
  { file: "logo-mark-white", label: "マーク（白1色）", formats: ["svg", "png"] },
  { file: "logo-mark-ink", label: "マーク（墨1色）", formats: ["svg", "png"] },
  { file: "favicon-16", label: "マーク（16px・タブ専用）", formats: ["svg", "png"] },
  { file: "app-icon", label: "アプリのアイコン", formats: ["svg", "png"] },
];

/** 句読点の後ろでだけ折り返す。lines=true は文（。）ごとに改行する */
function Phrases({ text, lines = false }: { text: string; lines?: boolean }) {
  if (lines)
    return (
      <>
        {text.split(/(?<=。)/).map((t, i) => (
          <span key={i} className="block">
            <Phrases text={t} />
          </span>
        ))}
      </>
    );
  return (
    <>
      {text.split(/(?<=[、。])/).map((t, i) => (
        <span key={i} className="inline-block max-w-full">
          {t}
        </span>
      ))}
    </>
  );
}

function Section({ id, no, kicker, title, children }: { id: string; no: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-28 sm:mt-20">
      <Reveal>
        <p className="flex items-baseline gap-3 border-b-2 border-sumi pb-2 text-sm font-bold">
          <span className={`${num} text-2xl font-bold text-indigo`}>{no}</span>
          {kicker}
        </p>
        <h2 className={`${kaku} mt-5 text-[1.45rem] font-black leading-snug sm:text-[2.1rem]`}>
          <Phrases text={title} />
        </h2>
      </Reveal>
      <div className="mt-6">{children}</div>
    </section>
  );
}

const BG: Record<LogoFile["bg"], string> = { white: "bg-white", paper: "bg-paper", indigo: "bg-indigo", sumi: "bg-sumi" };

function LogoGrid({ items }: { items: LogoFile[] }) {
  return (
    <div className="mt-3 grid border-l border-t border-sumi sm:grid-cols-2">
      {items.map((v) => (
        <div key={v.file} className="border-b border-r border-sumi">
          <div className={`grid h-40 place-items-center px-6 ${BG[v.bg]}`}>
            <img src={`/brand/${v.file}.svg`} alt={`${v.label}のロゴ`} className={v.tall ? "h-32 w-auto" : v.square ? "h-24 w-24" : "h-auto w-full max-w-[16rem]"} />
          </div>
          <div className="border-t border-sumi bg-paper px-4 py-3">
            <p className="font-black">{v.label}</p>
            <p className="text-sm leading-relaxed">{v.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function List({ title, mark, tone, items }: { title: string; mark: string; tone: string; items: string[] }) {
  return (
    <div>
      <p className={`font-black ${tone}`}>{title}</p>
      <ul className="mt-1 space-y-1">
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
