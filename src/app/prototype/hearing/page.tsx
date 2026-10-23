"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Notice, PageSkeleton } from "@/components/ui";
import { AioMeter, AioWhy, Cheer, ProgressBar, WhyAio } from "@/prototype/components";
import { type AioPoint, HEARING_QUESTIONS, type HearingAnswer, SAMPLE_LABEL, answeredCount, collectedAio, nextDeepDive, withNewText } from "@/prototype/growth";
import { growActions, useGrow } from "@/prototype/store";

/** 顧客が1問ずつ答えるヒアリング。答えが短いと、深掘りの質問が返ってくる */
export default function HearingPage() {
  const g = useGrow();
  const [step, setStep] = useState<number | null>(null);
  const [deep, setDeep] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [cheer, setCheer] = useState<AioPoint | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step, deep]);

  if (!g.ready) return <PageSkeleton />;
  const total = HEARING_QUESTIONS.length;
  // 最初は、まだ答えていない最初の問いから始める
  const current = step ?? Math.max(0, HEARING_QUESTIONS.findIndex((q) => !g.answers[q.id]?.text.trim()));
  const done = current >= total || (step === null && answeredCount(g.answers) === total);

  if (done) {
    return (
      <main className="page max-w-3xl space-y-4">
        <Notice tone="ok" title="ヒアリングが終わりました">
          おつかれさまでした！AIに「どこの、どんな会社か」を伝える材料がそろいました。この内容をもとに、記事の設計図を提案します。答えはあとから直せます。
        </Notice>
        <div className="flex flex-wrap gap-2">
          <Link href="/prototype/plan" className="btn-primary">
            記事の設計図を見る
          </Link>
          <button type="button" className="btn-secondary" onClick={() => { setStep(0); setDeep(null); setText(g.answers[HEARING_QUESTIONS[0].id]?.text ?? ""); }}>
            答えを見直す
          </button>
        </div>
      </main>
    );
  }

  const q = HEARING_QUESTIONS[current];
  const saved: HearingAnswer = g.answers[q.id] ?? { questionId: q.id, text: "", followUps: [] };
  const value = step === null && !deep ? saved.text : text;

  function go(to: number, cheerFor: AioPoint | null = null) {
    setCheer(cheerFor);
    setStep(to);
    setDeep(null);
    setText(to < total ? (g.answers[HEARING_QUESTIONS[to].id]?.text ?? "") : "");
  }

  function submit() {
    if (deep) {
      const next = { ...saved, followUps: [...saved.followUps, { question: deep, answer: value.trim() }] };
      growActions.saveAnswer(next);
      const more = value.trim() ? nextDeepDive(q, next) : null;
      if (more) {
        setDeep(more);
        setText("");
        setCheer(null);
      } else go(current + 1, value.trim() ? q.aio : null);
      return;
    }
    // 答えを書き直したら、深掘りは聞き直す
    const next = withNewText(saved, value);
    growActions.saveAnswer(next);
    const dd = nextDeepDive(q, next);
    if (dd) {
      setStep(current);
      setDeep(dd);
      setText("");
      setCheer(null);
    } else go(current + 1, q.aio);
  }

  return (
    <main className="page max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">ヒアリング</h1>
        <p className="text-muted">文章を考える必要はありません。短い言葉や箇条書きで大丈夫です。分からない問いは「あとで答える」で進めます。</p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm text-muted">
          <span>
            {current + 1} / {total}
          </span>
          <span aria-live="polite">答えは自動で保存されます</span>
        </div>
        <ProgressBar value={current + 1} max={total} label="ヒアリングの進み具合" />
      </div>

      {cheer && <Cheer point={cheer} />}

      <form
        className="card space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim() || deep) submit();
        }}
      >
        {deep ? (
          <>
            <div className="rounded-lg bg-canvas px-3 py-2 text-sm">
              <p className="text-muted">{q.label}</p>
              <p className="whitespace-pre-wrap">{saved.text}</p>
            </div>
            <Notice tone="info" title="もう少しだけ教えてください">
              具体的に分かると、ほかの会社には書けない記事になります。（深掘りの質問は{SAMPLE_LABEL}）
            </Notice>
            <div>
              <label htmlFor="answer" className="field-label text-lg">
                {deep}
              </label>
              <textarea id="answer" ref={inputRef} className="field min-h-28" value={value} onChange={(e) => setText(e.target.value)} />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="answer" className="field-label text-lg">
              {q.label}
            </label>
            <p id="answer-example" className="mb-1 whitespace-pre-wrap text-sm text-muted">
              {q.example}
            </p>
            <p id="answer-tip" className="mb-2 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-dark">
              コツ：{q.tip}
            </p>
            <div className="mb-2">
              <AioWhy point={q.aio} />
            </div>
            <textarea
              id="answer"
              ref={inputRef}
              aria-describedby="answer-example answer-tip"
              className="field min-h-36"
              value={value}
              onChange={(e) => {
                setStep(current);
                setText(e.target.value);
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => (deep ? go(current) : go(Math.max(0, current - 1)))} disabled={current === 0 && !deep}>
              戻る
            </button>
            <button type="button" className="btn-secondary" onClick={() => go(current + 1)}>
              {deep ? "この質問は飛ばす" : "あとで答える"}
            </button>
          </div>
          <button type="submit" className="btn-primary" disabled={!value.trim()}>
            次へ
          </button>
        </div>
      </form>

      <AioMeter points={HEARING_QUESTIONS.map((x) => x.aio)} collected={collectedAio(HEARING_QUESTIONS, (id) => !!g.answers[id]?.text.trim())} />
      {current === 0 && !deep && <WhyAio compact />}

      <Link href="/prototype" className="inline-block text-brand-dark underline">
        ホームへ戻る（答えは保存されています）
      </Link>
    </main>
  );
}
