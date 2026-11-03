"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { InviteLetter } from "@/components/InviteLetter";
import { EmptyState } from "@/components/ui";
import { USERS } from "@/mock/data";
import { DEMO_INVITES, useStore } from "@/mock/store";

/** 招待メールのリンク先。本番では期限（7日）と使用済みをサーバーで検査し、ログイン用のメールを送る */
export function MockInvite() {
  const { token } = useParams<{ token: string }>();
  const { db, login } = useStore();
  const router = useRouter();
  const invite = DEMO_INVITES[token];
  const user = invite && USERS.find((u) => u.id === invite.userId);
  const org = user && db.organizations.find((o) => o.id === user.organizationIds[0]);

  if (!invite || !user || !org) {
    return (
      <main className="page max-w-xl">
        <EmptyState mood="sad" title="この招待リンクは使えません">リンクが正しいか確認するか、コタムの担当者にお問い合わせください。</EmptyState>
      </main>
    );
  }
  if (invite.expired) {
    return (
      <main className="page max-w-xl">
        <EmptyState mood="sad" title="招待リンクの有効期限が切れています">お手数ですが、コタムの担当者に招待の再送をご依頼ください。</EmptyState>
      </main>
    );
  }

  return (
    <InviteLetter organizationName={org.name} recipientName={user.name.replace(/（.*$/, "")} message={null} isFree>
      <div className="space-y-3">
        <p className="text-sm text-muted">
          入力した内容は、記事を作るためにAIへ送信します。他の会社に見られることはありません。
          <Link href="/login" className="underline">
            利用規約とプライバシーについて（準備中）
          </Link>
        </p>
        <button
          type="button"
          className="btn-primary min-h-14 w-full text-lg"
          onClick={() => {
            login(user.id);
            router.push(org.profileApprovedAt ? "/" : "/profile");
          }}
        >
          同意してはじめる
          <span className="inline-block animate-nudge" aria-hidden>
            →
          </span>
        </button>
        <p className="text-sm text-muted">試作では、このボタンでそのままログインします。本番ではメールアドレスの確認をはさみます。</p>
      </div>
    </InviteLetter>
  );
}
