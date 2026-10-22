"use client";

import { useActionState } from "react";
import { Notice } from "@/components/ui";
import { type LoginState, sendLoginLink } from "./actions";

export function EmailLogin({ next, linkError }: { next: string; linkError: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendLoginLink, { sent: false });

  return (
    <main className="page max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">ログイン</h1>
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
