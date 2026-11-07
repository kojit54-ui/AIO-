"use client";

// 30秒でためす（/try）。ログインなしで、AIとお客様に選ばれる準備度の診断 → 1問答えて記事の書き出し、まで体験する。
// 書き出しは /api/try でAIが作る（使えないときは見本）。src/lib/tryout.ts・src/lib/tryoutAi.ts。入力はサーバーに残さない。

import Link from "next/link";
import { useEffect, useState } from "react";
import { Confetti, Shiori, type ShioriMood } from "@/components/fun";
import { Logo } from "@/components/landing";
import { ShioriTalk } from "@/components/talk";
import { AIO_QUIZ } from "@/lib/tips";
import { saveTryCarry } from "@/lib/tryoutCarry";
import { WaitlistForm } from "@/components/WaitlistForm";
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
  SAMPLE_STORY_SLOT,
  sampleOpening,
  storyProblem,
} from "@/lib/tryout";

interface TrialResultView {
  title: string;
  paragraphs: string[];
  /** AIが整えたお話の段落 */
  storyAt?: number;
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
  yes: { mood: "right", say: "いいですね！それはAIにもお客様にも伝わる材料です。" },
  some: { mood: "idea", say: "おしい！もう少し足すと、ぐっと良くなります。" },
  no: { mood: "cheer", say: "大丈夫！ここが伸びしろです。" },
};

const QUICK_STAGES: { title: string; phases: Phase[] }[] = [
  { title: "会社", phases: ["intro", "company"] },
  { title: "記事", phases: ["write", "making", "done"] },
];

/** quick＝診断なしで、会社のこと→1問→記事の書き出し（入口ページの「登録せずに、記事づくりを試す」から） */
export function TryOut({ quick = false }: { quick?: boolean }) {
  const stages = quick ? QUICK_STAGES : STAGES;
  const [phase, setPhase] = useState<Phase>(quick ? "company" : "intro");
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
  const [writeNote, setWriteNote] = useState("");
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
      else if (data?.reason === "off_topic" || res.status === 400) {
        // 記事にできない答えは、見本にせず書き直してもらう（そのまま載せない）
        setWriteNote(data?.message ?? "お仕事のお話が読み取れませんでした。どんなお仕事で、何がうれしかったかを書いてみてください。");
        setPhase("write");
      } else setOutcome(fallback(data?.reason ?? "unavailable"));
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
  const stage = stages.findIndex((s) => s.phases.includes(phase));

  // 画面が変わったら上に戻す（スマホで続きが見えるように）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [phase]);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <Logo />
          {quick && (
            <Link href="/welcome" className="inline-flex min-h-10 items-center text-sm font-bold text-muted underline underline-offset-4 hover:text-ink">
              ← 最初のページに戻る
            </Link>
          )}
          {!quick && (
            <span key={bump} className={`rounded-full bg-sun px-3 py-1 text-sm font-black shadow-[0_3px_0_var(--color-sun-dark)] ${bump ? "animate-stamp" : ""}`} aria-live="polite">
              ⭐ {points}pt
            </span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
        <ol className="flex items-center gap-1" aria-label={`${stages.length}つのうち${stage + 1}つめ`}>
          {stages.map((s, i) => (
            <li key={s.title} className="flex min-w-0 flex-1 items-center gap-1">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-black ${
                  i < stage || phase === "done" ? "border-ok-bright bg-ok-soft" : i === stage ? "animate-shine border-sun bg-sun-soft" : "border-line bg-surface text-muted"
                }`}
              >
                {i < stage || phase === "done" ? <span className="animate-stamp">⭐</span> : i + 1}
              </span>
              <span className={`min-w-0 truncate text-xs ${i === stage ? "font-black" : "text-muted"}`}>{s.title}</span>
              {i < stages.length - 1 && <span className={`h-1 min-w-2 flex-1 rounded-full ${i < stage ? "bg-ok-bright" : "bg-line"}`} aria-hidden />}
            </li>
          ))}
        </ol>

        <div key={phase} className="animate-rise space-y-5">
          {phase === "intro" && <Intro quick={quick} onStart={() => setPhase("company")} />}

          {phase === "company" && (
            <section className="card space-y-4">
              <ShioriTalk mood="ask" lines={[quick ? "会社のことを3つ。そのあと、仕事の話を1問聞きます。答えから、記事の書き出しをつくります。" : "まず、あなたの会社のことを3つだけ教えてください。記事の書き出しに使います。", "入れた内容は保存しません。安心してくださいね。"]} />
              <Field label="会社の名前" value={company} onChange={setCompany} placeholder="例）山田製作所" />
              <Field label="会社のある地域" value={region} onChange={setRegion} placeholder="例）岐阜県関市" />
              <Field label="どんな仕事？" value={job} onChange={setJob} placeholder="例）金属の部品加工" />
              <button
                type="button"
                className="btn-primary min-h-14 w-full text-lg"
                disabled={!company.trim() || !region.trim() || !job.trim()}
                onClick={() => {
                  addPoints(30);
                  setPhase(quick ? "write" : "check");
                }}
              >
                {quick ? "次へ" : "診断スタート！"} <span className="inline-block animate-nudge">→</span>
              </button>
            </section>
          )}

          {phase === "check" && (
            <section className="space-y-4">
              <div className="card space-y-2 bg-ink text-white">
                <p className="text-xs font-black text-sky">お客様が、AIにこう聞いたら…</p>
                <p className="text-lg font-black">💬 {customerQuestion(region, job)}</p>
                <p className="text-sm text-white/80">「{company}」がAIに紹介されて、読んだお客様に選ばれるための材料が、そろっているか見てみましょう。</p>
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
              <ShioriTalk mood="ask" lines={["では、さっそく記事を書いてみましょう！", "最近うれしかった仕事を、1つだけ教えてください。話すように書けば大丈夫です。"]} />
              <p className="text-sm text-muted">お客様の名前や、秘密の図面・寸法は書かなくて大丈夫です。</p>
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
                  onChange={(e) => {
                    setStory(e.target.value);
                    setWriteNote("");
                  }}
                  rows={4}
                  maxLength={400}
                  className="field text-lg"
                  placeholder="例）急ぎの試作を頼まれて、なんとか間に合わせた。お客様にとても喜ばれた。"
                />
              </label>
              {(writeNote || (story.trim().length >= 5 && storyProblem(story))) && (
                <p className="flex animate-rise items-start gap-2 rounded-2xl bg-sun-soft px-3 py-2 font-bold" role="status">
                  <span aria-hidden>💡</span>
                  <span>{writeNote || storyProblem(story)}</span>
                </p>
              )}
              <button
                type="button"
                className="btn-primary min-h-14 w-full text-lg"
                disabled={!!storyProblem(story)}
                onClick={() => {
                  addPoints(50);
                  void make();
                }}
              >
                {quick ? "記事の書き出しを見る →" : "✨ 記事にしてもらう"}
              </button>
            </section>
          )}

          {phase === "making" && <Making ready={!!outcome} onDone={() => setAnimDone(true)} onCorrect={() => addPoints(10)} />}

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

function Intro({ onStart, quick }: { onStart: () => void; quick: boolean }) {
  const todo = quick
    ? ["会社のことを3つ入れる", "最近うれしかった仕事を1つ書く", "その場で、記事の書き出しができる"]
    : ["会社のことを3つ入れる", "6つの質問に「はい・いいえ」で答える", "1問答えて、記事の書き出しができる"];
  return (
    <section className="card relative space-y-4 overflow-hidden text-center">
      <span className="absolute -right-8 -top-8 h-32 w-32 animate-blob bg-sun-soft" aria-hidden />
      <p className="relative inline-block rounded-full bg-brand-soft px-3 py-0.5 text-sm font-black text-brand-dark">登録なし</p>
      {quick ? (
        <h1 className="relative text-3xl font-black leading-snug">
          1問答えて、
          <br />
          <span className="text-brand">記事の書き出し</span>を
          <br />
          見てみましょう
        </h1>
      ) : (
        <h1 className="relative text-3xl font-black leading-snug">
          あなたの会社、
          <br />
          AIとお客様に選ばれる準備は
          <br />
          <span className="text-brand">できてる？</span>
        </h1>
      )}
      <div className="relative mx-auto max-w-md text-left">
        <ShioriTalk
          mood="point"
          lines={quick ? ["しおりが、1つだけ質問します。", "答えてもらった話から、その場で記事の書き出しをつくります。"] : ["しおりが、あなたの会社を診断します！", "最後に、その場で記事の書き出しもつくっちゃいますよ。"]}
        />
      </div>
      <ul className="relative mx-auto grid max-w-md gap-2 text-left" aria-label="やること">
        {todo.map((t, i) => (
          <li key={t} className="flex animate-rise items-center gap-3 rounded-2xl border-2 border-brand-soft px-3 py-2 font-bold" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-white">{i + 1}</span>
            {t}
          </li>
        ))}
      </ul>
      <button type="button" className="btn-primary relative min-h-16 w-full max-w-md text-xl" onClick={onStart}>
        ためしてみる <span className="inline-block animate-nudge">→</span>
      </button>
      {quick && (
        <p className="relative text-sm">
          <Link href="/try" className="font-bold text-brand-dark underline">
            AIOの準備度の診断つきでためす
          </Link>
        </p>
      )}
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

/** できてから、自動で結果に進むまでの秒数（豆知識を読み終えられるように、ボタンでもすぐ進める） */
const READY_SECONDS = 6;

/**
 * AIが書き出しを作るあいだ（2026-11-03 田村さん「待つ時間が長かったから工夫がほしい。AIOの豆知識とかほしい」）。
 * 進み具合の3段のあと、「しおりのAIO豆知識」を○×で。正解で +10pt。できたら「書き出しを見る」が出て、少しすると自動で進む
 */
function Making({ ready, onDone, onCorrect }: { ready: boolean; onDone: () => void; onCorrect: () => void }) {
  const [i, setI] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [first] = useState(() => Math.floor(Math.random() * AIO_QUIZ.length));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [right, setRight] = useState(0);
  const [left, setLeft] = useState(READY_SECONDS);
  const stepsDone = i >= MAKING.length - 1 && seconds >= MAKING.length;

  useEffect(() => {
    const t = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (i + 1 >= MAKING.length) return;
    const t = setTimeout(() => setI(i + 1), 1000);
    return () => clearTimeout(t);
  }, [i]);
  // できたら数えはじめ、0になったら進む
  useEffect(() => {
    if (!ready || !stepsDone) return;
    if (left <= 0) {
      onDone();
      return;
    }
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [ready, stepsDone, left, onDone]);

  const quiz = AIO_QUIZ[(first + n) % AIO_QUIZ.length];
  const answer = (v: boolean) => {
    if (picked !== null) return;
    setPicked(v);
    if (v === quiz.answer) {
      setRight((r) => r + 1);
      onCorrect();
    }
  };

  return (
    <section className="card space-y-4 py-6" aria-live="polite">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <Shiori mood={ready && stepsDone ? "right" : "think"} className="h-28 w-auto sm:h-32" />
          {!(ready && stepsDone) && (
            <span className="absolute -right-3 top-4 inline-block animate-write text-3xl" aria-hidden>
              ✏️
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-lg font-black sm:text-xl">{ready && stepsDone ? "できました！" : `${MAKING[i]}…`}</p>
          <ol className="flex flex-wrap gap-1.5 text-xs font-bold" aria-label="進み具合">
            {MAKING.map((m, k) => (
              <li key={m} className={`rounded-full px-2 py-0.5 ${k < i || (ready && stepsDone) ? "bg-ok-soft text-ok" : k === i ? "bg-brand-soft text-brand-dark" : "bg-canvas text-muted"}`}>
                {k < i || (ready && stepsDone) ? "✓ " : ""}
                {m}
              </li>
            ))}
          </ol>
          <div className="h-3 overflow-hidden rounded-full bg-canvas-deep" aria-hidden>
            {ready && stepsDone ? (
              <div className="h-full w-full rounded-full bg-ok-bright" />
            ) : (
              <div className="h-full w-full animate-stripe rounded-full bg-[length:28px_100%] bg-[repeating-linear-gradient(45deg,var(--color-brand)_0_7px,var(--color-sky)_7px_14px)]" />
            )}
          </div>
          <p className="text-xs text-muted tabular-nums">{ready && stepsDone ? "豆知識は、見終わってからでも大丈夫です。" : `AIがあなたのお話を読んで、記事の文に整えています（${seconds}秒）`}</p>
        </div>
      </div>

      {ready && stepsDone && (
        <button type="button" className="btn-primary min-h-14 w-full animate-pop text-lg" onClick={onDone}>
          ✨ 書き出しを見る（{left}）
        </button>
      )}

      <div key={n} className="animate-enter space-y-3 rounded-2xl border-2 border-sun bg-sun-soft p-4">
        <p className="flex items-center justify-between gap-2 text-xs font-bold">
          <span className="rounded-full bg-sun px-2.5 py-0.5 text-ink">💡 しおりのAIO豆知識</span>
          {right > 0 && <span className="text-brand-dark">正解 {right} 問</span>}
        </p>
        <p className="font-black leading-snug">Q. {quiz.q}</p>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((v) => {
            const chosen = picked === v;
            const correct = picked !== null && v === quiz.answer;
            return (
              <button
                key={String(v)}
                type="button"
                disabled={picked !== null}
                onClick={() => answer(v)}
                aria-label={v ? "まる（そう思う）" : "ばつ（そう思わない）"}
                className={`min-h-14 rounded-2xl border-2 text-3xl font-black transition-transform ${
                  correct ? "animate-pop border-ok-bright bg-ok-soft text-ok" : chosen ? "border-danger bg-danger-soft text-danger" : "border-line bg-surface hover:-translate-y-0.5"
                }`}
              >
                {v ? "○" : "×"}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="animate-rise space-y-2">
            <p className="font-black">{picked === quiz.answer ? "🎉 正解！ +10pt" : `おしい！ 答えは「${quiz.answer ? "○" : "×"}」`}</p>
            <p className="text-sm">{quiz.why}</p>
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-bold text-brand-dark underline"
                onClick={() => {
                  setPicked(null);
                  setN((v) => v + 1);
                }}
              >
                次の問題 →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Done({ outcome, story, future, onAgain, onKeep }: { outcome: Outcome; story: string; future: FutureScene; onAgain: () => void; onKeep: () => boolean }) {
  const [kept, setKept] = useState<boolean | null>(null);
  const [peek, setPeek] = useState(false);
  const opening = outcome.result;
  const ai = outcome.mode === "ai";
  const storyAt = opening.storyAt ?? -1;
  const lines = ai
    ? ["できました！あなたのお話を、AIが記事の文に整えました。", opening.cheer].filter(Boolean)
    : ["できました！これが、記事の書き出しの見本です。", SAMPLE_REASON[outcome.reason] ?? "AIにつながると、あなたのお話を読みやすく整えて入れます。"];
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
            i === storyAt && p === SAMPLE_STORY_SLOT ? (
              <p key={i} className="rounded-2xl border-2 border-dashed border-brand/50 bg-brand-soft/50 px-3 py-2 text-sm font-bold text-brand-dark">
                ✨ {p}
              </p>
            ) : i === storyAt ? (
              <p key={i}>
                <mark className="rounded-md bg-sun/60 px-1 font-bold text-ink">{p}</mark>
                <span className="ml-1 whitespace-nowrap text-xs font-black text-brand-dark">← AIが整えたあなたのお話</span>
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
          {storyAt >= 0 && opening.paragraphs[storyAt] && <Polished before={story} after={opening.paragraphs[storyAt]} />}
        </div>
      ) : (
        <p className="rounded-2xl border border-warn-soft bg-warn-soft px-3 py-2 text-sm text-warn" role="note">
          今回はAIを使わない見本です（AIは未使用）。会社の名前・地域・仕事だけを入れて作りました。AIにつながると、あなたのお話を読みやすく整えて入れます。
        </p>
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
        <div className="mx-auto mt-4 max-w-md text-left">
          <p className="mb-2 text-sm text-white/85">新規のお申し込みは準備中です。招待された方は、上の「続きを書く」からログインできます。</p>
          <div className="rounded-2xl bg-white p-3 text-sumi">
            <WaitlistForm source="try" />
          </div>
        </div>
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

/** AIが何をしたかが分かるように、答えと整えた文を並べる */
function Polished({ before, after }: { before: string; after: string }) {
  return (
    <section className="card animate-rise space-y-2" aria-label="AIが整えたところ">
      <h3 className="font-black">✨ AIが、こう整えました</h3>
      <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl bg-canvas p-3">
          <p className="text-xs font-black text-muted">あなたの答え</p>
          <p className="mt-1 text-muted">{before}</p>
        </div>
        <span className="self-center text-center text-2xl font-black text-brand" aria-hidden>
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </span>
        <div className="rounded-2xl border-2 border-sun bg-sun-soft p-3">
          <p className="text-xs font-black text-brand-dark">記事の文</p>
          <p className="mt-1 font-bold">{after}</p>
        </div>
      </div>
      <p className="text-sm text-muted">話し言葉を読みやすい文に直し、意味と事実は変えていません。</p>
    </section>
  );
}
