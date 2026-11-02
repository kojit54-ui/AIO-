"use client";

// しおりに教える（取り込み）。docs/DECISIONS.md 2026-11-02。
// 1. いつものAI（ChatGPT・Claude・Gemini）に頼み文を貼り、返事をここに貼る → しおりが読み取り → 選んだものを覚える
// 2. これまでのブログ記事を、過去記事として足す（次の記事づくりに使う）

import Link from "next/link";
import { useState } from "react";
import { Confetti, Shiori, Toast } from "@/components/fun";
import { WaitingScreen } from "@/components/WaitingScreen";
import { EmptyState, Notice } from "@/components/ui";
import { IMPORT_PROMPT, MAX_IMPORT_CHARS, type ImportCandidate } from "@/lib/growth/aiImport";
import { ApiError, useStore } from "@/mock/store";

const AI_LINKS = [
  { name: "ChatGPT", url: "https://chatgpt.com/" },
  { name: "Claude", url: "https://claude.ai/" },
  { name: "Gemini", url: "https://gemini.google.com/" },
];

export default function KnowledgePage() {
  const { db, user, api } = useStore();
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState("");
  const [reading, setReading] = useState(false);
  const [candidates, setCandidates] = useState<(ImportCandidate & { on: boolean })[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [blog, setBlog] = useState({ title: "", url: "", body: "" });

  if (!user) return null;
  if (user.role !== "client_member") {
    return (
      <main className="page">
        <EmptyState title="この画面は会社の担当の方が使います" />
      </main>
    );
  }
  const orgId = user.organizationIds[0];
  const notes = (db.knowledgeNotes ?? []).filter((n) => n.organizationId === orgId);
  const blogs = db.referenceArticles.filter((r) => r.organizationId === orgId);

  const fail = (e: unknown, fallback: string) => setError(e instanceof ApiError ? e.message : fallback);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(IMPORT_PROMPT);
      setCopied(true);
    } catch {
      setError("コピーできませんでした。下の頼み文を選んでコピーしてください");
    }
  }

  async function read() {
    setReading(true);
    setError(null);
    try {
      const items = await api.readImport(orgId, pasted);
      setCandidates(items.map((x) => ({ ...x, on: true })));
      if (!items.length) setError("覚えられることが見つかりませんでした。頼み文をそのまま貼って、もう一度AIに聞いてみてください");
    } catch (e) {
      fail(e, "読み取れませんでした。もう一度お試しください");
    }
    setReading(false);
  }

  async function save() {
    const chosen = (candidates ?? []).filter((c) => c.on).map(({ label, text }) => ({ label, text }));
    if (!chosen.length) return;
    setSaving(true);
    setError(null);
    try {
      await api.saveKnowledgeNotes(orgId, chosen);
      setDone(`しおりが${chosen.length}件を覚えました！`);
      setCandidates(null);
      setPasted("");
    } catch (e) {
      fail(e, "保存できませんでした");
    }
    setSaving(false);
  }

  async function addBlog() {
    setSaving(true);
    setError(null);
    try {
      await api.addBlogArticle(orgId, { title: blog.title.trim(), body: blog.body.trim(), url: /^https?:\/\//.test(blog.url.trim()) ? blog.url.trim() : null });
      setDone("ブログ記事を取り込みました！次の記事づくりに使います");
      setBlog({ title: "", url: "", body: "" });
    } catch (e) {
      fail(e, "保存できませんでした");
    }
    setSaving(false);
  }

  return (
    <main className="page max-w-4xl space-y-6">
      {reading && <WaitingScreen label="しおりがAIの返事を読んでいます" note="会社の知識として覚えられることを探しています。" />}
      {done && (
        <>
          <Confetti count={50} />
          <Toast key={done}>{done}</Toast>
        </>
      )}
      <div className="flex animate-rise flex-wrap items-end gap-4">
        <Shiori mood="ask" className="h-32 w-auto shrink-0 animate-float" />
        <div className="min-w-0 flex-1 basis-60">
          <Link href="/" className="text-sm text-brand-dark underline">
            ホームへ戻る
          </Link>
          <h1 className="text-2xl font-black sm:text-3xl">しおりに教える</h1>
          <p className="text-muted">ChatGPT・Claude・Gemini で相談してきたことや、これまでのブログ記事を取り込めます。しおりが覚えて、次の記事から使います。</p>
        </div>
      </div>
      {error && <Notice tone="warn" title={error} />}

      <section className="card animate-rise space-y-4" aria-labelledby="ai-import-heading">
        <h2 id="ai-import-heading" className="text-xl font-black">
          いつものAIから取り込む
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white">1</span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-bold">頼み文をコピーする</p>
              <button type="button" className="btn-primary" onClick={copyPrompt}>
                {copied ? "コピーしました ✓" : "頼み文をコピー"}
              </button>
              <details className="rounded-2xl bg-canvas p-3 text-sm">
                <summary className="cursor-pointer font-bold text-brand-dark">頼み文の中身を見る</summary>
                <pre className="mt-2 whitespace-pre-wrap font-sans">{IMPORT_PROMPT}</pre>
              </details>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white">2</span>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-bold">いつも使っているAIに貼り付けて送る</p>
              <p className="text-sm text-muted">これまでに会社のことを相談してきたAIで送ってください。会話を覚えているAIほど、くわしくまとめてくれます。</p>
              <div className="flex flex-wrap gap-2">
                {AI_LINKS.map((a) => (
                  <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" className="btn-secondary min-h-10 px-4 text-sm">
                    {a.name} を開く ↗
                  </a>
                ))}
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand font-black text-white">3</span>
            <div className="min-w-0 flex-1 space-y-2">
              <label htmlFor="ai-reply" className="block font-bold">
                返ってきた答えを、ここに貼る
              </label>
              <textarea
                id="ai-reply"
                className="field min-h-40"
                maxLength={MAX_IMPORT_CHARS}
                placeholder={"例：\n【会社・お仕事の内容】\n市内で戸建てのリフォーム。断熱と水回りが多い\n【選ばれる理由・強み】\n一級建築士が現地調査から工事まで担当する…"}
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
              />
              <button type="button" className="btn-primary" disabled={!pasted.trim() || reading} onClick={read}>
                しおりに読んでもらう
                <span className="inline-block animate-nudge" aria-hidden>
                  ✨
                </span>
              </button>
            </div>
          </li>
        </ol>

        {candidates && candidates.length > 0 && (
          <div className="animate-pop space-y-3 rounded-2xl border-2 border-sun bg-sun-soft p-4">
            <p className="font-bold">しおりが覚えられそうなこと（{candidates.length}件）。覚えてほしいものに印を付けてください。</p>
            <ul className="space-y-2">
              {candidates.map((c, i) => (
                <li key={i}>
                  <label className="flex cursor-pointer gap-3 rounded-2xl bg-surface p-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 shrink-0 accent-brand"
                      checked={c.on}
                      onChange={(e) => setCandidates(candidates.map((x, n) => (n === i ? { ...x, on: e.target.checked } : x)))}
                    />
                    <span>
                      <b className="block">{c.label}</b>
                      <span className="whitespace-pre-wrap text-sm text-muted">{c.text}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <button type="button" className="btn-primary" disabled={saving || !candidates.some((c) => c.on)} onClick={save}>
              選んだ{candidates.filter((c) => c.on).length}件を覚えてもらう
            </button>
          </div>
        )}
        <p className="text-xs text-muted">会話の記録をまるごと取り込む機能（各AIの「データのエクスポート」のファイルから）は準備中です。</p>
      </section>

      <section className="card animate-rise space-y-3" aria-labelledby="blog-import-heading">
        <h2 id="blog-import-heading" className="text-xl font-black">
          これまでのブログ記事を取り込む
        </h2>
        <p className="text-sm text-muted">書いてきた記事を取り込むと、文体や扱ってきたテーマを、次の記事づくりに生かします。（取り込み済み {blogs.length}本）</p>
        <div>
          <label htmlFor="blog-title" className="field-label">
            記事のタイトル
          </label>
          <input id="blog-title" className="field" value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} placeholder="例：冬の脱衣所が寒い家でできること" />
        </div>
        <div>
          <label htmlFor="blog-url" className="field-label">
            記事のURL（あれば）
          </label>
          <input id="blog-url" type="url" className="field" value={blog.url} onChange={(e) => setBlog({ ...blog, url: e.target.value })} placeholder="https://" />
        </div>
        <div>
          <label htmlFor="blog-body" className="field-label">
            本文（ブログの画面からコピーして貼り付け）
          </label>
          <textarea id="blog-body" className="field min-h-40" value={blog.body} onChange={(e) => setBlog({ ...blog, body: e.target.value })} placeholder="本文をそのまま貼り付けてください" />
        </div>
        <button type="button" className="btn-primary" disabled={saving || !blog.title.trim() || !blog.body.trim()} onClick={addBlog}>
          この記事を取り込む
        </button>
      </section>

      <section className="card animate-rise space-y-3" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-black">
          取り込んで覚えていること（{notes.length}件）
        </h2>
        {notes.length === 0 ? (
          <p className="text-sm text-muted">まだありません。上の手順で取り込むと、ここに増えていきます。</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {notes.map((n) => (
              <li key={n.id} className="flex animate-rise gap-2 rounded-2xl border border-line bg-surface p-3">
                <span className="min-w-0 flex-1">
                  <b className="block text-sm">{n.label}</b>
                  <span className="line-clamp-3 text-sm text-muted">{n.text}</span>
                </span>
                <button
                  type="button"
                  className="shrink-0 self-start text-xs text-danger underline"
                  onClick={() => api.deleteKnowledgeNote(n.id).catch((e) => fail(e, "消せませんでした"))}
                >
                  忘れてもらう
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
