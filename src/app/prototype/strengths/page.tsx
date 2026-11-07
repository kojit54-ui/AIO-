"use client";

// 強みの帳面（docs/AIO.md「強みの帳面」）。誰に・強み（根拠と数字）・選ばれた決め手・分野ごとの実績・書き方を1冊にまとめ、
// 保存すると、次の記事から AI（記事・点検・AIOのチェック・キーワードの提案）が毎回この帳面を読んで書く。
// 試作ではブラウザに保存。本物では strength_books（supabase/migrations/20261107170000_strength_books.sql）に保存する。

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useMemo, useState } from "react";
import { Confetti, Shiori, Toast, useFlash } from "@/components/fun";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  EMPTY_BOOK,
  MAX_FIELD,
  MAX_LONG_FIELD,
  MAX_STRENGTHS,
  MAX_TARGETS,
  MAX_WINS,
  WIN_GOAL,
  applyGapAnswer,
  bookChars,
  bookGaps,
  bookScore,
  bookToPrompt,
  fillEmpty,
  isEmptyBook,
  normalizeBook,
  sampleBookFromHearing,
  type StrengthBook,
} from "@/lib/strength/book";
import { useStore } from "@/mock/store";
import { SAMPLE_LABEL } from "@/prototype/growth";
import { currentGrowOrgId, useGrow } from "@/prototype/store";

const LOCAL_KEY = "cotam-strength-book-v1";

interface Saved {
  book: StrengthBook;
  confirmedAt: string | null;
}

function readLocal(): Saved {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { book?: unknown; confirmedAt?: unknown };
      return { book: normalizeBook(v.book), confirmedAt: typeof v.confirmedAt === "string" ? v.confirmedAt : null };
    }
  } catch {
    // 読めなければ空の帳面から
  }
  return { book: EMPTY_BOOK, confirmedAt: null };
}

const client = () => {
  const env = getSupabaseEnv();
  return env ? createBrowserClient(env.url, env.anonKey) : null;
};

export default function StrengthBookPage() {
  const store = useStore();
  const grow = useGrow();
  const remoteMode = store.mode === "remote";
  const orgId = remoteMode ? currentGrowOrgId() : null;
  const [saved, setSaved] = useState<Saved | null>(null);
  const [book, setBook] = useState<StrengthBook>(EMPTY_BOOK);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<"" | "draft" | "save">("");
  const [error, setError] = useState("");
  const [cheer, setCheer] = useState("");
  const [flash, fire] = useFlash();

  // 読み込み
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!remoteMode) {
        const s = readLocal();
        if (alive) {
          setSaved(s);
          setBook(s.book);
        }
        return;
      }
      if (!orgId) return;
      const db = client();
      const { data, error: e } = (await db?.from("strength_books").select("book, confirmed_at").eq("organization_id", orgId).maybeSingle()) ?? { data: null, error: null };
      if (!alive) return;
      if (e) setError("帳面を読み込めませんでした。少し待ってから開き直してください");
      const s = { book: normalizeBook(data?.book ?? {}), confirmedAt: (data?.confirmed_at as string | null) ?? null };
      setSaved(s);
      setBook(s.book);
    })();
    return () => {
      alive = false;
    };
  }, [remoteMode, orgId]);

  const gaps = useMemo(() => bookGaps(book), [book]);
  const gap = gaps[0] ?? null;
  const score = bookScore(book);
  const dirty = !!saved && JSON.stringify(saved.book) !== JSON.stringify(book);
  const inUse = !!saved?.confirmedAt && !dirty && !isEmptyBook(book);

  function celebrate(text: string) {
    setCheer(text);
    fire();
  }

  async function save(next: StrengthBook, message: string) {
    setBusy("save");
    setError("");
    try {
      const confirmedAt = new Date().toISOString();
      if (!remoteMode) {
        window.localStorage.setItem(LOCAL_KEY, JSON.stringify({ book: next, confirmedAt }));
      } else {
        const db = client();
        const { data: auth } = (await db?.auth.getUser()) ?? { data: { user: null } };
        if (!db || !orgId || !auth.user) throw new Error("ログインの有効期限が切れました。ログインし直してください");
        const { error: e } = await db
          .from("strength_books")
          .upsert({ organization_id: orgId, book: next, confirmed_at: confirmedAt, updated_by: auth.user.id, updated_at: confirmedAt }, { onConflict: "organization_id" });
        if (e) throw new Error(e.code === "42501" ? "帳面を直せるのは、会社の担当の方です" : "保存できませんでした。もう一度お試しください");
      }
      setSaved({ book: next, confirmedAt });
      setBook(next);
      celebrate(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存できませんでした。もう一度お試しください");
    } finally {
      setBusy("");
    }
  }

  async function draft() {
    setBusy("draft");
    setError("");
    try {
      let next: StrengthBook;
      let confirmedAt: string | null = null;
      if (!remoteMode) {
        next = fillEmpty(book, sampleBookFromHearing(Object.fromEntries(Object.entries(grow.answers).map(([k, v]) => [k, v.text]))));
      } else {
        const res = await fetch(`/api/organizations/${encodeURIComponent(orgId ?? "")}/strength-book`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }),
        });
        const json = (await res.json().catch(() => null)) as { book?: unknown; confirmedAt?: string | null; message?: string } | null;
        if (!res.ok) throw new Error(json?.message ?? "下書きを作れませんでした。もう一度お試しください");
        next = normalizeBook(json?.book);
        confirmedAt = json?.confirmedAt ?? null;
      }
      if (remoteMode) setSaved({ book: next, confirmedAt });
      setBook(next);
      celebrate("下書きができました。読んで、違う所を直してから保存してください");
    } catch (e) {
      setError(e instanceof Error ? e.message : "下書きを作れませんでした。もう一度お試しください");
    } finally {
      setBusy("");
    }
  }

  function addAnswer() {
    if (!gap || !answer.trim()) return;
    const next = applyGapAnswer(book, gap.key, answer);
    setAnswer("");
    void save(next, "帳面に書き足しました。AIがこの強みを使って書きます");
  }

  if (!saved) {
    return (
      <main className="page">
        <p className="text-muted" role="status">
          帳面を開いています…
        </p>
      </main>
    );
  }

  const set = (patch: Partial<StrengthBook>) => setBook((b) => ({ ...b, ...patch }));

  return (
    <main className="page space-y-5">
      {flash > 0 && (
        <>
          {score === 100 && <Confetti key={`c${flash}`} />}
          <Toast key={`t${flash}`}>{cheer}</Toast>
        </>
      )}
      <h1 className="sr-only">強みの帳面</h1>

      <section className="card flex animate-rise flex-wrap items-center gap-4" aria-label="しおりから">
        <Shiori mood={score === 100 ? "welldone" : score > 0 ? "cheer" : "point"} className="h-28 w-auto sm:h-32" />
        <div className="min-w-[12rem] flex-1 space-y-2">
          <p className="rounded-2xl bg-sun-soft px-4 py-3 font-bold" role="status">
            {isEmptyBook(book)
              ? "ここは、あなたの会社だけの「強みの帳面」。書いておくと、AIが毎回これを読んでから記事を書くよ。まずは下書きを作ってみよう。"
              : gap
                ? `いい調子！あと少し。${gap.message}。`
                : "帳面がそろったよ！AIに紹介されて来た人が「ここに頼もう」と決められる材料が、全部の記事に入るよ。"}
          </p>
          <p className="text-sm text-muted">
            AIは、紹介する理由を組み立てられる会社を選びます。紹介されて来た人は、ほとんど決めてから最後の確認に来ます。だから「誰に・どんな強みを・なぜそう言えるか」を先に決めておくと、どの記事も選ばれやすくなります。
          </p>
        </div>
        <div className="grid shrink-0 place-items-center gap-1 text-center">
          <span className="text-4xl font-black text-brand-dark">{score}%</span>
          <span className="text-xs text-muted">{bookChars(book).toLocaleString()}字</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${inUse ? "bg-ok-bright text-white" : "bg-line text-muted"}`}>{inUse ? "AIが使っています" : "まだ使っていません"}</span>
        </div>
      </section>

      {error && (
        <p className="rounded-2xl border-2 border-warn bg-surface px-4 py-3 font-bold text-warn" role="alert">
          {error}
        </p>
      )}

      {gap && (
        <section className="card animate-rise space-y-3 border-2 border-brand" aria-labelledby="gap-heading">
          <h2 id="gap-heading" className="text-sm text-muted">
            しおりからの質問（あと{gaps.length}つ）
          </h2>
          <p className="text-lg font-bold">{gap.ask}</p>
          <textarea className="field min-h-24 w-full" value={answer} maxLength={MAX_FIELD} placeholder={gap.example} onChange={(e) => setAnswer(e.target.value)} aria-label={gap.ask} />
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" disabled={!answer.trim() || !!busy} onClick={addAnswer}>
              帳面に書き足す
            </button>
            {isEmptyBook(book) && (
              <button type="button" className="btn-secondary" disabled={!!busy} onClick={() => void draft()}>
                {busy === "draft" ? "下書きを作っています…" : "会社のことの答えから下書きを作る"}
              </button>
            )}
          </div>
          {!remoteMode && <p className="text-xs text-muted">{SAMPLE_LABEL}：試作では、AIを使わずに答えを並べるだけです。</p>}
        </section>
      )}

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void save(normalizeBook(book), "保存しました。次の記事から、AIがこの帳面を読んで書きます");
        }}
      >
        <section className="card space-y-2" aria-labelledby="sp-heading">
          <h2 id="sp-heading" className="font-bold">
            ① ひとことで、何の専門の会社？
          </h2>
          <input className="field w-full" value={book.specialty} maxLength={MAX_FIELD} placeholder="例：図面の無い部品の、1個からの作り直し" onChange={(e) => set({ specialty: e.target.value })} aria-labelledby="sp-heading" />
        </section>

        <section className="card space-y-3" aria-labelledby="tg-heading">
          <div>
            <h2 id="tg-heading" className="font-bold">
              ② いちばん力になれるお客様（{MAX_TARGETS}つまで）
            </h2>
            <p className="text-sm text-muted">「どなたでも」より、困りごとまで絞るほうがAIに紹介されやすくなります。</p>
          </div>
          {book.targets.map((t, i) => (
            <div key={i} className="grid gap-2 rounded-2xl bg-sky p-3 sm:grid-cols-2">
              <input className="field" value={t.who} maxLength={MAX_FIELD} placeholder="どんなお客様？" aria-label={`お客様${i + 1}`} onChange={(e) => set({ targets: book.targets.map((x, j) => (j === i ? { ...x, who: e.target.value } : x)) })} />
              <div className="flex gap-2">
                <input className="field min-w-0 flex-1" value={t.problem} maxLength={MAX_FIELD} placeholder="どんな困りごと？" aria-label={`お客様${i + 1}の困りごと`} onChange={(e) => set({ targets: book.targets.map((x, j) => (j === i ? { ...x, problem: e.target.value } : x)) })} />
                <button type="button" className="btn-secondary px-3" aria-label={`お客様${i + 1}を消す`} onClick={() => set({ targets: book.targets.filter((_, j) => j !== i) })}>
                  ×
                </button>
              </div>
            </div>
          ))}
          {book.targets.length < MAX_TARGETS && (
            <button type="button" className="btn-secondary" onClick={() => set({ targets: [...book.targets, { who: "", problem: "" }] })}>
              ＋ お客様を足す
            </button>
          )}
        </section>

        <section className="card space-y-3" aria-labelledby="st-heading">
          <div>
            <h2 id="st-heading" className="font-bold">
              ③ そのお客様への強み（{MAX_STRENGTHS}つまで）
            </h2>
            <p className="text-sm text-muted">「丁寧」「親身」だけでは、どの会社にも書けます。なぜそう言えるか（根拠）と、数字を添えてください。</p>
          </div>
          {book.strengths.map((s, i) => (
            <div key={i} className="space-y-2 rounded-2xl bg-sky p-3">
              <div className="flex gap-2">
                <input className="field min-w-0 flex-1 font-bold" value={s.claim} maxLength={MAX_FIELD} placeholder="強み（例：図面が無くても作れる）" aria-label={`強み${i + 1}`} onChange={(e) => set({ strengths: book.strengths.map((x, j) => (j === i ? { ...x, claim: e.target.value } : x)) })} />
                <button type="button" className="btn-secondary px-3" aria-label={`強み${i + 1}を消す`} onClick={() => set({ strengths: book.strengths.filter((_, j) => j !== i) })}>
                  ×
                </button>
              </div>
              <input className="field w-full" value={s.reason} maxLength={MAX_FIELD} placeholder="なぜそう言える？（例：3次元測定機で現物を測り、同じ職人が図面を起こす）" aria-label={`強み${i + 1}の根拠`} onChange={(e) => set({ strengths: book.strengths.map((x, j) => (j === i ? { ...x, reason: e.target.value } : x)) })} />
              <input className="field w-full" value={s.numbers} maxLength={MAX_FIELD} placeholder="数字（例：この10年で約300点、最短3日）" aria-label={`強み${i + 1}の数字`} onChange={(e) => set({ strengths: book.strengths.map((x, j) => (j === i ? { ...x, numbers: e.target.value } : x)) })} />
            </div>
          ))}
          {book.strengths.length < MAX_STRENGTHS && (
            <button type="button" className="btn-secondary" onClick={() => set({ strengths: [...book.strengths, { claim: "", reason: "", numbers: "" }] })}>
              ＋ 強みを足す
            </button>
          )}
        </section>

        <section className="card space-y-3" aria-labelledby="wn-heading">
          <div>
            <h2 id="wn-heading" className="font-bold">
              ④ 実際に選ばれた決め手（目安{WIN_GOAL}つ・{MAX_WINS}つまで）
            </h2>
            <p className="text-sm text-muted">「〇〇だから、うちを選んでもらえた」を1件ずつ。事例の記事の芯になります。お客様の名前は書かなくて大丈夫です。</p>
          </div>
          {book.wins.map((w, i) => (
            <div key={i} className="flex gap-2">
              <input className="field min-w-0 flex-1" value={w} maxLength={MAX_FIELD} aria-label={`決め手${i + 1}`} onChange={(e) => set({ wins: book.wins.map((x, j) => (j === i ? e.target.value : x)) })} />
              <button type="button" className="btn-secondary px-3" aria-label={`決め手${i + 1}を消す`} onClick={() => set({ wins: book.wins.filter((_, j) => j !== i) })}>
                ×
              </button>
            </div>
          ))}
          {book.wins.length < MAX_WINS && (
            <button type="button" className="btn-secondary" onClick={() => set({ wins: [...book.wins, ""] })}>
              ＋ 決め手を足す
            </button>
          )}
        </section>

        <section className="card space-y-3" aria-labelledby="rc-heading">
          <h2 id="rc-heading" className="font-bold">
            ⑤ 分野ごとの実績・対応できる地域
          </h2>
          <p className="text-sm text-muted">「全部で1万件」より「ギヤの作り直し 年120点」のように分けると、AIが紹介する根拠に使えます。対応地域が書いていないと、AIが狭く思い込むことがあります。</p>
          <textarea className="field min-h-24 w-full" value={book.records} maxLength={MAX_LONG_FIELD} placeholder="例：ギヤの作り直し 年120点、シャフト 年80点。関東一円、全国は相談" onChange={(e) => set({ records: e.target.value })} aria-labelledby="rc-heading" />
        </section>

        <section className="card grid gap-3 sm:grid-cols-2" aria-label="書き方">
          <label className="space-y-1">
            <span className="font-bold">⑥ うちらしい書き方</span>
            <textarea className="field min-h-20 w-full" value={book.voice} maxLength={MAX_FIELD} placeholder="例：ですます調。専門用語にはひとこと説明。「まず現物を見せてください」が口ぐせ" onChange={(e) => set({ voice: e.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="font-bold">⑦ 使わない言葉・書かないこと</span>
            <textarea className="field min-h-20 w-full" value={book.avoid} maxLength={MAX_FIELD} placeholder="例：「業界最安」「絶対」は使わない。取引先の社名は出さない" onChange={(e) => set({ avoid: e.target.value })} />
          </label>
        </section>

        <details className="card">
          <summary className="cursor-pointer font-bold text-brand-dark">AIに渡している「この会社だけの指示」を見る</summary>
          <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-muted">{bookToPrompt(normalizeBook(book)) || "まだ何も書かれていません"}</pre>
        </details>

        <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface/95 p-3 shadow-lg backdrop-blur">
          <button type="submit" className="btn-primary" disabled={!!busy || (!dirty && inUse)}>
            {busy === "save" ? "保存しています…" : "保存して、AIに使ってもらう"}
          </button>
          {!isEmptyBook(book) && (
            <button type="button" className="btn-secondary" disabled={!!busy} onClick={() => void draft()}>
              {busy === "draft" ? "下書きを作っています…" : "空いている欄をAIに下書きしてもらう"}
            </button>
          )}
          <span className="text-sm text-muted">{dirty ? "直した所はまだ保存されていません" : inUse ? "次の記事から、AIがこの帳面を読んで書きます" : "保存すると、AIが使い始めます"}</span>
        </div>
      </form>
    </main>
  );
}
