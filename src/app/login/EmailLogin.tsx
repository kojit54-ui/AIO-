"use client";

import { useActionState } from "react";
import { Scene } from "@/components/fun";
import { Notice } from "@/components/ui";
import { type LoginState, sendLoginLink } from "./actions";

export function EmailLogin({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendLoginLink, { sent: false });

  return (
    <main className="page max-w-xl space-y-4">
      <div className="flex animate-rise items-end gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-black sm:text-3xl">ようこそ</h1>
          <p className="text-muted">コタムといっしょに、AIに紹介される記事を書きましょう。</p>
        </div>
        <Scene point="experience" className="h-24 w-32 shrink-0" />
      </div>
      {linkError && (
        <Notice tone="warn" title="ログイン用のリンクが使えませんでした">
          有効期限が切れたか、すでに使われています。もう一度メールを送ってください。
        </Notice>
      )}
      {state.sent ? (
        <Notice tone="ok" title="ログイン用のメールを送りました">
          招待されたメールアドレスであれば、数分以内にメールが届きます。このブラウザで、メールのリンクを開いてください。
        </Notice>
      ) : (
        <form action={action} className="card space-y-3">
          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="field-label">メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" className="field" />
          </label>
          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? "送信中…" : "ログイン用のメールを送る"}
          </button>
          <p className="text-sm text-muted">パスワードはありません。招待されたメールアドレスに、ログイン用のリンクを送ります。</p>
        </form>
      )}
    </main>
  );
}
