"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlockEditor } from "@/components/BlockEditor";
import { Dialog, Forbidden, GeneratingOverlay, NotFound, Notice, SampleNotice, StatusBadge, formatDate } from "@/components/ui";
import { FOLLOW_UP_QUESTION, QUESTIONS } from "@/mock/data";
import { ApiError, useStore } from "@/mock/store";
import { blocksToHtml, blocksToPlainText } from "@/lib/exportText";
import { canApply } from "@/lib/workflow";
import type { Article, ArticleVersion, Block, FactCheckStatus } from "@/types/domain";

type Banner = { tone: "danger" | "ok" | "info"; message: string; session?: boolean } | null;

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { db, user } = useStore();
  const article = db.articles.find((a) => a.id === id);

  if (!user) return null;
  if (!article) return <NotFound />;
  if (!user.organizationIds.includes(article.organizationId)) return <Forbidden />;
  const version = db.versions.find((v) => v.id === article.currentVersionId);
  if (!version) {
    return (
      <main className="page">
        <Notice tone="info" title="まだ本文がありません">
          <Link className="underline" href={`/articles/${id}/questions`}>
            質問に答えるところから始めましょう
          </Link>
        </Notice>
      </main>
    );
  }
  // 版が変わったら編集中の状態を作り直す
  return <ArticleWorkspace key={version.id} article={article} version={version} />;
}

function ArticleWorkspace({ article, version }: { article: Article; version: ArticleVersion }) {
  const { db, user, api, login } = useStore();
  const org = db.organizations.find((o) => o.id === article.organizationId)!;
  const isCoach = user!.role === "coach";
  const policy = org.reviewPolicy;

  const [title, setTitle] = useState(version.title);
  const [blocks, setBlocks] = useState<Block[]>(version.body);
  const [headings, setHeadings] = useState<string[]>(version.outline.map((o) => o.heading));
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<null | "save" | "generate" | "review" | "publish">(null);
  const [banner, setBanner] = useState<Banner>(null);
  const [conflict, setConflict] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tab, setTab] = useState<"answers" | "policy" | "facts" | "comments">(isCoach ? "comments" : "facts");
  const [mobileView, setMobileView] = useState<"body" | "side">("body");

  // 未保存のまま閉じようとしたら確認する
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const outlineMode = version.body.length === 0;
  const readOnly = isCoach;
  const facts = db.factChecks.filter((f) => f.versionId === version.id);
  const unchecked = facts.filter((f) => f.status === "unchecked").length;
  const reviews = db.reviews.filter((r) => r.articleId === article.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const frozenVersion = article.reviewRequestedVersionId ? db.versions.find((v) => v.id === article.reviewRequestedVersionId) : null;
  const approved = article.status === "approved" || (article.status === "published" && !article.publishedWithoutApproval);

  function handleError(e: unknown, fallback: string) {
    if (e instanceof ApiError && e.code === "conflict") return setConflict(true);
    if (e instanceof ApiError && e.code === "session_expired") return setBanner({ tone: "danger", message: e.message, session: true });
    setBanner({ tone: "danger", message: e instanceof ApiError ? e.message : fallback });
  }

  async function save(force = false) {
    setBusy("save");
    setBanner(null);
    try {
      const current = db.articles.find((a) => a.id === article.id)!;
      await api.saveVersion(article.id, { title, body: blocks }, force ? current.lockVersion : article.lockVersion);
      // 保存に成功したら key が変わり、この画面は新しい版で作り直される
    } catch (e) {
      handleError(e, "保存できませんでした");
      setBusy(null);
    }
  }

  async function generate() {
    setBusy("generate");
    setBanner(null);
    try {
      await api.generateBody(article.id, headings.filter((h) => h.trim()));
    } catch (e) {
      handleError(e, "文章を作れませんでした。入力内容は残っています");
      setBusy(null);
    }
  }

  async function requestReview() {
    setBusy("review");
    try {
      await api.requestReview(article.id);
      setBanner({ tone: "ok", message: "コタムに確認を依頼しました" });
    } catch (e) {
      handleError(e, "確認依頼を送れませんでした");
    }
    setBusy(null);
  }

  async function copy(kind: "title" | "body" | "html") {
    const text = kind === "title" ? title : kind === "body" ? blocksToPlainText(blocks) : blocksToHtml(blocks);
    try {
      await navigator.clipboard.writeText(text);
      const label = { title: "タイトル", body: "本文", html: "HTML" }[kind];
      setBanner({ tone: "ok", message: `${label}をコピーしました${approved ? "" : "（承認前の下書きです）"}` });
    } catch {
      setBanner({ tone: "danger", message: "コピーできませんでした。ブラウザの設定を確認してください" });
    }
  }

  const canRequestReview = !isCoach && !dirty && canApply(article, { type: "request_review" }, "client_member", policy);
  const canPublish = !isCoach && !dirty && canApply(article, { type: "publish", url: "https://example.com", at: "" }, "client_member", policy);

  return (
    <main className="page">
      {busy === "generate" && <GeneratingOverlay label={outlineMode ? "本文を作っています" : "新しい版を作っています"} />}

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={isCoach ? "/coach" : "/"} className="text-sm text-brand-dark underline">
            {isCoach ? "管理画面へ戻る" : "ホームへ戻る"}
          </Link>
          <h1 className="text-2xl font-bold">{outlineMode ? "見出し案を確認する" : isCoach ? "記事を確認する" : "記事を整える"}</h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <StatusBadge status={article.status} />
            <span>第{version.versionNo}版</span>
            <button type="button" className="underline" onClick={() => setHistoryOpen(true)}>
              版の履歴
            </button>
            {isCoach && <span>{org.name}</span>}
          </p>
        </div>
        {!isCoach && !outlineMode && (
          <div className="flex flex-wrap items-center gap-2">
            <span aria-live="polite" className={`text-sm ${dirty ? "font-semibold text-warn" : "text-muted"}`}>
              {busy === "save" ? "保存しています…" : dirty ? "保存していない変更があります" : "保存済み"}
            </span>
            <button type="button" className="btn-primary" disabled={!dirty || busy !== null} onClick={() => save()}>
              下書きを保存
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 space-y-2">
        {version.isSample && <SampleNotice />}
        {banner && (
          <Notice tone={banner.tone} title={banner.message}>
            {banner.session && (
              <button type="button" className="underline" onClick={() => { login(user!.id); setBanner(null); }}>
                もう一度ログインする（編集中の内容はこの画面に残っています）
              </button>
            )}
            {banner.tone === "danger" && !banner.session && "入力した内容は消えていません。"}
          </Notice>
        )}
        <StatusNotice
          article={article}
          frozenNo={frozenVersion?.versionNo}
          isCoach={isCoach}
          policy={policy}
          hasNewer={db.versions.some((v) => v.articleId === article.id && v.versionNo > version.versionNo)}
        />
      </div>

      {/* スマートフォンでは本文と補助情報をタブで切り替える */}
      <div className="mb-3 grid grid-cols-2 gap-2 lg:hidden" role="tablist" aria-label="表示の切り替え">
        <button role="tab" aria-selected={mobileView === "body"} className={mobileView === "body" ? "btn-primary" : "btn-secondary"} onClick={() => setMobileView("body")}>
          本文
        </button>
        <button role="tab" aria-selected={mobileView === "side"} className={mobileView === "side" ? "btn-primary" : "btn-secondary"} onClick={() => setMobileView("side")}>
          {isCoach ? "レビュー・コメント" : `確認事項・回答${unchecked > 0 ? `（未確認${unchecked}）` : ""}`}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={`card space-y-5 ${mobileView === "body" ? "" : "hidden lg:block"}`} aria-label="本文">
          {outlineMode ? (
            <OutlineEditor headings={headings} onChange={setHeadings} onGenerate={generate} busy={busy !== null} />
          ) : (
            <>
              <TitleEditor title={title} candidates={version.titleCandidates} readOnly={readOnly} onChange={(t) => { setTitle(t); setDirty(true); }} />
              <BlockEditor blocks={blocks} readOnly={readOnly} onChange={(b) => { setBlocks(b); setDirty(true); }} />
              {!isCoach && (
                <div className="border-t border-line pt-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    disabled={busy !== null || dirty}
                    onClick={() => {
                      setHeadings(blocks.filter((b) => b.type === "heading").map((b) => (b as { text: string }).text));
                      generate();
                    }}
                  >
                    もう一度作る（今の版は残ります）
                  </button>
                  {dirty && <p className="mt-1 text-sm text-muted">先に下書きを保存してください。</p>}
                </div>
              )}
            </>
          )}
        </section>

        <aside className={`space-y-4 ${mobileView === "side" ? "" : "hidden lg:block"}`} aria-label="補助情報">
          {!outlineMode && !isCoach && (
            <div className="card space-y-3">
              <p className="font-semibold">次の操作</p>
              {unchecked > 0 && <Notice tone="warn" title={`未確認の箇所が${unchecked}件あります`}>確認依頼や書き出しはできますが、先に確認するのがおすすめです。</Notice>}
              <button type="button" className="btn-primary w-full" disabled={!canRequestReview || busy !== null} onClick={requestReview}>
                コタムに確認を頼む
              </button>
              <div className="space-y-2">
                <p className="text-sm text-muted">{approved ? "承認済みの内容です" : "承認前の下書きです"}</p>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" className="btn-secondary px-2 text-sm" disabled={dirty} onClick={() => copy("title")}>
                    タイトル
                  </button>
                  <button type="button" className="btn-secondary px-2 text-sm" disabled={dirty} onClick={() => copy("body")}>
                    本文
                  </button>
                  <button type="button" className="btn-secondary px-2 text-sm" disabled={dirty} onClick={() => copy("html")}>
                    HTML
                  </button>
                </div>
                <p className="text-xs text-muted">コピーしても公開済みにはなりません。</p>
              </div>
              <button type="button" className="btn-secondary w-full" disabled={!canPublish || busy !== null} onClick={() => setPublishOpen(true)}>
                公開済みにする
              </button>
              {!canPublish && policy === "required" && article.status !== "approved" && article.status !== "published" && (
                <p className="text-xs text-muted">この会社では、承認済みの記事だけを公開済みにできます。</p>
              )}
            </div>
          )}

          {isCoach && <CoachReview article={article} onError={handleError} />}

          <div className="card">
            <div className="mb-3 flex flex-wrap gap-1" role="tablist" aria-label="補助情報">
              {(
                [
                  ["facts", `要確認${unchecked ? `(${unchecked})` : ""}`],
                  ["comments", `コメント${reviews.length ? `(${reviews.length})` : ""}`],
                  ["answers", "回答"],
                  ["policy", "指導方針"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  className={`rounded-md px-3 py-1 text-sm ${tab === key ? "bg-brand text-white" : "bg-canvas"}`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "facts" && <FactPanel facts={facts} readOnly={isCoach} />}
            {tab === "comments" && <CommentPanel reviews={reviews} />}
            {tab === "answers" && <AnswerPanel version={version} />}
            {tab === "policy" && <PolicyPanel orgId={article.organizationId} />}
          </div>
        </aside>
      </div>

      {conflict && (
        <Dialog title="別の画面で更新されました" onClose={() => setConflict(false)}>
          <p className="mb-4">この記事は、別の画面や別の人によって更新されています。どちらにしますか。</p>
          <div className="flex flex-col gap-2">
            <button type="button" className="btn-secondary" onClick={() => { setConflict(false); setTitle(version.title); setBlocks(version.body); setDirty(false); setBusy(null); }}>
              最新の版を開く（この画面の変更は破棄）
            </button>
            <button type="button" className="btn-primary" onClick={() => { setConflict(false); save(true); }}>
              自分の内容を新しい版として残す
            </button>
          </div>
        </Dialog>
      )}
      {publishOpen && <PublishDialog article={article} policy={policy} onClose={() => setPublishOpen(false)} onError={handleError} />}
      {historyOpen && <HistoryDialog article={article} isCoach={isCoach} dirty={dirty} onClose={() => setHistoryOpen(false)} onError={handleError} />}
    </main>
  );
}

function StatusNotice({ article, frozenNo, isCoach, policy, hasNewer }: { article: Article; frozenNo?: number; isCoach: boolean; policy: "optional" | "required"; hasNewer: boolean }) {
  switch (article.status) {
    case "in_review":
      return (
        <Notice tone="info" title={isCoach ? "確認を依頼されています" : "コタムが確認しています"}>
          {isCoach ? `第${frozenNo}版が確認の対象です。` : `確認中の第${frozenNo}版は固定されています。編集すると新しい版として保存され、確認中の版は変わりません。`}
        </Notice>
      );
    case "changes_requested":
      return <Notice tone="warn" title="修正の依頼があります">「コメント」タブを確認してください。編集すると作成中に戻り、もう一度確認を依頼できます。</Notice>;
    case "approved":
      return (
        <Notice tone="ok" title={isCoach ? "承認済みです" : "承認されました"}>
          {!isCoach && "編集すると承認は取り消され、作成中に戻ります。"}
          {hasNewer && " 確認中に作った新しい版は「版の履歴」に残っています。"}
        </Notice>
      );
    case "published":
      return (
        <Notice tone={article.publishedWithoutApproval ? "warn" : "ok"} title="公開済み">
          <a href={article.publishedUrl ?? "#"} className="underline" target="_blank" rel="noopener noreferrer">
            {article.publishedUrl}
          </a>
          {article.publishedAt && `（${formatDate(article.publishedAt)}）`}
          {article.publishedWithoutApproval && " コタムの確認を受けずに公開した記事です。"}
        </Notice>
      );
    default:
      return policy === "required" && !isCoach ? <Notice tone="info" title="この会社では、公開前にコタムの確認が必要です" /> : null;
  }
}

function TitleEditor({ title, candidates, readOnly, onChange }: { title: string; candidates: string[]; readOnly: boolean; onChange: (t: string) => void }) {
  if (readOnly) return <p className="text-2xl font-bold">{title}</p>;
  return (
    <div>
      <label htmlFor="title" className="field-label">
        タイトル
      </label>
      <input id="title" className="field text-xl font-bold" value={title} onChange={(e) => onChange(e.target.value)} />
      {candidates.length > 1 && (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-brand-dark">タイトル候補から選ぶ</summary>
          <ul className="mt-2 space-y-1">
            {candidates.map((c) => (
              <li key={c}>
                <button type="button" className="text-left underline" onClick={() => onChange(c)}>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function OutlineEditor({ headings, onChange, onGenerate, busy }: { headings: string[]; onChange: (h: string[]) => void; onGenerate: () => void; busy: boolean }) {
  return (
    <div className="space-y-4">
      <p>回答をもとに見出し案を作りました。順番や言葉を直してから本文を作れます。</p>
      <ol className="space-y-2">
        {headings.map((h, i) => (
          <li key={i} className="flex items-center gap-2">
            <label htmlFor={`h-${i}`} className="w-8 shrink-0 text-right text-muted">
              {i + 1}
            </label>
            <input id={`h-${i}`} className="field" value={h} onChange={(e) => onChange(headings.map((x, n) => (n === i ? e.target.value : x)))} />
            <button type="button" className="btn-secondary min-h-9 px-2 py-1 text-sm" aria-label={`見出し${i + 1}を上へ`} disabled={i === 0} onClick={() => { const n = [...headings]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>
              ↑
            </button>
            <button type="button" className="btn-secondary min-h-9 px-2 py-1 text-sm text-danger" aria-label={`見出し${i + 1}を削除`} onClick={() => onChange(headings.filter((_, n) => n !== i))}>
              ×
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="btn-secondary" onClick={() => onChange([...headings, ""])}>
        見出しを追加
      </button>
      <div className="border-t border-line pt-4">
        <button type="button" className="btn-primary" disabled={busy || headings.filter((h) => h.trim()).length === 0} onClick={onGenerate}>
          この見出しで本文を作る
        </button>
      </div>
    </div>
  );
}

const KIND_LABEL = { number: "数値", achievement: "実績", price: "価格", customer_name: "お客様の名前", other: "その他" } as const;
const FACT_STATUS: { value: FactCheckStatus; label: string }[] = [
  { value: "confirmed", label: "確認した" },
  { value: "fixed", label: "修正した" },
  { value: "removed", label: "削除した" },
];

function FactPanel({ facts, readOnly }: { facts: ReturnType<typeof useStore>["db"]["factChecks"]; readOnly: boolean }) {
  const { api } = useStore();
  if (facts.length === 0) return <p className="text-sm text-muted">確認が必要な箇所は見つかりませんでした。</p>;
  return (
    <ul className="space-y-3">
      {facts.map((f) => (
        <li key={f.id} className="rounded-lg border border-line p-3">
          <p className="text-xs text-muted">{KIND_LABEL[f.kind]}</p>
          <p className="font-semibold">「{f.excerpt}」</p>
          {readOnly ? (
            <p className="text-sm">{f.status === "unchecked" ? "未確認" : FACT_STATUS.find((s) => s.value === f.status)?.label}</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label={`「${f.excerpt}」の確認`}>
              {FACT_STATUS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={f.status === s.value}
                  className={`rounded-md border px-2 py-1 text-sm ${f.status === s.value ? "border-ok bg-ok-soft text-ok" : "border-line"}`}
                  onClick={() => api.setFactCheck(f.id, f.status === s.value ? "unchecked" : s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function CommentPanel({ reviews }: { reviews: ReturnType<typeof useStore>["db"]["reviews"] }) {
  if (reviews.length === 0) return <p className="text-sm text-muted">コメントはまだありません。</p>;
  const label = { comment: "コメント", changes_requested: "修正依頼", approved: "承認" };
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-lg bg-canvas p-3">
          <p className="text-xs text-muted">
            {r.reviewerName}・{label[r.decision]}・{formatDate(r.createdAt)}
          </p>
          <p>{r.comment || "（コメントなし）"}</p>
        </li>
      ))}
    </ul>
  );
}

function AnswerPanel({ version }: { version: ArticleVersion }) {
  const all = [...QUESTIONS, FOLLOW_UP_QUESTION];
  if (version.answers.length === 0) return <p className="text-sm text-muted">回答の記録はありません。</p>;
  return (
    <dl className="space-y-3">
      {version.answers.map((a) => (
        <div key={a.questionId}>
          <dt className="text-sm text-muted">{all.find((q) => q.id === a.questionId)?.label}</dt>
          <dd>{a.unknown ? "（まだ分からない）" : a.text}</dd>
        </div>
      ))}
    </dl>
  );
}

function PolicyPanel({ orgId }: { orgId: string }) {
  const { db, month } = useStore();
  const note = db.coachingNotes.find((n) => n.organizationId === orgId && n.targetMonth === month);
  if (!note) return <p className="text-sm text-muted">今月の指導方針はまだありません。</p>;
  const rows: [string, string][] = [
    ["重点テーマ", note.focus],
    ["想定読者", note.audience],
    ["記事の目的", note.purpose],
    ["避ける内容", note.avoid],
  ];
  return (
    <div className="space-y-3">
      <p>{note.clientVisibleNote}</p>
      <dl className="space-y-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-sm text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CoachReview({ article, onError }: { article: Article; onError: (e: unknown, f: string) => void }) {
  const { api } = useStore();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const inReview = article.status === "in_review";

  async function submit(decision: "comment" | "changes_requested" | "approved") {
    setBusy(true);
    try {
      await api.review(article.id, decision, comment.trim());
      setComment("");
      setDone({ comment: "コメントを送りました", changes_requested: "修正を依頼しました", approved: "承認しました" }[decision]);
    } catch (e) {
      onError(e, "送れませんでした");
    }
    setBusy(false);
  }

  return (
    <div className="card space-y-3">
      <p className="font-semibold">レビュー</p>
      {done && <Notice tone="ok" title={done} />}
      <div>
        <label htmlFor="review-comment" className="field-label">
          本文全体へのコメント
        </label>
        <textarea id="review-comment" className="field" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <button type="button" className="btn-primary" disabled={busy || !inReview} onClick={() => submit("approved")}>
          承認する
        </button>
        <button type="button" className="btn-secondary" disabled={busy || !inReview || !comment.trim()} onClick={() => submit("changes_requested")}>
          修正を依頼する
        </button>
        <button type="button" className="btn-secondary" disabled={busy || !comment.trim()} onClick={() => submit("comment")}>
          コメントだけ送る
        </button>
      </div>
      {!inReview && <p className="text-xs text-muted">承認と修正依頼は、確認を依頼された記事にだけ行えます。</p>}
    </div>
  );
}

function PublishDialog({ article, policy, onClose, onError }: { article: Article; policy: "optional" | "required"; onClose: () => void; onError: (e: unknown, f: string) => void }) {
  const { api } = useStore();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const withoutApproval = article.status !== "approved" && policy === "optional";
  return (
    <Dialog title="公開済みにする" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await api.markPublished(article.id, url.trim());
            onClose();
          } catch (err) {
            onError(err, "登録できませんでした");
            setBusy(false);
            onClose();
          }
        }}
      >
        <p>ブログに公開した記事のURLを入力してください。</p>
        {withoutApproval && <Notice tone="warn" title="コタムの確認を受けていない記事です">公開済みにすると、未承認のまま公開したことが記録されます。</Notice>}
        <div>
          <label htmlFor="published-url" className="field-label">
            公開URL
          </label>
          <input id="published-url" type="url" required className="field" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            やめる
          </button>
          <button type="submit" className="btn-primary" disabled={busy}>
            公開済みにする
          </button>
        </div>
      </form>
    </Dialog>
  );
}

function HistoryDialog({ article, isCoach, dirty, onClose, onError }: { article: Article; isCoach: boolean; dirty: boolean; onClose: () => void; onError: (e: unknown, f: string) => void }) {
  const { db, api } = useStore();
  const versions = db.versions.filter((v) => v.articleId === article.id).sort((a, b) => b.versionNo - a.versionNo);
  return (
    <Dialog title="版の履歴" onClose={onClose}>
      <ul className="max-h-80 space-y-2 overflow-y-auto">
        {versions.map((v) => (
          <li key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-line p-2">
            <span className="min-w-0">
              <span className="block font-semibold">
                第{v.versionNo}版{v.id === article.currentVersionId && "（表示中）"}
                {v.id === article.approvedVersionId && "・承認"}
                {v.id === article.reviewRequestedVersionId && "・確認中"}
              </span>
              <span className="block text-xs text-muted">{formatDate(v.createdAt)}</span>
            </span>
            {!isCoach && v.id !== article.currentVersionId && (
              <button
                type="button"
                className="btn-secondary min-h-9 shrink-0 px-3 py-1 text-sm"
                disabled={dirty}
                onClick={async () => {
                  try {
                    await api.restoreVersion(article.id, v.id, article.lockVersion);
                    onClose();
                  } catch (e) {
                    onClose();
                    onError(e, "復元できませんでした");
                  }
                }}
              >
                この版に戻す
              </button>
            )}
          </li>
        ))}
      </ul>
      {dirty && <p className="mt-2 text-sm text-muted">保存していない変更があるため、復元できません。</p>}
      <div className="mt-4 flex justify-end">
        <button type="button" className="btn-secondary" onClick={onClose}>
          閉じる
        </button>
      </div>
    </Dialog>
  );
}
