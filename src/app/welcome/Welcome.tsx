"use client";

// 入口のページ（サービスのご紹介）。ログインしていない人が最初に見る。
// 2026-11-03 田村さん「登録したくなる、ワクワクする、ログインしたくなるページにしたい」。
// 言葉は“やること”で書く（専門語を使わない）。AIOの考え方は docs/AIO.md（体験と数字が紹介されやすい・作り話をしない）。
// サービスの定義は src/lib/brand.ts（AIに選ばれて、お客様に選ばれる。いちばん大切なのはお客様に選ばれること）。
// 紹介される・売上が上がると約束はしない（決めるのはAI）。料金はまだ決まっていないので出さない。

import Link from "next/link";
import { useEffect, useState } from "react";
import { Confetti, Shiori, type ShioriMood } from "@/components/fun";
import { BigShiori, Logo, Reveal, useInView } from "@/components/landing";
import { ShioriTalk, Typed } from "@/components/talk";
import { CHOSEN_STAGES, SERVICE_COMPANION, SERVICE_MOST_IMPORTANT } from "@/lib/brand";
import { useStore } from "@/mock/store";
import type { MfgShowcase } from "@/lib/manufacturing";

export function Welcome({ makers }: { makers: MfgShowcase }) {
  const { ready, user } = useStore();
  // ログイン中なら、入口のボタンは「続きから」にする
  const signedIn = ready && !!user;
  const startHref = signedIn ? (user?.role === "coach" ? "/coach" : "/") : "/login";
  const startLabel = signedIn ? "続きから書く" : "さっそく始める";

  return (
    <div className="overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Logo />
          <div className="flex items-center gap-3">
          <Link href="/shiori" className="hidden text-sm font-bold text-brand-dark underline-offset-4 hover:underline sm:inline">
            しおりって？
          </Link>
          <Link href={startHref} className="btn-primary min-h-10 whitespace-nowrap px-4 py-1.5 text-sm">
            {signedIn ? "続きから" : "ログイン"}
          </Link>
          </div>
        </div>
      </header>

      <Hero startHref={startHref} startLabel={startLabel} />
      <AiChat />
      <TwoChosen />
      <Quiz />
      <ThreeSteps />
      <KeepGoing />
      <ForMakers m={makers} />
      <ForYou />
      <FinalCall startHref={startHref} startLabel={startLabel} signedIn={signedIn} />

      <footer className="mx-auto max-w-6xl space-y-1 px-4 pb-6 pt-10 text-center text-sm text-muted sm:px-6">
        <p>
          <Link href="/shiori" className="font-bold text-brand-dark underline">
            案内役「しおり」の自己紹介
          </Link>
        </p>
        <p>株式会社コタム</p>
      </footer>
    </div>
  );
}

/** 30秒でためす（/try）への入口。登録の前に、診断と記事の書き出しを体験できる */
function TryBanner() {
  return (
    <Link
      href="/try"
      className="group flex animate-rise items-center gap-3 rounded-3xl border-2 border-sun-dark bg-sun-soft p-3 pr-4 shadow-[0_5px_0_var(--color-sun-dark)] transition-transform [animation-delay:.32s] hover:-translate-y-1 sm:max-w-lg"
    >
      <span className="grid h-14 w-14 shrink-0 animate-shine place-items-center rounded-2xl bg-sun text-3xl" aria-hidden>
        🩺
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black text-warn">登録なし・30秒</span>
        <span className="block font-black leading-snug">あなたの会社、AIとお客様に選ばれる準備はできてる？ 診断してみる</span>
      </span>
      <span className="text-2xl text-ink transition-transform group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </Link>
  );
}

function Hero({ startHref, startLabel }: { startHref: string; startLabel: string }) {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-4 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-[1.2fr_1fr] md:pb-16 md:pt-14">
      <div className="space-y-5">
        <p className="inline-flex animate-rise items-center gap-2 rounded-full bg-sun-soft px-3 py-1 text-sm font-black">
          <span aria-hidden>✨</span> AIの時代の、会社のブログ
        </p>
        <h1 className="animate-rise text-[1.7rem] font-black leading-[1.35] [animation-delay:.08s] sm:text-5xl sm:leading-[1.3]">
          AIに選ばれて、
          <br />
          これから出会う
          <br />
          <span className="relative inline-block">
            <span className="relative z-10">お客様に選ばれる</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-full bg-sun/70 sm:h-4" aria-hidden />
          </span>
          会社に。
        </h1>
        <p className="animate-rise text-lg font-bold text-muted [animation-delay:.16s] sm:text-xl">
          AIに「この会社がいいよ」と紹介されて、
          <br className="hidden sm:inline" />
          これから出会うお客様に
          <br className="hidden sm:inline" />
          「ここに頼みたい」と思ってもらえる記事を。
          <br />
          <span className="text-ink">{SERVICE_COMPANION}</span>
        </p>
        <div className="flex animate-rise flex-wrap items-center gap-3 [animation-delay:.24s]">
          <Link href={startHref} className="btn-primary min-h-14 px-7 text-lg">
            {startLabel}
            <span className="inline-block animate-nudge" aria-hidden>
              →
            </span>
          </Link>
          <a href="#ai" className="btn-secondary min-h-14 px-6">
            どんなサービス？
            <span className="inline-block animate-hop" aria-hidden>
              ↓
            </span>
          </a>
        </div>
        <TryBanner />
      </div>

      <div className="relative mx-auto mt-2 flex w-full max-w-sm justify-center md:mt-0">
        <span className="absolute inset-6 -z-10 animate-blob bg-brand-soft" aria-hidden />
        <span className="absolute right-6 top-10 -z-10 h-24 w-24 animate-blob rounded-full bg-sun-soft [animation-delay:-3s]" aria-hidden />
        <BigShiori mood="jersey-cheer" className="animate-rise [animation-delay:.2s]" />
        <FloatChip className="left-0 top-6" delay="0s">
          🤖 AIに選ばれた！
        </FloatChip>
        <FloatChip className="-right-1 top-1/3" delay=".6s">
          ⭐ スタンプ +1
        </FloatChip>
        <FloatChip className="bottom-6 left-2" delay="1.2s">
          🤝 お客様に選ばれた！
        </FloatChip>
      </div>
    </section>
  );
}

/** しおりのまわりで、ふわふわ浮く札（しおり自身は動かさない） */
function FloatChip({ children, className, delay }: { children: React.ReactNode; className: string; delay: string }) {
  return (
    <span className={`absolute animate-pop rounded-full border-2 border-line bg-surface px-3 py-1 text-sm font-black shadow-[0_4px_0_var(--color-line)] ${className}`} style={{ animationDelay: delay }} aria-hidden>
      <span className="inline-block animate-float" style={{ animationDelay: delay }}>
        {children}
      </span>
    </span>
  );
}

function SectionTitle({ kicker, children }: { kicker: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 space-y-1 text-center">
      <p className="text-sm font-black text-brand">{kicker}</p>
      <h2 className="text-2xl font-black leading-snug sm:text-3xl">{children}</h2>
    </div>
  );
}

const ASK = "愛知で、金属の部品を10個だけ作ってくれる会社はある？";
const ANSWER_BEFORE = "小さな数の相談なら、";
const ANSWER_COMPANY = "〇〇製作所（あなたの会社）";
const ANSWER_AFTER = "がよさそうです。10個からの試作を受けた例をブログで紹介していて、相談の窓口もあります。";

const READER_THINKS = "10個でも、ていねいに相談にのってくれそう。ここに頼もう！";

/**
 * お客様がAIに相談して、あなたの会社が紹介され（AIに選ばれる）、
 * 記事を読んだ人が問い合わせる（お客様に選ばれる）までの様子（イメージ）。見えたら自動で流れる
 */
function AiChat() {
  const [ref, seen] = useInView<HTMLDivElement>(0.35);
  // 0:待ち 1:お客様が打つ 2:AIが考える 3:AIが答える 4:AIに選ばれた 5:記事を読む 6:お客様に選ばれた
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);
  useEffect(() => {
    if (seen && step === 0) {
      const t = setTimeout(() => setStep(1), 300);
      return () => clearTimeout(t);
    }
  }, [seen, step, round]);
  useEffect(() => {
    if (step !== 2 && step !== 4) return;
    const t = setTimeout(() => setStep(step + 1), step === 2 ? 1300 : 1400);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section id="ai" className="scroll-mt-16 bg-surface/60 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="いま、お客様の探し方が変わっています">
            お客様は、<span className="text-brand">AIに相談</span>しはじめました
          </SectionTitle>
        </Reveal>

        <div className="grid items-start gap-6 md:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-3">
            <div className="card flex items-center gap-3 px-4 py-3 opacity-80">
              <span className="text-3xl" aria-hidden>
                🔍
              </span>
              <p>
                <b className="block text-sm text-muted">いままで</b>
                検索して、たくさんのサイトを見くらべる
              </p>
            </div>
            <p className="text-center text-2xl text-brand" aria-hidden>
              ↓
            </p>
            <div className="card flex items-center gap-3 border-2 border-brand px-4 py-3">
              <span className="text-3xl" aria-hidden>
                💬
              </span>
              <p>
                <b className="block text-sm text-brand-dark">これから</b>
                AIに聞くと、AIが<b>おすすめの会社</b>を答えてくれる
              </p>
            </div>
            <ShioriTalk
              mood="point"
              size="md"
              className="pt-2"
              lines={["AIに紹介されるのは、はじまりです。", "紹介されて読みに来た人に「ここに頼みたい」と思ってもらえて、はじめてお問い合わせが来るんです。", "その両方を、いっしょにつくりましょう！"]}
            />
          </Reveal>

          <div ref={ref} className="card relative space-y-3 bg-canvas/60 p-4 sm:p-5">
            <p className="flex items-center justify-between text-xs font-black text-muted">
              <span>{step >= 5 ? "記事を読んでいる人（イメージ）" : "AIに相談している画面（イメージ）"}</span>
              <span className="flex gap-1" aria-hidden>
                <i className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                <i className="h-2.5 w-2.5 rounded-full bg-sun" />
                <i className="h-2.5 w-2.5 rounded-full bg-ok-bright" />
              </span>
            </p>
            <p className="sr-only">
              お客様：{ASK} AI：{ANSWER_BEFORE}
              {ANSWER_COMPANY}
              {ANSWER_AFTER} 記事を読んだ人：{READER_THINKS}
            </p>
            <div className="min-h-64 space-y-3 sm:min-h-[26rem]" aria-hidden key={round}>
              {step >= 1 && (
                <div className="ml-auto w-fit max-w-[85%] origin-bottom-right animate-bubble rounded-3xl rounded-br-md bg-brand px-4 py-2.5 font-bold text-white">
                  {step === 1 ? <Typed text={ASK} speed={45} delay={200} onDone={() => setTimeout(() => setStep(2), 400)} /> : ASK}
                </div>
              )}
              {step >= 2 && (
                <div className="flex items-start gap-2">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white">✦</span>
                  <div className="min-w-0 origin-top-left animate-bubble rounded-3xl rounded-tl-md border-2 border-line bg-surface px-4 py-2.5 leading-relaxed">
                    {step === 2 ? (
                      <span className="inline-flex gap-1 py-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="h-2 w-2 animate-dot rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </span>
                    ) : step === 3 ? (
                      <Typed text={ANSWER_BEFORE + ANSWER_COMPANY + ANSWER_AFTER} speed={32} delay={100} onDone={() => setTimeout(() => setStep(4), 300)} />
                    ) : (
                      <>
                        {ANSWER_BEFORE}
                        <mark className="rounded-md bg-sun/70 px-1 font-black text-ink">{ANSWER_COMPANY}</mark>
                        {ANSWER_AFTER}
                      </>
                    )}
                  </div>
                </div>
              )}
              {step >= 4 && (
                <div className="flex justify-center pt-1">
                  <span className="animate-stamp rounded-full border-2 border-brand bg-brand-soft px-4 py-1.5 font-black text-brand-dark shadow-[0_4px_0_var(--color-brand)]">🤖 1. AIに選ばれた！</span>
                </div>
              )}
              {step >= 5 && (
                <div className="animate-rise space-y-2 rounded-3xl border-2 border-line bg-surface p-3">
                  <p className="text-xs font-black text-muted">〇〇製作所のブログ</p>
                  <p className="font-black leading-snug">10個からの試作、5日でお届けしたお話</p>
                  <div className="ml-auto w-fit max-w-[90%] origin-bottom-right animate-bubble rounded-3xl rounded-br-md bg-sun-soft px-4 py-2 text-sm font-bold">
                    💭 {step === 5 ? <Typed text={READER_THINKS} speed={45} delay={300} onDone={() => setTimeout(() => setStep(6), 400)} /> : READER_THINKS}
                  </div>
                </div>
              )}
              {step >= 6 && (
                <div className="flex justify-center">
                  <span className="animate-stamp rounded-full border-2 border-sun-dark bg-sun px-4 py-1.5 font-black text-ink shadow-[0_4px_0_var(--color-sun-dark)]">🤝 2. お客様に選ばれた！ お問い合わせが来ました</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <p className="text-xs text-muted">紹介するかどうかはAIが、頼むかどうかは読んだ人が決めます。選ばれやすい材料を、いっしょにそろえます。</p>
              {step >= 6 && (
                <button
                  type="button"
                  className="text-sm font-bold text-brand-dark underline"
                  onClick={() => {
                    setRound((r) => r + 1);
                    setStep(0);
                  }}
                >
                  もう一度見る
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** このサービスの定義。2つの「選ばれる」と、いちばん大切なこと */
function TwoChosen() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="このサービスが目指すこと">2つの「選ばれる」</SectionTitle>
        </Reveal>
        <ol className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
          {CHOSEN_STAGES.map((st, i) => (
            <li key={st.key} className="contents">
              {i > 0 && (
                <span className="grid place-items-center text-3xl font-black text-brand" aria-hidden>
                  <span className="inline-block animate-hop sm:hidden">↓</span>
                  <span className="hidden animate-nudge sm:inline-block">→</span>
                </span>
              )}
              <Reveal delay={i * 0.15} className={`card flex h-full flex-col items-center gap-2 text-center ${st.key === "people" ? "border-2 border-sun bg-sun-soft" : ""}`}>
                <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-surface text-4xl shadow" aria-hidden>
                  {st.icon}
                </span>
                <p className="text-sm font-black text-brand">ステップ{st.step}</p>
                <h3 className="text-2xl font-black">{st.label}</h3>
                <p className="text-muted">{st.text}</p>
                {st.key === "people" && <span className="mt-auto rounded-full bg-sun px-3 py-0.5 text-sm font-black">いちばん大切</span>}
              </Reveal>
            </li>
          ))}
        </ol>
        <Reveal delay={0.3} className="mt-5">
          <ShioriTalk mood="point" size="md" lines={[SERVICE_MOST_IMPORTANT, "だから、しおりは「AIに伝わる材料」と「読んだ人が安心できる、あなたの会社らしさ」の両方を聞きますね。"]} />
        </Reveal>
      </div>
    </section>
  );
}

const CHOICES = [
  { id: "a", text: "高品質・短納期で、どんなご要望にもお応えします。", ok: false },
  { id: "b", text: "厚さ1mmのステンレス板で、部品を10個、5日でお届けしました。", ok: true },
];

/** AIにもお客様にも選ばれるのはどっち？ 1問だけのクイズ */
function Quiz() {
  const [picked, setPicked] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const right = CHOICES.find((c) => c.id === picked)?.ok;
  const talk: { mood: ShioriMood; lines: string[] } =
    picked === null
      ? { mood: "ask", lines: ["ここでクイズです！", "AIにも、読んだ人にも選ばれるのは、どっちの書き方だと思いますか？"] }
      : right
        ? { mood: "right", lines: ["正解です！すごい！", "AIは「この会社にしかない経験」と「数字」がある記事を紹介しやすいんです。", "読んだ人も「ここなら安心して頼める」と思えますよね。だから、しおりはあなたの会社の経験を、くわしく聞きますね。"] }
        : { mood: "think", lines: ["おしい！", "どの会社でも言える言葉だと、AIは紹介しにくいんです。もう一度えらんでみてください。"] };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="30秒でわかる">AIにもお客様にも選ばれるのは、どっち？</SectionTitle>
        </Reveal>
        <Reveal className="card space-y-4">
          {right && <Confetti count={50} />}
          <ShioriTalk key={`${picked}-${tries}`} mood={talk.mood} lines={talk.lines} size="md" />
          <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="えらぶ">
            {CHOICES.map((c, i) => {
              const chosen = picked === c.id;
              const state = chosen ? (c.ok ? "ok" : "ng") : right && c.ok ? "ok" : "idle";
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={!!right}
                  aria-pressed={chosen}
                  onClick={() => {
                    setPicked(c.id);
                    setTries((n) => n + 1);
                  }}
                  className={`relative rounded-3xl border-2 p-4 text-left font-bold transition-transform duration-150 enabled:hover:-translate-y-1 ${
                    state === "ok" ? "border-ok-bright bg-ok-soft" : state === "ng" ? "animate-[nod_.5s_ease-in-out] border-danger/50 bg-danger-soft" : "border-line bg-surface shadow-[0_4px_0_var(--color-line)] enabled:hover:border-brand"
                  }`}
                >
                  <span className="mb-1 block text-sm font-black text-brand">{i === 0 ? "A" : "B"}</span>
                  {c.text}
                  {state === "ok" && (
                    <span className="absolute -right-2 -top-3 animate-stamp rounded-full bg-ok-bright px-2.5 py-0.5 text-sm font-black text-white">⭕ 正解 +10pt</span>
                  )}
                  {state === "ng" && <span className="absolute -right-2 -top-3 animate-stamp rounded-full bg-danger px-2.5 py-0.5 text-sm font-black text-white">❌ おしい</span>}
                </button>
              );
            })}
          </div>
          {right && (
            <p className="animate-rise rounded-2xl bg-sun-soft px-4 py-3 text-sm font-bold">
              💡 ポイント：Bには「何を・いくつ・何日で」という<b>実際の経験と数字</b>があります。これはAIにはつくれない、あなたの会社だけの材料です。読んだ人にも「頼んだらこうなる」が伝わります。
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const STEPS: { mood: ShioriMood; title: string; text: string; tag: string }[] = [
  { mood: "ask", title: "しおりの質問に答える", text: "話すように答えるだけ。うまく書こうとしなくて大丈夫です。わからない質問は飛ばせます。", tag: "あなた" },
  { mood: "think", title: "AIが記事にまとめる", text: "あなたの答えから、AIに紹介されやすく、読んだ人に伝わる記事をつくります。AIOのチェックもおまかせ。", tag: "AIにおまかせ" },
  { mood: "jersey-done", title: "ブログに載せる", text: "載せ方も1ステップずつ案内します。載せたらスタンプがもらえます！", tag: "あなた" },
];

function ThreeSteps() {
  return (
    <section className="bg-surface/60 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="むずかしいことはありません">やることは、3つだけ</SectionTitle>
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.12} className="card relative flex h-full flex-col items-center gap-2 pt-8 text-center">
                <span className="absolute -top-4 left-1/2 grid h-10 w-10 -translate-x-1/2 place-items-center rounded-full border-4 border-canvas bg-brand text-lg font-black text-white">{i + 1}</span>
                <Shiori mood={s.mood} className="h-28 w-auto" />
                <span className={`rounded-full px-3 text-xs font-black ${s.tag === "あなた" ? "bg-brand-soft text-brand-dark" : "bg-sun-soft"}`}>{s.tag}</span>
                <h3 className="text-xl font-black">{s.title}</h3>
                <p className="text-muted">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const STAMPS = [
  { icon: "👋", title: "はじめまして" },
  { icon: "✏️", title: "はじめての1本" },
  { icon: "🚀", title: "デビュー" },
  { icon: "🔍", title: "AIOチェック" },
  { icon: "🔥", title: "3か月つづけた" },
  { icon: "🏆", title: "AIに紹介された" },
];

/** 続けるのが楽しくなるしかけ（スタンプ帳・しおりが育つ）。見えたら1つずつスタンプが押される */
function KeepGoing() {
  const [ref, seen] = useInView<HTMLDivElement>(0.3);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen || n >= 4) return;
    const t = setTimeout(() => setN((x) => x + 1), n === 0 ? 400 : 650);
    return () => clearTimeout(t);
  }, [seen, n]);
  const level = Math.min(n, 4);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="ゲームみたいに続けられる">書くほど、楽しくなる</SectionTitle>
        </Reveal>
        <div ref={ref} className="grid gap-4 md:grid-cols-2">
          <div className="card space-y-3">
            <h3 className="flex items-center justify-between text-lg font-black">
              🎖️ スタンプ帳
              <span className="rounded-full bg-sun-soft px-3 text-sm">
                {n} / {STAMPS.length} こ
              </span>
            </h3>
            <ul className="grid grid-cols-3 gap-2">
              {STAMPS.map((s, i) => {
                const got = i < n;
                return (
                  <li key={s.title} className={`grid place-items-center gap-1 rounded-2xl border-2 p-2 text-center ${got ? "border-sun bg-sun-soft" : "border-dashed border-line"}`}>
                    <span className={`grid h-12 w-12 place-items-center rounded-full text-2xl ${got ? "animate-stamp bg-surface shadow" : "bg-canvas opacity-40 grayscale"}`} aria-hidden>
                      {s.icon}
                    </span>
                    <span className={`text-xs font-bold leading-tight ${got ? "" : "text-muted"}`}>{s.title}</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-muted">記事を書く、ブログに載せる、続ける。そのたびにスタンプが増えます。</p>
          </div>
          <div className="card space-y-3">
            <h3 className="text-lg font-black">🌱 しおりが育つ</h3>
            <div className="flex items-end gap-3">
              <Shiori mood={level >= 4 ? "welldone" : "idea"} className="h-28 w-auto" />
              <div className="min-w-0 flex-1 space-y-2 pb-2">
                <p className="font-black">
                  しおりの理解度 <span className="text-2xl text-brand">Lv.{level + 1}</span>
                </p>
                <div className="h-4 overflow-hidden rounded-full bg-canvas-deep" aria-hidden>
                  <div className="h-full rounded-full bg-gradient-to-r from-brand to-sky transition-[width] duration-700 ease-[cubic-bezier(.3,1.4,.5,1)]" style={{ width: `${15 + level * 20}%` }} />
                </div>
                {level >= 4 && <p className="animate-stamp text-sm font-black text-brand-dark">⬆ レベルアップ！</p>}
              </div>
            </div>
            <p className="text-sm text-muted">会社のことを教えるほど、しおりがあなたの会社にくわしくなり、記事がどんどん「あなたの会社らしく」なります。</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 製造業に特化している理由（製造業の知識表から） */
function ForMakers({ m }: { m: MfgShowcase }) {
  const { counts, samples, industries, total } = m;
  const stats: [string, number][] = [
    ["発注する人の疑問", counts.question],
    ["つまずく言葉のやさしい説明", counts.term],
    ["買い手の探し方・決め方", counts.buyer],
    ["製造業の悩み", counts.pain],
    ["Webでうまくいったやり方", counts.success],
    ["最近の動き", counts.trend],
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl space-y-5 px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="製造業に特化しています">しおりは、ものづくりの現場を勉強しています</SectionTitle>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto max-w-3xl text-center text-muted">
            公的機関や業界団体、業界メディア、調査の公開情報を巡回して、{industries}の業種について、製造業の悩みや、発注する人がよく抱く疑問、つまずきやすい言葉など {total.toLocaleString()}件 を集め、AIに教えています。だから「小ロットでも頼める？」「図面がなくても大丈夫？」のような、お客様が本当に知りたいことに答える記事になります。これからも増やしていきます。
          </p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map(([label, n], i) => (
            <li key={label}>
              <Reveal delay={i * 0.06} className="card h-full text-center">
                <span className="block text-3xl font-black text-brand">{n}</span>
                <span className="text-sm font-bold">{label}</span>
              </Reveal>
            </li>
          ))}
        </ul>
        <Reveal delay={0.1}>
          <p className="mb-2 text-center text-sm font-bold">お客様がよく抱く疑問の例</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {samples.map((x) => (
              <li key={x.id} className="rounded-full border-2 border-line bg-surface px-3 py-1 text-sm">
                「{x.title}」
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

const FOR_YOU = [
  { icon: "🔧", title: "ものづくりの会社のための", text: "ひとり親方から30人くらいの会社まで。現場の経験こそが、いちばんの材料です。" },
  { icon: "🖱️", title: "パソコンが苦手でも大丈夫", text: "ボタンは大きく、やることは1つずつ。しおりが毎回となりで案内します。" },
  { icon: "📝", title: "文章が苦手でも大丈夫", text: "質問に答えるだけ。文章はAIが整えます。あなたは読んで直すだけ。" },
  { icon: "🙅", title: "うそは書きません", text: "AIが数字や実績をつくり話しないよう、あなたの答えだけで書きます。" },
];

function ForYou() {
  return (
    <section className="bg-surface/60 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle kicker="安心してください">こんな方のためのサービスです</SectionTitle>
        </Reveal>
        <ul className="grid gap-3 sm:grid-cols-2">
          {FOR_YOU.map((f, i) => (
            <li key={f.title}>
              <Reveal delay={i * 0.08} className="card flex h-full items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-2xl" aria-hidden>
                  {f.icon}
                </span>
                <span>
                  <b className="block text-lg">{f.title}</b>
                  <span className="text-muted">{f.text}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinalCall({ startHref, startLabel, signedIn }: { startHref: string; startLabel: string; signedIn: boolean }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-6 text-white shadow-[0_8px_0_var(--color-brand-dark)] sm:p-10">
          <span className="absolute -right-10 -top-10 h-40 w-40 animate-blob bg-white/10" aria-hidden />
          <div className="relative grid items-end gap-4 sm:grid-cols-[auto_1fr]">
            <Shiori mood="bow" className="mx-auto h-36 w-auto sm:h-48" />
            <div className="space-y-4">
              <h2 className="text-2xl font-black leading-snug sm:text-3xl">
                さあ、AIに選ばれて、
                <br className="sm:hidden" />
                お客様に選ばれる会社になろう！
              </h2>
              <p className="font-bold text-white/90">まずは、しおりの質問に3つ答えるところから。最初のスタンプがもらえます。</p>
              <Link href={startHref} className="btn min-h-14 border-sun bg-sun px-7 text-lg text-ink shadow-[0_4px_0_var(--color-sun-dark)] hover:-translate-y-0.5">
                {startLabel}
                <span className="inline-block animate-nudge" aria-hidden>
                  →
                </span>
              </Link>
              {!signedIn && (
                <p className="text-sm text-white/85">
                  招待メールが届いていない方は、コタムの担当者にお声がけください。
                  <br />
                  <Link href="/try" className="font-bold text-white underline">
                    まずは30秒でためしてみる →
                  </Link>
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
