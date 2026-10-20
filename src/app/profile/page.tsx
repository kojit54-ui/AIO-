"use client";

import Link from "next/link";
import { useState } from "react";
import { PROFILE_FIELDS } from "@/components/CoachForms";
import { EmptyState, Notice, formatDate } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";

/** 顧客が、コタムの登録した会社プロフィールを確認する画面 */
export default function ProfilePage() {
  const { db, user, api } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (!user) return null;
  const org = db.organizations.find((o) => o.id === user.organizationIds[0]);
  if (user.role !== "client_member" || !org) return <main className="page"><EmptyState title="この画面は顧客担当者向けです" /></main>;
  if (!org.profile) return <main className="page"><EmptyState title="会社プロフィールはコタムが準備中です" /></main>;

  return (
    <main className="page max-w-3xl space-y-5">
      <div>
        <Link href="/" className="text-sm text-brand-dark underline">
          ホームへ戻る
        </Link>
        <h1 className="text-2xl font-bold">会社プロフィールの確認</h1>
        <p className="text-muted">記事を作るときに使う会社の情報です。違うところがあれば、コタムの担当者にお知らせください。</p>
      </div>
      {error && <Notice tone="danger" title={error} />}
      <dl className="card grid gap-x-4 gap-y-3 sm:grid-cols-[10rem_1fr]">
        {PROFILE_FIELDS.map(([k, label]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd>{org.profile![k]}</dd>
          </div>
        ))}
      </dl>
      {org.profileApprovedAt ? (
        <Notice tone="ok" title={`${formatDate(org.profileApprovedAt)}に確認済みです`} />
      ) : (
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await api.approveProfile(org.id);
            } catch (e) {
              setError(e instanceof ApiError ? e.message : "保存できませんでした");
            }
            setBusy(false);
          }}
        >
          この内容で問題ありません
        </button>
      )}
    </main>
  );
}
