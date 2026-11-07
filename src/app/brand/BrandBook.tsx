"use client";

// ブランドとロゴ（/brand）第2版。文面は src/lib/brandBook.ts、正本は docs/BRAND.md。ロゴは public/brand/。
// 2026-11-07 田村さん「クオリティ低い。AIっぽい」→ 3AIの批評をうけて作り直した。
// 見た目の決まり：生成りの紙に墨の罫線、角は丸めない（最大2px）、絵文字は使わない、番号と寸法線で組む。
// 「世界観を見せる」より「頼む前の不安に答える」順番（仕事 → 見本 → AIと人 → 理念 → 約束 → ロゴ）。

/* eslint-disable @next/next/no-img-element -- ロゴの見本は固定のSVG。崩しの見本もそのまま見せたい */

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/landing";
import { SiteFooter, SiteHeader } from "@/components/site";
import { Toast, useFlash } from "@/components/fun";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import {
  BRAND_AI_NOTE,
  BRAND_COLORS,
  BRAND_DESCRIPTOR,
  BRAND_FONTS,
  BRAND_GAP,
  BRAND_LINE,
  BRAND_MISSION,
  BRAND_PHILOSOPHY,
  BRAND_PROMISES,
  BRAND_READING,
  BRAND_SAMPLE,
  BRAND_STEPS,
  BRAND_VOICE,
  LOGO_COLORWAYS,
  LOGO_DONTS,
  LOGO_PARTS,
  LOGO_RULES,
  LOGO_STORY,
  LOGO_VARIANTS,
  type LogoFile,
} from "@/lib/brandBook";

const kaku = "font-[family-name:var(--font-kaku)]";
const num = "font-[family-name:var(--font-barlow)] tracking-wide";

const TOC = [
  { id: "work", no: "01", label: "伝わらない仕事" },
  { id: "sample", no: "02", label: "話が記事になるまで" },
  { id: "ai", no: "03", label: "AIと人" },
  { id: "mission", no: "04", label: "理念とミッション" },
  { id: "promise", no: "05", label: "記事づくりの約束" },
  { id: "logo", no: "06", label: "ロゴ" },
  { id: "rules", no: "07", label: "ロゴの使い方" },
  { id: "colors", no: "08", label: "色と書体" },
  { id: "download", no: "09", label: "ダウンロード" },
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
    <div className="overflow-x-clip bg-paper text-sumi">
      <SiteHeader />
      {flash > 0 && <Toast key={flash}>{copied} をコピーしました</Toast>}
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
        {/* 表紙：図面の表題欄の形 */}
        <section className="border-2 border-sumi bg-paper">
          <div className="grid md:grid-cols-[1.35fr_1fr]">
            <div className="p-5 sm:p-10">
              <img src="/brand/logo-horizontal.svg" alt={SERVICE_NAME} width={483} height={120} className="h-auto w-64 sm:w-80" />
              <span className="mt-6 block h-1.5 w-16 bg-brass" aria-hidden />
              <h1 className={`${kaku} mt-6 text-[1.9rem] font-black leading-[1.35] sm:text-5xl`}>
                <span className="inline-block">現場の話を、</span>
                <span className="inline-block">選ばれる理由に。</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed">{BRAND_DESCRIPTOR}</p>
            </div>
            <dl className="grid grid-cols-[6.5rem_1fr] border-t-2 border-sumi text-sm md:border-l-2 md:border-t-0">
              {[
                ["名称", SERVICE_NAME],
                ["読み", BRAND_READING],
                ["ひとこと", BRAND_LINE],
                ["対象", "町工場・ものづくりの会社（1〜30人規模）"],
                ["運営", SERVICE_OPERATOR],
                ["版", "第2版　2026.11"],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b border-sumi/30 px-4 py-3 font-bold text-sumi/70">{k}</dt>
                  <dd className="border-b border-l border-sumi/30 px-4 py-3 font-bold">{v}</dd>
                </div>
              ))}
              <div className="col-span-2 flex flex-wrap gap-x-4 gap-y-1 px-4 py-3">
                {TOC.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className="text-sm font-bold underline-offset-4 hover:underline">
                    <span className={`${num} mr-1 text-indigo`}>{t.no}</span>
                    {t.label}
                  </a>
                ))}
              </div>
            </dl>
          </div>
        </section>

        {/* 01 伝わらない仕事 */}
        <Section id="work" no="01" kicker="伝わらない仕事" title="設備の一覧だけでは、伝わらない仕事がある。">
          <div className="grid border-2 border-sumi md:grid-cols-[1fr_1.6fr]">
            <div className="border-b-2 border-sumi p-5 md:border-b-0 md:border-r-2">
              <p className="text-sm font-bold text-sumi/70">よくある会社の紹介文</p>
              <ul className={`${kaku} mt-3 space-y-2 text-xl font-bold`}>
                {BRAND_GAP.common.map((c) => (
                  <li key={c} className="text-sumi/60 line-through decoration-danger decoration-2">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed">どれも本当のことです。でも、どの会社も同じことを書いているので、頼む人には違いがわかりません。</p>
            </div>
            <div>
              <div className="hidden grid-cols-2 border-b border-sumi bg-sumi text-sm font-bold text-paper sm:grid">
                <p className="px-4 py-2">頼む人が知りたいこと</p>
                <p className="border-l border-paper/30 px-4 py-2">記事で伝えること</p>
              </div>
              {BRAND_GAP.wanted.map((w, i) => (
                <Reveal key={w.q} delay={i * 0.06} className="grid border-b border-sumi/30 last:border-0 sm:grid-cols-2">
                  <p className="px-4 pt-3 font-bold leading-snug sm:py-3">{w.q}</p>
                  <p className="px-4 pb-3 pt-1 text-sm leading-relaxed sm:border-l sm:border-sumi/30 sm:py-3">
                    <span className="mr-1 font-bold text-indigo sm:hidden">→</span>
                    {w.a}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>

        {/* 02 話が記事になるまで */}
        <Section id="sample" no="02" kicker="話が記事になるまで" title="書かなくていい。仕事の話を、聞かせてください。">
          <div className="grid border-2 border-sumi md:grid-cols-2">
            <div className="border-b-2 border-sumi bg-[repeating-linear-gradient(transparent_0_31px,rgb(31_42_51/0.12)_31px_32px)] p-5 md:border-b-0 md:border-r-2">
              <p className="text-sm font-bold text-sumi/70">案内役との一問一答（{BRAND_SAMPLE.company}）</p>
              <ol className="mt-4 space-y-3">
                {BRAND_SAMPLE.talk.map((t, i) => (
                  <Reveal key={i} delay={i * 0.12}>
                    <li className={`flex items-start gap-2 ${t.who === "user" ? "flex-row-reverse" : ""}`}>
                      <span className={`grid h-9 w-11 shrink-0 place-items-center text-xs font-bold ${t.who === "guide" ? "bg-indigo text-white" : "bg-sumi text-paper"}`} aria-hidden>
                        {t.who === "guide" ? "聞き手" : "社長"}
                      </span>
                      <p className={`max-w-[85%] px-3 py-2 leading-relaxed ${t.who === "guide" ? "bg-white" : "border border-sumi bg-paper"}`}>
                        <span className="sr-only">{t.who === "guide" ? "聞き手：" : "社長："}</span>
                        {t.text}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
            <div className="bg-white p-5 sm:p-7">
              <p className="text-sm font-bold text-sumi/70">できあがった記事の一部（見本）</p>
              <h3 className={`${kaku} mt-3 text-2xl font-black leading-snug`}>{BRAND_SAMPLE.article.heading}</h3>
              <p className="mt-3 leading-loose">{BRAND_SAMPLE.article.body}</p>
              <p className="mt-4 border-l-4 border-brass pl-3 text-sm leading-relaxed">
                「1mm」「ステンレス」「治具」「点で付けて冷ます」。話の中にあった具体的な言葉が、AIにも、頼む人にも届く手がかりになります。書いてあるのは話してくれたことだけで、専門の言葉には説明を添えています。
              </p>
            </div>
          </div>
        </Section>

        {/* 03 AIと人 */}
        <Section id="ai" no="03" kicker="AIと人" title="AIが探し、人が決める。">
          <ol className="grid border-2 border-sumi md:grid-cols-3">
            {BRAND_STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.1} className={`p-5 ${i > 0 ? "border-t-2 border-sumi md:border-l-2 md:border-t-0" : ""}`}>
                <li>
                  <p className={`${num} text-4xl font-bold text-indigo`}>{s.no}</p>
                  <p className={`${kaku} mt-1 text-xl font-black`}>{s.title}</p>
                  <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-sumi/80">{BRAND_AI_NOTE}</p>
        </Section>

        {/* 04 理念とミッション */}
        <Section id="mission" no="04" kicker="理念とミッション" title="なぜやるのか。何をするのか。">
          <div className="space-y-10">
            {[
              { label: "理念", item: BRAND_PHILOSOPHY },
              { label: "ミッション", item: BRAND_MISSION },
            ].map(({ label, item }) => (
              <Reveal key={label} className="grid gap-3 border-t-2 border-sumi pt-5 md:grid-cols-[9rem_1fr]">
                <p className="font-bold text-indigo">{label}</p>
                <div>
                  <p className={`${kaku} text-[1.4rem] font-black leading-snug sm:text-4xl`}>
                    <Phrases text={item.title} />
                  </p>
                  {item.body.map((b) => (
                    <p key={b} className="mt-3 max-w-3xl leading-loose">
                      {b}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 05 記事づくりの約束 */}
        <Section id="promise" no="05" kicker="記事づくりの約束" title="書くこと、書かないこと。">
          <ol className="border-[3px] border-sumi bg-white">
            {BRAND_PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <li className="grid grid-cols-[3.5rem_1fr] border-b border-sumi/30 last:border-0 sm:grid-cols-[5rem_1fr]">
                  <span className={`${num} grid place-items-center border-r border-sumi/30 text-2xl font-bold text-indigo`}>{String(i + 1).padStart(2, "0")}</span>
                  <div className="px-4 py-4">
                    <p className={`${kaku} text-lg font-black leading-snug`}>{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-6 grid gap-6 border-t border-sumi/30 pt-5 md:grid-cols-[9rem_1fr]">
            <p className="font-bold text-indigo">話し方</p>
            <div>
              <p className="leading-relaxed">{BRAND_VOICE.summary}</p>
              <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                <List title="こう話す" mark="○" items={BRAND_VOICE.dos} tone="text-ok" />
                <List title="使わない" mark="×" items={BRAND_VOICE.donts} tone="text-danger" />
              </div>
            </div>
          </div>
        </Section>

        {/* 06 ロゴ */}
        <Section id="logo" no="06" kicker="ロゴ" title="現場の帳面に、しおりを一本。">
          <div className="grid border-2 border-sumi md:grid-cols-[1fr_1.1fr]">
            <div className="relative grid place-items-center border-b-2 border-sumi bg-white p-6 md:border-b-0 md:border-r-2">
              <ConstructionMark />
            </div>
            <div className="p-5 sm:p-7">
              <p className="leading-loose">{LOGO_STORY}</p>
              <ol className="mt-5 space-y-3">
                {LOGO_PARTS.map((p) => (
                  <li key={p.no} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-sumi/30 pt-3">
                    <span className={`${num} grid h-7 w-7 place-items-center border border-sumi text-sm font-bold`}>{p.no}</span>
                    <span>
                      <b className="block">{p.name}</b>
                      <span className="text-sm leading-relaxed">{p.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <h3 className="mt-10 text-lg font-black">ロゴの種類</h3>
          <LogoGrid items={LOGO_VARIANTS} />
          <h3 className="mt-10 text-lg font-black">色の種類</h3>
          <LogoGrid items={LOGO_COLORWAYS} />
        </Section>

        {/* 07 ロゴの使い方 */}
        <Section id="rules" no="07" kicker="ロゴガイドライン" title="ロゴの使い方">
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
        <Section id="colors" no="08" kicker="色と書体" title="藍と真鍮と、生成りの紙。">
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
                <p className={`text-2xl leading-snug sm:text-3xl ${f.font === "kaku" ? `${kaku} font-black` : f.font === "barlow" ? `${num} font-bold` : "font-bold"}`}>{f.sample}</p>
                <p className="text-sm">
                  <b className="block">{f.name}</b>
                  <span className="text-sumi/70">
                    {f.weight}・{f.use}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-sumi/80">どれも無料で使える書体です（Google Fonts）。</p>
        </Section>

        {/* 09 ダウンロード */}
        <Section id="download" no="09" kicker="ダウンロード" title="ロゴのデータ">
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
            ホームページや資料にはSVG、WordやPowerPointにはPNGが便利です。ご利用の会社が「{SERVICE_NAME}で記事を書いています」と紹介してくださるときも、このページのルールでお使いください。わからないことは
            <Link href="/welcome#faq" className="font-bold text-indigo underline underline-offset-4">
              よくある質問
            </Link>
            からどうぞ。
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
  { file: "logo-horizontal-ink", label: "横組み（墨1色）", formats: ["svg", "png"] },
  { file: "logo-vertical", label: "縦組み（カラー）", formats: ["svg", "png"] },
  { file: "logo-vertical-white", label: "縦組み（白1色）", formats: ["svg", "png"] },
  { file: "logo-mark", label: "マーク（カラー）", formats: ["svg", "png"] },
  { file: "logo-mark-white", label: "マーク（白1色）", formats: ["svg", "png"] },
  { file: "logo-mark-ink", label: "マーク（墨1色）", formats: ["svg", "png"] },
  { file: "favicon-16", label: "マーク（16px・タブ専用）", formats: ["svg", "png"] },
  { file: "app-icon", label: "アプリのアイコン", formats: ["svg", "png"] },
];

/** 「、」「。」のあとで折り返す（ことばの途中の改行を防ぐ） */
function Phrases({ text }: { text: string }) {
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

/** マークの作図（寸法線つき）。public/brand/logo-mark.svg と同じ形 */
function ConstructionMark() {
  return (
    <svg viewBox="-14 -14 148 148" className="mx-auto h-auto w-full max-w-[19rem]" role="img" aria-label="マークの作図。本体は幅70・高さ100、しおりは下に12はみ出す">
      <defs>
        <pattern id="grid5" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="#1f2a33" strokeOpacity=".08" strokeWidth=".4" />
        </pattern>
      </defs>
      <rect x="-14" y="-14" width="148" height="148" fill="url(#grid5)" />
      <image href="/brand/logo-mark.svg" x="0" y="0" width="120" height="120" />
      <g stroke="#1e4f7c" strokeWidth=".6" fill="none">
        <path d="M25 112v8M95 112v8M25 118h70" />
        <path d="M14 4h8M14 104h8M17 4v100" />
        <path d="M47 21h36v18H47z" strokeDasharray="2 1.5" />
        <path d="M100 86h8M100 116h8M104 86v30" />
      </g>
      <g fill="#1e4f7c" fontSize="6" fontWeight="700" fontFamily="var(--font-barlow), sans-serif" textAnchor="middle">
        <text x="60" y="127">70</text>
        <text x="9" y="56" transform="rotate(-90 9 56)">100</text>
        <text x="113" y="103">+12</text>
        <text x="65" y="17">表題欄 36×18</text>
      </g>
    </svg>
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
