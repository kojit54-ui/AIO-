"use client";

import { useState, useTransition } from "react";
import { Confetti } from "@/components/fun";
import { LoginStage } from "@/components/landing";
import { Notice } from "@/components/ui";
import { InviteWhat } from "./MockInvite";
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
      <LoginStage mood="joy" title="メールを送りました！" lines={["メールのリンクを押したら、すぐ始められますよ。", "待ってますね！"]}>
        <Notice tone="ok" title="ログイン用のメールを送りました">
          {maskedEmail} にメールが届きます。このブラウザでメールのリンクを開くと、ログインして使いはじめられます。
        </Notice>
      </LoginStage>
    );
  }

  return (
    <LoginStage mood="bow" title={<>{organizationName}様、<br />ようこそ！</>} lines={["お待ちしていました！案内役のしおりです。", "いっしょに、AIに紹介される会社になりましょう！"]}>
      <Confetti count={50} />
      <div className="card space-y-4 p-6">
        <h2 className="text-xl font-black">🎁 ご招待が届いています</h2>
        <InviteWhat />
        <p className="text-sm text-muted">
          入力した内容は、記事を作るためにAIへ送信します。他の会社に見られることはありません。利用規約とプライバシーの説明は準備中です。
        </p>
        <p className="text-sm">招待先のメールアドレス：{maskedEmail}</p>
        {result && !result.ok && <Notice tone="danger">{FAILED[result.reason === "valid" ? "error" : result.reason]}</Notice>}
        <button type="button" className="btn-primary min-h-14 w-full text-lg" disabled={pending} onClick={() => start(async () => setResult(await acceptInvite(token)))}>
          {pending ? "受付中…" : "同意してはじめる"}
        </button>
      </div>
    </LoginStage>
  );
}
