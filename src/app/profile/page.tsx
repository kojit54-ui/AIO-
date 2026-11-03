"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PROFILE_FIELDS } from "@/components/CoachForms";
import { ProfileSetup } from "@/components/ProfileSetup";
import { EmptyState, Notice, formatDate } from "@/components/ui";
import { ApiError, useStore } from "@/mock/store";

/** 顧客が、コタムの登録した会社プロフィールを確認する画面 */
export default function ProfilePage() {
  const { db, user, api } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // 記事を書く画面から来たときは、確かめたあとにそこへ戻れるようにする
  const [returnTo, setReturnTo] = useState<string | null>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const v = sessionStorage.getItem("aio.returnTo");
        if (v?.startsWith("/prototype/write/")) setReturnTo(v);
      } catch {
        // 読めなくても、確かめる画面は使える
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  if (!user) return null;
  const org = db.organizations.find((o) => o.id === user.organizationIds[0]);
  if (user.role !== "client_member" || !org) return <main className="page"><EmptyState title="この画面は顧客担当者向けです" /></main>;
  if (!org.profile) return <main className="page"><ProfileSetup orgId={org.id} /></main>;

  return (
    <main className="page max-w-3xl space-y-5">
      <div>
        <Link href="/" className="text-sm text-brand-dark underline">
          ホームへ戻る
        </Link>
        <h1 className="text-2xl font-black sm:text-3xl">会社の情報を確かめる</h1>
        <p className="text-muted">記事を作るときに使う会社の情報です。違うところがあれば、「会社のことを教える」の答えを直してから、下の「答えからまとめ直す」を押してください。</p>
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
        <>
          <Notice tone="ok" title={`${formatDate(org.profileApprovedAt)}に確認済みです`} />
          {returnTo && (
            <Link
              href={returnTo}
              className="btn-primary min-h-14 px-6 text-lg"
              onClick={() => {
                try {
                  sessionStorage.removeItem("aio.returnTo");
                } catch {
                  // 消せなくても戻れる
                }
              }}
            >
              記事づくりに戻る →
            </Link>
          )}
        </>
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
      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <Link href="/prototype/hearing" className="btn-secondary">
          「会社のことを教える」の答えを直す
        </Link>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              await api.buildProfileFromHearing(org.id);
            } catch (e) {
              setError(e instanceof ApiError ? e.message : "会社の情報をまとめられませんでした");
            }
            setBusy(false);
          }}
        >
          答えからまとめ直す
        </button>
      </div>
    </main>
  );
}
