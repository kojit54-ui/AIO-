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
import { SAMPLE_ANSWER_IDEAS, insertIdea, sampleTitleIdeas } from "@/lib/answerIdeas";
import { PLAN_IDS, defaultReader } from "@/lib/articlePlan";
import { ShioriTalk } from "@/components/talk";
import { SAMPLE_LABEL } from "@/prototype/growth";
import type { AioPoint } from "@/types/domain";
import type { ArticleQuestion } from "@/prototype/growth";

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

  // 最初に「誰のどんな悩みに答えるか」を決める（2026-11-03 プロの書き方に合わせた順番。docs/DECISIONS.md）
  const readerDefault = defaultReader(row.keyword, row.question);
  const readerQ: ArticleQuestion = {
    id: PLAN_IDS.reader,
    label: "この記事は、誰のどんな悩みに答えますか",
    aio: "qa",
    example: `例：${readerDefault}`,
    tip: "困っている人を1人思いうかべると、記事がその人に届きます。入っている案のままでも大丈夫です。",
  };
  const qs = [readerQ, ...articleQuestions(row, { generic: !!orgId })];
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
            <PlanStep
              orgId={orgId}
              keyword={row.keyword}
              reader={answers[PLAN_IDS.reader] ?? readerDefault}
              qa={qs.filter((x) => x.id !== PLAN_IDS.reader).map((x) => ({ question: x.label, answer: answers[x.id] ?? "" }))}
              conclusion={answers[PLAN_IDS.conclusion] ?? ""}
              title={answers[PLAN_IDS.title] ?? ""}
              onChange={(next) => save({ ...answers, ...next })}
              onEditReader={() => setStep(0)}
            />
            {orgId ? (
              <WriteWithAi
                rowId={row.id}
                approved={!!db.organizations.find((o) => o.id === orgId)?.profileApprovedAt}
                ready={!!answers[PLAN_IDS.title]?.trim()}
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
              本番では、ここで選んだタイトルと答えに合わせて、AIが記事の下書き（見出し・本文・画像）を作ります。試作では、この先を省略しています。
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
  // 読む人の悩みは、書く記事リストの疑問から作った案を最初から入れておく
  const value = answers[q.id] ?? (q.id === PLAN_IDS.reader ? readerDefault : "");

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
          if (answers[q.id] === undefined && value) save({ ...answers, [q.id]: value });
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
          <button type="submit" className={!value.trim() && q.optional ? "btn-secondary" : "btn-primary"} disabled={!value.trim() && !q.optional}>
            {!value.trim() && q.optional ? "分からないので次へ" : step === qs.length - 1 ? "答え終わった" : "次へ"}
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
function WriteWithAi({ rowId, approved, ready, busy, error, existing, onWrite, onReview }: { rowId: string; approved: boolean; ready: boolean; busy: boolean; error: string | null; existing: string | null; onWrite: () => void; onReview: () => void }) {
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
      <p className="text-lg font-black">④ この作戦で、AIに記事を書いてもらいましょう</p>
      <p className="text-muted">選んだタイトルと答えに合わせて、AIが「読む人が知りたい順番」（見出し）を作ります。確かめてから本文に進みます。</p>
      {error && <Notice tone="danger" title={error} />}
      {!ready && <p className="text-sm font-bold text-brand-dark">上でタイトルを1つ選ぶと、押せるようになります。</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary min-h-14 px-6 text-lg" onClick={onWrite} disabled={busy || !ready}>
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

/**
 * 記事の作戦を決める：この記事の答え（結論）とタイトル。質問に答え終わったら、見出しより先に決める。
 * プロは「誰の悩みに・何と答えるか」を先に決め、タイトルで約束してから見出しを組む（2026-11-03 田村さん：見出しの一覧だけ見せられても分からない）
 */
function PlanStep({
  orgId,
  keyword,
  reader,
  qa,
  conclusion,
  title,
  onChange,
  onEditReader,
}: {
  orgId?: string;
  keyword: string;
  reader: string;
  qa: { question: string; answer: string }[];
  conclusion: string;
  title: string;
  onChange: (next: Record<string, string>) => void;
  onEditReader: () => void;
}) {
  const [ideas, setIdeas] = useState<{ titles: string[]; sample: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [own, setOwn] = useState(false);
  const asked = useRef(false);

  async function ask(fresh: boolean) {
    setBusy(true);
    setError(null);
    try {
      let out: { conclusion: string; titles: string[]; sample: boolean };
      if (!orgId) {
        // 画面試作（架空データ）では、決まったサンプルを出す
        await new Promise((r) => setTimeout(r, 600));
        out = { ...sampleTitleIdeas(keyword), sample: true };
      } else {
        const res = await fetch(`/api/organizations/${encodeURIComponent(orgId)}/title-ideas`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ keyword, reader, answers: qa.filter((x) => x.answer.trim()), idempotencyKey: crypto.randomUUID() }),
        }).catch(() => null);
        const json = ((await res?.json().catch(() => null)) ?? {}) as { conclusion?: string; titles?: string[]; sample?: boolean; message?: string };
        if (!res?.ok || !json.titles?.length) {
          setError(json.message ?? "AIがタイトル案を作れませんでした。もう一度お試しください");
          return;
        }
        out = { conclusion: json.conclusion ?? "", titles: json.titles, sample: !!json.sample };
      }
      setIdeas({ titles: out.titles, sample: out.sample });
      setOwn(false);
      // はじめは1つ目を選んでおく。答えも空ならAIの案を入れる（どちらもあとで直せる）
      const next: Record<string, string> = {};
      if (fresh || !title.trim()) next[PLAN_IDS.title] = out.titles[0];
      if ((fresh || !conclusion.trim()) && out.conclusion) next[PLAN_IDS.conclusion] = out.conclusion;
      if (Object.keys(next).length) onChange(next);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // 最初に開いたときだけ、自動で案を作る（もう選んであれば作らない）
    if (asked.current || title.trim()) return;
    asked.current = true;
    void ask(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const titles = ideas?.titles ?? (title ? [title] : []);
  const custom = own || (!!title && !titles.includes(title));
  const card = (on: boolean) => `w-full rounded-xl border-2 px-3 py-3 text-left font-bold ${on ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand"}`;

  return (
    <section className="card space-y-5 border-2 border-sun" aria-labelledby="plan-heading">
      <div className="space-y-2">
        <h2 id="plan-heading" className="text-xl font-black">
          🎯 書く前に、記事の作戦を決めましょう
        </h2>
        <ol className="flex flex-wrap gap-2 text-sm font-bold" aria-label="記事ができるまで">
          {["読む人の悩み", "材料（質問）", "答えとタイトル", "見出しと本文はAI"].map((label, i) => (
            <li key={label} className={`rounded-full px-3 py-1 ${i < 2 ? "bg-brand text-white" : i === 2 ? "bg-sun text-ink" : "bg-canvas text-muted"}`}>
              {i < 2 ? "✓ " : `${i + 1}. `}
              {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl bg-canvas p-3">
        <p className="text-sm font-bold text-muted">① この記事を読んでほしい人</p>
        <p className="mt-1 font-bold">{reader}</p>
        <button type="button" className="mt-1 text-sm font-bold text-brand-dark underline" onClick={onEditReader}>
          直す
        </button>
      </div>

      {busy && !ideas && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-soft p-3 font-bold text-brand-dark" role="status">
          しおりが、答えとタイトル案を考えています
          <span className="inline-flex gap-0.5" aria-hidden>
            <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand" />
            <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.15s]" />
            <i className="h-1.5 w-1.5 animate-hop rounded-full bg-brand [animation-delay:.3s]" />
          </span>
        </div>
      )}
      {error && (
        <Notice tone="warn" title={error}>
          <button type="button" className="btn-secondary mt-2" onClick={() => ask(false)} disabled={busy}>
            もう一度作ってもらう
          </button>
        </Notice>
      )}

      {(ideas || title) && (
        <>
          <div className="space-y-2">
            <label htmlFor="plan-conclusion" className="field-label text-lg">
              ② この記事の答え（結論）
            </label>
            <ShioriTalk mood="point" size="sm" lines="記事のはじめに、この答えを書きます。AIは「最初に答えがある記事」を選びやすいです。違っていたら直してください。" />
            <textarea id="plan-conclusion" className="field min-h-24" value={conclusion} onChange={(e) => onChange({ [PLAN_IDS.conclusion]: e.target.value })} />
          </div>

          <fieldset className="space-y-2">
            <legend className="field-label text-lg">③ タイトルを1つ選ぶ</legend>
            <p className="text-sm text-muted">
              タイトルは「この記事を読むと何が分かるか」の約束です。「{keyword}」が入っていると、探している人とAIに見つけてもらいやすくなります。
              {ideas?.sample && <span>（{SAMPLE_LABEL}）</span>}
            </p>
            {titles.map((t) => {
              const on = !custom && t === title;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  className={card(on)}
                  onClick={() => {
                    setOwn(false);
                    onChange({ [PLAN_IDS.title]: t });
                  }}
                >
                  <span className="mr-2" aria-hidden>
                    {on ? "✅" : "⬜"}
                  </span>
                  {t}
                </button>
              );
            })}
            <button type="button" aria-pressed={custom} className={card(custom)} onClick={() => setOwn(true)}>
              <span className="mr-2" aria-hidden>
                {custom ? "✅" : "⬜"}
              </span>
              自分で書く
            </button>
            {custom && <input aria-label="自分で書くタイトル" className="field" value={title} placeholder={`例：${keyword}で迷ったら読む話`} onChange={(e) => onChange({ [PLAN_IDS.title]: e.target.value })} />}
            <button type="button" className="text-sm font-bold text-brand-dark underline" onClick={() => ask(true)} disabled={busy}>
              {busy ? "考えています…" : "🔄 別の案を作ってもらう"}
            </button>
          </fieldset>
        </>
      )}
    </section>
  );
}
