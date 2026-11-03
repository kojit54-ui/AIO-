"use client";

// AIOのチェック（人の確認の代わり。docs/DECISIONS.md 2026-11-02）。
// お客様：何をチェックするかを見てから実施 → 結果 → 足りない所をしおりと一問一答 → 記事に反映。
// コタム：結果とやり取りを読むだけ（コメントは記事の画面の「コメントを残す」から）。

import { useState } from "react";
import { AioIcon } from "@/components/aio";
import { Confetti, Shiori, Toast } from "@/components/fun";
import { ShioriTalk } from "@/components/talk";
import { GeneratingOverlay, formatDate } from "@/components/ui";
import { AIO_CHECK_GROUPS, AIO_CHECK_LIST, aioCheckLabel } from "@/lib/aioCheck";
import { useStore } from "@/mock/store";
import type { AioCheck, AioCheckKey, AioPoint, Answer, Article, ArticleVersion } from "@/types/domain";

const AIO_KEYS = new Set<string>(["experience", "numbers", "entity", "qa", "comparison", "expertise", "feeling", "action", "trust"]);

/** 項目のしるし。AIOの材料は材料のアイコン、ほかは決まった記号 */
function CheckIcon({ k, className = "h-5 w-5" }: { k: AioCheckKey; className?: string }) {
  if (AIO_KEYS.has(k)) return <AioIcon point={k as AioPoint} className={className} />;
  const path = { facts: "M4 20h16M7 16l3-8 3 5 2-3 2 6", words: "M4 6h16M4 12h10M4 18h7M17 15l4 4m0-4l-4 4", ai_tone: "M12 3l2 5 5 .5-4 3.5 1.5 5L12 14l-4.5 3 1.5-5-4-3.5L10 8z" }[k as "facts" | "words" | "ai_tone"];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}

/** 「AIに選ばれる」「人に選ばれる」の札 */
function StageTag({ stage }: { stage: (typeof AIO_CHECK_GROUPS)[number] }) {
  return (
    <p className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black ${stage.key === "ai" ? "bg-brand-soft text-brand-dark" : "bg-sun text-ink"}`}>
      <span aria-hidden>{stage.icon}</span>
      {stage.step}. {stage.label}
    </p>
  );
}

/** 「こんなチェックをします」。項目名を並べ、開くと何を見るかの説明が出る */
export function AioCheckList({ compact = false }: { compact?: boolean }) {
  return (
    <div className="space-y-2 rounded-2xl bg-canvas p-3">
      {!compact && (
        <>
          <p className="font-bold">こんなチェックをします（{AIO_CHECK_LIST.length}項目）</p>
          {AIO_CHECK_GROUPS.map((g) => (
            <div key={g.key}>
              <StageTag stage={g} />
              <ul className="mt-1 flex flex-wrap gap-1.5 text-xs" aria-label={`${g.label}ためのチェック`}>
                {g.keys.map((k, i) => (
                  <li key={k} className="inline-flex animate-pop items-center gap-1 rounded-full bg-surface px-2 py-1 font-bold text-brand-dark ring-1 ring-line" style={{ animationDelay: `${i * 0.04}s` }}>
                    <CheckIcon k={k} className="h-4 w-4" />
                    {aioCheckLabel(k).split("（")[0]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
      <details>
        <summary className="cursor-pointer text-sm font-bold text-brand-dark">{compact ? `チェックする${AIO_CHECK_LIST.length}項目の説明` : "それぞれ何を見るの？"}</summary>
        <ul className="mt-2 space-y-2 text-sm">
          {AIO_CHECK_LIST.map((c) => (
            <li key={c.key} className="flex gap-2">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-dark">
                <CheckIcon k={c.key} />
              </span>
              <span>
                <b className="block">{c.label}</b>
                <span className="text-muted">{c.what}</span>
              </span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function CheckResult({ check, applied }: { check: AioCheck; applied: boolean }) {
  // 答えを書き足した項目は、書き足したことが分かるようにする
  const answered = new Set(applied ? check.questions.filter((q) => check.answers.some((a) => a.questionId === q.id && !a.unknown && a.text.trim())).map((q) => q.key) : []);
  const items = check.items.map((i) => (answered.has(i.key) ? { ...i, ok: true, note: "答えてもらった内容を書き足しました" } : i));
  const good = items.filter((i) => i.ok).length;
  return (
    <div className="space-y-3">
      <div>
        <p className="flex items-baseline justify-between gap-2">
          <b>チェックの結果</b>
          <span className="text-sm text-muted">
            {good} / {items.length} 項目OK
          </span>
        </p>
        <div className="mt-1 h-3 overflow-hidden rounded-full bg-canvas" aria-hidden>
          <div className="h-full rounded-full bg-gradient-to-r from-sun to-ok-bright transition-[width] duration-700" style={{ width: `${items.length ? (good / items.length) * 100 : 0}%` }} />
        </div>
        {check.summary && !applied && <p className="mt-2 text-sm">{check.summary}</p>}
        {check.isSample && <p className="mt-1 text-xs text-warn">サンプル（AIは未接続）</p>}
      </div>
      {AIO_CHECK_GROUPS.map((g) => (
        <div key={g.key} className="space-y-1.5">
          <StageTag stage={g} />
          <ul className="space-y-1.5 text-sm">
            {items.filter((i) => g.keys.includes(i.key)).map((i, n) => (
          <li
            key={i.key}
            className={`flex animate-rise items-start gap-2 rounded-xl px-2.5 py-1.5 ${i.ok ? "bg-ok-soft" : "bg-sun-soft"}`}
            style={{ animationDelay: `${n * 0.04}s` }}
          >
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black ${i.ok ? "bg-ok-bright text-white" : "bg-sun text-ink"}`} aria-hidden>
              {i.ok ? "✓" : "！"}
            </span>
            <span>
              <b className="block">
                {aioCheckLabel(i.key)}
                <span className="sr-only">{i.ok ? "（OK）" : "（足りない）"}</span>
              </b>
              {i.note && <span className="text-muted">{i.note}</span>}
            </span>
          </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** 聞き返しとその答え（コタムの画面と、終わったチェック） */
function QaLog({ check }: { check: AioCheck }) {
  if (check.questions.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="font-bold">AIとのやり取り</p>
      <ul className="space-y-2 text-sm">
        {check.questions.map((q) => {
          const a = check.answers.find((x) => x.questionId === q.id);
          return (
            <li key={q.id} className="space-y-1">
              <p className="rounded-2xl rounded-tl-sm bg-brand-soft px-3 py-2">
                <b className="text-brand-dark">AI：</b>
                {q.text}
              </p>
              <p className="ml-6 rounded-2xl rounded-tr-sm bg-surface px-3 py-2 ring-1 ring-line">
                <b>お客様：</b>
                {a ? (a.unknown ? "まだ分からない" : a.text || "（未回答）") : "（未回答）"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** 聞き返しに一問一答で答える */
function Questions({ check, onApply, onError }: { check: AioCheck; onApply: () => void; onError: (e: unknown, f: string) => void }) {
  const { api } = useStore();
  const [answers, setAnswers] = useState<Answer[]>(check.answers);
  const firstOpen = check.questions.findIndex((q) => !check.answers.some((a) => a.questionId === q.id));
  const [step, setStep] = useState(firstOpen < 0 ? check.questions.length - 1 : firstOpen);
  const [saving, setSaving] = useState(false);
  const q = check.questions[step];
  const current = answers.find((a) => a.questionId === q.id) ?? { questionId: q.id, text: "", unknown: false };
  const isLast = step === check.questions.length - 1;
  const canGo = current.unknown || current.text.trim().length > 0;

  function set(patch: Partial<Answer>) {
    setAnswers((prev) => {
      const next = { ...current, ...patch };
      return prev.some((a) => a.questionId === q.id) ? prev.map((a) => (a.questionId === q.id ? next : a)) : [...prev, next];
    });
  }

  async function next() {
    setSaving(true);
    try {
      await api.saveAioAnswers(check.id, answers);
      if (isLast) onApply();
      else setStep(step + 1);
    } catch (e) {
      onError(e, "答えを保存できませんでした");
    }
    setSaving(false);
  }

  return (
    <form
      key={q.id}
      className="animate-enter space-y-3 rounded-2xl border-2 border-brand bg-surface p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (canGo) next();
      }}
    >
      <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="rounded-full bg-brand px-3 py-0.5 text-white">
          AIからの質問 {step + 1} / {check.questions.length}
        </span>
        <span className="text-muted">「{aioCheckLabel(q.key)}」のため</span>
      </p>
      {/* 答えた質問に星。あと何問かが一目で分かるように */}
      <p className="flex flex-wrap gap-1" aria-hidden>
        {check.questions.map((x, i) => (
          <span key={x.id} className={`grid h-7 w-7 place-items-center rounded-full border-2 text-xs font-black ${i < step ? "animate-stamp border-ok-bright bg-ok-soft" : i === step ? "animate-shine border-sun bg-sun-soft" : "border-line text-muted"}`}>
            {i < step ? "⭐" : i + 1}
          </span>
        ))}
      </p>
      <label htmlFor="aio-answer" className="block text-lg font-black leading-snug">
        {q.text}
      </label>
      {q.example && <p className="rounded-xl bg-canvas px-3 py-2 text-sm text-muted">{q.example}</p>}
      <textarea
        id="aio-answer"
        className="field min-h-28"
        placeholder={q.example || "短い言葉や箇条書きで大丈夫です"}
        value={current.unknown ? "" : current.text}
        disabled={current.unknown}
        onChange={(e) => set({ text: e.target.value })}
      />
      <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-dashed px-3 py-1 text-sm ${current.unknown ? "border-brand bg-brand-soft text-brand-dark" : "border-line text-muted"}`}>
        <input type="checkbox" className="h-4 w-4 accent-brand" checked={current.unknown} onChange={(e) => set({ unknown: e.target.checked })} />
        まだ分からない
      </label>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="btn-secondary min-h-10 px-4 text-sm" disabled={step === 0 || saving} onClick={() => setStep(step - 1)}>
          ← 戻る
        </button>
        <button type="submit" className="btn-primary" disabled={!canGo || saving}>
          {isLast ? "記事に反映する" : "次へ"}
          <span className="inline-block animate-nudge" aria-hidden>
            {isLast ? "✨" : "→"}
          </span>
        </button>
      </div>
    </form>
  );
}

/** AIOのチェックの状態と操作。記事の画面の上の知らせ・右の枠・質問のウィンドウで共有する */
export function useAioCheck(article: Article, version: ArticleVersion, onError: (e: unknown, f: string) => void) {
  const { db, api } = useStore();
  const [busy, setBusy] = useState<null | "check" | "apply">(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [askOpen, setAskOpen] = useState(false);
  const checks = db.aioChecks.filter((c) => c.articleId === article.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latest = checks[0];
  // 今の版をチェックしたもの、または答えを反映して今の版を作ったもの
  const forCurrent = latest && (latest.versionId === version.id || latest.resultVersionId === version.id) ? latest : null;
  const applied = forCurrent?.resultVersionId === version.id;

  async function run() {
    setBusy("check");
    try {
      const c = await api.runAioCheck(article.id);
      if (c.status === "done") setCelebrate("チェック完了！AIにも人にも選ばれやすい記事です");
      // 足りない所があれば、すぐに質問のウィンドウを開く
      else setAskOpen(true);
    } catch (e) {
      onError(e, "AIOのチェックができませんでした。もう一度お試しください");
    }
    setBusy(null);
  }

  async function apply(check: AioCheck) {
    setBusy("apply");
    try {
      await api.applyAioCheck(check.id);
      setAskOpen(false);
      setCelebrate("答えを記事に書き込みました！");
    } catch (e) {
      onError(e, "記事に反映できませんでした。答えは残っています");
      setBusy(null);
    }
  }

  return { checks, latest, forCurrent, applied, busy, celebrate, askOpen, setAskOpen, run, apply, onError };
}
export type AioCheckControl = ReturnType<typeof useAioCheck>;

/** 記事の画面のいちばん上の知らせ。チェックがまだなら実施を、質問があれば答えるのをすすめる */
export function AioCheckBanner({ ctl, dirty }: { ctl: AioCheckControl; dirty: boolean }) {
  const { forCurrent, busy } = ctl;
  if (forCurrent?.status === "done") return null;
  const asking = forCurrent?.status === "asking";
  const open = asking ? forCurrent.questions.filter((q) => !forCurrent.answers.some((a) => a.questionId === q.id)).length : 0;
  return (
    <div className={`mb-4 flex animate-rise flex-wrap items-end gap-3 rounded-3xl border-2 px-4 pt-2 ${asking ? "border-sun bg-sun-soft" : "border-brand bg-brand-soft"}`}>
      <Shiori mood={asking ? "ask" : "point"} className="h-24 w-auto shrink-0" />
      <div className="mb-3 min-w-0 flex-1 basis-56">
        <p className="text-lg font-black">{asking ? `AIから質問が${forCurrent.questions.length}つ届いています` : "ブログに載せる前に、AIOのチェックをしましょう"}</p>
        <p className="text-sm">
          {asking
            ? `答えると、AIにも読んだ人にも選ばれやすい記事になります。${open < forCurrent.questions.length ? `（あと${open}問）` : ""}`
            : `AIに選ばれて、読んだ人の心が動く記事か、${AIO_CHECK_LIST.length}の項目をAIがチェックします。足りない所は、AIが質問します。`}
        </p>
      </div>
      <button
        type="button"
        className="btn-primary mb-3 text-lg"
        disabled={busy !== null || (!asking && dirty)}
        onClick={() => (asking ? ctl.setAskOpen(true) : ctl.run())}
      >
        {asking ? "質問に答える" : "AIOのチェックを実施"}
        <span className="inline-block animate-nudge" aria-hidden>
          {asking ? "→" : "✨"}
        </span>
      </button>
    </div>
  );
}

/** チェック後にポコッと出る、質問に答えるウィンドウ */
function AskDialog({ ctl, check }: { ctl: AioCheckControl; check: AioCheck }) {
  const ng = check.items.filter((i) => !i.ok);
  const good = check.items.length - ng.length;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="aio-ask-title"
      onKeyDown={(e) => e.key === "Escape" && ctl.setAskOpen(false)}
    >
      <div className="card my-4 w-full max-w-2xl animate-pop space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-end gap-3">
            <Shiori mood="surprise" className="h-20 w-auto shrink-0 sm:h-24" />
            <div>
              <h2 id="aio-ask-title" className="text-xl font-black sm:text-2xl">
                チェックが終わりました！
              </h2>
              <p className="text-sm text-muted">
                {check.items.length}項目のうち <b className="text-ink">{good}項目OK</b>。あと少しで、もっとAIに紹介されやすくなります。
              </p>
            </div>
          </div>
          <button type="button" className="shrink-0 text-sm text-muted underline" onClick={() => ctl.setAskOpen(false)}>
            あとで答える
          </button>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-canvas" aria-hidden>
          <div className="h-full rounded-full bg-gradient-to-r from-sun to-ok-bright" style={{ width: `${check.items.length ? (good / check.items.length) * 100 : 0}%` }} />
        </div>
        {check.summary && <p>{check.summary}</p>}
        {ng.length > 0 && (
          <div>
            <p className="mb-1 text-sm font-bold">足りないところ</p>
            <ul className="flex flex-wrap gap-1.5 text-sm">
              {ng.map((i) => (
                <li key={i.key} className="rounded-full bg-sun-soft px-3 py-1 font-bold" title={i.note}>
                  ！ {aioCheckLabel(i.key)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Questions check={check} onApply={() => ctl.apply(check)} onError={ctl.onError} />
        {check.isSample && <p className="text-xs text-warn">サンプル（AIは未接続）</p>}
      </div>
    </div>
  );
}

/** 生成中の表示・質問のウィンドウ・お祝い。スマホで右の枠が隠れていても出るよう、画面の直下に置く */
export function AioCheckOverlays({ ctl }: { ctl: AioCheckControl }) {
  const { busy, askOpen, forCurrent, celebrate } = ctl;
  return (
    <>
      {busy && <GeneratingOverlay label={busy === "check" ? "AIOのチェックをしています" : "答えを記事に書き込んでいます"} />}
      {!busy && askOpen && forCurrent?.status === "asking" && <AskDialog ctl={ctl} check={forCurrent} />}
      {celebrate && (
        <>
          <Confetti count={50} />
          <Toast key={celebrate}>{celebrate}</Toast>
        </>
      )}
    </>
  );
}

/** 記事の画面の「AIOのチェック」の枠 */
export function AioCheckPanel({ ctl, isCoach, dirty }: { ctl: AioCheckControl; isCoach: boolean; dirty: boolean }) {
  const { checks, latest, forCurrent, applied, busy, run } = ctl;
  return (
    <section className="card space-y-3" aria-labelledby="aio-check-heading">
      <h2 id="aio-check-heading" className="flex items-center gap-2 text-lg font-bold">
        AIOのチェック
        {forCurrent && <span className={`rounded-full px-2.5 text-sm ${forCurrent.status === "done" ? "bg-ok-soft text-ok" : "bg-sun-soft"}`}>{forCurrent.status === "done" ? "チェック済み" : "答え待ち"}</span>}
      </h2>

      {!forCurrent && (
        <>
          <ShioriTalk
            mood="point"
            lines={isCoach ? "この内容は、まだAIOのチェックをしていません。" : ["ブログに載せる前に、AIが記事をチェックします。", "AIの検索に紹介されやすいか、足りない所はないかを見て、必要なら質問しますね。"]}
          />
          <AioCheckList />
          {latest && <p className="text-xs text-muted">前回のチェック：{formatDate(latest.createdAt)}（そのあと記事が直されています）</p>}
          {!isCoach && (
            <>
              <button type="button" className="btn-primary w-full" disabled={busy !== null || dirty} onClick={run}>
                AIOのチェックを実施
                <span className="inline-block animate-nudge" aria-hidden>
                  ✨
                </span>
              </button>
              {dirty && <p className="text-xs text-muted">先に下書きを保存してください。</p>}
            </>
          )}
        </>
      )}

      {forCurrent && (
        <>
          {forCurrent.status === "done" && (
            <div className="flex animate-pop items-end gap-3 rounded-2xl bg-ok-soft px-3 pt-2">
              <Shiori mood={applied ? "welldone" : "right"} className="h-24 w-auto shrink-0" />
              <p className="mb-3 text-sm font-bold">
                {applied ? "答えを記事に書き込みました。読んで、自分の言葉になっているか確かめてください。" : "チェック完了！このままブログに載せられます。"}
              </p>
            </div>
          )}
          <CheckResult check={forCurrent} applied={applied} />
          {forCurrent.status === "asking" && !isCoach && (
            <button type="button" className="btn-primary w-full" onClick={() => ctl.setAskOpen(true)}>
              AIからの質問に答える（{forCurrent.questions.length}問）
            </button>
          )}
          {(isCoach || forCurrent.status === "done") && <QaLog check={forCurrent} />}
          {!isCoach && forCurrent.status === "done" && (
            <button type="button" className="btn-secondary w-full" disabled={busy !== null || dirty} onClick={run}>
              もう一度チェックする
            </button>
          )}
          <AioCheckList compact />
        </>
      )}

      {isCoach && checks.length > 1 && (
        <details className="rounded-2xl bg-canvas p-3 text-sm">
          <summary className="cursor-pointer font-bold">これまでのチェック（{checks.length}回）</summary>
          <ul className="mt-2 space-y-3">
            {checks.map((c) => (
              <li key={c.id} className="space-y-1">
                <p className="text-xs text-muted">
                  {formatDate(c.createdAt)}・{c.items.filter((i) => i.ok).length} / {c.items.length} 項目OK・{c.status === "done" ? "終わり" : "答え待ち"}
                </p>
                <QaLog check={c} />
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
