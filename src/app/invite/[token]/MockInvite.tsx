"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
        <EmptyState title="この招待リンクは使えません">リンクが正しいか確認するか、コタムの担当者にお問い合わせください。</EmptyState>
      </main>
    );
  }
  if (invite.expired) {
    return (
      <main className="page max-w-xl">
        <EmptyState title="招待リンクの有効期限が切れています">お手数ですが、コタムの担当者に招待の再送をご依頼ください。</EmptyState>
      </main>
    );
  }

  return (
    <main className="page max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">{org.name}様へのご招待</h1>
      <div className="card space-y-3">
        <p>コタムのブログ執筆支援サービスにご招待します。月次指導の方針をもとに、質問に答えるだけで記事の下書きを作れます。</p>
        <p className="text-sm text-muted">
          入力した内容は、記事を作るためにAIへ送信します。他の会社に見られることはありません。
          <Link href="/login" className="underline">
            利用規約とプライバシーについて（準備中）
          </Link>
        </p>
        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => {
            login(user.id);
            router.push(org.profileApprovedAt ? "/" : "/profile");
          }}
        >
          同意してはじめる
        </button>
      </div>
      <p className="text-sm text-muted">試作では、このボタンでそのままログインします。本番ではメールアドレスの確認をはさみます。</p>
    </main>
  );
}
