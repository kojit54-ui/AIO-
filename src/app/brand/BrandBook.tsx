"use client";

// ブランドとロゴ（/brand）第2版。文面は src/lib/brandBook.ts、正本は docs/BRAND.md。ロゴは public/brand/。
// 2026-11-07 田村さん「クオリティ低い。AIっぽい」→ 3AIの批評をうけて作り直した。
// 見た目の決まり：生成りの紙に墨の罫線、角は丸めない（最大2px）、絵文字は使わない、番号と寸法線で組む。
// 「世界観を見せる」より「頼む前の不安に答える」順番（仕事 → 見本 → AIと人 → 理念 → 約束 → 運営 → ロゴの意味）。
// 2026-11-08 田村さん「このコンテンツは誰向け？」→ 読者は製造業の社長。ロゴの種類・決まり・色番号・書体・ダウンロード一覧は /brand/logo へ移した。

/* eslint-disable @next/next/no-img-element -- ロゴの見本は固定のSVG。崩しの見本もそのまま見せたい */

import Link from "next/link";
import { Reveal } from "@/components/landing";
import { SiteFooter, SiteHeader } from "@/components/site";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import {
  BRAND_AI_NOTE,
  BRAND_AIO_NOTE,
  BRAND_BODY,
  BRAND_BODY_CLOSE,
  BRAND_COLORS,
  BRAND_DESCRIPTOR,
  BRAND_ESSENCE,
  BRAND_ESSENCE_NOTE,
  BRAND_GAP,
  BRAND_HOW,
  BRAND_LEDGER,
  BRAND_LINE,
  BRAND_MISSION,
  BRAND_OPERATOR,
  BRAND_PHILOSOPHY,
  BRAND_PROMISE_HEADING,
  BRAND_PROMISES,
  BRAND_READING,
  BRAND_SAMPLE,
  BRAND_SECRETS,
  BRAND_STEPS,
  LOGO_PARTS,
  LOGO_STORY,
} from "@/lib/brandBook";
import { COMPANY, PRICE_LABEL } from "@/lib/about";

/** 色の意味（社長向け。色の番号は /brand/logo に） */
const COLOR_MEANING: Record<string, string> = {
  藍: "作業着や図面の青。長く使える道具の色",
  真鍮: "しおりの色。選ばれた所の目じるし",
  生成り: "帳面の紙。記事を書きためる地",
  墨: "書き込む文字と罫線",
};

const kaku = "font-[family-name:var(--font-kaku)]";
const num = "font-[family-name:var(--font-barlow)] tracking-wide";

const TOC = [
  { id: "work", no: "01", label: "伝わらない仕事" },
  { id: "sample", no: "02", label: "話が記事になるまで" },
  { id: "ai", no: "03", label: "AIと人" },
  { id: "mission", no: "04", label: "芯・理念・ミッション" },
  { id: "promise", no: "05", label: "記事づくりの約束" },
  { id: "operator", no: "06", label: "運営について" },
  { id: "logo", no: "07", label: "ロゴに込めた考え" },
];

const KANJI = ["一", "二", "三", "四", "五"];

export function BrandBook() {
  return (
    <div className="overflow-x-clip bg-paper text-sumi">
      <SiteHeader />
      <main className={`${kaku} mx-auto max-w-5xl px-4 pb-16 pt-6 font-medium sm:px-6 sm:pt-10`}>
        {/* 表紙：図面の表題欄の形 */}
        <section className="border-2 border-sumi bg-paper">
          <div className="grid md:grid-cols-[1.35fr_1fr]">
            <div className="p-5 sm:p-10">
              <img src="/brand/logo-horizontal.svg" alt={SERVICE_NAME} width={483} height={120} className="h-auto w-64 sm:w-80" />
              <h1 className={`${kaku} mt-8 text-[1.9rem] font-black leading-[1.35] sm:text-5xl`}>
                <Phrases text={BRAND_LINE} />
              </h1>
              <p className="mt-4 text-base leading-7 sm:text-lg sm:leading-relaxed">
                <Phrases text={BRAND_DESCRIPTOR} lines />
              </p>
            </div>
            <dl className="grid grid-cols-[6.5rem_1fr] grid-rows-[repeat(5,auto)_1fr] border-t-2 border-sumi text-sm md:border-l-2 md:border-t-0">
              {[
                ["対象", "製造業の一人親方〜30人の会社"],
                ["形式", "招待制のWebサービス"],
                ["発行", "毎月1本から10本まで、自社のホームページへ"],
                ["料金", "月額50,000円（税抜。税込55,000円）"],
                ["運営", SERVICE_OPERATOR],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b border-sumi/30 px-4 py-3 font-bold text-sumi/70">{k}</dt>
                  <dd className="border-b border-l border-sumi/30 px-4 py-3 font-bold">{v}</dd>
                </div>
              ))}
              <nav aria-label="このページの目次" className="col-span-2 hidden px-4 py-4 md:block">
                <p className="text-sm font-bold text-sumi/70">目次</p>
                <ol className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {TOC.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-sm font-bold underline-offset-4 hover:underline">
                        <span className={`${num} mr-1.5 text-indigo`}>{t.no}</span>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <details className="group col-span-2 md:hidden">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-bold [&::-webkit-details-marker]:hidden">
                  このページの目次
                  <span className={`${num} text-xl text-indigo group-open:hidden`} aria-hidden>
                    ＋
                  </span>
                  <span className={`${num} hidden text-xl text-indigo group-open:inline`} aria-hidden>
                    －
                  </span>
                </summary>
                <ul className="border-t border-sumi/30">
                  {TOC.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="flex min-h-11 items-center border-b border-sumi/15 px-4 font-bold">
                        <span className={`${num} mr-2 text-indigo`}>{t.no}</span>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </dl>
          </div>
        </section>

        {/* はじめに：ボディコピー */}
        <section className="mt-12 grid gap-6 md:grid-cols-[9rem_1fr]">
          <p className="font-bold text-indigo">はじめに</p>
          <div className="max-w-3xl">
            {BRAND_BODY.map((b) => (
              <p key={b} className="mb-4 text-[1.05rem] leading-loose">
                {b}
              </p>
            ))}
            <p className="mb-4 text-sm leading-relaxed text-sumi/80">{BRAND_AIO_NOTE}</p>
            <p className={`${kaku} mt-6 border-l-[6px] border-brass pl-4 text-xl font-black leading-relaxed sm:text-2xl`}>
              <Phrases text={BRAND_BODY_CLOSE} />
            </p>
          </div>
        </section>

        {/* 01 伝わらない仕事 */}
        <Section id="work" no="01" kicker="伝わらない仕事" title="設備の一覧だけでは、伝わらない仕事がある。">
          <div className="grid border-2 border-sumi md:grid-cols-[1fr_1.6fr]">
            <div className="border-b-2 border-sumi p-5 md:border-b-0 md:border-r-2">
              <p className="text-sm font-bold text-sumi/70">この言葉だけでは、まだ伝わらないこと</p>
              <ul className={`${kaku} mt-3 space-y-1 text-lg font-bold leading-[1.9]`}>
                {BRAND_GAP.common.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed">どれも大切な強みです。ただ、この言葉だけでは、頼む人は「自分の仕事を頼めるか」まで判断できません。</p>
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
              <p className="mt-1 text-sm">{BRAND_HOW}答えやすい方法で話せます。</p>
              <ol className="mt-4 space-y-3 font-[family-name:var(--font-maru)]">
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
              <h3 className={`${kaku} mt-3 text-2xl font-black leading-snug`}>
                <Phrases text={BRAND_SAMPLE.article.heading} />
              </h3>
              <p className="mt-3 leading-loose">{BRAND_SAMPLE.article.body}</p>
              <p className="mt-4 border-l-4 border-brass pl-3 text-sm leading-relaxed">
                「1mm」「ステンレス」「治具」「点で付けて冷ます」。話の中にあった具体的な言葉が、AIにも、頼む人にも届く手がかりになります。社長の話をもとに、仕事の内容や条件を変えずに記事にしています。専門の言葉には説明を添えています。
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
        <Section id="mission" no="04" kicker="芯・理念・ミッション" title="なぜやるのか。何をするのか。">
          <div className="space-y-10">
            <Reveal className="grid gap-3 border-2 border-sumi bg-white p-5 md:grid-cols-[9rem_1fr] md:p-7">
              <p className="font-bold text-indigo">ブランドの芯</p>
              <div>
                <p className={`${kaku} text-[1.4rem] font-black leading-snug sm:text-4xl`}>
                  <Phrases text={BRAND_ESSENCE} />
                </p>
                <p className="mt-3 max-w-3xl leading-loose">{BRAND_ESSENCE_NOTE}</p>
              </div>
            </Reveal>
            {[
              { label: "理念", item: BRAND_PHILOSOPHY },
              { label: "ミッション", item: BRAND_MISSION },
              { label: "「帳」とは", item: { title: BRAND_LEDGER.title, body: [BRAND_LEDGER.body] } },
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
        <Section id="promise" no="05" kicker="記事づくりの約束" title={BRAND_PROMISE_HEADING}>
          <ol className="border-[3px] border-sumi bg-white">
            {BRAND_PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <li className="grid grid-cols-[3.5rem_1fr] border-b border-sumi/30 last:border-0 sm:grid-cols-[5rem_1fr]">
                  <span className={`${kaku} grid place-items-center border-r border-sumi/30 text-2xl font-black text-indigo`}>{KANJI[i]}</span>
                  <div className="px-4 py-4">
                    <p className={`${kaku} text-lg font-black leading-snug`}>{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed">{p.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-6 grid gap-3 border-l-4 border-brass bg-white p-5 md:grid-cols-[9rem_1fr]">
            <p className="font-bold text-indigo">話してよい範囲</p>
            <div>
              <p className={`${kaku} text-lg font-black leading-snug`}>{BRAND_SECRETS.title}</p>
              <p className="mt-1 text-sm leading-relaxed">{BRAND_SECRETS.text}</p>
            </div>
          </div>
        </Section>

        {/* 06 運営について */}
        <Section id="operator" no="06" kicker="運営について" title={BRAND_OPERATOR.title}>
          <div className="grid gap-6 md:grid-cols-[9rem_1fr]">
            <p className="font-bold text-indigo">{SERVICE_OPERATOR}</p>
            <div className="max-w-3xl">
              {BRAND_OPERATOR.body.map((b) => (
                <p key={b} className="mb-4 leading-loose">
                  {b}
                </p>
              ))}
              <dl className="mt-2 grid grid-cols-[6.5rem_1fr] border-y border-sumi text-sm">
                {[
                  ["代表", COMPANY.representative],
                  ["所在地", `〒${COMPANY.postalCode} ${COMPANY.address}`],
                  ["電話", COMPANY.telephone],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="border-b border-sumi/30 py-2 font-bold text-sumi/70 last-of-type:border-0">{k}</dt>
                    <dd className="border-b border-sumi/30 py-2 font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm">
                <Link href="/about" className="font-bold text-indigo underline underline-offset-4">
                  運営会社と編集方針
                </Link>
                も、あわせてご覧ください。
              </p>
            </div>
          </div>

          {/* 次の一歩：入口ページへ（押す所だけ明るい青） */}
          <div className="mt-10 border-2 border-sumi bg-white p-5 sm:p-7">
            <p className={`${kaku} text-xl font-black leading-snug sm:text-2xl`}>
              <Phrases text="実際の画面・料金・はじめ方は、ご案内のページにまとめています。" />
            </p>
            <p className="mt-2 text-sm leading-relaxed">料金は{PRICE_LABEL}です。</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/welcome" className="btn-primary min-h-12 px-6 text-base">
                サービスのご案内を見る
              </Link>
              <Link href="/try?mode=quick" className="min-h-11 content-center font-bold text-brand underline underline-offset-4">
                登録せずに、記事の書き出しを試す
              </Link>
            </div>
          </div>
        </Section>

        {/* 07 帳面に込めた考え（ロゴの意味と色。作業用の決まりは /brand/logo へ） */}
        <Section id="logo" no="07" kicker="ロゴに込めた考え" title="現場の帳面に、しおりを一本。">
          <div className="grid border-2 border-sumi md:grid-cols-[1fr_1.1fr]">
            <div className="relative grid place-items-center border-b-2 border-sumi bg-white p-6 md:border-b-0 md:border-r-2">
              <img src="/brand/logo-mark.svg" alt="AIOえらばれ帳のマーク（藍の帳面に真鍮のしおり）" width={160} height={160} className="h-auto w-40 sm:w-48" />
            </div>
            <div className="p-5 sm:p-7">
              <dl className="mb-5 grid grid-cols-[4rem_1fr] border-y border-sumi text-sm">
                <dt className="border-b border-sumi/30 py-2 font-bold text-sumi/70">名称</dt>
                <dd className="border-b border-sumi/30 py-2 font-bold">{SERVICE_NAME}</dd>
                <dt className="py-2 font-bold text-sumi/70">読み</dt>
                <dd className="py-2 font-bold">{BRAND_READING}</dd>
              </dl>
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
          <ul className="mt-6 grid grid-cols-2 border-l border-t border-sumi sm:grid-cols-4">
            {BRAND_COLORS.slice(0, 4).map((c) => (
              <li key={c.hex} className="border-b border-r border-sumi bg-white">
                <span className="block h-12" style={{ background: c.hex }} aria-hidden />
                <span className="block p-3">
                  <b className="block">{c.name}</b>
                  <span className="mt-1 block text-sm leading-snug">{COLOR_MEANING[c.name] ?? c.role}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* ロゴをお使いになる方へ（作業用の情報は別ページ） */}
          <div className="mt-12 border-t-2 border-sumi pt-6">
            <p className="font-black">ロゴをお使いになる方へ</p>
            <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed">
                すべての種類のロゴ（SVG・PNG）を1つにまとめています。使い方の決まりは
                <Link href="/brand/logo" className="mx-1 font-bold text-indigo underline underline-offset-4">
                  ロゴの使い方
                </Link>
                のページにあります。
              </p>
              <a href="/brand/aio-erabare-logo.zip" download className="inline-flex min-h-12 shrink-0 items-center border-2 border-sumi bg-paper px-5 font-bold">
                ロゴをダウンロード（ZIP）
              </a>
            </div>
            <p className={`${num} mt-8 border-t border-sumi/30 pt-3 text-sm text-sumi/70`}>第3版　2026年11月</p>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

/** 「、」「。」のあとで折り返す（ことばの途中の改行を防ぐ） */
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
