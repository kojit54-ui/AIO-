"use client";

import { useState, useTransition } from "react";
import { Notice } from "@/components/ui";
import type { AcceptResult } from "@/lib/auth/invitations";
import { acceptInvite } from "./actions";

const FAILED: Record<Exclude<Exclude<AcceptResult, { ok: true }>["reason"], "valid">, string> = {
  expired: "招待リンクの有効期限が切れています。コタムの担当者に招待の再送をご依頼ください。",
  used: "この招待リンクはすでに使われています。ログイン画面からメールアドレスでログインしてください。",
  invalid: "この招待リンクは使えません。コタムの担当者にお問い合わせください。",
  error: "受け付けられませんでした。時間をおいてもう一度お試しください。",
};

export function AcceptInvite({ token, organizationName, maskedEmail }: { token: string; organizationName: string; maskedEmail: string }) {
  const [result, setResult] = useState<AcceptResult | null>(null);
  const [pending, start] = useTransition();

  if (result?.ok) {
    return (
      <main className="page max-w-xl space-y-4">
        <Notice tone="ok" title="ログイン用のメールを送りました">
          {maskedEmail} にメールが届きます。メールのリンクを開くと、ログインして使いはじめられます。
        </Notice>
      </main>
    );
  }

  return (
    <main className="page max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">{organizationName}様へのご招待</h1>
      <div className="card space-y-3">
        <p>コタムのブログ執筆支援サービスにご招待します。月次指導の方針をもとに、質問に答えるだけで記事の下書きを作れます。</p>
        <p className="text-sm text-muted">
          入力した内容は、記事を作るためにAIへ送信します。他の会社に見られることはありません。利用規約とプライバシーの説明は準備中です。
        </p>
        <p className="text-sm">招待先のメールアドレス：{maskedEmail}</p>
        {result && !result.ok && <Notice tone="danger">{FAILED[result.reason === "valid" ? "error" : result.reason]}</Notice>}
        <button type="button" className="btn-primary w-full" disabled={pending} onClick={() => start(async () => setResult(await acceptInvite(token)))}>
          {pending ? "受付中…" : "同意してはじめる"}
        </button>
      </div>
    </main>
  );
}
