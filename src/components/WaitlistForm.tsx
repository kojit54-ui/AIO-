"use client";

// 新規受付の案内を受け取るフォーム（入口ページ・試すページ）。メールだけを聞く。保存できたら「受け付けました」。
// 失敗したら入力を残して、もう一度送れるようにする。
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { normalizeEmail, type WaitlistSource } from "@/lib/waitlist";

export function WaitlistForm({ source, dark = false }: { source: WaitlistSource; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "invalid">("idle");
  const id = `waitlist-${source}`;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizeEmail(email)) return setState("invalid");
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source, website, startedAt }) });
      setState(res.ok ? "done" : res.status === 400 ? "invalid" : "error");
      // どのページの受付から来たかだけ数える（メールアドレスは送らない）
      if (res.ok) trackEvent("generate_lead", { form: source });
    } catch {
      setState("error");
    }
  };

  if (state === "done")
    return (
      <p className={`border-2 px-4 py-3 font-bold ${dark ? "border-paper/60 text-paper" : "border-sumi bg-white"}`} role="status">
        受け付けました。新規受付を始めるときに、このメールアドレス（{email}）へお知らせします。
      </p>
    );

  return (
    <form onSubmit={send} className="relative space-y-2" noValidate>
      <label htmlFor={id} className={`block text-sm font-bold ${dark ? "text-paper" : ""}`}>
        新規受付が始まったら、お知らせします
      </label>
      {/* ロボットよけ。人には見えない */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
      <div className="flex flex-col gap-2">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "sending") setState("idle");
          }}
          placeholder="例）yamada@example.co.jp"
          className="min-h-12 w-full min-w-0 border-2 border-sumi bg-white px-3 text-base text-sumi placeholder:text-sumi/40 focus:outline-none focus:ring-4 focus:ring-brand-soft"
          aria-invalid={state === "invalid"}
          aria-describedby={`${id}-note`}
        />
        <button type="submit" disabled={state === "sending"} className="btn-primary min-h-12 w-full px-5">
          {state === "sending" ? "送っています…" : "受付開始の案内を受け取る"}
        </button>
      </div>
      <p id={`${id}-note`} className={`text-xs leading-relaxed ${dark ? "text-paper/80" : "text-sumi/70"}`} role={state === "invalid" || state === "error" ? "alert" : undefined}>
        {state === "invalid"
          ? "メールアドレスの形を確かめてください。"
          : state === "error"
            ? "送信できませんでした。時間をおいて、もう一度お試しください。"
            : "メールアドレスだけで受け付けます。この送信で、有料の契約は始まりません。"}
      </p>
    </form>
  );
}
