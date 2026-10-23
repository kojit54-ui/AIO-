"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotFound, Notice, PageSkeleton } from "@/components/ui";
import { AioMeter, AioWhy, Cheer, ProgressBar, WhyAio } from "@/prototype/components";
import { articleQuestions, collectedAio, computeGrowth } from "@/prototype/growth";
import { growActions, useGrow } from "@/prototype/store";

/** 設計図の1本を書く。質問は1問ずつ、例とコツつき */
export default function WritePage() {
  const { rowId } = useParams<{ rowId: string }>();
  const g = useGrow();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  if (!g.ready) return <PageSkeleton />;
  const row = g.plan?.rows.find((r) => r.id === rowId);
  if (!g.plan || !row) return <NotFound what="記事の設計図" />;

  const qs = articleQuestions(row);
  const answers = draft ?? g.articleAnswers[row.id] ?? {};
  const finished = step >= qs.length;

  function save(next: Record<string, string>) {
    setDraft(next);
    growActions.saveArticleAnswers(row!.id, next);
    if (row!.status === "todo") growActions.setRowStatus(row!.id, "writing");
  }

  function publish() {
    const before = computeGrowth(g.answers, g.plan).level;
    growActions.setRowStatus(row!.id, "published");
    const after = computeGrowth(g.answers, { ...g.plan!, rows: g.plan!.rows.map((r) => (r.id === row!.id ? { ...r, status: "published" as const } : r)) });
    setResult(after.level > before ? `レベル ${after.level}「${after.name}」に上がりました！` : `公開しました。今は ${after.points} 点です。`);
  }

  if (finished) {
    return (
      <main className="page max-w-3xl space-y-4">
        <p className="text-sm text-muted">{row.kind === "pillar" ? "柱の記事" : "周りの記事"}：{row.keyword}</p>
        {result ? (
          <Notice tone="ok" title={result}>
            設計図の色が変わりました。次の記事も1本ずつ増やしていきましょう。
          </Notice>
        ) : (
          <>
            <AioMeter points={qs.map((x) => x.aio)} collected={collectedAio(qs, (id) => !!answers[id]?.trim())} />
            <Notice tone="info" title="おつかれさまでした！質問はここまでです">
              本番では、ここから今ある記事作成の流れにつながります。見出し案を作り、GPT が本文を書き、Claude が点検し、Gemini が画像を作ります。試作では、この先を省略しています。
            </Notice>
            <button type="button" className="btn-primary" onClick={publish} disabled={row.status === "published"}>
              公開したことにする（試作）
            </button>
          </>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href="/prototype/plan" className="btn-secondary">
            設計図に戻る
          </Link>
          <Link href="/prototype" className="btn-secondary">
            ホームへ
          </Link>
        </div>
      </main>
    );
  }

  const q = qs[step];
  const value = answers[q.id] ?? "";

  return (
    <main className="page max-w-3xl space-y-5">
      <div>
        <p className="text-sm text-muted">
          {row.kind === "pillar" ? "柱の記事" : "周りの記事"}：{row.keyword}
        </p>
        <h1 className="text-2xl font-bold">質問に答える</h1>
        <p className="text-muted">文章を考える必要はありません。短い言葉や箇条書きで大丈夫です。</p>
      </div>
      <div>
        <p className="mb-1 text-sm text-muted">
          {step + 1} / {qs.length}
        </p>
        <ProgressBar value={step + 1} max={qs.length} label="回答の進み具合" />
      </div>
      {step > 0 && answers[qs[step - 1].id]?.trim() && <Cheer point={qs[step - 1].aio} />}
      <form
        className="card space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setStep(step + 1);
        }}
      >
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
            onChange={(e) => save({ ...answers, [q.id]: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap justify-between gap-2">
          <button type="button" className="btn-secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            戻る
          </button>
          <button type="submit" className="btn-primary" disabled={!value.trim()}>
            {step === qs.length - 1 ? "答え終わった" : "次へ"}
          </button>
        </div>
      </form>
      <AioMeter points={qs.map((x) => x.aio)} collected={collectedAio(qs, (id) => !!answers[id]?.trim())} />
      {step === 0 && <WhyAio compact />}
    </main>
  );
}
