"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotFound, Notice, PageSkeleton } from "@/components/ui";
import { AioMeter, AioWhy, Cheer, ProgressBar, WhyAio } from "@/prototype/components";
import { KIND_LABEL, articleQuestions, collectedAio, computeGrowth } from "@/prototype/growth";
import { growActions, resolveRowId, useGrow, useGrowSync } from "@/prototype/store";
import { ApiError, useStore } from "@/mock/store";
import { WaitingScreen } from "@/components/WaitingScreen";
import { QUESTIONS } from "@/mock/data";
import { toArticleAnswers } from "@/prototype/articleBridge";
import { AIO_POINTS } from "@/lib/aio";
import { SAMPLE_ANSWER_IDEAS, insertIdea } from "@/lib/answerIdeas";
import { SAMPLE_LABEL } from "@/prototype/growth";
import type { AioPoint } from "@/types/domain";

/** 設計図の1本を書く。質問は1問ずつ、例とコツつき */
export default function WritePage() {
  const { rowId } = useParams<{ rowId: string }>();
  const g = useGrow();
  const sync = useGrowSync();
  const { user, db, api } = useStore();
  const router = useRouter();
  const [writing, setWriting] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const orgId = sync.mode === "remote" ? user?.organizationIds[0] : undefined;
  const [stepState, setStep] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [stepState]);

  if (!g.ready) return <PageSkeleton />;
  // 保存が終わって行の id が DB の id に変わっても、開いている画面のまま書きつづけられるようにする
  const row = g.plan?.rows.find((r) => r.id === rowId) ?? g.plan?.rows.find((r) => r.id === resolveRowId(rowId));
  if (!g.plan || !row) return <NotFound what="書く記事" />;

  const qs = articleQuestions(row, { generic: !!orgId });
  const answers = draft ?? g.articleAnswers[row.id] ?? {};
  // 「続きを書く」で戻ったときは、まだ答えていない最初の問いから。全部答えていれば最後の画面
  const firstOpen = qs.findIndex((x) => !answers[x.id]?.trim());
  const step = stepState ?? (firstOpen === -1 ? qs.length : firstOpen);
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
        <p className="text-sm text-muted">{KIND_LABEL[row.kind]}：{row.keyword}</p>
        {result ? (
          <Notice tone="ok" title={result}>
            書く記事リストに「やった」が1本増えました。次の記事も1本ずつ増やしていきましょう。
          </Notice>
        ) : (
          <>
            <AioMeter points={qs.map((x) => x.aio)} collected={collectedAio(qs, (id) => !!answers[id]?.trim())} />
            {orgId ? (
              <WriteWithAi
                rowId={row.id}
                approved={!!db.organizations.find((o) => o.id === orgId)?.profileApprovedAt}
                busy={writing}
                error={writeError}
                existing={(() => {
                  const prev = articleFor(row.id);
                  const a = prev ? db.articles.find((x) => x.id === prev) : undefined;
                  return a?.currentVersionId ? a.id : null;
                })()}
                onReview={() => setStep(0)}
                onWrite={async () => {
                  setWriting(true);
                  setWriteError(null);
                  try {
                    // 失敗してやり直すときは、前に作った記事をそのまま使う（同じ記事を2本作らない）
                    const prev = articleFor(row.id);
                    const id = prev && db.articles.some((x) => x.id === prev) ? prev : (await api.createArticle({ customTheme: { title: row.keyword, readerProblem: row.question || `「${row.keyword}」について知りたい人` } })).id;
                    rememberArticle(row.id, id);
                    await api.saveAnswers(id, toArticleAnswers(answers), QUESTIONS.length - 1);
                    if (row.status === "todo") growActions.setRowStatus(row.id, "writing");
                    await api.generateOutline(id);
                    router.push(`/articles/${id}`);
                  } catch (e) {
                    setWriting(false);
                    setWriteError(e instanceof ApiError ? e.message : "AIが記事を書けませんでした。答えは残っています。もう一度お試しください");
                  }
                }}
              />
            ) : (
              <>
            <Notice tone="info" title="おつかれさまでした！質問はここまでです">
              本番では、ここからAIが記事の下書き（見出し・本文・画像）を作ります。試作では、この先を省略しています。
            </Notice>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={publish} disabled={row.status === "published"}>
                公開したことにする（試作）
              </button>
              <button type="button" className="btn-secondary" onClick={() => setStep(0)}>
                答えを見直す
              </button>
            </div>
              </>
            )}
          </>
        )}
        <div className="flex flex-wrap gap-2">
          <Link href="/prototype/keywords" className="btn-secondary">
            書く記事リストに戻る
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
          {KIND_LABEL[row.kind]}：{row.keyword}
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
          <AnswerIdeas key={q.id} orgId={orgId} keyword={row.keyword} question={q.label} point={q.aio} onPick={(idea) => { setStep(step); save({ ...answers, [q.id]: insertIdea(value, idea) }); inputRef.current?.focus(); }} />
          <textarea
            id="answer"
            ref={inputRef}
            aria-describedby="answer-example answer-tip"
            className="field min-h-36"
            value={value}
            onChange={(e) => {
              // 書き始めたら位置を固定し、答えが埋まっても次の問いへ勝手に移らないようにする
              setStep(step);
              save({ ...answers, [q.id]: e.target.value });
            }}
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

/**
 * 手が止まったときに押す「AIに案を出してもらう」。読んだ人が「うちと同じ悩みだ」と思える場面のたたき台を3つ出し、選ぶと答えに入る。
 * 案は思い出すきっかけ。実際にあったことに直してもらう（2026-11-03 田村さん）
 */
function AnswerIdeas({ orgId, keyword, question, point, onPick }: { orgId?: string; keyword: string; question: string; point: AioPoint; onPick: (idea: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [ideas, setIdeas] = useState<string[] | null>(null);
  const [sample, setSample] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState(false);

  async function ask() {
    setBusy(true);
    setError(null);
    setPicked(false);
    try {
      if (!orgId) {
        // 画面試作（架空データ）では、決まったサンプルを出す
        await new Promise((r) => setTimeout(r, 600));
        setIdeas(SAMPLE_ANSWER_IDEAS);
        setSample(true);
        return;
      }
      const res = await fetch(`/api/organizations/${encodeURIComponent(orgId)}/answer-ideas`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keyword, question, goal: AIO_POINTS[point].people, idempotencyKey: crypto.randomUUID() }),
      }).catch(() => null);
      const json = ((await res?.json().catch(() => null)) ?? {}) as { ideas?: string[]; sample?: boolean; message?: string };
      if (res?.ok && json.ideas?.length) {
        setIdeas(json.ideas);
        setSample(!!json.sample);
      } else setError(json.message ?? "AIが案を出せませんでした。もう一度お試しください");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-2 space-y-2">
      <button type="button" className="btn-secondary min-h-11 border-sun" onClick={ask} disabled={busy}>
        {busy ? (
          <span className="inline-flex items-center gap-2">
            しおりが案を考えています
            <span className="inline-flex gap-0.5" aria-hidden>
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand" />
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.15s]" />
              <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.3s]" />
            </span>
          </span>
        ) : ideas ? (
          "💡 別の案を出してもらう"
        ) : (
          "💡 思いつかないときは、AIに案を出してもらう"
        )}
      </button>
      {error && <Notice tone="warn" title={error} />}
      {ideas && !busy && (
        <div className="animate-enter space-y-2 rounded-2xl border-2 border-sun bg-sun-soft p-3">
          <p className="text-sm font-bold">
            AIの案（たたき台）{sample && <span className="font-normal text-muted">：{SAMPLE_LABEL}</span>}
          </p>
          <p className="text-sm text-muted">読んだ人が「うちと同じ悩みだ。ここなら分かってくれる」と思える場面です。近いものを選んでください。</p>
          <ul className="space-y-2">
            {ideas.map((idea) => (
              <li key={idea}>
                <button
                  type="button"
                  className="w-full rounded-xl border-2 border-line bg-surface px-3 py-2 text-left hover:border-brand"
                  onClick={() => {
                    onPick(idea);
                    setPicked(true);
                  }}
                >
                  <span className="block">{idea}</span>
                  <span className="mt-1 block text-sm font-bold text-brand-dark">この案を使う →</span>
                </button>
              </li>
            ))}
          </ul>
          {picked && (
            <p className="animate-enter rounded-lg bg-surface px-3 py-2 text-sm font-bold text-brand-dark">
              入れました！実際にあったことに直してください。いつ・どんなお客様だったかを足すと、ほかの会社には書けない記事になります。
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// 書く記事リストの1本と、AIが書いた記事をこのブラウザで結びつけ、2回目は同じ記事を開く
const ARTICLE_KEY = (rowId: string) => `aio.rowArticle.${rowId}`;
function articleFor(rowId: string): string | null {
  try {
    return localStorage.getItem(ARTICLE_KEY(rowId));
  } catch {
    return null;
  }
}
function rememberArticle(rowId: string, articleId: string) {
  try {
    localStorage.setItem(ARTICLE_KEY(rowId), articleId);
  } catch {
    // 覚えられなくても、記事は作れている
  }
}

/**
 * 質問に答え終わったあと、AIに記事を書いてもらう（2026-11-03 田村さん：試作のまま「省略」と出ていた）。
 * 会社の情報を確かめる前は、先にそちらへ案内する（確かめた会社の情報だけを記事に使うため）
 */
function WriteWithAi({ rowId, approved, busy, error, existing, onWrite, onReview }: { rowId: string; approved: boolean; busy: boolean; error: string | null; existing: string | null; onWrite: () => void; onReview: () => void }) {
  if (!approved) {
    return (
      <div className="card space-y-3 border-2 border-sun">
        <p className="text-lg font-black">あと一歩です！先に会社の情報を確かめてください（1分）</p>
        <p className="text-muted">「会社のことを教える」の答えを、AIが会社の情報にまとめています。内容を確かめた会社の情報だけを記事に使います。確かめたら、この画面に戻って「AIに記事を書いてもらう」を押してください。</p>
        <Link
          href="/profile"
          className="btn-primary"
          onClick={() => {
            try {
              sessionStorage.setItem("aio.returnTo", `/prototype/write/${rowId}`);
            } catch {
              // 戻り先を覚えられなくても、確かめる画面は開ける
            }
          }}
        >
          会社の情報を確かめる →
        </Link>
      </div>
    );
  }
  return (
    <div className="card space-y-3 border-2 border-brand">
      {busy && <WaitingScreen label="AIが記事の見出しを考えています" note="答えてくれた内容から、記事の見出しを作っています。1分ほどかかります。" />}
      <p className="text-lg font-black">🎉 おつかれさまでした！質問はここまでです</p>
      <p className="text-muted">答えてくれた内容から、AIが記事を書きます。まず見出しを作るので、確かめてから本文に進みます。</p>
      {error && <Notice tone="danger" title={error} />}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary min-h-14 px-6 text-lg" onClick={onWrite} disabled={busy}>
          ✨ AIに記事を書いてもらう
        </button>
        {existing && (
          <Link href={`/articles/${existing}`} className="btn-secondary">
            前に書いてもらった記事を開く
          </Link>
        )}
        <button type="button" className="btn-secondary" onClick={onReview} disabled={busy}>
          答えを見直す
        </button>
      </div>
    </div>
  );
}
