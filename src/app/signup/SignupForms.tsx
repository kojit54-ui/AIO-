"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoginStage } from "@/components/landing";
import { Notice } from "@/components/ui";
import { CodeForm } from "@/app/login/EmailLogin";
import { CONFIRM_PATH, PRICE_LABEL, TRIAL_DAYS, confirmRows } from "@/lib/billing/plan";
import { ORG_NAME_MAX } from "@/lib/orgName";
import { PERSON_NAME_MAX } from "@/lib/personName";
import { type SignupState, goToCheckout, sendSignupCode } from "./actions";

function TestModeNote() {
  return (
    <Notice tone="warn" title="試験中（テストモード）">
      いまは試験用の画面です。本物のお金は動きません。カード番号は 4242 4242 4242 4242 などのテスト用の番号を使います。
    </Notice>
  );
}

/** 1歩目：会社名・お名前・メールアドレス → 6桁の番号 */
export function SignupStart({ testMode, closed, codeEnabled }: { testMode: boolean; closed: boolean; codeEnabled: boolean }) {
  const [state, action, pending] = useActionState<SignupState, FormData>(sendSignupCode, { sent: false });
  return (
    <LoginStage
      mood={state.sent ? "joy" : "bow"}
      compact={state.sent}
      title={state.sent ? "メールを送りました！" : <>{TRIAL_DAYS}日間、無料でためせます</>}
      lines={
        state.sent
          ? ["メールに届いた6桁の番号を、下に入れてください。", "そのあと、お支払いの条件を確かめてもらいますね。"]
          : ["まず、会社名とお名前、メールアドレスを教えてください。", "パスワードはいりません。メールに届く番号で入れます。"]
      }
    >
      {testMode && <TestModeNote />}
      <Steps now={state.sent ? 1 : 0} />
      {closed ? (
        <Notice tone="info" title="新規のお申し込みは、準備中です">
          受付を始めるときに、入口のページでお知らせします。{" "}
          <Link href="/welcome#price" className="font-bold underline">
            料金と条件を見る
          </Link>
        </Notice>
      ) : state.sent && state.email ? (
        <div className="card space-y-4 p-6">
          <div className="space-y-1">
            <p className="text-sm text-muted">送り先</p>
            <p className="break-all text-lg font-black">{state.email}</p>
            <p className="text-sm text-muted">
              違っていたら{" "}
              <a href="/signup" className="font-bold text-brand-dark underline">
                入れ直す
              </a>
            </p>
          </div>
          {codeEnabled ? (
            <CodeForm email={state.email} next={CONFIRM_PATH} />
          ) : (
            <p className="font-bold">メールの中の「ログインする」を押すと、続きの画面が開きます。</p>
          )}
          <details className="rounded-2xl bg-canvas px-4 py-2 text-sm">
            <summary className="cursor-pointer font-bold">メールが届かないときは</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              <li>迷惑メールのフォルダを見てください</li>
              <li>番号のかわりに、メールの中の「ログインする」を押しても進めます</li>
              <li>数分たっても届かないときは、メールアドレスを確かめて入れ直してください</li>
            </ul>
          </details>
        </div>
      ) : (
        <form action={action} className="card space-y-4 p-6">
          <h2 className="text-xl font-black">お申し込み</h2>
          <p className="-mt-2 text-sm text-muted">
            {PRICE_LABEL}。はじめの{TRIAL_DAYS}日間は無料です。お試しのあいだに解約すれば、料金はかかりません。
          </p>
          <label className="block">
            <span className="field-label">会社名（屋号）</span>
            <input name="orgName" required maxLength={ORG_NAME_MAX} defaultValue={state.orgName} key={`o${state.orgName ?? ""}`} autoComplete="organization" placeholder="例）田中精工株式会社" className="field min-h-12 text-lg" />
          </label>
          <label className="block">
            <span className="field-label">お名前</span>
            <input name="personName" required maxLength={PERSON_NAME_MAX} defaultValue={state.personName} key={`p${state.personName ?? ""}`} autoComplete="name" placeholder="例）田中 一郎" className="field min-h-12 text-lg" />
          </label>
          <label className="block">
            <span className="field-label">メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={state.email} key={`e${state.email ?? ""}`} placeholder="例）tanaka@example.co.jp" className="field min-h-12 text-lg" />
          </label>
          {state.error && <p className="text-sm font-bold text-danger">{state.error}</p>}
          <button type="submit" className="btn-primary min-h-14 w-full text-lg" disabled={pending}>
            {pending ? "送っています…" : "番号をメールで受け取る →"}
          </button>
          <p className="text-sm text-muted">
            すでにお使いの方は{" "}
            <Link href="/login" className="font-bold text-brand-dark underline">
              ログイン
            </Link>
          </p>
        </form>
      )}
    </LoginStage>
  );
}

/** 2歩目：お支払いの条件の最終確認と、規約への同意 */
export function ConfirmStep({
  nowMs,
  orgName,
  orgFixed,
  email,
  withTrial,
  testMode,
  error,
}: {
  nowMs: number;
  orgName: string;
  orgFixed: boolean;
  email: string;
  withTrial: boolean;
  testMode: boolean;
  error: string | null;
}) {
  const rows = confirmRows(nowMs, withTrial);
  const [agree, setAgree] = useState(false);
  return (
    <LoginStage
      mood="point"
      compact
      title={withTrial ? "最後に、お支払いの条件を確かめてください" : "もう一度お申し込みいただけます"}
      lines={withTrial ? ["請求の日と、解約の締め切りを先にお伝えしますね。", "このあとカードを登録すると、お試しが始まります。"] : ["お試しは一度だけなので、今日から有料になります。", "書いた記事は残っていますよ。"]}
    >
      {testMode && <TestModeNote />}
      <Steps now={2} />
      <form action={goToCheckout} className="card space-y-4 p-6">
        <dl className="divide-y divide-line rounded-2xl border-2 border-line text-sm sm:text-base">
          <div className="grid grid-cols-[6.5rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-muted">会社名</dt>
            <dd>
              {orgFixed ? (
                <b>{orgName}</b>
              ) : (
                <input name="orgName" required maxLength={ORG_NAME_MAX} defaultValue={orgName} aria-label="会社名（屋号）" className="field min-h-10 py-1" />
              )}
            </dd>
          </div>
          <div className="grid grid-cols-[6.5rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-muted">メール</dt>
            <dd className="break-all">{email}</dd>
          </div>
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2 px-3 py-2.5 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold text-muted">{k}</dt>
              <dd className={k === "解約の締め切り" || k === "初回の請求" ? "font-black" : ""}>{v}</dd>
            </div>
          ))}
        </dl>
        <label className="flex items-start gap-3 rounded-2xl bg-sun-soft/50 p-3">
          <input type="checkbox" name="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-6 w-6 shrink-0 accent-brand" />
          <span className="text-sm leading-relaxed">
            <Link href="/terms" target="_blank" className="font-bold text-brand-dark underline">
              利用規約
            </Link>
            と
            <Link href="/privacy" target="_blank" className="font-bold text-brand-dark underline">
              プライバシーポリシー
            </Link>
            、上のお支払いの条件を確かめ、同意します
          </span>
        </label>
        {error && <p className="text-sm font-bold text-danger">{error}</p>}
        <CheckoutButton disabled={!agree} withTrial={withTrial} />
        <p className="text-xs leading-relaxed text-muted">
          カードの登録は、決済会社 Stripe の画面で行います。カード番号はコタムには届きません。{" "}
          <Link href="/tokushoho" target="_blank" className="underline">
            特定商取引法にもとづく表記
          </Link>
        </p>
      </form>
    </LoginStage>
  );
}

function CheckoutButton({ disabled, withTrial }: { disabled: boolean; withTrial: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary min-h-14 w-full text-lg" disabled={disabled || pending}>
      {pending ? "カード登録の画面を開いています…" : withTrial ? "カードを登録して、お試しを始める →" : "カードを登録して、申し込む →"}
    </button>
  );
}

/** いまどこか（3つの歩み） */
function Steps({ now }: { now: number }) {
  const steps = ["会社とメール", "メールの番号", "条件の確認とカード"];
  return (
    <ol className="flex gap-1.5 text-xs font-bold sm:text-sm" aria-label="申し込みの流れ">
      {steps.map((s, i) => (
        <li
          key={s}
          aria-current={i === now ? "step" : undefined}
          className={`flex flex-1 items-center gap-1.5 rounded-full px-2.5 py-1.5 ${i < now ? "bg-ok-soft text-ok" : i === now ? "bg-brand text-white" : "bg-canvas text-muted"}`}
        >
          <span aria-hidden>{i < now ? "✓" : i + 1}</span>
          <span className="truncate">{s}</span>
        </li>
      ))}
    </ol>
  );
}
