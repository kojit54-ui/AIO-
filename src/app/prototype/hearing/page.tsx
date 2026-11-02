"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Shiori } from "@/components/fun";
import { Notice, PageSkeleton } from "@/components/ui";
import { useStore } from "@/mock/store";
import { AioMeter, AioWhy, Cheer, ProgressBar, WhyAio } from "@/prototype/components";
import { type AioPoint, HEARING_QUESTIONS, type HearingAnswer, collectedAio, deepDiveWhy, nextDeepDive, pendingDeepDive, resumeIndex, withNewText, MAX_ANSWER } from "@/prototype/growth";
import { growActions, useGrow, useGrowSync } from "@/prototype/store";

/**
 * 顧客が1問ずつ答えるヒアリング。答えるたびに、AIが聞く理由を添えて深掘りの質問を返す（1問につき4回まで。2026-11-02）。
 * 本物のデータ（remote）ではAIが答えを読んで聞き、試作（local）では決まった深掘りを返す
 */
export default function HearingPage() {
  const g = useGrow();
  const sync = useGrowSync();
  const { user } = useStore();
  const ai = sync.mode === "remote" && !!user;
  const orgId = user?.organizationIds[0];
  const [thinking, setThinking] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
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
  // 最初は、まだ答えていない問いか、深掘りが残っている問いから始める（読み込み直しても続きから）
  const current = step ?? resumeIndex(g.answers);
  const done = current >= total;

  if (done) {
    return (
      <main className="page max-w-3xl space-y-4">
        <Notice tone="ok" title="答え終わりました">
          おつかれさまでした！AIに「どこの、どんな会社か」を伝える材料がそろいました。この内容をもとに、しおりが書く記事をおすすめします。答えはあとから直せます。
        </Notice>
        <div className="flex flex-wrap gap-2">
          <Link href="/prototype/plan" className="btn-primary">
            書く記事を決める
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
  const activeDeep = deep ?? (step === null && !saved.draft ? nextDeepDive(q, saved) : null);
  const value = step === null && !activeDeep ? saved.text : text;

  function go(to: number, cheerFor: AioPoint | null = null) {
    setCheer(cheerFor);
    setStep(to);
    setDeep(null);
    setText(to < total ? (g.answers[HEARING_QUESTIONS[to].id]?.text ?? "") : "");
  }

  /** AIに次の深掘りを聞く。質問が来たら答え待ちとして保存して true を返す。要らない・失敗したら深掘りを終える */
  async function askAi(next: HearingAnswer): Promise<boolean> {
    if (!ai || !orgId) return false;
    setThinking(true);
    setAiError(null);
    try {
      const res = await fetch(`/api/organizations/${encodeURIComponent(orgId)}/hearing-follow-up`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questionId: q.id, answer: { text: next.text, followUps: next.followUps }, idempotencyKey: crypto.randomUUID() }),
      }).catch(() => null);
      const json = ((await res?.json().catch(() => null)) ?? {}) as { followUp?: { question: string; why: string } | null; message?: string };
      if (res?.ok && json.followUp) {
        growActions.saveAnswer({ ...next, followUps: [...next.followUps, { question: json.followUp.question, why: json.followUp.why, answer: "", pending: true }] });
        setStep(current);
        setDeep(json.followUp.question);
        setText("");
        setCheer(null);
        return true;
      }
      if (!res?.ok) setAiError(json.message ?? "AIが聞き返せませんでした。このまま次へ進めます");
      growActions.saveAnswer({ ...next, deepDiveDone: true });
      return false;
    } finally {
      setThinking(false);
    }
  }

  async function submit(answer = value) {
    if (ai) {
      let next: HearingAnswer;
      if (activeDeep) {
        // 答え待ちの深掘りに答えを入れる。飛ばしたら（空の答え）、この問いではもう聞かない
        const prev = saved.followUps.slice(0, -1);
        const last = saved.followUps[saved.followUps.length - 1];
        next = { ...saved, followUps: [...prev, { question: activeDeep, why: last?.why, answer: answer.trim() }] };
        if (!answer.trim()) {
          growActions.saveAnswer({ ...next, deepDiveDone: true });
          return go(current + 1);
        }
      } else {
        next = withNewText(saved, value);
      }
      growActions.saveAnswer(next);
      if (!(await askAi(next))) go(current + 1, q.aio);
      return;
    }
    if (activeDeep) {
      // 飛ばした深掘りも空の答えとして残し、読み込み直しても同じ質問を聞き直さない
      const next = { ...saved, followUps: [...saved.followUps, { question: activeDeep, answer: answer.trim() }] };
      growActions.saveAnswer(next);
      const more = answer.trim() ? nextDeepDive(q, next) : null;
      if (more) {
        setStep(current);
        setDeep(more);
        setText("");
        setCheer(null);
      } else go(current + 1, answer.trim() ? q.aio : null);
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
        <h1 className="text-2xl font-bold">会社のことを教える</h1>
        <p className="text-muted">文章を考える必要はありません。短い言葉や箇条書きで大丈夫です。分からない問いは「あとで答える」で進めます。</p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm text-muted">
          <span>
            {current + 1} / {total}
          </span>
          <span aria-live="polite">答えは自動で保存されます</span>
        </div>
        <ProgressBar value={current + 1} max={total} label="答えた進み具合" />
      </div>

      {cheer && <Cheer point={cheer} />}
      {aiError && <Notice tone="warn" title={aiError} />}

      <form
        className="card space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim() || activeDeep) submit();
        }}
      >
        {activeDeep ? (
          <>
            <div className="rounded-lg bg-canvas px-3 py-2 text-sm">
              <p className="text-muted">{q.label}</p>
              <p className="whitespace-pre-wrap">{saved.text}</p>
            </div>
            <div className="flex animate-pop items-end gap-3 rounded-2xl bg-ok-soft px-3 pt-2">
              <Shiori mood="think" className="h-24 w-auto shrink-0" />
              <p className="mb-3 text-sm">
                <b className="block text-ok">もう少しくわしく教えてください（{saved.followUps.length + (pendingDeepDive(saved) ? 0 : 1)}回目の質問）</b>
                <b>なぜ聞くの？</b>　{deepDiveWhy(q, saved)}
              </p>
            </div>
            <div>
              <label htmlFor="answer" className="field-label text-lg">
                {activeDeep}
              </label>
              <textarea maxLength={MAX_ANSWER} id="answer" ref={inputRef} className="field min-h-28" value={value} onChange={(e) => setText(e.target.value)} />
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
            <textarea maxLength={MAX_ANSWER}
              id="answer"
              ref={inputRef}
              aria-describedby="answer-example answer-tip"
              className="field min-h-36"
              value={value}
              onChange={(e) => {
                // 書いている途中の答えも保存し、ほかの画面へ移っても消えないようにする
                setStep(current);
                setText(e.target.value);
                growActions.saveAnswer({ ...withNewText(saved, e.target.value), draft: true });
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={() => (activeDeep ? go(current) : go(Math.max(0, current - 1)))} disabled={current === 0 && !activeDeep}>
              戻る
            </button>
            <button type="button" className="btn-secondary" disabled={thinking} onClick={() => (activeDeep ? submit("") : go(current + 1))}>
              {activeDeep ? "この質問は飛ばす" : "あとで答える"}
            </button>
          </div>
          <button type="submit" className="btn-primary" disabled={!value.trim() || thinking}>
            {thinking ? "しおりが答えを読んでいます…" : "次へ"}
          </button>
        </div>
      </form>

      <AioMeter points={HEARING_QUESTIONS.map((x) => x.aio)} collected={collectedAio(HEARING_QUESTIONS, (id) => !!g.answers[id]?.text.trim())} />
      {current === 0 && !activeDeep && <WhyAio compact />}

      <Link href="/prototype" className="inline-block text-brand-dark underline">
        ホームへ戻る（答えは保存されています）
      </Link>
    </main>
  );
}
