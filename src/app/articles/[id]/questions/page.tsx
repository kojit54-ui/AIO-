"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Forbidden, GeneratingOverlay, NotFound, Notice, SampleNotice } from "@/components/ui";
import { FOLLOW_UP_QUESTION, QUESTIONS } from "@/mock/data";
import { ApiError, useStore } from "@/mock/store";
import { needsFollowUp } from "@/mock/sampleGenerator";
import type { Answer } from "@/types/domain";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const { db, user, api, login } = useStore();
  const router = useRouter();
  const article = db.articles.find((a) => a.id === id);
  const draft = db.draftAnswers[id];

  const [answers, setAnswers] = useState<Answer[]>(() => draft?.answers ?? []);
  const [step, setStep] = useState(() => Math.min(draft?.step ?? 0, QUESTIONS.length - 1));
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<{ message: string; session?: boolean } | null>(null);
  const [generating, setGenerating] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step, showFollowUp]);

  if (!user) return null;
  if (!article) return <NotFound />;
  if (!user.organizationIds.includes(article.organizationId)) return <Forbidden />;

  const theme = db.themes.find((t) => t.id === article.themeId);
  const question = showFollowUp ? FOLLOW_UP_QUESTION : QUESTIONS[step];
  const total = QUESTIONS.length;
  const current = answers.find((a) => a.questionId === question.id) ?? { questionId: question.id, text: "", unknown: false };

  function setCurrent(patch: Partial<Answer>) {
    setSaveState("idle");
    setAnswers((prev) => {
      const next = { ...current, ...patch };
      return prev.some((a) => a.questionId === question.id) ? prev.map((a) => (a.questionId === question.id ? next : a)) : [...prev, next];
    });
  }

  function handleError(e: unknown, fallback: string) {
    if (e instanceof ApiError && e.code === "session_expired") setError({ message: e.message, session: true });
    else setError({ message: e instanceof ApiError ? e.message : fallback });
  }

  async function save(nextStep = step): Promise<boolean> {
    setSaveState("saving");
    setError(null);
    try {
      await api.saveAnswers(id, answers, nextStep);
      setSaveState("saved");
      return true;
    } catch (e) {
      setSaveState("error");
      handleError(e, "保存できませんでした");
      return false;
    }
  }

  async function goNext() {
    if (showFollowUp || step === total - 1) {
      if (!showFollowUp && needsFollowUp(answers)) {
        if (await save(step)) setShowFollowUp(true);
        return;
      }
      if (!(await save(step))) return;
      setGenerating(true);
      try {
        await api.generateOutline(id);
        router.push(`/articles/${id}`);
      } catch (e) {
        setGenerating(false);
        handleError(e, "見出し案を作れませんでした。回答は残っています");
      }
      return;
    }
    const nextStep = step + 1;
    if (await save(nextStep)) setStep(nextStep);
  }

  function goBack() {
    if (showFollowUp) setShowFollowUp(false);
    else setStep((s) => Math.max(0, s - 1));
  }

  const isLast = showFollowUp || step === total - 1;
  const canProceed = current.unknown || current.text.trim().length > 0;

  return (
    <main className="page max-w-3xl space-y-5">
      {generating && <GeneratingOverlay label="見出し案を作っています" />}
      <div>
        <p className="text-sm text-muted">テーマ：{theme?.title}</p>
        <h1 className="text-2xl font-bold">質問に答える</h1>
        <p className="text-muted">文章を考える必要はありません。短い言葉や箇条書きで大丈夫です。</p>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-sm text-muted">
          <span>{showFollowUp ? "追加の質問" : `${step + 1} / ${total}`}</span>
          <SaveIndicator state={saveState} />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={showFollowUp ? total : step + 1} aria-label="回答の進み具合">
          <div className="h-full bg-brand transition-all" style={{ width: `${((showFollowUp ? total : step + 1) / total) * 100}%` }} />
        </div>
      </div>

      {error && (
        <Notice tone="danger" title={error.message}>
          {error.session ? (
            <button type="button" className="mt-2 underline" onClick={() => { login(user.id); setError(null); }}>
              もう一度ログインする（回答はこの画面に残っています）
            </button>
          ) : (
            "入力した内容は消えていません。もう一度お試しください。"
          )}
        </Notice>
      )}

      <form
        className="card space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed) goNext();
        }}
      >
        {showFollowUp && <Notice tone="info" title="もう少しだけ教えてください">具体的な場面があると、読み手に伝わる記事になります。分からなければ「まだ分からない」で進めます。</Notice>}
        <div>
          <label htmlFor="answer" className="field-label text-lg">
            {question.label}
          </label>
          <p id="answer-example" className="mb-2 text-sm text-muted">
            {question.example}
          </p>
          {question.tip && (
            <p id="answer-tip" className="mb-2 rounded-md bg-brand-soft px-3 py-2 text-sm text-brand-dark">
              コツ：{question.tip}
            </p>
          )}
          <textarea
            id="answer"
            ref={inputRef}
            aria-describedby={question.tip ? "answer-example answer-tip" : "answer-example"}
            className="field min-h-36"
            value={current.unknown ? "" : current.text}
            disabled={current.unknown}
            onChange={(e) => setCurrent({ text: e.target.value })}
          />
          <label className="mt-2 inline-flex items-center gap-2">
            <input type="checkbox" checked={current.unknown} onChange={(e) => setCurrent({ unknown: e.target.checked })} />
            まだ分からない
          </label>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" onClick={goBack} disabled={step === 0 && !showFollowUp}>
              戻る
            </button>
            <button type="button" className="btn-secondary" onClick={() => save()} disabled={saveState === "saving"}>
              下書き保存
            </button>
          </div>
          <button type="submit" className="btn-primary" disabled={!canProceed || saveState === "saving"}>
            {isLast ? "見出し案を作る" : "次へ"}
          </button>
        </div>
      </form>

      {isLast && <SampleNotice />}
      <Link href="/" className="inline-block text-brand-dark underline">
        ホームへ戻る（回答は保存した所まで残ります）
      </Link>
    </main>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  const text = { idle: "", saving: "保存しています…", saved: "保存しました", error: "保存できていません" }[state];
  return (
    <span aria-live="polite" className={state === "error" ? "font-semibold text-danger" : ""}>
      {text}
    </span>
  );
}
