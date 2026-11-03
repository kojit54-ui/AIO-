"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LoginStage, useGreeting } from "@/components/landing";
import { Notice } from "@/components/ui";
import { type LoginState, sendLoginLink } from "./actions";

export function EmailLogin({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendLoginLink, { sent: false });
  const hello = useGreeting();

  return (
    <LoginStage
      mood={state.sent ? "joy" : "bow"}
      title={state.sent ? "メールを送りました！" : <>{hello}！<br />今日もいっしょに書きましょう</>}
      lines={state.sent ? ["メールのリンクを押したら、すぐ始められますよ。", "待ってますね！"] : ["案内役のしおりです。", "メールアドレスを入れるだけで入れます。パスワードはいりません！"]}
    >
      {linkError && (
        <Notice tone="warn" title="ログイン用のリンクが使えませんでした">
          有効期限が切れたか、すでに使われています。もう一度メールを送ってください。
        </Notice>
      )}
      {state.sent ? <MailSent /> : (
        <form action={action} className="card space-y-4 p-6">
          <input type="hidden" name="next" value={next} />
          <h2 className="text-xl font-black">ログイン</h2>
          <label className="block">
            <span className="field-label">メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" inputMode="email" placeholder="例）tanaka@example.co.jp" className="field min-h-14 text-lg" />
          </label>
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <button type="submit" className="btn-primary min-h-14 w-full text-lg" disabled={pending}>
            {pending ? (
              <>
                <span className="inline-block animate-fly" aria-hidden>
                  ✉️
                </span>
                送っています…
              </>
            ) : (
              <>
                ログイン用のメールを送る
                <span className="inline-block animate-nudge" aria-hidden>
                  →
                </span>
              </>
            )}
          </button>
          <p className="text-sm text-muted">招待されたメールアドレスに、ログイン用のリンクを送ります。</p>
        </form>
      )}
      <p className="text-center text-sm text-muted">
        はじめての方は{" "}
        <Link href="/welcome" className="font-bold text-brand-dark underline">
          どんなサービスか見る
        </Link>
      </p>
    </LoginStage>
  );
}

/** メールを送ったあと。次にやることを1つずつ見せる */
function MailSent() {
  const steps = [
    { icon: "📬", text: "メールを開く", note: "数分で届きます" },
    { icon: "👆", text: "メールの中のリンクを押す", note: "このブラウザで開いてください" },
    { icon: "🎉", text: "ログインできたら、スタート！", note: "" },
  ];
  return (
    <div className="card space-y-4 p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-16 w-16 shrink-0 animate-fly place-items-center rounded-2xl bg-sun-soft text-4xl" aria-hidden>
          ✉️
        </span>
        <p className="font-bold">招待されたメールアドレスであれば、ログイン用のメールが届きます。</p>
      </div>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.text} className="flex animate-rise items-center gap-3 rounded-2xl border-2 border-brand-soft px-3 py-2" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-black text-white">{i + 1}</span>
            <span className="min-w-0 flex-1">
              <b className="block">{s.text}</b>
              {s.note && <span className="block text-sm text-muted">{s.note}</span>}
            </span>
            <span className="text-2xl" aria-hidden>
              {s.icon}
            </span>
          </li>
        ))}
      </ol>
      <details className="rounded-2xl bg-canvas px-4 py-2 text-sm">
        <summary className="cursor-pointer font-bold">メールが届かないときは</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
          <li>迷惑メールのフォルダを見てください</li>
          <li>メールアドレスが、招待されたものと同じか確かめてください</li>
          <li>それでも届かないときは、コタムの担当者にお声がけください</li>
        </ul>
      </details>
    </div>
  );
}
