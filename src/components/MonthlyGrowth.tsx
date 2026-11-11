"use client";

// しおり通信（今月のまとめ）・続けた月の記録・AIに紹介されたか（2026-11-02 提案の3）。
// どれも実際の記事・チェック・取り込みの記録から出す。

import Link from "next/link";
import { useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { WaitingScreen } from "@/components/WaitingScreen";
import { Notice } from "@/components/ui";
import { MONTHLY_MENTION_CHECKS, cleanAnswerText } from "@/lib/growth/mentionQuestions";
import { articleSummaries } from "@/lib/selectors";
import { monthlySummary, writingStreak } from "@/lib/growth/monthly";
import { ApiError, type MockDb, useStore } from "@/mock/store";
import { GuideName, GuideText } from "@/components/useGuide";

const ym = (iso: string) => iso.slice(0, 7);

export { monthlySummary, writingStreak };

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
  const writtenThemes = new Set(articleSummaries(db, orgId).map((a) => a.themeTitle));
  const [y, mo] = month.split("-");

  async function toggleMail(on: boolean) {
    setError(null);
    try {
      await api.setNewsletterOptOut(!on);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "設定を変えられませんでした");
    }
  }

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
            <span className="text-xs text-muted"><GuideText text={x.label} /></span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 rounded-2xl border-2 border-brand-soft p-3">
        <p className="font-black">AIに紹介されているか、<GuideName />が調べます</p>
        <ShioriTalk
          mood={ever ? "jersey-done" : "think"}
          size="sm"
          lines={[ever ? "AIに紹介されたことがありますよ！" : "お客様がAIに聞きそうな質問を、しおりが代わりに聞いてみます。", `答えや出典に、あなたの会社が出てくるか確かめますね。月${MONTHLY_MENTION_CHECKS}回まで調べられます。`]}
        >
          <button type="button" className="btn-primary" disabled={busy || runsThisMonth >= MONTHLY_MENTION_CHECKS} onClick={check}>
            {runsThisMonth >= MONTHLY_MENTION_CHECKS ? "今月は調べ終わりました" : `今月のチェックをする（残り${MONTHLY_MENTION_CHECKS - runsThisMonth}回）`}
          </button>
        </ShioriTalk>
        {error && <Notice tone="warn" title={error} />}
        {latest.length > 0 && (
          <ul className="space-y-2">
            {latest.map((m) => (
              <li key={m.id} className={`rounded-2xl p-3 text-sm ${m.mentioned ? "animate-pop bg-ok-soft" : "bg-canvas"}`}>
                <p className="font-bold">
                  {m.mentioned ? "🎉 紹介されました：" : "まだ出てきません："}「{m.question}」
                </p>
                <p className="whitespace-pre-line text-muted">{cleanAnswerText(m.excerpt)}</p>
                {!m.mentioned && !m.isSample && !writtenThemes.has(m.question) && (
                  <Link href="/articles/new#ai-questions" className="mt-1 inline-flex items-center gap-1 font-bold text-brand-dark underline">
                    この質問に答える記事を書く →
                  </Link>
                )}
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
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-canvas px-3 py-2 text-sm">
        <span className="font-bold">📬 毎月1日に、このまとめをメールでもお届けします</span>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-5 w-5 accent-brand" checked={!db.newsletterOptOut} onChange={(e) => toggleMail(e.target.checked)} />
          受け取る
        </label>
        <Link href="/newsletter" className="text-brand-dark underline">
          メールの見本を見る
        </Link>
      </div>
    </section>
  );
}
