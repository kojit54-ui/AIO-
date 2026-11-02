"use client";

// しおり通信（今月のまとめ）・続けた月の記録・AIに紹介されたか（2026-11-02 提案の3）。
// どれも実際の記事・チェック・取り込みの記録から出す。

import { useState } from "react";
import { Shiori } from "@/components/fun";
import { WaitingScreen } from "@/components/WaitingScreen";
import { Notice } from "@/components/ui";
import { MONTHLY_MENTION_CHECKS } from "@/lib/growth/mentionQuestions";
import { ApiError, type MockDb, useStore } from "@/mock/store";

const ym = (iso: string) => iso.slice(0, 7);

/** 記事の本文を作った月が、今月（または先月）から何か月続いているか */
export function writingStreak(db: MockDb, orgId: string, now = new Date()): number {
  const articleIds = new Set(db.articles.filter((a) => a.organizationId === orgId).map((a) => a.id));
  const months = new Set(db.versions.filter((v) => articleIds.has(v.articleId) && v.body.length > 0).map((v) => ym(v.createdAt)));
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  // 今月まだ書いていなければ、先月から数える（月の初めに0にならないように）
  if (!months.has(d.toISOString().slice(0, 7))) d.setUTCMonth(d.getUTCMonth() - 1);
  let n = 0;
  while (months.has(d.toISOString().slice(0, 7))) {
    n++;
    d.setUTCMonth(d.getUTCMonth() - 1);
  }
  return n;
}

export function monthlySummary(db: MockDb, orgId: string, month: string) {
  const articles = db.articles.filter((a) => a.organizationId === orgId);
  const ids = new Set(articles.map((a) => a.id));
  const written = new Set(db.versions.filter((v) => ids.has(v.articleId) && v.body.length > 0 && ym(v.createdAt) === month).map((v) => v.articleId)).size;
  const published = articles.filter((a) => a.status === "published" && a.publishedAt && ym(a.publishedAt) === month).length;
  const checks = db.aioChecks.filter((c) => c.organizationId === orgId && ym(c.createdAt) === month);
  const score = checks.length ? Math.round((checks.reduce((n, c) => n + c.items.filter((i) => i.ok).length / Math.max(1, c.items.length), 0) / checks.length) * 100) : null;
  const learned = (db.knowledgeNotes ?? []).filter((n) => n.organizationId === orgId && ym(n.createdAt) === month).length + checks.reduce((n, c) => n + c.answers.filter((a) => !a.unknown && a.text.trim()).length, 0);
  return { written, published, score, learned };
}

export function MonthlyGrowth({ db, orgId, month }: { db: MockDb; orgId: string; month: string }) {
  const { api } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streak = writingStreak(db, orgId);
  const s = monthlySummary(db, orgId, month);
  const mentions = (db.aioMentions ?? []).filter((m) => m.organizationId === orgId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const latestAt = mentions[0]?.createdAt.slice(0, 16);
  const latest = mentions.filter((m) => m.createdAt.slice(0, 16) === latestAt);
  const runsThisMonth = new Set(mentions.filter((m) => ym(m.createdAt) === month).map((m) => m.createdAt.slice(0, 16))).size;
  const ever = mentions.some((m) => m.mentioned);
  const [y, mo] = month.split("-");

  async function check() {
    setBusy(true);
    setError(null);
    try {
      await api.runMentionCheck(orgId);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "AIに聞けませんでした");
    }
    setBusy(false);
  }

  const stats = [
    { label: "書いた記事", value: `${s.written}本` },
    { label: "公開した記事", value: `${s.published}本` },
    { label: "しおりが覚えたこと", value: `+${s.learned}` },
    { label: "AIOのチェック", value: s.score === null ? "—" : `${s.score}点` },
  ];

  return (
    <section className="card animate-rise space-y-4" aria-labelledby="monthly-heading">
      {busy && <WaitingScreen label="AIに聞いています" note="地域とサービスの質問を、検索できるAIに聞いて、あなたの会社が出てくるか確かめています。" />}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="monthly-heading" className="text-lg font-black">
          📰 しおり通信 {y}年{Number(mo)}月号
        </h2>
        <p className={`rounded-full px-3 py-1 text-sm font-black ${streak >= 2 ? "animate-pop bg-sun text-ink" : "bg-canvas text-muted"}`}>
          {streak > 0 ? `🔥 ${streak}か月つづけて書いています` : "今月の1本から、記録を始めましょう"}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((x, i) => (
          <li key={x.label} className="animate-pop rounded-2xl bg-canvas p-3 text-center" style={{ animationDelay: `${i * 0.06}s` }}>
            <span className="block text-2xl font-black tabular-nums text-brand">{x.value}</span>
            <span className="text-xs text-muted">{x.label}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 rounded-2xl border-2 border-brand-soft p-3">
        <div className="flex flex-wrap items-end gap-3">
          <Shiori mood={ever ? "jersey-done" : "think"} className="h-20 w-auto shrink-0 animate-float" />
          <div className="min-w-0 flex-1 basis-56">
            <p className="font-black">AIに紹介されているか、しおりが調べます</p>
            <p className="text-sm text-muted">お客様がAIに聞きそうな質問を、検索できるAI（ChatGPT）に聞いて、答えや出典にあなたの会社が出てくるかを確かめます。月{MONTHLY_MENTION_CHECKS}回まで。</p>
          </div>
          <button type="button" className="btn-primary" disabled={busy || runsThisMonth >= MONTHLY_MENTION_CHECKS} onClick={check}>
            {runsThisMonth >= MONTHLY_MENTION_CHECKS ? "今月は調べ終わりました" : `今月のチェックをする（残り${MONTHLY_MENTION_CHECKS - runsThisMonth}回）`}
          </button>
        </div>
        {error && <Notice tone="warn" title={error} />}
        {latest.length > 0 && (
          <ul className="space-y-2">
            {latest.map((m) => (
              <li key={m.id} className={`rounded-2xl p-3 text-sm ${m.mentioned ? "animate-pop bg-ok-soft" : "bg-canvas"}`}>
                <p className="font-bold">
                  {m.mentioned ? "🎉 紹介されました：" : "まだ出てきません："}「{m.question}」
                </p>
                <p className="text-muted">{m.excerpt}</p>
                {m.sources.length > 0 && (
                  <p className="mt-1 text-xs">
                    出典：
                    {m.sources.slice(0, 3).map((x, i) => (
                      <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-brand-dark underline">
                        {i + 1}. {x.title.slice(0, 30)}
                      </a>
                    ))}
                  </p>
                )}
              </li>
            ))}
            {!ever && <li className="text-xs text-muted">記事を積み重ねるほど、AIに紹介されやすくなります。結果はAIのその時の答えなので、毎回変わることがあります。</li>}
          </ul>
        )}
      </div>
    </section>
  );
}
