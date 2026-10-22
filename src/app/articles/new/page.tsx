"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState, Notice, monthLabel } from "@/components/ui";
import { CURRENT_MONTH } from "@/mock/data";
import { ApiError, useStore } from "@/mock/store";
import { isOrgReady } from "@/lib/selectors";

export default function NewArticlePage() {
  const { db, user, api } = useStore();
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
        <EmptyState title="先に会社プロフィールをご確認ください" action={<Link href="/profile" className="btn-primary">確認する</Link>}>
          確認した会社の情報だけを、記事づくりに使います。
        </EmptyState>
      </main>
    );
  }

  if (!isOrgReady(db, orgId, CURRENT_MONTH)) {
    return (
      <main className="page">
        <EmptyState title="コタムが準備中です">会社情報と今月の指導方針が登録されると、記事を書き始められます。</EmptyState>
      </main>
    );
  }

  const themes = db.themes
    .filter((t) => t.organizationId === orgId && t.targetMonth === CURRENT_MONTH && t.source === "coach")
    .sort((a, b) => a.sortOrder - b.sortOrder);

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
        <h1 className="text-2xl font-bold">テーマを選ぶ</h1>
        <p className="text-muted">{monthLabel(CURRENT_MONTH)}にコタムと決めたテーマです。書きやすいものを1つ選んでください。</p>
      </div>
      {error && <Notice tone="danger" title={error} />}

      <ul className="grid gap-4 md:grid-cols-2">
        {themes.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              disabled={busy}
              className="card h-full w-full text-left hover:border-brand disabled:opacity-60"
              onClick={() => start({ themeId: t.id })}
            >
              <span className="block text-lg font-bold">{t.title}</span>
              <span className="mt-2 block text-sm text-muted">誰の悩みに答えるか</span>
              <span className="block">{t.readerProblem}</span>
              <span className="mt-2 block text-sm text-muted">伝えたい内容</span>
              <span className="block">{t.message}</span>
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
            <button type="button" className="card flex h-full min-h-32 w-full items-center justify-center border-dashed text-lg font-semibold hover:border-brand" onClick={() => setCustom(true)}>
              自分でテーマを決める
            </button>
          )}
        </li>
      </ul>
    </main>
  );
}
