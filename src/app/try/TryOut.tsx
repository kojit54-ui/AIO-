"use client";

// 30秒でためす（/try）。ログインなしで、AIと人に選ばれる準備度の診断 → 1問答えて記事の書き出し、まで体験する。
// いまはサンプル（AIにはつながない）。src/lib/tryout.ts。入力はこのブラウザの画面の中だけで使い、保存も送信もしない。

import Link from "next/link";
import { useEffect, useState } from "react";
import { Confetti, Shiori, type ShioriMood } from "@/components/fun";
import { Logo } from "@/components/landing";
import { ShioriTalk } from "@/components/talk";
import { SampleNotice } from "@/components/ui";
import { saveTryCarry } from "@/lib/tryoutCarry";
import { FutureAnswer } from "./FutureAnswer";
import {
  READINESS_QUESTIONS,
  type ReadinessAnswer,
  customerQuestion,
  futureScene,
  type FutureScene,
  missingMaterials,
  readinessRank,
  readinessScore,
  sampleOpening,
} from "@/lib/tryout";

interface TrialResultView {
  title: string;
  paragraphs: string[];
  nextAsks: string[];
  cheer: string;
}
interface Outcome {
  mode: "ai" | "sample";
  reason: string;
  result: TrialResultView;
}

/** 見本で作ったときに、しおりが伝えること */
const SAMPLE_REASON: Record<string, string> = {
  visitor_limit: "今日ためせる回数を使いきったので、今回は見本で作りました。",
  daily_limit: "今日はたくさんの人がためしたので、今回は見本で作りました。",
  budget_exceeded: "今月ためせる分がいっぱいになったので、今回は見本で作りました。",
  disabled: "いまはAIをお休みしているので、見本で作りました。",
  off_topic: "お仕事のお話が読み取れなかったので、見本で作りました。お仕事のことを書いてもう一度ためしてみてください。",
  unavailable: "いまAIにつながらなかったので、今回は見本で作りました。",
  checked: "AIの文章に確かめきれないところがあったので、今回は見本で作りました。",
};

type Phase = "intro" | "company" | "check" | "result" | "write" | "making" | "done";

const STAGES: { title: string; phases: Phase[] }[] = [
  { title: "会社", phases: ["intro", "company"] },
  { title: "診断", phases: ["check"] },
  { title: "結果", phases: ["result"] },
  { title: "記事", phases: ["write", "making", "done"] },
];

const CHOICES: { value: ReadinessAnswer; label: string; icon: string }[] = [
  { value: "yes", label: "はい", icon: "⭕" },
  { value: "some", label: "少し", icon: "🔺" },
  { value: "no", label: "いいえ", icon: "❌" },
];

const REACT: Record<ReadinessAnswer, { mood: ShioriMood; say: string }> = {
  yes: { mood: "right", say: "いいですね！それはAIにも人にも伝わる材料です。" },
  some: { mood: "idea", say: "おしい！もう少し足すと、ぐっと良くなります。" },
  no: { mood: "cheer", say: "大丈夫！ここが伸びしろです。" },
};

export function TryOut() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [company, setCompany] = useState("");
  const [region, setRegion] = useState("");
  const [job, setJob] = useState("");
  const [answers, setAnswers] = useState<Record<string, ReadinessAnswer>>({});
  const [qIndex, setQIndex] = useState(0);
  const [last, setLast] = useState<ReadinessAnswer | null>(null);
  const [story, setStory] = useState("");
  const [points, setPoints] = useState(0);
  const [bump, setBump] = useState(0);
  // ロボットよけ：開いた時刻と、人には見えない欄
  const [startedAt] = useState(() => Date.now());
  const [website, setWebsite] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [animDone, setAnimDone] = useState(false);

  // 書き出しを作る。AIを使えないときは見本で続ける
  const make = async () => {
    setOutcome(null);
    setAnimDone(false);
    setPhase("making");
    const fallback = (reason: string): Outcome => ({ mode: "sample", reason, result: { ...sampleOpening({ company, region, job, answer: story }), cheer: "" } });
    try {
      const res = await fetch("/api/try", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, region, job, story, answers, startedAt, website }),
      });
      const data = (await res.json().catch(() => null)) as { mode?: string; reason?: string; result?: TrialResultView; message?: string } | null;
      if (res.ok && data?.mode === "ai" && data.result) setOutcome({ mode: "ai", reason: "", result: data.result });
      else setOutcome(fallback(data?.reason ?? (res.status === 400 ? "invalid" : "unavailable")));
    } catch {
      setOutcome(fallback("unavailable"));
    }
  };
  useEffect(() => {
    if (phase === "making" && animDone && outcome) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
  }, [phase, animDone, outcome]);

  const addPoints = (n: number) => {
    setPoints((p) => p + n);
    setBump((b) => b + 1);
  };
  const stage = STAGES.findIndex((s) => s.phases.includes(phase));

  // 画面が変わったら上に戻す（スマホで続きが見えるように）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Logo />
          <span key={bump} className={`rounded-full bg-sun px-3 py-1 text-sm font-black shadow-[0_3px_0_var(--color-sun-dark)] ${bump ? "animate-stamp" : ""}`} aria-live="polite">
            ⭐ {points}pt
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
        <ol className="flex items-center gap-1" aria-label={`4つのうち${stage + 1}つめ`}>
          {STAGES.map((s, i) => (
            <li key={s.title} className="flex min-w-0 flex-1 items-center gap-1">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-black ${
                  i < stage || phase === "done" ? "border-ok-bright bg-ok-soft" : i === stage ? "animate-shine border-sun bg-sun-soft" : "border-line bg-surface text-muted"
                }`}
              >
                {i < stage || phase === "done" ? <span className="animate-stamp">⭐</span> : i + 1}
              </span>
              <span className={`min-w-0 truncate text-xs ${i === stage ? "font-black" : "text-muted"}`}>{s.title}</span>
              {i < STAGES.length - 1 && <span className={`h-1 min-w-2 flex-1 rounded-full ${i < stage ? "bg-ok-bright" : "bg-line"}`} aria-hidden />}
            </li>
          ))}
        </ol>

        <div key={phase} className="animate-rise space-y-5">
          {phase === "intro" && <Intro onStart={() => setPhase("company")} />}

          {phase === "company" && (
            <section className="card space-y-4">
              <ShioriTalk mood="ask" lines={["まず、あなたの会社のことを3つだけ教えてください。", "入れた内容は保存しません。安心してくださいね。"]} />
              <Field label="会社の名前" value={company} onChange={setCompany} placeholder="例）山田製作所" />
              <Field label="会社のある地域" value={region} onChange={setRegion} placeholder="例）岐阜県関市" />
              <Field label="どんな仕事？" value={job} onChange={setJob} placeholder="例）金属の部品加工" />
              <button
                type="button"
                className="btn-primary min-h-14 w-full text-lg"
                disabled={!company.trim() || !region.trim() || !job.trim()}
                onClick={() => {
                  addPoints(30);
                  setPhase("check");
                }}
              >
                診断スタート！ <span className="inline-block animate-nudge">→</span>
              </button>
            </section>
          )}

          {phase === "check" && (
            <section className="space-y-4">
              <div className="card space-y-2 bg-ink text-white">
                <p className="text-xs font-black text-sky">お客様が、AIにこう聞いたら…</p>
                <p className="text-lg font-black">💬 {customerQuestion(region, job)}</p>
                <p className="text-sm text-white/80">「{company}」がAIに紹介されて、読んだ人に選ばれるための材料が、そろっているか見てみましょう。</p>
              </div>
              <div className="card space-y-4">
                <p className="text-sm font-black text-brand-dark">
                  しつもん {qIndex + 1} / {READINESS_QUESTIONS.length}
                </p>
                <div className="flex gap-1" aria-hidden>
                  {READINESS_QUESTIONS.map((q, i) => (
                    <span key={q.id} className={`h-2 flex-1 rounded-full ${i < qIndex ? "bg-ok-bright" : i === qIndex ? "bg-sun" : "bg-line"}`} />
                  ))}
                </div>
                {last && (
                  <p key={`${qIndex}-r`} className="flex animate-pop items-center gap-2 rounded-2xl bg-sun-soft px-3 py-2 text-sm font-bold">
                    <Shiori mood={REACT[last].mood} className="h-10 w-auto" />
                    {REACT[last].say} <span className="ml-auto shrink-0 font-black text-brand">+10pt</span>
                  </p>
                )}
                <p key={qIndex} className="animate-enter text-xl font-black leading-snug">
                  {READINESS_QUESTIONS[qIndex].q}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CHOICES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-line bg-surface font-black shadow-[0_4px_0_var(--color-line)] transition-transform hover:-translate-y-1 hover:border-brand active:translate-y-0.5"
                      onClick={() => {
                        const q = READINESS_QUESTIONS[qIndex];
                        setAnswers((a) => ({ ...a, [q.id]: c.value }));
                        setLast(c.value);
                        addPoints(10);
                        if (qIndex + 1 < READINESS_QUESTIONS.length) setQIndex(qIndex + 1);
                        else setPhase("result");
                      }}
                    >
                      <span className="text-2xl" aria-hidden>
                        {c.icon}
                      </span>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {phase === "result" && <Result company={company} answers={answers} onNext={() => setPhase("write")} />}

          {phase === "write" && (
            <section className="card relative space-y-4">
              <ShioriTalk mood="jersey-cheer" lines={["では、さっそく記事を書いてみましょう！", "最近うれしかった仕事を、1つだけ教えてください。話すように書けば大丈夫です。"]} />
              {/* ロボットよけ。人には見えない */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
              <label className="block">
                <span className="field-label">最近うれしかった仕事は？</span>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={4}
                  maxLength={400}
                  className="field text-lg"
                  placeholder="例）急ぎの試作を頼まれて、なんとか間に合わせた。お客様にとても喜ばれた。"
                />
              </label>
              <button
                type="button"
                className="btn-primary min-h-14 w-full text-lg"
                disabled={story.trim().length < 5}
                onClick={() => {
                  addPoints(50);
                  void make();
                }}
              >
                ✨ 記事にしてもらう
              </button>
            </section>
          )}

          {phase === "making" && <Making onDone={() => setAnimDone(true)} />}

          {phase === "done" && (
            <Done
              outcome={outcome ?? { mode: "sample", reason: "unavailable", result: { ...sampleOpening({ company, region, job, answer: story }), cheer: "" } }}
              story={story}
              future={futureScene({ company, region, job, answer: story })}
              onKeep={() => saveTryCarry({ company, region, job, story })}
              onAgain={() => {
                setPhase("intro");
                setAnswers({});
                setQIndex(0);
                setLast(null);
                setStory("");
                setPoints(0);
                setBump(0);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} maxLength={40} placeholder={placeholder} className="field min-h-14 text-lg" />
    </label>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="card relative space-y-4 overflow-hidden text-center">
      <span className="absolute -right-8 -top-8 h-32 w-32 animate-blob bg-sun-soft" aria-hidden />
      <p className="relative inline-block rounded-full bg-brand-soft px-3 py-0.5 text-sm font-black text-brand-dark">登録なし・30秒</p>
      <h1 className="relative text-3xl font-black leading-snug">
        あなたの会社、
        <br />
        AIと人に選ばれる準備は
        <br />
        <span className="text-brand">できてる？</span>
      </h1>
      <div className="relative mx-auto max-w-md text-left">
        <ShioriTalk mood="point" lines={["しおりが、あなたの会社を診断します！", "最後に、その場で記事の書き出しもつくっちゃいますよ。"]} />
      </div>
      <ul className="relative mx-auto grid max-w-md gap-2 text-left" aria-label="やること">
        {["会社のことを3つ入れる", "6つの質問に「はい・いいえ」で答える", "1問答えて、記事の書き出しができる"].map((t, i) => (
          <li key={t} className="flex animate-rise items-center gap-3 rounded-2xl border-2 border-brand-soft px-3 py-2 font-bold" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-white">{i + 1}</span>
            {t}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-primary relative min-h-16 w-full max-w-md text-xl" onClick={onStart}>
        ためしてみる <span className="inline-block animate-nudge">→</span>
      </button>
    </section>
  );
}

/** 点数のメーター。0 から数えあがる */
function Result({ company, answers, onNext }: { company: string; answers: Record<string, ReadinessAnswer>; onNext: () => void }) {
  const score = readinessScore(answers);
  const rank = readinessRank(score);
  const missing = missingMaterials(answers);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= score) return;
    const t = setTimeout(() => setShown((s) => Math.min(score, s + Math.max(1, Math.ceil((score - s) / 8)))), 40);
    return () => clearTimeout(t);
  }, [shown, score]);
  const finished = shown >= score;
  const deg = (shown / 100) * 360;

  return (
    <section className="space-y-4">
      <div className="card space-y-4 text-center">
        <p className="font-black text-muted">{company}の、選ばれる準備度</p>
        <div
          className="relative mx-auto grid h-48 w-48 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--color-brand) ${deg}deg, var(--color-canvas-deep) ${deg}deg)` }}
          role="img"
          aria-label={`${score}点`}
        >
          <div className="grid h-36 w-36 place-items-center rounded-full bg-surface">
            <p className="leading-none">
              <span className="text-6xl font-black text-brand">{shown}</span>
              <span className="font-black">点</span>
            </p>
          </div>
        </div>
        {finished && (
          <p className="inline-block animate-stamp rounded-full border-2 border-sun-dark bg-sun px-4 py-1 text-lg font-black shadow-[0_4px_0_var(--color-sun-dark)]">
            {rank.icon} {rank.name}
          </p>
        )}
      </div>
      {finished && (
        <div className="animate-rise space-y-4">
          <div className="card">
            <ShioriTalk mood={score >= 60 ? "joy" : "cheer"} lines={rank.say} />
          </div>
          {missing.length > 0 && (
            <div className="card space-y-3">
              <h2 className="text-lg font-black">🧩 足りない材料</h2>
              <ul className="flex flex-wrap gap-2">
                {missing.map((m, i) => (
                  <li key={m.id} className="animate-pop rounded-full border-2 border-dashed border-brand px-3 py-1 text-sm font-bold" style={{ animationDelay: `${i * 0.08}s` }}>
                    {m.missing}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted">どれも、しおりの質問に答えるだけでそろいます。むずかしい作業はありません。</p>
            </div>
          )}
          <button type="button" className="btn-primary min-h-16 w-full text-lg" onClick={onNext}>
            1問答えて、記事の書き出しを作ってみる <span className="inline-block animate-nudge">→</span>
          </button>
          <p className="text-center text-xs text-muted">この点数は、答えから出した目安です。紹介するかどうかはAIが、頼むかどうかは読んだ人が決めます。</p>
        </div>
      )}
    </section>
  );
}

const MAKING = ["答えを読んでいます", "見出しを考えています", "書き出しを書いています"];

function Making({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => (i + 1 < MAKING.length ? setI(i + 1) : onDone()), 1000);
    return () => clearTimeout(t);
  }, [i, onDone]);
  return (
    <section className="card grid place-items-center gap-4 py-10 text-center" aria-live="polite">
      <div className="relative">
        <Shiori mood="think" className="h-40 w-auto" />
        <span className="absolute -right-4 top-6 inline-block animate-write text-4xl" aria-hidden>
          ✏️
        </span>
      </div>
      <p className="text-xl font-black">{MAKING[i]}…</p>
      <div className="h-3 w-full max-w-xs overflow-hidden rounded-full bg-canvas-deep" aria-hidden>
        <div className="h-full rounded-full bg-brand transition-[width] duration-1000" style={{ width: `${((i + 1) / MAKING.length) * 100}%` }} />
      </div>
    </section>
  );
}

function Done({ outcome, story, future, onAgain, onKeep }: { outcome: Outcome; story: string; future: FutureScene; onAgain: () => void; onKeep: () => boolean }) {
  const [kept, setKept] = useState<boolean | null>(null);
  const [peek, setPeek] = useState(false);
  const opening = outcome.result;
  const ai = outcome.mode === "ai";
  const quote = ai ? -1 : opening.paragraphs.findIndex((p) => p.startsWith("「"));
  const lines = ai
    ? ["できました！あなたの答えから、AIが書き出しを作りました。", opening.cheer].filter(Boolean)
    : ["できました！これが、あなたの記事の書き出しです。", SAMPLE_REASON[outcome.reason] ?? "あなたのお話が、記事の真ん中になっていますよ。"];
  return (
    <section className="space-y-4">
      <Confetti count={70} />
      <div className="card">
        <ShioriTalk mood="jersey-done" lines={lines} />
      </div>

      <article className="relative rotate-[-0.6deg] rounded-3xl border-2 border-line bg-surface p-5 shadow-[0_10px_0_var(--color-line)] sm:p-7">
        <span className="absolute -right-3 -top-4 rotate-6 animate-stamp rounded-xl border-2 border-danger bg-surface px-2 py-0.5 text-sm font-black text-danger">下書き</span>
        <h2 className="text-xl font-black leading-snug sm:text-2xl">{opening.title}</h2>
        <div className="mt-3 space-y-3 leading-loose">
          {opening.paragraphs.map((p, i) =>
            i === quote ? (
              <p key={i}>
                <mark className="rounded-md bg-sun/60 px-1 font-bold text-ink">{p}</mark>
                <span className="ml-1 text-xs font-black text-brand-dark">← あなたのお話から</span>
              </p>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
          <p className="select-none text-muted blur-[3px]" aria-hidden>
            このあと、ご相談の中身、むずかしかったところ、工夫したこと、お客様の声が続きます。読んだ人がすぐ相談できるように…
          </p>
        </div>
      </article>
      {ai ? (
        <div className="space-y-2">
          <p className="rounded-2xl border border-brand-soft bg-brand-soft px-3 py-2 text-sm text-brand-dark" role="note">
            ✨ AIが書いた下書きです。事実と違うところがあれば、直してから使います。入力した内容は保存していません。
          </p>
          <details className="rounded-2xl bg-canvas px-4 py-2 text-sm">
            <summary className="cursor-pointer font-bold">あなたの答え</summary>
            <p className="mt-1 text-muted">{story}</p>
          </details>
        </div>
      ) : (
        <SampleNotice />
      )}

      {peek ? (
        <FutureAnswer scene={future} title={opening.title} />
      ) : (
        <button
          type="button"
          onClick={() => setPeek(true)}
          className="group flex w-full animate-rise items-center gap-3 rounded-3xl border-2 border-ink/80 bg-ink p-4 text-left text-white shadow-[0_6px_0_rgba(0,0,0,.25)] transition-transform hover:-translate-y-1"
        >
          <span className="grid h-14 w-14 shrink-0 animate-shine place-items-center rounded-2xl bg-sun text-3xl" aria-hidden>
            🔮
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-black text-sun">おまけ</span>
            <span className="block text-lg font-black leading-snug">1年後、お客様がAIに相談したら…？ のぞいてみる</span>
          </span>
          <span className="text-2xl transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </button>
      )}

      <div className="card space-y-2">
        <h3 className="font-black">📝 続きは、しおりがこう聞きます</h3>
        <ul className="space-y-1">
          {opening.nextAsks.map((q) => (
            <li key={q} className="rounded-2xl bg-canvas px-3 py-1.5 font-bold">
              {q}
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">答えるほど、AIに紹介されやすく、読んだ人が安心できる材料（経験・数字）がそろった記事になります。</p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-6 text-center text-white shadow-[0_8px_0_var(--color-brand-dark)]">
        <p className="mx-auto mb-3 inline-flex animate-stamp items-center gap-2 rounded-full bg-sun px-3 py-1 font-black text-ink">🎖️ スタンプ「はじめまして」ゲット！</p>
        <h2 className="text-2xl font-black leading-snug">この続き、書いてみませんか？</h2>
        <p className="mt-1 font-bold text-white/90">ログインすると、しおりといっしょに最後まで書けます。</p>
        <Link href="/login" className="btn mt-4 min-h-14 border-sun bg-sun px-7 text-lg text-ink shadow-[0_4px_0_var(--color-sun-dark)] hover:-translate-y-0.5">
          続きを書く <span className="inline-block animate-nudge">→</span>
        </Link>
        <div className="mx-auto mt-4 max-w-md rounded-2xl bg-white/15 px-4 py-3 text-left text-sm">
          {kept ? (
            <p className="font-bold">✅ このブラウザに覚えました。ログインしたあと「会社のことを教える」で使えます（7日間）。</p>
          ) : (
            <>
              <p className="font-bold">今入れた会社のことを、ログインしたあとに使いますか？</p>
              <p className="text-white/85">このブラウザの中にだけ覚えます。サーバーには送りません。</p>
              <button type="button" className="mt-2 rounded-full bg-white px-4 py-1.5 font-black text-brand-dark" onClick={() => setKept(onKeep())}>
                このブラウザに覚えておく
              </button>
              {kept === false && <p className="mt-1">覚えられませんでした（ブラウザの設定で止められています）。</p>}
            </>
          )}
        </div>
        <p className="mt-3 text-sm text-white/85">招待メールが届いていない方は、コタムの担当者にお声がけください。</p>
      </div>
      <p className="text-center">
        <button type="button" className="text-sm font-bold text-brand-dark underline" onClick={onAgain}>
          もう一度ためす
        </button>
        <span className="sr-only">（あなたの答え：{story}）</span>
      </p>
    </section>
  );
}
