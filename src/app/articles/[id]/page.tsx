"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { KnowledgeUsed } from "@/components/ShioriGrowth";
import { AioCheckBanner, AioCheckOverlays, AioCheckPanel, useAioCheck } from "@/components/AioCheckPanel";
import { BlockEditor } from "@/components/BlockEditor";
import { Confetti, ShioriFace, Toast } from "@/components/fun";
import { type GuideStep, ShioriTalk, StepGuide } from "@/components/talk";
import { Dialog, Forbidden, GeneratingOverlay, NotFound, Notice, SampleNotice, StatusBadge, formatDate } from "@/components/ui";
import { FOLLOW_UP_QUESTION, QUESTIONS } from "@/mock/data";
import { PLAN_LABELS, PLAN_QUESTIONS, planOf } from "@/lib/articlePlan";
import { ApiError, useStore } from "@/mock/store";
import { blocksToHtml, blocksToPlainText } from "@/lib/exportText";
import { slotOf } from "@/lib/imageSlot";
import { MAX_HEADINGS } from "@/lib/limits";
import { MAX_IMAGE_MOOD, type ImageStyle } from "@/lib/ai/images";
import { canApply } from "@/lib/workflow";
import type { AiReviewCategory, Article, ArticleImage, ArticleVersion, Block, FactCheckStatus } from "@/types/domain";

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
  const [tab, setTab] = useState<"answers" | "policy" | "facts" | "comments" | "aiReview">(isCoach ? "comments" : "facts");
  const [mobileView, setMobileView] = useState<"body" | "side">("body");

  // 未保存のまま閉じようとしたら確認する
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const outlineMode = version.body.length === 0;
  // できたばかりの版を開いたときだけ、ひとこと添える
  const [fresh] = useState(() => !isCoach && Date.now() - new Date(version.createdAt).getTime() < 60_000);
  const readOnly = isCoach;
  const facts = db.factChecks.filter((f) => f.versionId === version.id);
  const unchecked = facts.filter((f) => f.status === "unchecked").length;
  const reviews = db.reviews.filter((r) => r.articleId === article.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const frozenVersion = article.reviewRequestedVersionId ? db.versions.find((v) => v.id === article.reviewRequestedVersionId) : null;
  const approved = article.status === "approved" || (article.status === "published" && !article.publishedWithoutApproval);
  // 今の版がAIOのチェックを終えているか（チェックした版、または答えを反映して作った版）
  const aioDone = db.aioChecks.some((c) => c.status === "done" && (c.versionId === version.id || c.resultVersionId === version.id));

  function handleError(e: unknown, fallback: string) {
    if (e instanceof ApiError && e.code === "conflict") return setConflict(true);
    if (e instanceof ApiError && e.code === "session_expired") return setBanner({ tone: "danger", message: e.message, session: true });
    setBanner({ tone: "danger", message: e instanceof ApiError ? e.message : fallback });
  }

  const aio = useAioCheck(article, version, handleError);

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


  async function copy(kind: CopyKind): Promise<boolean> {
    const text = kind === "title" ? title : kind === "body" ? blocksToPlainText(blocks) : blocksToHtml(blocks);
    try {
      await navigator.clipboard.writeText(text);
      const label = { title: "タイトル", body: "本文", html: "HTML" }[kind];
      setBanner({ tone: "ok", message: `${label}をコピーしました${approved ? "" : "（承認前の下書きです）"}` });
      return true;
    } catch {
      setBanner({ tone: "danger", message: "コピーできませんでした。ブラウザの設定を確認してください" });
      return false;
    }
  }

  const canPublish = !isCoach && !dirty && canApply(article, { type: "publish", url: "https://example.com", at: "" }, "client_member", policy);

  return (
    <main className="page">
      {busy === "generate" && <GeneratingOverlay label={outlineMode ? "本文を作っています" : "もう一度書いています"} />}
      {fresh && !outlineMode && <Confetti count={50} />}
      {fresh && outlineMode && <Toast>記事の流れができました！読む人の疑問の順に並んでいます</Toast>}
      {banner?.tone === "ok" && <Toast key={banner.message}>{banner.message}</Toast>}
      {!isCoach && <ArticleSteps article={article} outlineMode={outlineMode} aioDone={aioDone} />}

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={isCoach ? "/coach" : "/"} className="text-sm text-brand-dark underline">
            {isCoach ? "管理画面へ戻る" : "ホームへ戻る"}
          </Link>
          <h1 className="text-2xl font-black sm:text-3xl">{outlineMode ? "記事の流れができました" : isCoach ? "記事を確認する" : "記事を整える"}</h1>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <StatusBadge status={article.status} />
            <span>{version.versionNo}回目の保存</span>
            <button type="button" className="underline" onClick={() => setHistoryOpen(true)}>
              前の内容に戻す
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
        {banner && banner.tone !== "ok" && (
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
          hasNewer={db.versions.some((v) => v.articleId === article.id && v.versionNo > version.versionNo)}
        />
      </div>

      {!isCoach && !outlineMode && <AioCheckOverlays ctl={aio} />}
      {!isCoach && !outlineMode && <AioCheckBanner ctl={aio} dirty={dirty} />}
      {!isCoach && !outlineMode && <ShioriNote status={article.status} fresh={fresh} />}
      {!outlineMode && <KnowledgeUsed labels={version.knowledgeUsed ?? []} />}
      {!isCoach && reviews.length > 0 && (
        <div className="mb-4 flex animate-rise items-start gap-3 rounded-3xl border-2 border-sun bg-sun-soft px-4 py-3" role="status">
          <ShioriFace className="h-12 w-12" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">コタムからコメントが届いています</p>
            <p className="whitespace-pre-wrap">{reviews[0].comment}</p>
            <p className="text-xs text-muted">
              {reviews[0].reviewerName}・{formatDate(reviews[0].createdAt)}
              {reviews.length > 1 && `（ほかに${reviews.length - 1}件。「コメント」で見られます）`}
            </p>
          </div>
        </div>
      )}

      {/* スマートフォンでは本文と補助情報をタブで切り替える */}
      <div className="mb-3 grid grid-cols-2 gap-2 lg:hidden" role="tablist" aria-label="表示の切り替え">
        <button role="tab" aria-selected={mobileView === "body"} className={mobileView === "body" ? "btn-primary" : "btn-secondary"} onClick={() => setMobileView("body")}>
          本文
        </button>
        <button role="tab" aria-selected={mobileView === "side"} className={mobileView === "side" ? "btn-primary" : "btn-secondary"} onClick={() => setMobileView("side")}>
          {isCoach ? "AIOのチェック・コメント" : `画像・確認事項${unchecked > 0 ? `（未確認${unchecked}）` : ""}`}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className={`card space-y-5 ${mobileView === "body" ? "" : "hidden lg:block"}`} aria-label="本文">
          {outlineMode ? (
            <OutlineEditor title={version.title} plan={planOf(version.answers)} headings={headings} onChange={setHeadings} onGenerate={generate} busy={busy !== null} />
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
                    もう一度作る（今の文章も残ります）
                  </button>
                  {dirty && <p className="mt-1 text-sm text-muted">先に下書きを保存してください。</p>}
                </div>
              )}
            </>
          )}
        </section>

        <aside className={`space-y-4 ${mobileView === "side" ? "" : "hidden lg:block"}`} aria-label="補助情報">
          {!outlineMode && <AioCheckPanel ctl={aio} isCoach={isCoach} dirty={dirty} />}

          {!outlineMode && !isCoach && (
            <div className="card space-y-3">
              <p className="text-lg font-bold">ブログに載せる</p>
              {unchecked > 0 && <Notice tone="warn" title={`確かめてほしいところが${unchecked}か所あります`}>数字や名前が正しいか、先に確かめるのがおすすめです。</Notice>}
              {!aioDone && <p className="text-sm text-muted">AIOのチェックがまだです。先にチェックしておくのがおすすめです。</p>}
              <button type="button" className="btn-primary w-full" disabled={!canPublish || busy !== null} onClick={() => setPublishOpen(true)}>
                ブログに載せる（1つずつ案内します）
              </button>
              {dirty && <p className="text-xs text-muted">先に下書きを保存してください。</p>}
              <details className="space-y-2">
                <summary className="cursor-pointer text-sm text-brand-dark">コピーだけしたいとき</summary>
                <div className="mt-2 grid grid-cols-3 gap-2">
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
              </details>
            </div>
          )}

          {isCoach && <CoachComment article={article} onError={handleError} />}

          <section className="card" aria-labelledby="images-heading">
            <h2 id="images-heading" className="mb-1 text-lg font-bold">画像</h2>
            <p className="mb-3 text-sm text-muted">記事のいちばん上の画像（アイキャッチ）と、見出しごとの画像です。</p>
            <ImagePanel article={article} version={version} canGenerate={!isCoach} />
          </section>

          <div className="card">
            <p className="mb-2 text-sm text-muted">見たいものを選んでください</p>
            <div className="mb-3 grid grid-cols-3 gap-2" role="tablist" aria-label="補助情報">
              {(
                [
                  ["facts", `確かめる${unchecked ? `(${unchecked})` : ""}`],
                  ["comments", `コメント${reviews.length ? `(${reviews.length})` : ""}`],
                  ["aiReview", "AIの点検"],
                  ["answers", "答えた内容"],
                  ["policy", "今月の方針"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  className={`rounded-full border-2 px-2 py-1.5 text-sm font-bold transition-colors ${tab === key ? "border-brand bg-brand text-white" : "border-line bg-surface text-brand hover:border-brand"}`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "facts" && <FactPanel facts={facts} readOnly={isCoach} />}
            {tab === "comments" && <CommentPanel reviews={reviews} />}
            {tab === "aiReview" && <AiReviewPanel version={version} />}
            {tab === "answers" && <AnswerPanel version={version} />}
            {tab === "policy" && <PolicyPanel orgId={article.organizationId} />}
          </div>
        </aside>
      </div>

      {conflict && (
        <Dialog title="別の画面で直されています" onClose={() => setConflict(false)}>
          <p className="mb-4">この記事は、別の画面かほかの人が先に直しています。どちらにしますか。</p>
          <div className="flex flex-col gap-2">
            <button type="button" className="btn-secondary" onClick={() => { setConflict(false); setTitle(version.title); setBlocks(version.body); setDirty(false); setBusy(null); }}>
              新しいほうを開く（この画面で直した分は消えます）
            </button>
            <button type="button" className="btn-primary" onClick={() => { setConflict(false); save(true); }}>
              この画面の内容も残す
            </button>
          </div>
        </Dialog>
      )}
      {publishOpen && <PublishDialog article={article} onCopy={copy} onClose={() => setPublishOpen(false)} onError={handleError} />}
      {historyOpen && <HistoryDialog article={article} isCoach={isCoach} dirty={dirty} onClose={() => setHistoryOpen(false)} onError={handleError} />}
    </main>
  );
}

/** しおりのひとこと。本文ができた直後・確認中・公開後だけ出す */
function ShioriNote({ status, fresh }: { status: Article["status"]; fresh: boolean }) {
  const note =
    status === "published"
      ? { mood: "jersey-done" as const, text: "公開おめでとうございます！次の1本も、いっしょに書きましょう。" }
      : status === "in_review"
        ? { mood: "coffee" as const, text: "コタムが確認しています。おつかれさまでした。ひと息ついてくださいね。" }
        : fresh
          ? { mood: "jersey-done" as const, text: "記事ができました！読みながら、言葉を自分らしく整えましょう。" }
          : null;
  if (!note) return null;
  return (
    <ShioriTalk mood={note.mood} lines={note.text} size="md" className="mb-4 animate-rise rounded-3xl bg-surface/70 px-4 pt-2" />
  );
}

/** 記事ができるまでの道のり。今どこにいるかを示す */
function ArticleSteps({ article, outlineMode, aioDone }: { article: Article; outlineMode: boolean; aioDone: boolean }) {
  const steps = ["質問に答える", "記事の流れを決める", "本文を整える", "AIOのチェック", "ブログに載せる"];
  const now = article.status === "published" ? 5 : aioDone ? 4 : outlineMode ? 1 : 2;
  return (
    <ol className="mb-4 flex flex-wrap gap-x-1 gap-y-1.5 text-xs sm:text-sm" aria-label="記事ができるまで">
      {steps.map((label, i) => {
        const state = i < now ? "done" : i === now ? "now" : "todo";
        return (
          <li key={label} className="flex items-center gap-1">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold sm:gap-1.5 sm:px-3 ${
                state === "done" ? "bg-brand-soft text-brand-dark" : state === "now" ? "bg-brand text-white shadow-[0_3px_0_var(--color-brand-dark)]" : "bg-surface text-muted"
              }`}
              aria-current={state === "now" ? "step" : undefined}
            >
              <span aria-hidden>{state === "done" ? "✓" : i + 1}</span>
              {label}
            </span>
            {i < steps.length - 1 && (
              <span className="hidden text-line sm:inline" aria-hidden>
                ━
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StatusNotice({ article, frozenNo, isCoach, hasNewer }: { article: Article; frozenNo?: number; isCoach: boolean; hasNewer: boolean }) {
  switch (article.status) {
    case "in_review":
      return (
        <Notice tone="info" title={isCoach ? "確認を依頼されています" : "コタムが確認しています"}>
          {isCoach ? `第${frozenNo}版が確認の対象です。` : `コタムが見ているのは${frozenNo}回目の保存の内容です。ここで直しても、コタムが見ている内容は変わりません。`}
        </Notice>
      );
    case "changes_requested":
      return <Notice tone="warn" title="修正の依頼があります">「コメント」を見て直してください。直したら、もう一度コタムに見てもらえます。</Notice>;
    case "approved":
      return (
        <Notice tone="ok" title={isCoach ? "承認済みです" : "コタムのOKが出ました"}>
          {!isCoach && "ここから直すと、もう一度コタムに見てもらうことになります。"}
          {hasNewer && (isCoach ? " 確認中に作った新しい版は「前の内容に戻す」に残っています。" : " コタムが見ている間に直した内容は「前の内容に戻す」に残っています。")}
        </Notice>
      );
    case "published":
      return (
        <Notice tone={article.publishedWithoutApproval ? "warn" : "ok"} title="ブログに載せました">
          <a href={article.publishedUrl ?? "#"} className="underline" target="_blank" rel="noopener noreferrer">
            {article.publishedUrl}
          </a>
          {article.publishedAt && `（${formatDate(article.publishedAt)}）`}
        </Notice>
      );
    default:
      // 公開前のコタムの確認はやめ、AIOのチェックに置き換えた（docs/DECISIONS.md 2026-11-02）
      return null;
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

/**
 * 見出しの画面。見出しの一覧だけでは何のことか分からない（2026-11-03 田村さん）ので、
 * 先に決めた作戦（タイトル・読む人・答え）を上に出し、見出しは「読む人の疑問」の順番として見せる。直すのは開いたときだけ
 */
function OutlineEditor({ title, plan, headings, onChange, onGenerate, busy }: { title: string; plan: { reader: string; conclusion: string }; headings: string[]; onChange: (h: string[]) => void; onGenerate: () => void; busy: boolean }) {
  const filled = headings.filter((h) => h.trim());
  return (
    <div className="space-y-5">
      <ShioriTalk mood="welldone" lines={["読む人が知りたい順番に、記事の流れを作りました！", "上から読むと、悩みが少しずつ解けていく流れです。このままで大丈夫なら「この流れで本文を書く」を押してください。"]} />
      <div className="space-y-3 rounded-2xl border-2 border-sun bg-sun-soft p-4">
        <p className="text-sm font-bold text-muted">この記事の作戦</p>
        <div>
          <p className="text-xs font-bold text-muted">タイトル</p>
          <p className="text-lg font-black">{title}</p>
        </div>
        {plan.reader && (
          <div>
            <p className="text-xs font-bold text-muted">読んでほしい人</p>
            <p className="font-bold">{plan.reader}</p>
          </div>
        )}
        {plan.conclusion && (
          <div>
            <p className="text-xs font-bold text-muted">この記事の答え（本文のはじめに書きます）</p>
            <p>{plan.conclusion}</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="mb-2 text-lg font-black">読む人の疑問に、この順番で答えます</h2>
        <ol className="space-y-1">
          {filled.map((h, i) => (
            <li key={i} className="animate-rise" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="flex items-start gap-3 rounded-xl bg-canvas p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white" aria-hidden>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-muted">読む人の疑問{i + 1}</p>
                  <p className="font-bold">{h}</p>
                </div>
              </div>
              {i < filled.length - 1 && (
                <p className="py-0.5 pl-5 text-muted" aria-hidden>
                  ↓
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
      <details className="rounded-xl border-2 border-line p-3" open={filled.length === 0}>
        <summary className="cursor-pointer font-bold text-brand-dark">流れを直したいとき（言葉を直す・入れ替える・足す）</summary>
        <ol className="mt-3 space-y-2">
          {headings.map((h, i) => (
            <li key={i} className="flex items-center gap-2">
              <label htmlFor={`h-${i}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-black text-white">
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
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-secondary" onClick={() => onChange([...headings, ""])} disabled={headings.length >= MAX_HEADINGS}>
            疑問を足す
          </button>
          {headings.length >= MAX_HEADINGS && <p className="text-sm text-muted">{MAX_HEADINGS}個までです</p>}
        </div>
      </details>
      <div className="border-t border-line pt-4">
        <button type="button" className="btn-primary text-lg" disabled={busy || filled.length === 0} onClick={onGenerate}>
          この流れで本文を書く
          <span className="inline-block animate-nudge" aria-hidden>
            ✨
          </span>
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
  if (facts.length === 0) return <p className="text-sm text-muted">確かめてほしいところは見つかりませんでした。</p>;
  return (
    <ul className="space-y-3">
      {facts.map((f) => (
        <li key={f.id} className={`animate-rise rounded-2xl border-2 p-3 transition-colors ${f.status === "unchecked" ? "border-sun bg-sun-soft" : "border-line"}`}>
          <p className="text-xs text-muted">{KIND_LABEL[f.kind]}</p>
          <p className="font-semibold">「{f.excerpt}」</p>
          {readOnly ? (
            <p className="text-sm">{f.status === "unchecked" ? "まだ確かめていない" : FACT_STATUS.find((s) => s.value === f.status)?.label}</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1" role="group" aria-label={`「${f.excerpt}」の確認`}>
              {FACT_STATUS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={f.status === s.value}
                  className={`rounded-full border-2 px-3 py-1 text-sm font-bold transition-transform active:scale-95 ${f.status === s.value ? "border-ok bg-ok-soft text-ok" : "border-line bg-surface"}`}
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
        <li key={r.id} className="rounded-2xl bg-canvas p-3">
          <p className="text-xs text-muted">
            {r.reviewerName}・{label[r.decision]}・{formatDate(r.createdAt)}
          </p>
          <p>{r.comment || "（コメントなし）"}</p>
        </li>
      ))}
    </ul>
  );
}

const REVIEW_CATEGORY_LABEL: Record<AiReviewCategory, string> = {
  originality: "この会社らしさ",
  aio: "AIとお客様に選ばれるか",
  ai_tone: "AIが書いたように見える",
  facts: "事実が正しいか",
  style: "言葉づかい",
};

/** 公開前の点検（Claude）。指摘を受けて書き手が書き直した場合は、そう示す */
function AiReviewPanel({ version }: { version: ArticleVersion }) {
  const r = version.aiReview;
  if (!r) return <p className="text-sm text-muted">{version.body.length ? "この保存の内容には、点検の結果がありません。" : "本文を作ると、AIが記事を点検します。"}</p>;
  return (
    <div className="space-y-3 text-sm">
      {r.summary && <p>{r.summary}</p>}
      <p className="text-muted">
        {r.findings.length === 0 ? "直すところは見つかりませんでした。" : r.rewritten ? "次の指摘に沿って本文を書き直しました。" : "次の指摘がありました（書き直しはできませんでした）。"}
      </p>
      <ul className="space-y-2">
        {r.findings.map((f, i) => (
          <li key={i} className="rounded-2xl bg-canvas p-3">
            <p className="font-semibold">{REVIEW_CATEGORY_LABEL[f.category] ?? f.category}</p>
            {f.excerpt && <p className="text-muted">「{f.excerpt}」</p>}
            <p>{f.advice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const IMAGE_STYLE_OPTIONS: readonly (readonly [ImageStyle, string])[] = [
  ["photo", "写真風"],
  ["illustration", "イラスト風"],
  ["site", "サイトに合わせる"],
];

type ImageLook = { style: ImageStyle; mood: string };

function readLook(key: string): ImageLook {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "null") as Partial<ImageLook> | null;
    if (saved && IMAGE_STYLE_OPTIONS.some(([k]) => k === saved.style)) return { style: saved.style!, mood: (saved.mood ?? "").slice(0, MAX_IMAGE_MOOD) };
  } catch {
    // 読めない環境（サーバー側の描画、保存の禁止）ではイラスト風から始める
  }
  return { style: "illustration", mood: "" };
}

/** 画像（Gemini）：アイキャッチと見出しごとの提案と、ナノバナナで作った画像 */
function ImagePanel({ article, version, canGenerate }: { article: Article; version: ArticleVersion; canGenerate: boolean }) {
  const { api } = useStore();
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [unitCost, setUnitCost] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "danger" | "warn"; text: string } | null>(null);
  const lookKey = `imageLook:${article.organizationId}`;
  // 作風とサイトの雰囲気は、この端末で会社ごとに覚えておく（毎回選び直さなくてよいように）
  const [look, setLook] = useState(() => readLook(lookKey));

  function changeLook(next: ImageLook) {
    setLook(next);
    try {
      localStorage.setItem(lookKey, JSON.stringify(next));
    } catch {
      // 覚えられなくても作るのには困らない
    }
  }

  useEffect(() => {
    let alive = true;
    api
      .listImages(article.id)
      .then((r) => alive && (setImages(r.images), setEnabled(r.enabled), setUnitCost(r.unitCostYen)))
      .catch(() => alive && setMessage({ tone: "danger", text: "画像を読み込めませんでした" }));
    return () => {
      alive = false;
    };
  }, [api, article.id, version.id]);

  async function makeIdeas() {
    setBusy("ideas");
    setMessage(null);
    try {
      await api.generateImageIdeas(article.id);
    } catch (e) {
      setMessage({ tone: "danger", text: e instanceof ApiError ? e.message : "画像の案を作れませんでした。もう一度お試しください" });
    } finally {
      setBusy(null);
    }
  }

  const ideas = version.imageIdeas;
  if (!ideas || (!ideas.eyecatch && !ideas.perHeading.length)) {
    if (!version.body.length) return <p className="text-sm text-muted">本文を作ると、画像の案が出ます。</p>;
    return (
      <div className="space-y-2 text-sm">
        {busy === "ideas" && <GeneratingOverlay label="画像の案を作っています" />}
        <p className="text-muted">画像の案がまだありません。本文を作ったときに、画像の案だけ作れなかったようです。</p>
        {canGenerate && (
          <button type="button" className="btn-primary w-full" disabled={busy !== null} onClick={makeIdeas}>
            {busy === "ideas" ? "画像の案を作っています…" : "画像の案を作る"}
          </button>
        )}
        {message && <Notice tone={message.tone} title={message.text} />}
      </div>
    );
  }
  const items = [...(ideas.eyecatch ? [{ ...ideas.eyecatch, slot: "eyecatch", label: "アイキャッチ" }] : []), ...ideas.perHeading.map((i) => ({ ...i, slot: slotOf(i.heading), label: i.heading }))];
  const missing = items.filter((i) => !images.some((m) => m.slot === i.slot));

  async function generate(slots: string[], key: string) {
    setBusy(key);
    setMessage(null);
    try {
      const r = await api.generateImages(article.id, slots, look);
      setImages(r.images);
      if (r.failed) setMessage({ tone: "warn", text: `${r.failed}枚は作れませんでした。もう一度お試しください` });
    } catch (e) {
      setMessage({ tone: "danger", text: e instanceof ApiError ? e.message : "画像を作れませんでした。もう一度お試しください" });
    } finally {
      setBusy(null);
    }
  }

  const showButtons = canGenerate && enabled;
  return (
    <div className="space-y-3 text-sm">
      {busy && busy !== "ideas" && <GeneratingOverlay label={busy === "all" ? "画像を作っています" : "画像を1枚作っています"} />}
      {showButtons && (
        <fieldset className="space-y-2">
          <legend className="mb-1 font-semibold">画像の雰囲気を選んでから作ります</legend>
          <div className="grid grid-cols-3 gap-2">
            {IMAGE_STYLE_OPTIONS.map(([key, label]) => (
              <label
                key={key}
                className={`flex cursor-pointer items-center justify-center rounded-full border-2 px-2 py-1.5 text-center font-bold ${look.style === key ? "border-brand bg-brand text-white" : "border-line bg-surface text-brand hover:border-brand"}`}
              >
                <input type="radio" name="image-style" value={key} className="sr-only" checked={look.style === key} onChange={() => changeLook({ ...look, style: key })} />
                {label}
              </label>
            ))}
          </div>
          {look.style === "site" && (
            <label className="block space-y-1">
              <span className="block text-xs text-muted">サイトの雰囲気（色・質感・明るさなど）。一度書けば、この端末では次回も使います</span>
              <textarea
                className="field"
                rows={2}
                maxLength={MAX_IMAGE_MOOD}
                placeholder="例：白と若草色が基調。木のぬくもりがある明るい写真が多い"
                value={look.mood}
                onChange={(e) => changeLook({ ...look, mood: e.target.value })}
              />
            </label>
          )}
        </fieldset>
      )}
      {showButtons && (
        <div className="space-y-1">
          <button type="button" className="btn-primary w-full" disabled={busy !== null || !missing.length || (look.style === "site" && !look.mood.trim())} onClick={() => generate(missing.map((i) => i.slot), "all")}>
            {busy === "all" ? "画像を作っています…" : missing.length ? `まだ無い画像を作る（${missing.length}枚${unitCost ? `・約${missing.length * unitCost}円` : ""}）` : "すべての画像があります"}
          </button>
          <p className="text-xs text-muted">文字は入れずに作ります。実際の写真があれば、そちらを使ってください。</p>
        </div>
      )}
      {message && <Notice tone={message.tone} title={message.text} />}
      <ul className="space-y-3">
        {items.map((s) => {
          const img = images.find((m) => m.slot === s.slot);
          return (
            <li key={s.slot} className="space-y-2 rounded-2xl bg-canvas p-3">
              <p className="font-semibold">{s.label}</p>
              {img && (
                <figure className="space-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 期限付きURLの画像をそのまま表示する */}
                  <img src={img.url} alt={img.alt} className="aspect-video w-full animate-pop rounded-xl object-cover" />
                  {img.isSample && <figcaption className="text-xs text-warn">サンプル（AIは未接続）</figcaption>}
                </figure>
              )}
              <p>{s.photoIdea}</p>
              <p className="text-xs text-muted">画像の説明（代替テキスト）：{s.alt}</p>
              {(img || showButtons) && (
                <div className="flex flex-wrap gap-2">
                  {img && (
                    <a className="btn-secondary min-h-9 px-3 py-1 text-sm" href={img.downloadUrl} download={`${s.slot === "eyecatch" ? "eyecatch" : s.label}.png`}>
                      ダウンロード
                    </a>
                  )}
                  {showButtons && (
                    <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" disabled={busy !== null || (look.style === "site" && !look.mood.trim())} onClick={() => generate([s.slot], s.slot)}>
                      {busy === s.slot ? "作っています…" : `${img ? "作り直す" : "この画像を作る"}${unitCost ? `（約${unitCost}円）` : ""}`}
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AnswerPanel({ version }: { version: ArticleVersion }) {
  const all = [...QUESTIONS, FOLLOW_UP_QUESTION, ...PLAN_QUESTIONS.map((q) => ({ ...q, label: PLAN_LABELS[q.id] ?? q.label }))];
  if (version.answers.length === 0) return <p className="text-sm text-muted">答えた内容の記録はありません。</p>;
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
  if (!note) return <p className="text-sm text-muted">今月の方針はありません。しおりのおすすめのテーマで、そのまま書けます。</p>;
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

/** コタムのコメント。AIOのチェックの結果を見て、気になる所をお客様に伝える。お客様の記事の画面に出る */
function CoachComment({ article, onError }: { article: Article; onError: (e: unknown, f: string) => void }) {
  const { api } = useStore();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await api.review(article.id, "comment", comment.trim());
      setComment("");
      setDone(true);
    } catch (e) {
      onError(e, "送れませんでした");
    }
    setBusy(false);
  }

  return (
    <div className="card space-y-3">
      <p className="text-lg font-bold">コメントを残す</p>
      <p className="text-sm text-muted">AIOのチェックの結果ややり取りを見て、気になる所があれば伝えられます。お客様の記事の画面に表示されます。</p>
      {done && <Notice tone="ok" title="コメントを送りました" />}
      <div>
        <label htmlFor="review-comment" className="field-label">
          コメント
        </label>
        <textarea id="review-comment" className="field" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <button type="button" className="btn-primary w-full" disabled={busy || !comment.trim()} onClick={submit}>
        コメントを送る
      </button>
    </div>
  );
}

type CopyKind = "title" | "body" | "html";

/** ブログに載せる案内。ブログを開く → タイトル → 本文 → 画像 → 公開 → URL を、1つずつ進める（2026-11-02 田村さん） */
function PublishDialog({ article, onCopy, onClose, onError }: { article: Article; onCopy: (k: CopyKind) => Promise<boolean>; onClose: () => void; onError: (e: unknown, f: string) => void }) {
  const { api } = useStore();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState<Partial<Record<CopyKind, boolean>>>({});
  const copy = async (k: CopyKind) => {
    if (await onCopy(k)) setCopied((c) => ({ ...c, [k]: true }));
  };
  const copyButton = (k: CopyKind, label: string, primary = true) => (
    <button type="button" className={copied[k] ? "btn-secondary" : primary ? "btn-primary" : "btn-secondary"} onClick={() => copy(k)}>
      {copied[k] ? `${label}をコピーしました ✓` : `${label}をコピー`}
    </button>
  );
  const valid = /^https?:\/\/\S+\.\S+/.test(url.trim());

  async function register() {
    setBusy(true);
    try {
      await api.markPublished(article.id, url.trim());
      setStep(6);
    } catch (err) {
      onError(err, "登録できませんでした");
      onClose();
    }
    setBusy(false);
  }

  const steps: GuideStep[] = [
    {
      title: "ブログを開く",
      mood: "point",
      say: ["いつも記事を書いているブログの管理画面を、新しい画面で開いてください。", "「新しく書く」を押します。WordPress なら「投稿」→「新規投稿を追加」です。"],
      next: "開けた！",
    },
    {
      title: "タイトル",
      mood: "right",
      say: ["まずタイトルです。下のボタンでコピーして、ブログの「タイトル」の欄に貼ってください。", "貼るときは、欄を押してから Ctrl と V を同時に押します。"],
      body: copyButton("title", "タイトル"),
      next: copied.title ? "貼れた！" : null,
    },
    {
      title: "本文",
      mood: "right",
      say: ["次は本文です。コピーして、ブログの本文の欄に貼ってください。", "見出しの太さがくずれたら、「HTMLでコピー」を使ってみてくださいね。"],
      body: (
        <div className="flex flex-wrap gap-2">
          {copyButton("body", "本文")}
          {copyButton("html", "HTMLで", false)}
        </div>
      ),
      next: copied.body || copied.html ? "貼れた！" : null,
    },
    {
      title: "画像",
      mood: "idea",
      say: ["画像を作ってあれば、記事のいちばん上の画像（アイキャッチ）に入れましょう。", "この画面の「画像」から保存できます。画像がなくても大丈夫ですよ。"],
      next: "できた！（なしでもOK）",
    },
    {
      title: "公開",
      mood: "jersey-cheer",
      say: ["いよいよです！ブログの「公開」ボタンを押してください。"],
      next: "公開した！",
    },
    {
      title: "URL",
      mood: "ask",
      say: ["最後に、公開したページのアドレス（URL）を教えてください。", "ブログで公開したページを開いて、画面のいちばん上のアドレスをコピーして貼ります。"],
      body: (
        <div className="space-y-2">
          <label htmlFor="published-url" className="field-label">
            公開したページのURL
          </label>
          <input id="published-url" type="url" className="field" placeholder="例：https://www.sakura-reform.jp/blog/winter-bath/" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="button" className="btn-primary" disabled={busy || !valid} onClick={register}>
            登録する
          </button>
          {url.trim() && !valid && <p className="text-xs text-warn">https:// から始まるアドレスを貼ってください</p>}
        </div>
      ),
      next: null,
    },
  ];

  return (
    <Dialog title="ブログに載せる" wide onClose={onClose}>
      <StepGuide
        steps={steps}
        step={step}
        onStep={setStep}
        doneSay={["公開おめでとうございます！", "しおりも記事のことを覚えました。検索やAIにどう見られるか、これからいっしょに見ていきましょう。"].join("")}
        doneBody={
          <button type="button" className="btn-primary" onClick={onClose}>
            記事の画面に戻る
          </button>
        }
      />
    </Dialog>
  );
}

function HistoryDialog({ article, isCoach, dirty, onClose, onError }: { article: Article; isCoach: boolean; dirty: boolean; onClose: () => void; onError: (e: unknown, f: string) => void }) {
  const { db, api } = useStore();
  const versions = db.versions.filter((v) => v.articleId === article.id).sort((a, b) => b.versionNo - a.versionNo);
  return (
    <Dialog title="前の内容に戻す" onClose={onClose}>
      <ul className="max-h-80 space-y-2 overflow-y-auto">
        {versions.map((v) => (
          <li key={v.id} className="flex items-center justify-between gap-2 rounded-2xl border border-line p-3">
            <span className="min-w-0">
              <span className="block font-semibold">
                {v.versionNo}回目の保存{v.id === article.currentVersionId && "（表示中）"}
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
                    onError(e, "戻せませんでした");
                  }
                }}
              >
                この版に戻す
              </button>
            )}
          </li>
        ))}
      </ul>
      {dirty && <p className="mt-2 text-sm text-muted">保存していない変更があるため、戻せません。先に保存してください。</p>}
      <div className="mt-4 flex justify-end">
        <button type="button" className="btn-secondary" onClick={onClose}>
          閉じる
        </button>
      </div>
    </Dialog>
  );
}
