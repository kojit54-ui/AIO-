"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { LoginStage, useGreeting } from "@/components/landing";
import { Notice } from "@/components/ui";
import type { GoogleLoginError } from "@/lib/auth/google";
import { type CodeState, type LoginState, sendLoginLink, signInWithGoogle, verifyLoginCode } from "./actions";

export function EmailLogin({ next, linkError, googleError = null, googleEnabled = false, codeEnabled = false }: { next: string; linkError: boolean; googleError?: GoogleLoginError | null; googleEnabled?: boolean; codeEnabled?: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(sendLoginLink, { sent: false });
  const hello = useGreeting();

  return (
    <LoginStage
      mood={state.sent ? "joy" : "bow"}
      compact={state.sent && codeEnabled}
      title={state.sent ? "メールを送りました！" : <>{hello}！<br />今日もいっしょに書きましょう</>}
      lines={state.sent ? [codeEnabled ? "メールに届いた6桁の番号を、下に入れてください。" : "メールのリンクを押したら、すぐ始められますよ。", "待ってますね！"] : [codeEnabled ? "メールに届く6桁の番号で入れます。パスワードはいりません！" : "メールに届くリンクで入れます。パスワードはいりません！"]}
    >
      {linkError && (
        <Notice tone="warn" title="ログイン用のリンクが使えませんでした">
          有効期限が切れたか、すでに使われています。もう一度メールを送ってください。
        </Notice>
      )}
      {googleError === "google_not_invited" && (
        <Notice tone="warn" title="このGoogleアカウントでは入れませんでした">
          招待されたメールアドレスと同じGoogleアカウントを選んでください。わからないときは、下のメールでのログインをお使いください。
        </Notice>
      )}
      {googleError === "google_failed" && (
        <Notice tone="warn" title="Googleでのログインがうまくいきませんでした">
          少し待ってから、もう一度お試しください。メールでのログインも使えます。
        </Notice>
      )}
      {state.sent ? <MailSent email={codeEnabled ? state.email : undefined} next={state.next ?? next} /> : (
        <form action={action} className="card space-y-4 p-6">
          <input type="hidden" name="next" value={next} />
          <h2 className="text-xl font-black">
            招待されたメールアドレスで<span className="inline-block">ログイン</span>
          </h2>
          <label className="block">
            <span className="field-label">メールアドレス</span>
            <input name="email" type="email" required autoComplete="email" inputMode="email" defaultValue={state.email} key={state.email ?? ""} placeholder="例）tanaka@example.co.jp" className="field min-h-14 text-lg" />
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
                {codeEnabled ? "6桁の番号をメールで受け取る" : "ログイン用のメールを送る"}
                <span className="inline-block animate-nudge" aria-hidden>
                  →
                </span>
              </>
            )}
          </button>
          <p className="text-sm text-muted">{codeEnabled ? "届いたメールの6桁の番号を、次の画面で入れます。" : "招待されたメールアドレスに、ログイン用のリンクを送ります。"}</p>
        </form>
      )}
      {!state.sent && googleEnabled && <GoogleButton next={next} />}
      <p className="text-center text-sm text-muted">
        はじめての方は{" "}
        <Link href="/welcome" className="font-bold text-brand-dark underline">
          どんなサービスか見る
        </Link>
      </p>
    </LoginStage>
  );
}

/** Googleでログイン。招待されたアドレスの Google アカウントだけ入れる */
function GoogleButton({ next }: { next: string }) {
  return (
    <form action={signInWithGoogle} className="card space-y-3 p-6">
      <input type="hidden" name="next" value={next} />
      <p className="flex items-center gap-3 text-sm font-bold text-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        または、Googleで
        <span className="h-px flex-1 bg-line" />
      </p>
      <GoogleSubmit />
      <p className="text-sm text-muted">招待されたメールアドレスが Gmail などの Google アカウントなら、ボタン1つで入れます。</p>
    </form>
  );
}

function GoogleSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-secondary min-h-14 w-full gap-3 text-lg" disabled={pending}>
      <GoogleMark />
      {pending ? "Googleを開いています…" : "Googleでログイン"}
    </button>
  );
}

/** Google の「G」のしるし（Google のブランドの決まりにそった4色） */
function GoogleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** メールを送ったあと。番号で入れるときは、番号の欄をいちばん上に置く */
function MailSent({ email, next }: { email?: string; next: string }) {
  const retry = (
    <a href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-brand-dark underline">
      メールアドレスを入れ直す
    </a>
  );
  const trouble = (
    <details className="rounded-2xl bg-canvas px-4 py-2 text-sm">
      <summary className="cursor-pointer font-bold">メールが届かないときは</summary>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
        <li>迷惑メールのフォルダを見てください</li>
        <li>メールアドレスが、招待されたものと同じか確かめてください（{retry}）</li>
        <li>それでも届かないときは、コタムの担当者にお声がけください</li>
      </ul>
    </details>
  );
  if (email) {
    return (
      <div className="card space-y-4 p-6">
        <div className="space-y-1">
          <p className="text-sm text-muted">送り先</p>
          <p className="break-all text-lg font-black">{email}</p>
          <p className="text-sm text-muted">
            招待されたアドレスなら、数分で届きます。件名は「AIOえらばれ帳 ログイン用のリンク」。違っていたら {retry}
          </p>
        </div>
        <CodeForm email={email} next={next} />
        <p className="text-sm text-muted">メールの中のリンクを押しても入れます。</p>
        {trouble}
      </div>
    );
  }
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
      {trouble}
    </div>
  );
}

/** メールの6桁の番号を入れる（src/lib/auth/loginCode.ts） */
function CodeForm({ email, next }: { email: string; next: string }) {
  const [state, action, pending] = useActionState<CodeState, FormData>(verifyLoginCode, {});
  // ログインできたら、ページごと読み直して行き先へ（画面の中だけで移ると、ログイン前の状態が残る）
  useEffect(() => {
    if (state.next) window.location.assign(state.next);
  }, [state.next]);
  const busy = pending || Boolean(state.next);
  return (
    <form action={action} className="space-y-2 rounded-2xl border-2 border-sun-soft bg-sun-soft/40 p-4">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="field-label">メールを見たら、この画面に戻って6桁の番号を入れてください</span>
        <input
          name="code"
          required
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={10}
          placeholder="123456"
          className="field min-h-14 text-center text-2xl font-black tracking-[0.4em]"
        />
      </label>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" className="btn-primary min-h-12 w-full" disabled={busy}>
        {busy ? "確かめています…" : "番号でログイン"}
      </button>
    </form>
  );
}
