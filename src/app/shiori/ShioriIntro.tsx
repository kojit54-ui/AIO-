"use client";

// しおりの自己紹介（/shiori）。ログインなしで見られる（2026-11-03 田村さん「しおりの自己紹介的なページもほしい」）。
// しおりの絵は動かさない。話すのは吹き出し。表情の図鑑は、全部見るとお祝いが出る。
// しおりは案内役のキャラクターで、記事を作るのはAIだと正直に書く。

import Link from "next/link";
import { useState } from "react";
import { Confetti, Shiori, type ShioriMood } from "@/components/fun";
import { BigShiori, Logo, Reveal } from "@/components/landing";
import { SHIORI_LEVELS } from "@/components/ShioriGrowth";
import { ShioriTalk } from "@/components/talk";
import { ChosenPath } from "@/components/ChosenPath";

const PROFILE: { label: string; value: string; icon: string }[] = [
  { icon: "💼", label: "お仕事", value: "あなたの会社の記事づくりの案内役" },
  { icon: "✨", label: "得意なこと", value: "質問すること、ほめること、AIOのニュース集め" },
  { icon: "🙅", label: "苦手なこと", value: "作り話。だから、あなたの経験をくわしく聞きます" },
  { icon: "📰", label: "毎週月曜日", value: "AIに選ばれるための最新ニュースを読んでいます" },
  { icon: "💬", label: "口ぐせ", value: "「いいですね！それ、AIにもお客様にも伝わる話です」" },
  { icon: "❤️", label: "好きなもの", value: "現場の言葉。飾らない話がいちばん伝わります" },
];

/** 表情の図鑑。押すと、その顔のときに言いそうなことを話す */
const FACES: { mood: ShioriMood; name: string; say: string }[] = [
  { mood: "bow", name: "ごあいさつ", say: "はじめまして、しおりです。どうぞよろしくお願いします！" },
  { mood: "ask", name: "しつもん", say: "ちょっと教えてください。そのとき、お客様は何に困っていましたか？" },
  { mood: "point", name: "ここがポイント", say: "ここを書くと、AIが紹介しやすくなって、読んだ人も安心できるんです。" },
  { mood: "surprise", name: "びっくり", say: "えっ、そんな工夫をしていたんですか！それ、記事にしましょう！" },
  { mood: "idea", name: "ひらめき", say: "いいこと思いつきました！その話、もう1本書けますよ。" },
  { mood: "think", name: "考え中", say: "うーん…どう書くと伝わるか、いま考えています。" },
  { mood: "right", name: "正解", say: "そのとおりです！材料がそろいました。" },
  { mood: "welldone", name: "よくできました", say: "すばらしい！とても読みやすい記事になりました。" },
  { mood: "cheer", name: "おうえん", say: "あと少しです！いっしょにがんばりましょう！" },
  { mood: "joy", name: "うれしい", say: "うれしいです！また一歩、選ばれる会社に近づきましたね。" },
  { mood: "coffee", name: "ひと休み", say: "おつかれさまです。コーヒーでも飲んで、ひと息つきましょう。" },
  { mood: "sad", name: "しょんぼり", say: "うまくいきませんでした…。でも大丈夫、もう一度やってみましょう。" },
  { mood: "jersey-stretch", name: "準備運動", say: "さあ、準備運動はばっちり。今月も書きますよ！" },
  { mood: "jersey-cheer", name: "フレー！", say: "フレー、フレー！今月の1本、いっしょに書きましょう！" },
  { mood: "jersey-done", name: "やりきった", say: "やりきりました！ブログに載せたら、スタンプですよ。" },
];

const CAN_DO: { icon: string; title: string; text: string }[] = [
  { icon: "💬", title: "質問して、聞き出す", text: "1問ずつ、なぜ聞くのかを添えて質問します。話すように答えてください。" },
  { icon: "📝", title: "記事にまとめる", text: "あなたの答えから、AIといっしょに記事の形にします。" },
  { icon: "🔍", title: "AIOのチェック", text: "AIに選ばれて、読んだ人にも選ばれる記事か、12のポイントで確かめます。" },
  { icon: "🎖️", title: "応援する", text: "スタンプやレベルアップで、続けるのを応援します。" },
];

const QA: { q: string; a: string }[] = [
  { q: "しおりはAIなの？", a: "しおりは、この記事づくりの案内役のキャラクターです。質問や記事づくりの裏では、AIが動いています。" },
  { q: "しおりに話したことは、ほかの会社に伝わる？", a: "伝わりません。あなたの会社の記事づくりのためだけに使います。" },
  { q: "うまく答えられなくても大丈夫？", a: "大丈夫です。わからない質問は飛ばせます。しおりが聞き方を変えて、もう一度聞くこともあります。" },
];

export function ShioriIntro() {
  const [face, setFace] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const complete = seen.size === FACES.length;

  return (
    <div className="overflow-x-clip">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Logo />
          <Link href="/try" className="btn-primary min-h-10 px-4 py-1.5 text-sm">
            30秒でためす
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-5xl items-center gap-4 px-4 pb-8 pt-8 sm:px-6 md:grid-cols-[1fr_1.2fr]">
        <div className="relative mx-auto">
          <span className="absolute inset-4 -z-10 animate-blob bg-brand-soft" aria-hidden />
          <BigShiori mood="bow" />
        </div>
        <div className="space-y-4">
          <p className="inline-block animate-rise rounded-full bg-sun-soft px-3 py-0.5 text-sm font-black">コタムのAIO案内役</p>
          <h1 className="animate-rise text-4xl font-black [animation-delay:.08s] sm:text-5xl">
            しおり<span className="ml-2 text-lg text-muted">です</span>
          </h1>
          <ShioriTalk
            mood="joy"
            hideOnPhone
            lines={["はじめまして！あなたの会社の記事づくりを、となりで案内します。", "AIに選ばれて、そのあと記事を読んだ、これから出会うお客様に選ばれるまで、ずっと伴走します。いっしょにがんばりましょう！"]}
          />
          <ChosenPath />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Reveal className="card relative overflow-hidden">
          <span className="absolute right-4 top-3 rotate-6 rounded-xl border-2 border-brand px-2 text-sm font-black text-brand" aria-hidden>
            PROFILE
          </span>
          <h2 className="mb-3 text-xl font-black">📇 しおりのプロフィール</h2>
          <dl className="grid gap-2 sm:grid-cols-2">
            {PROFILE.map((p) => (
              <div key={p.label} className="flex items-start gap-3 rounded-2xl bg-canvas px-3 py-2">
                <span className="text-xl" aria-hidden>
                  {p.icon}
                </span>
                <div>
                  <dt className="text-xs font-black text-brand-dark">{p.label}</dt>
                  <dd className="font-bold">{p.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Reveal className="card space-y-4">
          {complete && <Confetti count={60} />}
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-xl font-black">😊 しおりの表情図鑑</h2>
            <p className={`rounded-full px-3 py-0.5 text-sm font-black ${complete ? "animate-stamp bg-sun" : "bg-sun-soft"}`}>
              {complete ? "🎉 ぜんぶ見た！" : `${seen.size} / ${FACES.length} 見た`}
            </p>
          </div>
          <ShioriTalk key={face} mood={FACES[face].mood} size="lg" lines={complete && seen.size === FACES.length && face === FACES.length - 1 ? [FACES[face].say, "ぜんぶの顔を見てくれて、ありがとうございます！"] : FACES[face].say} />
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {FACES.map((f, i) => (
              <li key={f.mood}>
                <button
                  type="button"
                  aria-pressed={face === i}
                  onClick={() => {
                    setFace(i);
                    setSeen((s) => new Set(s).add(i));
                  }}
                  className={`flex w-full flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-transform hover:-translate-y-0.5 ${
                    face === i ? "border-brand bg-brand-soft" : seen.has(i) ? "border-line bg-surface" : "border-dashed border-line bg-canvas"
                  }`}
                >
                  <Shiori mood={f.mood} className={`h-16 w-auto ${seen.has(i) ? "" : "opacity-60"}`} />
                  <span className="text-xs font-bold">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">押すと、その顔のときのしおりが話します。</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Reveal>
          <h2 className="mb-3 text-center text-2xl font-black">しおりにできること</h2>
        </Reveal>
        <ul className="grid gap-3 sm:grid-cols-2">
          {CAN_DO.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 0.08} className="card flex h-full items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-soft text-2xl" aria-hidden>
                  {c.icon}
                </span>
                <span>
                  <b className="block text-lg">{c.title}</b>
                  <span className="text-muted">{c.text}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Reveal className="card space-y-3">
          <h2 className="text-xl font-black">🌱 しおりは、あなたの会社といっしょに育ちます</h2>
          <p className="text-muted">会社のことを教えるほど、しおりがくわしくなって、記事が「あなたの会社らしく」なっていきます。</p>
          <ol className="flex gap-2 overflow-x-auto pb-2">
            {SHIORI_LEVELS.map((l, i) => (
              <li key={l.name} className="flex w-24 shrink-0 flex-col items-center gap-1 rounded-2xl bg-canvas p-2 text-center">
                <span className="rounded-full bg-brand px-2 text-xs font-black text-white">Lv.{i + 1}</span>
                <Shiori mood={l.mood} className="h-16 w-auto" />
                <span className="text-xs font-bold leading-tight">{l.name}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <Reveal>
          <h2 className="mb-3 text-center text-2xl font-black">しおりに聞いてみた</h2>
        </Reveal>
        <div className="space-y-2">
          {QA.map((x) => (
            <details key={x.q} className="card group p-4">
              <summary className="cursor-pointer list-none font-black">
                <span className="mr-2 text-brand">Q.</span>
                {x.q}
                <span className="float-right transition-transform group-open:rotate-180" aria-hidden>
                  ▾
                </span>
              </summary>
              <p className="mt-2 flex items-start gap-2">
                <span className="font-black text-sun-dark">A.</span>
                {x.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-6 text-center text-white shadow-[0_8px_0_var(--color-brand-dark)] sm:p-8">
          <Shiori mood="jersey-cheer" className="mx-auto h-32 w-auto" />
          <h2 className="mt-2 text-2xl font-black">しおりと、さっそく話してみませんか？</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/try" className="btn min-h-14 border-sun bg-sun px-6 text-lg text-ink shadow-[0_4px_0_var(--color-sun-dark)] hover:-translate-y-0.5">
              30秒でためす <span className="inline-block animate-nudge">→</span>
            </Link>
            <Link href="/login" className="btn min-h-14 border-white/70 bg-transparent px-6 text-white hover:bg-white/10">
              ログイン
            </Link>
          </div>
        </Reveal>
      </section>
      <footer className="pb-6 text-center text-sm text-muted">株式会社コタム</footer>
    </div>
  );
}
