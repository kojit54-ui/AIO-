"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProfileSetup } from "@/components/ProfileSetup";
import { EmptyState, Notice, monthLabel } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";
import { nearQueries } from "@/lib/growth/nearQueries";
import { isPickQuestion, questionsToWrite, readerProblemForQuestion } from "@/lib/growth/mentionQuestions";
import { articleSummaries } from "@/lib/selectors";
import { ShioriTalk } from "@/components/talk";
import { GuideName, GuideText } from "@/components/useGuide";
import { PhotoStart } from "@/components/PhotoStart";

export default function NewArticlePage() {
  const { db, user, api, month } = useStore();
  const router = useRouter();
  const [custom, setCustom] = useState(false);
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  const orgId = user.organizationIds[0];

  if (user.role !== "client_member") {
    return (
      <main className="page">
        <EmptyState title="記事の作成は顧客担当者の画面で行います" />
      </main>
    );
  }

  const org = db.organizations.find((o) => o.id === orgId);
  if (org?.profile && !org.profileApprovedAt) {
    return (
      <main className="page">
        <EmptyState mood="point" title="先に会社の情報を確かめてください" action={<Link href="/profile" className="btn-primary">確認する</Link>}>
          確認した会社の情報だけを、記事づくりに使います。
        </EmptyState>
      </main>
    );
  }

  if (!isOrgReady(db, orgId)) {
    return (
      <main className="page">
        <ProfileSetup orgId={orgId} />
      </main>
    );
  }

  const themes = db.themes
    .filter((t) => t.organizationId === orgId && t.targetMonth === month && t.source === "coach")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Search Console の伸びしろのある言葉（つながっている会社だけ）。会社名だけの言葉は外す
  const sc = (db.searchConsole ?? []).find((x) => x.organizationId === orgId && x.verifiedAt);
  const near = nearQueries(sc?.snapshot, { exclude: [org?.name ?? ""] });
  // AIに聞いても、まだ会社が出てこない質問（しおり通信の「AIに紹介されているか」の結果から）
  const aiQuestions = questionsToWrite(
    (db.aioMentions ?? []).filter((m) => m.organizationId === orgId),
    articleSummaries(db, orgId).map((a) => a.themeTitle),
  );

  async function start(input: Parameters<typeof api.createArticle>[0]) {
    setBusy(true);
    setError(null);
    try {
      const a = await api.createArticle(input);
      router.push(`/articles/${a.id}/questions`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "記事を作れませんでした。もう一度お試しください");
      setBusy(false);
    }
  }

  return (
    <main className="page space-y-5">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">どのテーマで書きますか？</h1>
        <p className="text-muted">
          <GuideText text={themes.length > 0 ? `${monthLabel(month)}にコタムと決めたテーマです。書きやすいものを1つ選んでください。` : "書きたいテーマを自分で決めるか、しおりのおすすめから選べます。"} />
        </p>
        {themes.length === 0 && (
          <Link href="/prototype/plan" className="mt-2 inline-block font-bold text-brand-dark underline">
            <GuideName />のおすすめから選ぶ（書く記事を決める）
          </Link>
        )}
      </div>
      {error && <Notice tone="danger" title={error} />}

      {aiQuestions.length > 0 && (
        <section id="ai-questions" className="card animate-rise scroll-mt-4 space-y-3 border-2 border-brand" aria-labelledby="ai-q-heading">
          <h2 id="ai-q-heading" className="font-black">
            🤖 AIに聞いても、まだあなたの会社が出てこない質問
          </h2>
          <ShioriTalk mood="idea" size="sm" lines={["お客様がAIに聞きそうな質問を、代わりにAIに聞いてみた結果です。", "この質問に答える記事で、あなたの仕事と強みを伝えましょう。必ず紹介されるとは限りませんが、AIが参考にできる材料が増えます。"]} />
          <ul className="grid gap-2 sm:grid-cols-3">
            {aiQuestions.map((q, i) => (
              <li key={q.question} className="animate-pop" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <button
                  type="button"
                  disabled={busy}
                  className="group flex h-full w-full flex-col items-start gap-1 rounded-2xl border-2 border-line bg-surface p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-brand disabled:opacity-60"
                  onClick={() => start({ customTheme: { title: q.question, readerProblem: readerProblemForQuestion(q.question) } })}
                >
                  {i === 0 && <span className="rounded-full bg-sun px-2 text-xs font-black text-ink">まずはこれから</span>}
                  <span className="font-black">「{q.question}」</span>
                  {i === 0 && isPickQuestion(q.question) && <span className="text-xs">頼み先を探している人が、そのままAIに聞く質問です。</span>}
                  {q.citedSites.length > 0 && <span className="text-xs text-muted">AIが参考にしたサイト：{q.citedSites.join("、")}</span>}
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
                    この質問に答える記事を書く
                    <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PhotoStart orgId={orgId} busy={busy} onPick={(t) => start({ customTheme: { title: t.title, readerProblem: t.readerProblem } })} />

      {near.length > 0 && (
        <section className="card animate-rise space-y-3 border-2 border-sun" aria-labelledby="near-heading">
          <h2 id="near-heading" className="font-black">
            🔍 検索で、あと一歩の言葉
          </h2>
          <ShioriTalk mood="idea" size="sm" lines={["Search Console を見ていて気づきました！", "この言葉で、あなたのサイトはもう検索に出ています。記事を書けば、もっと上に行けそうですよ。"]} />
          <ul className="grid gap-2 sm:grid-cols-3">
            {near.map((q, i) => (
              <li key={q.query} className="animate-pop" style={{ animationDelay: `${0.2 + i * 0.08}s` }}>
                <button
                  type="button"
                  disabled={busy}
                  className="group flex h-full w-full flex-col items-start gap-1 rounded-2xl border-2 border-line bg-surface p-3 text-left transition-transform hover:-translate-y-0.5 hover:border-brand disabled:opacity-60"
                  onClick={() => start({ customTheme: { title: q.query, readerProblem: `「${q.query}」で検索して、くわしく知りたい人` } })}
                >
                  <span className="font-black">「{q.query}」</span>
                  <span className="text-xs text-muted">
                    いま{Math.round(q.position)}位・28日で{q.impressions.toLocaleString("ja-JP")}回 検索に出ました
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-brand">
                    この言葉で書く
                    <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                      →
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {themes.map((t, i) => (
          <li key={t.id} className="animate-rise" style={{ animationDelay: `${i * 0.08}s` }}>
            <button
              type="button"
              disabled={busy}
              className="card group h-full w-full text-left transition-transform hover:-translate-y-1 hover:border-brand disabled:opacity-60"
              onClick={() => start({ themeId: t.id })}
            >
              <span className="mb-1 inline-block rounded-full bg-brand-soft px-3 text-sm font-bold text-brand-dark">テーマ {i + 1}</span>
              <span className="block text-lg font-black">{t.title}</span>
              <span className="mt-2 block text-sm text-muted">誰の悩みに答えるか</span>
              <span className="block">{t.readerProblem}</span>
              <span className="mt-2 block text-sm text-muted">伝えたい内容</span>
              <span className="block">{t.message}</span>
              <span className="mt-3 inline-flex items-center gap-1 font-bold text-brand">
                このテーマで書く
                <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </span>
            </button>
          </li>
        ))}
        <li>
          {custom ? (
            <form
              className="card space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                start({ customTheme: { title: title.trim(), readerProblem: problem.trim() } });
              }}
            >
              <p className="text-lg font-bold">自分でテーマを決める</p>
              <div>
                <label htmlFor="custom-title" className="field-label">
                  テーマ
                </label>
                <input id="custom-title" className="field" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：雨漏りに気づいたら最初にすること" />
              </div>
              <div>
                <label htmlFor="custom-problem" className="field-label">
                  誰のどんな悩みに答えますか
                </label>
                <textarea id="custom-problem" className="field" rows={2} required value={problem} onChange={(e) => setProblem(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary" disabled={busy || !title.trim() || !problem.trim()}>
                  このテーマで書く
                </button>
                <button type="button" className="btn-secondary" onClick={() => setCustom(false)}>
                  やめる
                </button>
              </div>
            </form>
          ) : (
            <button type="button" className="card flex h-full min-h-32 w-full items-center justify-center gap-2 border-2 border-dashed text-lg font-bold transition-transform hover:-translate-y-1 hover:border-brand" onClick={() => setCustom(true)}>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sun text-xl" aria-hidden>
                ＋
              </span>
              自分でテーマを決める
            </button>
          )}
        </li>
      </ul>
    </main>
  );
}
