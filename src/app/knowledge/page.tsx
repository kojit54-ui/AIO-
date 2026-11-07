"use client";

// しおりに教える（取り込み）。docs/DECISIONS.md 2026-11-02・11-03。
// やり方を3つから選び、どれも手順を1つずつ進める（2026-11-02 田村さん：リテラシーの低い人が使う。ゲームのように）。
// 1. いつものAI（ChatGPT・Claude・Gemini）に頼み文を貼り、返事をここに貼る → しおりが読み取り → 選んだものを覚える
// 2. 会話の記録をまるごと（各AIの書き出しファイル）→ 関係する会話を選ぶ → しおりが読み取り
// 3. これまでのブログ記事を、過去記事として足す（次の記事づくりに使う）

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChatExportImport } from "@/components/ChatExportImport";
import { Confetti, Toast } from "@/components/fun";
import { type GuideStep, ShioriTalk, StepGuide } from "@/components/talk";
import { WaitingScreen } from "@/components/WaitingScreen";
import { EmptyState, Notice } from "@/components/ui";
import { IMPORT_PROMPT, MAX_IMPORT_CHARS, type ImportCandidate } from "@/lib/growth/aiImport";
import { localHearing } from "@/lib/growth/localKnowledge";
import { ApiError, useStore } from "@/mock/store";
import { GuideName, GuideText } from "@/components/useGuide";

const AI_LINKS = [
  { name: "ChatGPT", url: "https://chatgpt.com/" },
  { name: "Claude", url: "https://claude.ai/" },
  { name: "Gemini", url: "https://gemini.google.com/" },
];

type Mode = "ask" | "file" | "blog";
const MODES: { id: Mode; icon: string; title: string; note: string; time: string }[] = [
  { id: "ask", icon: "💬", title: "いつものAIに、まとめてもらう", note: "ChatGPT などに頼み文を送って、返事を貼るだけ", time: "かんたん・5分" },
  { id: "file", icon: "📦", title: "会話の記録を、まるごと渡す", note: "AIの「データのエクスポート」のファイルから", time: "じっくり・メール待ちあり" },
  { id: "blog", icon: "📝", title: "これまでのブログ記事を渡す", note: "書いてきた記事を1本ずつ貼り付け", time: "1本1分" },
];

/** ホームの「ふだん使っているAI」から来たとき（/knowledge?mode=ask&ai=ChatGPT）は、そのやり方とAIを選んだ状態で始める */
function fromUrl(): { mode: Mode | null; ai: string | null } {
  if (typeof window === "undefined") return { mode: null, ai: null };
  const q = new URLSearchParams(window.location.search);
  const m = q.get("mode");
  const a = q.get("ai");
  return { mode: MODES.some((x) => x.id === m) ? (m as Mode) : null, ai: AI_LINKS.some((x) => x.name === a) ? a : null };
}

export default function KnowledgePage() {
  const { db, user, api } = useStore();
  const [start] = useState(fromUrl);
  const [mode, setMode] = useState<Mode | null>(start.mode);
  const [ai, setAi] = useState(start.ai ?? AI_LINKS[0].name);
  // ホームから来たときは、やり方の選択を飛ばして手順のところまで動かす
  useEffect(() => {
    if (!start.mode) return;
    const t = setTimeout(() => document.getElementById("teach-guide")?.scrollIntoView({ behavior: "smooth", block: "start" }), 600);
    return () => clearTimeout(t);
  }, [start.mode]);
  const [askStep, setAskStep] = useState(0);
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
  const org = db.organizations.find((o) => o.id === orgId);
  // 会社に関係する会話を探す言葉：会社名・会社の情報・ヒアリングの答え
  const hints = [org?.name ?? "", org?.profile?.business ?? "", org?.profile?.strengths ?? "", ...Object.values(db.hearing ?? localHearing()).map((a) => a.text)];

  const fail = (e: unknown, fallback: string) => setError(e instanceof ApiError ? e.message : fallback);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(IMPORT_PROMPT);
      setCopied(true);
    } catch {
      setError("コピーできませんでした。下の「頼み文の中身を見る」から選んでコピーしてください");
    }
  }

  async function read(text = pasted) {
    setReading(true);
    setError(null);
    try {
      const items = await api.readImport(orgId, text);
      setCandidates(items.map((x) => ({ ...x, on: true })));
      if (!items.length) setError("覚えられることが見つかりませんでした。頼み文をそのまま貼って、もう一度AIに聞いてみてください");
      else if (mode === "ask") setAskStep(4);
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

  const aiUrl = AI_LINKS.find((a) => a.name === ai)?.url ?? AI_LINKS[0].url;
  const askSteps: GuideStep[] = [
    {
      title: "AIを選ぶ",
      mood: "ask",
      say: start.ai ? [`いつもの${start.ai}を開きましょう。`, "下のボタンを押すと、新しい画面で開きます。開いたら、この画面に戻ってきてくださいね。"] : ["いつもどのAIを使っていますか？", "押すと、そのAIが新しい画面で開きます。"],
      body: (
        <div className="flex flex-wrap gap-2">
          {(start.ai ? AI_LINKS.filter((a) => a.name === start.ai) : AI_LINKS).map((a) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={start.ai ? "btn-primary min-h-14 text-lg" : "btn-secondary"}
              onClick={() => {
                setAi(a.name);
                setAskStep(1);
              }}
            >
              {a.name} ↗
            </a>
          ))}
        </div>
      ),
      next: null,
    },
    {
      title: "コピー",
      mood: "point",
      say: [`${ai}が開きましたね。`, "こちらの画面に戻って、しおりが用意した「頼み文」をコピーしてください。"],
      body: (
        <div className="space-y-2">
          <button type="button" className={copied ? "btn-secondary" : "btn-primary"} onClick={copyPrompt}>
            {copied ? "コピーしました ✓" : "頼み文をコピー"}
          </button>
          <details className="rounded-2xl bg-canvas p-3 text-sm">
            <summary className="cursor-pointer font-bold text-brand-dark">頼み文の中身を見る</summary>
            <pre className="mt-2 whitespace-pre-wrap font-sans">{IMPORT_PROMPT}</pre>
          </details>
        </div>
      ),
      next: copied ? "コピーできた！" : null,
    },
    {
      title: "送る",
      mood: "right",
      say: [`${ai}の画面で、いつも質問を書く欄に貼り付けて、送ってください。`, "貼り付けは、欄を押してから Ctrl と V を同時に押すとできます。"],
      body: (
        <a href={aiUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-dark underline">
          {ai}をもう一度開く ↗
        </a>
      ),
      next: "送った！",
    },
    {
      title: "貼る",
      mood: "jersey-cheer",
      say: ["答えが返ってきたら、その答えを全部コピーして、ここに貼ってください。", "答えの下にある「コピー」の印を押すと、まとめてコピーできます。"],
      body: (
        <div className="space-y-2">
          <textarea
            id="ai-reply"
            aria-label="AIの答え"
            className="field min-h-40"
            maxLength={MAX_IMPORT_CHARS}
            placeholder={"例：\n【会社・お仕事の内容】\n市内で戸建てのリフォーム。断熱と水回りが多い\n【選ばれる理由・強み】\n一級建築士が現地調査から工事まで担当する…"}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
          />
          <button type="button" className="btn-primary" disabled={!pasted.trim() || reading} onClick={() => read()}>
            <GuideName />に読んでもらう
            <span className="inline-block animate-nudge" aria-hidden>
              ✨
            </span>
          </button>
        </div>
      ),
      next: null,
    },
  ];

  return (
    <main className="page max-w-4xl space-y-6">
      {reading && <WaitingScreen label="しおりがAIの返事を読んでいます" note="会社の知識として覚えられることを探しています。" />}
      {done && (
        <>
          <Confetti count={50} />
          <Toast key={done}><GuideText text={done} /></Toast>
        </>
      )}
      <div className="animate-rise space-y-2">
        <Link href="/" className="text-sm text-brand-dark underline">
          ホームへ戻る
        </Link>
        <h1 className="text-2xl font-black sm:text-3xl"><GuideName />に教える</h1>
        <ShioriTalk mood="ask" size="lg" lines={["会社のことを教えてもらえたら、次の記事からもっとあなたらしく書けます。", "やり方を3つ用意しました。どれから教えてくれますか？"]} />
      </div>
      {error && <Notice tone="warn" title={error} />}
      {done && start.ai && (
        <section className="card animate-pop space-y-3 border-2 border-brand">
          <ShioriTalk mood="jersey-cheer" lines={[`${start.ai}からの取り込み、できました！`, "次は、会社のことを聞く質問です。取り込んだ内容で分かった質問は飛ばすので、残りだけ答えてください。"]} />
          <Link href="/prototype/hearing" className="btn-primary min-h-14 w-full text-lg">
            残りの質問に答える →
          </Link>
        </section>
      )}

      <section aria-label="教え方を選ぶ" className="grid gap-3 sm:grid-cols-3">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setError(null);
              // スマホでは選んだやり方の手順が下に出るので、そこまで動かす
              setTimeout(() => document.getElementById("teach-guide")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
            }}
            aria-pressed={mode === m.id}
            className={`card animate-rise flex flex-col items-start gap-1 text-left transition-transform hover:-translate-y-0.5 ${mode === m.id ? "border-brand ring-4 ring-brand-soft" : ""}`}
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <span className="text-3xl" aria-hidden>
              {m.icon}
            </span>
            <span className="font-black">{m.title}</span>
            <span className="text-sm text-muted">{m.note}</span>
            <span className="mt-1 rounded-full bg-sun-soft px-2 py-0.5 text-xs font-bold">{m.time}</span>
          </button>
        ))}
      </section>

      <div id="teach-guide" className="scroll-mt-4" />
      {mode === "ask" && (
        <section className="card animate-pop" aria-label="いつものAIに、まとめてもらう">
          <StepGuide steps={askSteps} step={askStep} onStep={setAskStep} doneSay="読み終わりました！下の中から、覚えてほしいものを選んでくださいね。" />
        </section>
      )}
      {mode === "file" && (
        <section className="card animate-pop" aria-label="会話の記録を、まるごと渡す">
          <ChatExportImport hints={hints} busy={reading} onRead={read} />
        </section>
      )}
      {mode === "blog" && (
        <section className="card animate-pop space-y-3" aria-labelledby="blog-import-heading">
          <h2 id="blog-import-heading" className="sr-only">
            これまでのブログ記事を取り込む
          </h2>
          <ShioriTalk mood="point" lines={["書いてきた記事を貼ってもらえたら、文体や扱ってきたテーマを覚えます。", `いまは${blogs.length}本覚えています。1本ずつ貼ってくださいね。`]} />
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
      )}

      {candidates && candidates.length > 0 && (
        <section className="animate-pop space-y-3 rounded-3xl border-2 border-sun bg-sun-soft p-4" aria-label="覚えてほしいものを選ぶ">
          <ShioriTalk mood="jersey-done" lines={[`${candidates.length}件、覚えられそうなことが見つかりました！`, "覚えてほしいものに印を付けて、下のボタンを押してください。"]} />
          <ul className="space-y-2">
            {candidates.map((c, i) => (
              <li key={i} className="animate-rise" style={{ animationDelay: `${i * 0.05}s` }}>
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
        </section>
      )}

      <section className="card animate-rise space-y-3" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-xl font-black">
          <GuideName />のノート（覚えていること {notes.length}件）
        </h2>
        {notes.length === 0 ? (
          <p className="text-sm text-muted">まだありません。上のどれかで教えると、ここに増えていきます。</p>
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
