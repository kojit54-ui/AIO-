"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AioMeter, AioWhy, Cheer, WhyAio } from "@/components/aio";
import { Confetti, Road, Scene, Shiori, ShioriFace, Wave } from "@/components/fun";
import { ShioriTalk } from "@/components/talk";
import { Forbidden, GeneratingOverlay, NotFound, Notice, SampleNotice } from "@/components/ui";
import { collectedAio } from "@/lib/aio";
import { FOLLOW_UP_QUESTION, PREVIOUS_CASE_QUESTION, QUESTIONS } from "@/mock/data";
import { ApiError, useStore } from "@/mock/store";
import { needsFollowUp } from "@/mock/sampleGenerator";
import type { AioPoint, Answer } from "@/types/domain";
import { GuideName } from "@/components/useGuide";
import { VoiceInput } from "@/components/VoiceInput";
import { WinHelper } from "@/components/WinHelper";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const { db, user, api, login, mode } = useStore();
  const router = useRouter();
  const article = db.articles.find((a) => a.id === id);
  const draft = db.draftAnswers[id];

  const [answers, setAnswers] = useState<Answer[]>(() => draft?.answers ?? []);
  const [step, setStep] = useState(() => Math.min(draft?.step ?? 0, QUESTIONS.length - 1));
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<{ message: string; session?: boolean } | null>(null);
  const [generating, setGenerating] = useState(false);
  // 全部答えたときの紙吹雪
  const [celebrate, setCelebrate] = useState(false);
  const [cheer, setCheer] = useState<AioPoint | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 記入例は会社の情報に合わせてAIが作る（2026-11-02）。まだ無ければ裏で作ってもらう
  const orgForExamples = article ? db.organizations.find((o) => o.id === article.organizationId) : undefined;
  const needExamples = !!orgForExamples?.profile && !orgForExamples.profile.questionExamples && user?.role === "client_member";
  useEffect(() => {
    if (needExamples && orgForExamples) api.ensureQuestionExamples(orgForExamples.id).catch(() => undefined);
  }, [needExamples, orgForExamples, api]);

  useEffect(() => {
    // 次の質問に進んだら上に戻し、えんぴつが進むのとほめる言葉を見せる
    window.scrollTo({ top: 0, behavior: "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  }, [step, showFollowUp]);

  if (!user) return null;
  if (!article) return <NotFound />;
  if (!user.organizationIds.includes(article.organizationId)) return <Forbidden />;

  const theme = db.themes.find((t) => t.id === article.themeId);
  const question = showFollowUp ? FOLLOW_UP_QUESTION : QUESTIONS[step];
  const total = QUESTIONS.length;
  const exampleOf = (q: { id: string; example: string }) => orgForExamples?.profile?.questionExamples?.[q.id] ?? q.example;
  const current = answers.find((a) => a.questionId === question.id) ?? { questionId: question.id, text: "", unknown: false };
  const allQuestions = [...QUESTIONS, FOLLOW_UP_QUESTION];
  // 前回の続き：同じ会社の前の記事で話してくれたお客様の「その後」を聞く（任意）
  const previous = db.articles
    .filter((a) => a.organizationId === article.organizationId && a.id !== article.id && a.currentVersionId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((a) => db.versions.find((v) => v.id === a.currentVersionId))
    .find((v) => v?.answers.some((x) => x.questionId === "q1" && !x.unknown && x.text.trim()));
  const previousCase = previous?.answers.find((x) => x.questionId === "q1")?.text.trim();
  const prevAnswer = answers.find((a) => a.questionId === PREVIOUS_CASE_QUESTION.id)?.text ?? "";
  function setPrevAnswer(text: string) {
    setSaveState("idle");
    setAnswers((list) => [...list.filter((a) => a.questionId !== PREVIOUS_CASE_QUESTION.id), { questionId: PREVIOUS_CASE_QUESTION.id, text, unknown: false }]);
  }
  // 答えて進んだ直後だけ、ひとこと添える（開き直したときは出さない）
  const answeredAio = question.aio && !current.unknown && current.text.trim() ? question.aio : null;

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
        if (await save(step)) {
          setCheer(answeredAio);
          setShowFollowUp(true);
        }
        return;
      }
      if (!(await save(step))) return;
      setCelebrate(true);
      setGenerating(true);
      try {
        await api.generateOutline(id);
        router.push(`/articles/${id}`);
      } catch (e) {
        setGenerating(false);
        setCelebrate(false);
        handleError(e, "見出しを作れませんでした。答えは残っています");
      }
      return;
    }
    const nextStep = step + 1;
    if (await save(nextStep)) {
      setCheer(answeredAio);
      setStep(nextStep);
    }
  }

  function goBack() {
    setCheer(null);
    if (showFollowUp) setShowFollowUp(false);
    else setStep((s) => Math.max(0, s - 1));
  }

  const isLast = showFollowUp || step === total - 1;
  const canProceed = current.unknown || current.text.trim().length > 0;

  const doneCount = showFollowUp ? total : step;

  return (
    <main className="page max-w-5xl space-y-5">
      {celebrate && <Confetti />}
      {generating && <GeneratingOverlay label="見出しを作っています" />}
      {cheer && <Cheer key={question.id} point={cheer} />}
      <div className="flex animate-rise items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black leading-snug sm:text-3xl">
            {step === 0 && !showFollowUp ? "今日の1本、いっしょに書きましょう" : "その調子です！"} <Wave />
          </h1>
          <p className="text-muted">テーマ：{theme?.title}</p>
        </div>
      </div>
      {step === 0 && !showFollowUp && (
        <ShioriTalk mood="jersey-stretch" lines={["文章を考える必要はありませんよ。", "短い言葉や箇条書きで大丈夫です。いっしょに進めましょう！"]} />
      )}

      <Road total={total} current={doneCount} label="答えは「次へ進む」で保存されます" />
      <div className="-mt-3 flex min-h-6 justify-end text-sm">
        <SaveIndicator state={saveState} />
      </div>

      {error && (
        <div className="flex items-end gap-3">
          <Shiori mood="sad" className="h-24 w-auto shrink-0" />
          <div className="min-w-0 flex-1">
            <Notice tone="danger" title={error.message}>
              {error.session ? (
                <button type="button" className="mt-2 underline" onClick={() => { login(user.id); setError(null); }}>
                  もう一度ログインする（回答はこの画面に残っています）
                </button>
              ) : (
                "入力した内容は消えていません。もう一度お試しください。"
              )}
            </Notice>
          </div>
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <form
          key={question.id}
          className="card animate-enter overflow-hidden p-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (canProceed) goNext();
          }}
        >
          <div className="flex items-end gap-4 bg-gradient-to-b from-brand-soft to-surface px-5 pt-4">
            <Scene point={question.aio} className="h-24 w-32 shrink-0 sm:h-32 sm:w-44" />
            {showFollowUp && <ShioriBubble text="もう少しだけ教えてください。具体的な場面があると、読み手に伝わる記事になります。" />}
            {!showFollowUp && <ShioriBubble key={question.id} text={step === 0 ? "1問目です。気楽にどうぞ！" : isLast ? "最後の質問です！" : `${step + 1}問目です。いい調子ですよ！`} />}
          </div>
          <div className="space-y-3 p-5 pt-3">
            <span className="inline-block rounded-full bg-brand px-3.5 py-0.5 text-sm font-black text-white">{showFollowUp ? "追加の質問" : `質問 ${step + 1}`}</span>
            <label htmlFor="answer" className="block text-xl font-black leading-snug sm:text-2xl">
              {question.label}
            </label>
            <p id="answer-example" className="rounded-2xl bg-canvas px-4 py-2.5 text-[0.95rem] text-muted">
              {exampleOf(question)}
            </p>
            {question.tip && (
              <p id="answer-tip" className="rounded-2xl bg-sun-soft px-4 py-2.5 text-[0.95rem]">
                <span className="font-bold">コツ：</span>
                {question.tip}
              </p>
            )}
            {question.aio && <AioWhy point={question.aio} />}
            <textarea
              id="answer"
              ref={inputRef}
              aria-describedby={question.tip ? "answer-example answer-tip" : "answer-example"}
              className="field min-h-36"
              placeholder={exampleOf(question)}
              value={current.unknown ? "" : current.text}
              disabled={current.unknown}
              onChange={(e) => setCurrent({ text: e.target.value })}
            />
            {question.id === "q8" && !current.unknown && (
              <WinHelper remote={mode === "remote"} orgId={article.organizationId} answer={current.text} onPick={(win) => setCurrent({ text: current.text.trim() ? `${current.text.trimEnd()}\n${win}` : win })} />
            )}
            <VoiceInput disabled={current.unknown} onText={(said) => setCurrent({ text: current.text ? `${current.text}${/[。、\n]$/.test(current.text) ? "" : "。"}${said}` : said })} />
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-dashed px-4 py-1.5 text-[0.95rem] transition-colors ${current.unknown ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-muted hover:border-brand"}`}>
              <input type="checkbox" className="h-4 w-4 accent-brand" checked={current.unknown} onChange={(e) => setCurrent({ unknown: e.target.checked })} />
              まだ分からない
            </label>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={goBack} disabled={step === 0 && !showFollowUp}>
                  ← 戻る
                </button>
                <button type="button" className="btn-secondary" onClick={() => save()} disabled={saveState === "saving"}>
                  下書き保存
                </button>
              </div>
              <button type="submit" className="btn-primary text-lg" disabled={!canProceed || saveState === "saving"}>
                {isLast ? "見出しを作る" : "次へ進む"}
                <span className="inline-block animate-nudge" aria-hidden>
                  {isLast ? "✨" : "→"}
                </span>
              </button>
            </div>
          </div>
        </form>

        <aside className="space-y-4">
          <AioMeter points={allQuestions.flatMap((q) => (q.aio ? [q.aio] : []))} collected={collectedAio(allQuestions, (qid) => answers.some((a) => a.questionId === qid && !a.unknown && a.text.trim().length > 0))} />
          <p className="flex items-center gap-3 rounded-2xl bg-surface/70 px-4 py-3 text-sm">
            <ShioriFace className="h-12 w-12" />
            <span>
              <b className="block"><GuideName />より</b>
              くわしい体験ほど、AIが紹介しやすく、読んだ人も安心して頼めます。
            </span>
          </p>
        </aside>
      </div>

      {step === 0 && !showFollowUp && previous && previousCase && (
        <section className="card animate-rise space-y-2 border-2 border-sun" aria-labelledby="prev-case-heading">
          <h2 id="prev-case-heading" className="font-black">
            前回の続き（答えなくても大丈夫です）
          </h2>
          <ShioriTalk mood="ask" size="sm" lines={[`前の記事「${previous.title}」で話してくれたお客様（${Array.from(previousCase).slice(0, 40).join("")}…）、`, "その後どうなりましたか？"]} />
          <p className="text-sm text-muted">なぜ聞くの？　その後の様子は、ほかの会社には書けない一番の材料です。記事に厚みが出て、AIに紹介されやすく、読んだ人にも「頼んだらこうなる」が伝わります。</p>
          <label htmlFor="prev-followup" className="sr-only">
            {PREVIOUS_CASE_QUESTION.label}
          </label>
          <textarea id="prev-followup" className="field min-h-24" placeholder={exampleOf(PREVIOUS_CASE_QUESTION)} value={prevAnswer} onChange={(e) => setPrevAnswer(e.target.value)} />
          <VoiceInput onText={(said) => setPrevAnswer(prevAnswer ? `${prevAnswer}。${said}` : said)} />
        </section>
      )}
      {step === 0 && !showFollowUp && <WhyAio compact />}
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

/** 絵の中のしおりの横に出る、短いひとこと */
function ShioriBubble({ text }: { text: string }) {
  return (
    <p className="relative mb-4 w-fit origin-bottom-left animate-bubble rounded-3xl rounded-bl-md border-2 border-brand-soft bg-surface px-3 py-2 text-sm font-bold text-brand-dark shadow-sm">
      <span aria-hidden className="absolute -left-2 bottom-2 h-3 w-3 rotate-45 border-b-2 border-l-2 border-brand-soft bg-surface" />
      {text}
    </p>
  );
}
