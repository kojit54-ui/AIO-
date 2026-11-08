"use client";

// 入口のページ（サービスのご紹介）。ログインしていない人が最初に見る。
// 2026-11-07 田村さん「ブランドページとサービスサイトに乖離がある。目的は登録してもらうこと」→ GPT・Gemini・Claude で2回対話し、
// 合意案で作り直した（/mnt/project-files/brand-book/lp-discussion.md、docs/DECISIONS.md）。
// - 約束はブランド（docs/BRAND.md「頼む人に、正直な帳面を。」）にそろえる。「AIに選ばれた！」のような成果の先取りはしない
// - 外側はブランドの紙面（生成り・藍・角ゴシック・罫線、絵文字なし）。キャラ・スタンプ・明るい青は「画面の見本」の枠の中と、押すボタンだけ
// - 手順は「答える → 確かめて直す → 公開する」。料金と条件は隠さない（src/lib/legal.ts と同じ）
// - いまは招待制なので、新規の方には「登録せずに試す」と「新規受付の案内（メール）」を出す。「さっそく始める」で行き止まりにしない

import { serviceJsonLd } from "@/lib/about";
import { SiteFooter, SiteHeader, useStartLink } from "@/components/site";
import { FAQ } from "@/lib/faq";
import { COLUMNS } from "@/lib/column";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shiori } from "@/components/fun";
import { Reveal, useInView } from "@/components/landing";
import { Typed } from "@/components/talk";
import { BRAND_GAP, BRAND_LINE, BRAND_PROMISES, BRAND_SAMPLE } from "@/lib/brandBook";
import { TRY_HREF } from "@/lib/signup";
import { WaitlistForm } from "@/components/WaitlistForm";
import { AIO_CHECK_LIST } from "@/lib/aioCheck";
import { ARTICLES_PER_MONTH_LABEL } from "@/lib/articleQuota";
import type { MfgShowcase } from "@/lib/manufacturing";

const kaku = "font-[family-name:var(--font-kaku)]";
const num = "font-[family-name:var(--font-barlow)] tracking-wide";
const maru = "font-[family-name:var(--font-maru)]";

const KANJI = ["一", "二", "三", "四", "五"];

export function Welcome({ makers }: { makers: MfgShowcase }) {
  const { signedIn, href } = useStartLink();
  return (
    <div className="overflow-x-clip bg-paper text-sumi">
      <SiteHeader />
      <main className={`${kaku} font-medium`}>
        <Hero signedIn={signedIn} href={href} />
        <Gap />
        <AiChat />
        <Focus total={makers.total} industries={makers.industries} />
        <StrengthBook />
        <Steps />
        <Included total={makers.total} industries={makers.industries} />
        <KeepGoing />
        <Promises />
        <Price />
        <Faq />
        <ColumnTeaser />
        <FinalCall signedIn={signedIn} href={href} />
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ id, kicker, title, children, tone = "paper" }: { id?: string; kicker: string; title: string; children: React.ReactNode; tone?: "paper" | "white" }) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-sumi/15 py-14 sm:py-20 ${tone === "white" ? "bg-white" : ""}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="text-sm font-bold text-indigo">{kicker}</p>
          <h2 className={`${kaku} mt-2 text-[1.6rem] font-black leading-snug sm:text-4xl`}>
            <Phrases text={title} />
          </h2>
        </Reveal>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

/** 句読点の後ろでだけ折り返す */
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

/** 押せるボタンの組。主は「登録せずに試す」。いまは新規受付の前なので、案内とログインを添える */
function SubLinks({ dark = false }: { dark?: boolean }) {
  const sub = dark ? "text-paper underline decoration-paper/50" : "text-indigo underline decoration-indigo/40";
  return (
    <p className={`flex flex-col gap-y-2 text-sm font-bold sm:flex-row sm:flex-wrap sm:gap-x-5 ${dark ? "text-paper" : ""}`}>
      <a href="#notify" className={`py-1 underline-offset-4 ${sub}`}>
        新規受付の案内を受け取る
      </a>
      <Link href="/login" className={`py-1 underline-offset-4 ${sub}`}>
        招待された方・ご利用中の方はログイン
      </Link>
    </p>
  );
}

/** しおりのひとこと（2026-11-08 3者の合意：枠の外で喋るのは、しおり1人・5か所まで。吹き出しは見えたときに1回だけ出る） */
function Says({ text, big = false }: { text: string; big?: boolean }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.6);
  return (
    <div ref={ref} className="flex items-end gap-2.5">
      {/* 胸から上だけを見せる */}
      <span className={`block shrink-0 overflow-hidden ${big ? "h-[72px] sm:h-36" : "h-14 sm:h-16"}`} aria-hidden>
        <Shiori mood="ask" as="shiori" className={`${big ? "h-[180px] sm:h-[360px]" : "h-[140px] sm:h-[160px]"} w-auto max-w-none`} />
      </span>
      <p
        className={`${maru} relative mb-1.5 w-fit max-w-md rounded-2xl rounded-bl-sm border-2 border-brand-soft bg-white px-4 py-2.5 font-bold leading-relaxed text-ink shadow-sm ${big ? "text-[0.95rem] sm:text-base" : "text-sm sm:text-[0.95rem]"} ${seen ? "animate-bubble" : "opacity-0"}`}
        style={{ transformOrigin: "left bottom" }}
      >
        <span className="sr-only">しおり：</span>
        {text}
      </p>
    </div>
  );
}

function MainButton({ signedIn, href }: { signedIn: boolean; href: string }) {
  if (signedIn)
    return (
      <Link href={href} className="btn-primary min-h-14 px-7 text-lg">
        続きから書く <span aria-hidden>→</span>
      </Link>
    );
  return (
    <Link href={TRY_HREF} className="btn-primary min-h-14 w-full px-4 text-[1.05rem] sm:w-auto sm:px-7 sm:text-lg">
      登録せずに、記事の書き出しを試す <span aria-hidden>→</span>
    </Link>
  );
}

/** スマホでは「見出し→ボタン→見本→ほかの入口と料金」の順。PCは左に文、右に見本 */
function Hero({ signedIn, href }: { signedIn: boolean; href: string }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-x-10 gap-y-7 px-4 pb-14 pt-4 sm:px-6 md:grid-cols-[1.05fr_1fr] md:pb-20 md:pt-14">
      <div className="md:self-end">
        <p className="inline-block border-b-2 border-sumi pb-1 text-sm font-bold">製造業の一人親方〜30人の会社へ</p>
        <h1 className={`${kaku} mt-4 text-[2rem] font-black leading-[1.35] sm:text-[3.1rem]`}>
          <span className="block">仕事の話に</span>
          <span className="block">答えるだけ。</span>
          <span className="mt-1 block text-[1.55rem] leading-snug sm:text-[2.3rem]">
            <span className="inline-block">毎月1本から、</span>
            <span className="inline-block">自社サイトの記事に。</span>
          </span>
        </h1>
        <p className="mt-3 max-w-xl text-base leading-[1.7] sm:mt-5 sm:text-[1.05rem] sm:leading-loose">
          <span className="inline-block">案内役の質問に答えると、</span>
          <span className="inline-block">AIが記事の下書きに。</span>
          <span className="inline-block">確かめて直し、</span>
          <span className="inline-block">自社サイトで公開します。</span>
        </p>
        <p className="mt-2 text-sm font-bold text-sumi/70 sm:mt-3">{BRAND_LINE}</p>
        {!signedIn && (
          <div className="mt-3 sm:mt-5">
            <Says big text="パソコンが苦手でも大丈夫。いつもの言葉で、お仕事の話を聞かせてください。" />
          </div>
        )}
        <div className="mt-4">
          <MainButton signedIn={signedIn} href={href} />
          {!signedIn && <p className="mt-2 text-sm leading-[1.6] text-sumi/80">会社のこと3項目＋仕事の話1問で、記事の書き出しを試せます。対応する端末なら、声でも答えられます。</p>}
        </div>
      </div>
      <div className="md:col-start-2 md:row-span-2 md:row-start-1 md:self-center">
        <SampleScreen />
      </div>
      {!signedIn && (
        <div className="space-y-4 md:self-start">
          <SubLinks />
          <p className="border-t border-sumi/20 pt-3 text-sm leading-relaxed text-sumi/80">
            月額50,000円（税抜）。新規のお申し込みは準備中です。
            <a href="#price" className="ml-1 font-bold text-indigo underline underline-offset-4">
              料金とお試し
            </a>
          </p>
        </div>
      )}
    </section>
  );
}

/** 画面の見本：社長の答えから、記事ができるまで。枠の中だけ、サービスの画面の見た目（明るい青・丸ゴシック・案内役） */
function SampleScreen() {
  const talk = BRAND_SAMPLE.talk.slice(2);
  return (
    <figure className="overflow-hidden rounded-2xl border border-sumi/25 bg-white shadow-[0_10px_30px_-12px_rgba(31,42,51,0.35)]">
      <figcaption className="flex items-center justify-between border-b border-sumi/20 px-4 py-2 text-xs font-bold">
        <span>画面の見本</span>
        <span className="text-sumi/60">{BRAND_SAMPLE.company}</span>
      </figcaption>
      <div className={`${maru} space-y-3 bg-canvas px-4 py-4`}>
        {talk.map((t, i) =>
          t.who === "guide" ? (
            <div key={i} className="flex items-end gap-2">
              <Shiori mood="ask" as="shiori" className="h-14 w-auto shrink-0" />
              <p className="rounded-2xl rounded-bl-md border-2 border-line bg-surface px-3 py-2 font-bold leading-relaxed">{t.text}</p>
            </div>
          ) : (
            <p key={i} className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-brand px-3 py-2 font-bold leading-relaxed text-white">
              <span className="sr-only">社長・担当者：</span>
              {t.text}
            </p>
          ),
        )}
      </div>
      <p className="border-y border-sumi/30 bg-paper px-4 py-1.5 text-center text-xs font-bold text-sumi/70">↓ AIが記事に。社長や担当の方が確かめてから公開</p>
      <div className="px-5 py-4">
        <p className="text-xs font-bold text-sumi/60">できあがった記事の一部（見本）</p>
        <p className={`${kaku} mt-1 text-lg font-black leading-snug`}>
          <Phrases text={BRAND_SAMPLE.article.heading} />
        </p>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed">{BRAND_SAMPLE.article.body}</p>
      </div>
      <div className="flex items-center gap-3 border-t border-sumi/20 px-4 py-2.5">
        <span className="flex shrink-0 -space-x-2" aria-hidden>
          {["shiori", "gen", "koyuki"].map((g) => (
            // eslint-disable-next-line @next/next/no-img-element -- 小さな固定の絵
            <img key={g} src={`/guide/${g}-face.webp`} width={192} height={192} alt="" className="h-9 w-9 rounded-full border-2 border-white bg-sky object-cover" />
          ))}
        </span>
        <span className="text-sm font-bold">案内役は3タイプから選べます</span>
      </div>
    </figure>
  );
}

/** 設備の一覧だけでは伝わらない（ブランドページの01と同じ中身） */
function Gap() {
  return (
    <Section kicker="なぜ記事なのか" title="設備の一覧だけでは、伝わらない仕事がある。" tone="white">
      <div className="grid border-2 border-sumi md:grid-cols-[1fr_1.6fr]">
        <div className="border-b-2 border-sumi bg-paper p-5 md:border-b-0 md:border-r-2">
          <p className="text-sm font-bold text-sumi/70">この言葉だけでは、まだ伝わらないこと</p>
          <ul className="mt-3 space-y-1 text-lg font-bold leading-[1.9]">
            {BRAND_GAP.common.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed">どれも大切な強みです。ただ、この言葉だけでは、頼む人は「自分の仕事を頼めるか」まで判断できません。</p>
        </div>
        <div>
          <p className="bg-sumi px-4 py-2 text-sm font-bold text-paper sm:hidden">頼む人が知りたいこと → 記事で伝えること</p>
          <div className="hidden grid-cols-2 bg-sumi text-sm font-bold text-paper sm:grid">
            <p className="px-4 py-2">頼む人が知りたいこと</p>
            <p className="border-l border-paper/30 px-4 py-2">記事で伝えること</p>
          </div>
          {BRAND_GAP.wanted.map((w) => (
            <div key={w.q} className="grid border-b border-sumi/30 last:border-0 sm:grid-cols-2">
              <p className="px-4 pt-3 font-bold leading-snug sm:py-3">{w.q}</p>
              <p className="px-4 pb-3 pt-1 text-sm leading-relaxed sm:border-l sm:border-sumi/30 sm:py-3">
                <span className="mr-1 font-bold text-indigo sm:hidden">→</span>
                {w.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

const ASK = "愛知で、金属の部品を10個だけ作ってくれる会社はある？";
const ANSWER = "小さな数の試作を受けている会社として、〇〇製作所があります。ホームページの記事で、10個からの試作を受けた例と、そのときの進め方を紹介しています。";

/** 発注先をAIに相談する人の画面（イメージ）。見えたら1回だけ流れる */
function AiChat() {
  const [ref, seen] = useInView<HTMLDivElement>(0.35);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!seen || step !== 0) return;
    const t = setTimeout(() => setStep(1), 300);
    return () => clearTimeout(t);
  }, [seen, step]);
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => setStep(3), 1200);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <Section id="ai" kicker="AIと人" title="AIが候補を探し、人が記事を読んで決める。">
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div className="space-y-4 leading-loose">
          <p>発注先を探すとき、検索だけでなく、AIに相談する人も出てきました。AIは、ホームページに書かれた具体的な仕事の記録を、候補を探す手がかりにします。</p>
          <p>そして最後に「ここに頼もう」と決めるのは、記事を読んだ人です。できる材質や数量、工夫や条件が書いてあれば、相談するかどうかを判断できます。</p>
          <p className="border-l-4 border-indigo pl-3 text-sm font-bold">AIの回答で紹介されることや、問い合わせが増えることは約束できません。</p>
        </div>
        <div ref={ref} className="border-2 border-sumi bg-white">
          <p className="border-b-2 border-sumi px-4 py-2 text-xs font-bold">AIに相談している画面（イメージ）</p>
          <p className="sr-only">
            相談する人：{ASK} AI：{ANSWER}
          </p>
          <div className={`${maru} min-h-56 space-y-3 bg-canvas p-4`} aria-hidden>
            {step >= 1 && (
              <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-brand px-3 py-2 font-bold text-white">
                {step === 1 ? <Typed text={ASK} speed={40} delay={150} onDone={() => setTimeout(() => setStep(2), 300)} /> : ASK}
              </div>
            )}
            {step >= 2 && (
              <div className="w-fit max-w-[92%] rounded-2xl rounded-tl-md border-2 border-line bg-surface px-3 py-2 leading-relaxed">
                {step === 2 ? (
                  <span className="inline-flex gap-1 py-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-dot rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                ) : (
                  <Typed text={ANSWER} speed={26} delay={80} />
                )}
              </div>
            )}
          </div>
          <p className="border-t border-sumi/30 px-4 py-2 text-xs text-sumi/70">紹介するかはAIが、頼むかは読んだ人が決めます。</p>
        </div>
      </div>
    </Section>
  );
}

const STEPS = [
  { who: "社長・担当者", title: "質問に答える", text: "案内役が、なぜ聞くのかを添えて1問ずつ聞きます。文字でも声でも、写真1枚からでも。わからない質問は飛ばせます。" },
  { who: "AI", title: "記事にまとめる", text: `答えから記事を書き、${AIO_CHECK_LIST.length}項目の「AIOのチェック」で見直します。足りない所は、案内役が聞き返します。` },
  { who: "社長・担当者", title: "確かめて、載せる", text: "読んで、直してから、自社のホームページにご自身で載せます。自動投稿ではありません。載せ方は1ステップずつ案内します。" },
];

/** 製造業だけにしぼっている理由。根拠のある言い方だけにする（数は知識表から） */
function Focus({ total, industries }: { total: number; industries: number }) {
  const rows = [
    {
      t: "聞くことが、決まっている",
      d: "材質・大きさ・数量・精度・納期・できない条件。頼む人が判断に使うことを、案内役が順に聞きます。聞き方のもとは、コタムが2011年から中小企業のホームページづくりで重ねてきた聞き取りです。受けた相談・工夫・納め方を答えれば、そのまま仕事の事例の記事になります。",
    },
    {
      t: `コタム独自の製造業データベース ${total.toLocaleString()}件`,
      d: `切削・板金・樹脂成形・金型など${industries}業種の悩みと、発注する人の疑問・決め手・つまずく言葉を、コタムが読み解き、業種と使いみちごとに仕分けた独自のデータベースです。案内役の質問の例、書く記事の案、AIが書くときと点検するときの決まりに組み込んであり、毎週2回、新しい事例を足しています。`,
    },
    {
      t: "記事が、同じ方向にたまる",
      d: "書く記事は、受けたい仕事から決めます。毎月の記事がそろうほど、「この会社は何が得意か」が、読む人にもAIにも伝わりやすくなります。",
    },
  ];
  return (
    <Section kicker="なぜ製造業だけなのか" title="製造業の仕事に、しぼっています。" tone="white">
      <p className="max-w-3xl leading-loose">「何でもできます」より「この仕事なら、ここ」と言える会社のほうが、頼む人にもAIにも選ぶ理由が伝わります。だから、このサービスも製造業にしぼりました。</p>
      <ol className="mt-6 grid border-2 border-sumi md:grid-cols-3">
        {rows.map((r, i) => (
          <li key={r.t} className={`p-5 ${i > 0 ? "border-t-2 border-sumi md:border-l-2 md:border-t-0" : ""}`}>
            <p className={`${num} text-sm font-bold text-indigo`}>0{i + 1}</p>
            <p className="mt-1 text-lg font-bold leading-snug">{r.t}</p>
            <p className="mt-2 text-sm leading-relaxed">{r.d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** 強みの帳面。言えるのは「自分で作って持てる」まで（他社との比較・価格・「勝る」は出さない。DECISIONS 2026-11-08） */
function StrengthBook() {
  const rows: [string, string][] = [
    ["得意なこと", "例：図面の無い部品の、1個からの作り直し"],
    ["お客様と困りごと", "例：古い設備の保全担当／交換部品が手に入らない"],
    ["強み・根拠・数字", "例：図面が無くても作れる／現物を測って図面を起こす／この10年で約300点"],
    ["選ばれる決め手", "例：見積もりの前に、現物を見に行く"],
    ["うちらしい書き方", "例：ですます調。専門用語にはひとこと説明。「業界最安」「絶対」は使わない"],
  ];
  return (
    <Section kicker="強みの帳面" title="強みの文と、自社専用の書き方を、自分で持てる。">
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-start">
        <div className="space-y-4 leading-loose">
          <p>会社の得意なことや選ばれる理由をまとめた「強みの文」と、伝え方をそろえる「自社専用の書き方」。案内役の質問に答えながら自分で作り、毎月の記事づくりで育てていけます。</p>
          <p>AIが下書きし、足りない所は案内役が1問ずつ聞きます。下書きのままの帳面は使いません。社長や担当の方が確かめて保存した帳面を、記事を書くAI・点検するAI・AIOのチェック・記事の提案に、毎回「この会社だけの指示」として渡します。</p>
          <p className="border-l-4 border-indigo pl-3 text-sm leading-relaxed">対面での聞き取りや、ホームページの技術的な直し、AIの回答での表示の計測はしていません。月額50,000円（税抜。税込55,000円）に含まれます。</p>
        </div>
        <div className="border-2 border-sumi bg-white">
          <p className="flex items-center justify-between border-b-2 border-sumi px-4 py-2 text-xs font-bold">
            <span>画面の見本</span>
            <span className="text-sumi/60">見本：架空の金属加工会社</span>
          </p>
          <dl className="text-sm">
            {rows.map(([k, v], i) => (
              <div key={k} className={`grid grid-cols-[7.5rem_1fr] ${i > 0 ? "border-t border-sumi/30" : ""}`}>
                <dt className="px-4 py-3 font-bold text-sumi/70">{k}</dt>
                <dd className="border-l border-sumi/30 px-4 py-3 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

function Steps() {
  return (
    <Section id="how" kicker="毎月やること" title="答える。確かめる。自社サイトに載せる。" tone="white">
      <div className="mb-5">
        <Says text="専門の言葉のままで大丈夫。聞き足りない所は、私から聞きますね。" />
      </div>
      <ol className="grid border-2 border-sumi md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className={`p-5 sm:p-6 ${i > 0 ? "border-t-2 border-sumi md:border-l-2 md:border-t-0" : ""}`}>
            <p className="flex items-baseline justify-between">
              <span className={`${num} text-4xl font-bold text-indigo`}>0{i + 1}</span>
              <span className={`px-2 py-0.5 text-xs font-bold ${s.who !== "AI" ? "bg-sumi text-paper" : "border border-sumi"}`}>{s.who}</span>
            </p>
            <h3 className={`${kaku} mt-2 text-xl font-black`}>{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex md:justify-end">
        <Says text="ホームページへの載せ方も、画面で1つずつ案内しますね。" />
      </div>
    </Section>
  );
}

/** 月額に含まれるもの。いまできることだけを書く */
function Included({ total, industries }: { total: number; industries: number }) {
  const rows: [string, string][] = [
    ["記事", `${ARTICLES_PER_MONTH_LABEL}。案内役の質問、AIによる記事づくり、AIOのチェック（${AIO_CHECK_LIST.length}項目）まで`],
    ["確認・修正の機能", "社長や担当の方が画面の上で読んで、直せます。足りない所は案内役が聞き返します"],
    ["強みの帳面", "得意なこと・お客様と困りごと・強みの根拠と数字・選ばれる決め手を、一問一答で書きためる帳面。記事・点検・チェック・提案のAIに毎回渡します"],
    ["掲載手順の案内", "確かめた記事を、自社のホームページ（ブログ）にご自身で載せます。自動投稿ではありません。操作は画面で順に案内します"],
    ["製造業データベース", `コタム独自。${industries}業種の悩み・発注する人の疑問と決め手など${total.toLocaleString()}件を、質問・記事の案・AIの書き方と点検に組み込んでいます（毎週2回更新）`],
    ["毎月のお知らせ", "AIの検索の変化を、公式に発表されたことだけでお伝えします（しおり通信・毎月1日）"],
  ];
  return (
    <Section kicker="含まれるもの" title="月額に含まれるもの。">
      <p className="mb-4 font-bold">AIが下書きをつくり、社長や担当の方が確かめて直し、自社サイトに載せるサービスです。</p>
      <dl className="grid grid-cols-[7.5rem_1fr] border-2 border-sumi bg-white text-sm sm:grid-cols-[11rem_1fr] sm:text-base">
        {rows.map(([k, v], i) => (
          <div key={k} className="contents">
            <dt className={`px-4 py-3 font-bold text-sumi/70 ${i > 0 ? "border-t border-sumi/30" : ""}`}>{k}</dt>
            <dd className={`border-l border-sumi/30 px-4 py-3 leading-relaxed ${i > 0 ? "border-t" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

const STAMPS = [
  { icon: "👋", title: "はじめまして" },
  { icon: "✏️", title: "はじめての1本" },
  { icon: "🚀", title: "デビュー" },
  { icon: "🔍", title: "AIOチェック" },
  { icon: "📚", title: "5本の書き手" },
  { icon: "🔥", title: "3か月つづけた" },
];

/** 続けられる仕組み。枠の中は、実際の画面と同じ見た目 */
function KeepGoing() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen || n >= 4) return;
    const t = setTimeout(() => setN((x) => x + 1), n === 0 ? 400 : 600);
    return () => clearTimeout(t);
  }, [seen, n]);
  const guides = [
    { id: "shiori", name: "しおり", note: "ちょっと厳しめの、頼れるお姉さん" },
    { id: "gen", name: "源さん", note: "白髪まじりの、ベテラン職人" },
    { id: "koyuki", name: "こゆき", note: "本物そっくりのオコジョ" },
  ] as const;
  return (
    <Section kicker="続けられる仕組み" title="毎月の記事を、ひとりで続けなくていい。" tone="white">
      <div ref={ref} className="grid gap-6 md:grid-cols-2">
        <figure className="border-2 border-sumi">
          <figcaption className="border-b-2 border-sumi px-4 py-2 text-xs font-bold">画面の見本：案内役を選ぶ</figcaption>
          <ul className={`${maru} grid grid-cols-3 gap-2 bg-canvas p-3`}>
            {guides.map((g) => (
              <li key={g.id} className="flex flex-col items-center rounded-2xl border-2 border-line bg-surface p-2 text-center">
                <Shiori mood="joy" as={g.id} className="h-24 w-auto" />
                <b className="mt-1">{g.name}</b>
                <span className="text-xs leading-snug text-muted">{g.note}</span>
              </li>
            ))}
          </ul>
          <p className="px-4 py-3 text-sm leading-relaxed">話しやすい案内役を選べます。手が止まっているときは、案内役のほうから声をかけます。</p>
        </figure>
        <figure className="border-2 border-sumi">
          <figcaption className="border-b-2 border-sumi px-4 py-2 text-xs font-bold">画面の見本：スタンプ帳</figcaption>
          <ul className={`${maru} grid grid-cols-3 gap-2 bg-canvas p-3`}>
            {STAMPS.map((s, i) => {
              const got = i < n;
              return (
                <li key={s.title} className={`grid place-items-center gap-1 rounded-2xl border-2 p-2 text-center ${got ? "border-sun bg-sun-soft" : "border-dashed border-line bg-surface"}`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-full text-2xl ${got ? "animate-stamp bg-surface shadow" : "opacity-40 grayscale"}`} aria-hidden>
                    {s.icon}
                  </span>
                  <span className={`text-xs font-bold leading-tight ${got ? "" : "text-muted"}`}>{s.title}</span>
                </li>
              );
            })}
          </ul>
          <p className="px-4 py-3 text-sm leading-relaxed">答える、書く、載せる、続ける。そのたびにスタンプがたまり、書いた記事が帳面のように増えていきます。</p>
        </figure>
      </div>
    </Section>
  );
}

function Promises() {
  return (
    <Section kicker="記事づくりの約束" title="頼む人に、正直な帳面を。">
      <ol className="border-2 border-sumi bg-white">
        {BRAND_PROMISES.map((p, i) => (
          <li key={p.title} className="grid grid-cols-[3.25rem_1fr] border-b border-sumi/30 last:border-0 sm:grid-cols-[4.5rem_1fr]">
            <span className={`${kaku} grid place-items-center border-r border-sumi/30 text-xl font-black text-indigo`}>{KANJI[i]}</span>
            <div className="px-4 py-3.5">
              <p className="font-black leading-snug">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-sumi/80">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-sumi/80">
        AIの回答で紹介されることや、問い合わせ・受注が増えることは約束しません。考え方は
        <Link href="/brand" className="mx-1 font-bold text-indigo underline underline-offset-4">
          ブランドのページ
        </Link>
        にまとめています。
      </p>
    </Section>
  );
}

/** 料金とお試し。条件は利用規約・特定商取引法の表記（src/lib/legal.ts）と同じにする */
function Price() {
  const rows: [string, string][] = [
    ["料金", `月額50,000円（税抜。税込55,000円）。記事は${ARTICLES_PER_MONTH_LABEL}`],
    ["お試し", "はじめての方は7日間無料。申し込みのときにクレジットカードを登録します"],
    ["請求", "お試しが終わった日に初回を請求し、毎月自動で更新します。初めての請求の前の日にメールでお知らせします"],
    ["解約", "マイページからいつでも。お試しのあいだに解約すれば、料金はかかりません"],
  ];
  return (
    <Section id="price" kicker="料金とお試し" title="料金と条件を、先にお伝えします。" tone="white">
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <dl className="grid grid-cols-[7.5rem_1fr] border-2 border-sumi text-sm sm:grid-cols-[8.5rem_1fr] sm:text-base">
          {rows.map(([k, v], i) => (
            <div key={k} className="contents">
              <dt className={`px-4 py-3 font-bold text-sumi/70 ${i > 0 ? "border-t border-sumi/30" : ""}`}>{k}</dt>
              <dd className={`border-l border-sumi/30 px-4 py-3 leading-relaxed ${i > 0 ? "border-t" : ""} ${i === 0 ? "font-black" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="self-start border-2 border-sumi bg-paper p-5 md:p-6">
          <p className="font-black">新規のお申し込みは、準備中です。</p>
          <p className="mt-2 text-sm leading-relaxed">受付を始めるときに、メールでお知らせします。それまでは、登録せずに記事の書き出しを試せます。</p>
          <div id="notify" className="mt-4 scroll-mt-24">
            <WaitlistForm source="price" />
          </div>
          <p className="mt-4 flex flex-col gap-2 text-sm font-bold">
            <Link href={TRY_HREF} className="text-indigo underline underline-offset-4">
              登録せずに、記事の書き出しを試す
            </Link>
            <Link href="/tokushoho" className="text-sumi/70 underline underline-offset-4">
              特定商取引法にもとづく表記
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}

/** よくある質問。AIもこの形（質問と答え）を読みとりやすい */
function Faq() {
  return (
    <Section id="faq" kicker="よくある質問" title="気になることに、先にお答えします。">
      <ul className="border-2 border-sumi bg-white">
        {FAQ.map((f) => (
          <li key={f.q} className="border-b border-sumi/30 last:border-0">
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
                <span className={`${num} text-indigo`} aria-hidden>
                  Q
                </span>
                <span className="flex-1">{f.q}</span>
                <span className="text-xl text-indigo group-open:hidden" aria-hidden>
                  ＋
                </span>
                <span className="hidden text-xl text-indigo group-open:inline" aria-hidden>
                  －
                </span>
              </summary>
              <p className="border-t border-sumi/15 bg-paper px-4 py-3 leading-relaxed">{f.a}</p>
            </details>
          </li>
        ))}
      </ul>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd() }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd()).replace(/</g, "\\u003c") }} />
    </Section>
  );
}

function faqJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }).replace(/</g, "\\u003c");
}

/** AIOの読みもの（/column）の新しい記事 */
function ColumnTeaser() {
  const list = COLUMNS.slice(0, 3);
  return (
    <section className="border-t border-sumi/15 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className={`${kaku} text-xl font-black`}>AIOの読みもの</h2>
          <Link href="/column" className="text-sm font-bold text-indigo underline underline-offset-4">
            すべて見る
          </Link>
        </div>
        <ul className="mt-4 grid border-t-2 border-sumi md:grid-cols-3">
          {list.map((c, i) => (
            <li key={c.slug} className={`border-b border-sumi/30 ${i > 0 ? "md:border-l" : ""}`}>
              <Link href={`/column/${c.slug}`} className="block h-full p-4 hover:bg-white">
                <b className="leading-snug">{c.title}</b>
                <span className="mt-1 block text-sm text-sumi/75">{c.lead}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCall({ signedIn, href }: { signedIn: boolean; href: string }) {
  return (
    <section className="bg-indigo py-14 text-paper sm:py-[72px]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div>
          <p className="text-sm font-bold text-paper/80">{BRAND_LINE}</p>
          <h2 className={`${kaku} mt-2 text-[1.6rem] font-black leading-snug sm:text-4xl`}>
            <span className="inline-block">まずは、仕事の話を</span>
            <span className="inline-block">1つ聞かせてください。</span>
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-paper/90">最近うれしかった仕事を1つ書くと、その場で記事の書き出しができます。会社の名前・地域・仕事の3つも入れます。登録はいりません。</p>
          {!signedIn && (
            <div className="mt-6">
              <Says text="うまく話せなくても大丈夫。まずは1問だけ、気軽に試してみてください。" />
            </div>
          )}
          <div className="mt-5 space-y-3">
            <MainButton signedIn={signedIn} href={href} />
            {!signedIn && <SubLinks dark />}
          </div>
        </div>
      </div>
    </section>
  );
}
