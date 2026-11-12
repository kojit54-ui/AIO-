"use client";

// 記事の質問「選ばれた決め手」の下に出す（2026-11-12）。
// ①強みの帳面にある決め手から選べる ②答えた決め手を帳面に足せる。事例の核を1本ずつ帳面にためると、次の記事からAIが使う（docs/AIO.md「選ばれる決め手」）。

import Link from "next/link";
import { useEffect, useState } from "react";
import { WIN_GOAL, hasWin, type StrengthBook } from "@/lib/strength/book";
import { addWinToBook, loadBook } from "@/lib/strength/browser";

export function WinHelper({ remote, orgId, answer, onPick }: { remote: boolean; orgId: string | null; answer: string; onPick: (win: string) => void }) {
  const [book, setBook] = useState<StrengthBook | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    loadBook(remote, orgId)
      .then((s) => alive && setBook(s?.book ?? null))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [remote, orgId]);

  const text = answer.trim();
  const wins = book?.wins.filter((w) => w.trim()) ?? [];
  const canAdd = !!book && Array.from(text).length >= 8 && !hasWin(book, text);

  async function add() {
    setBusy(true);
    setError("");
    try {
      const saved = await addWinToBook(remote, orgId, text);
      setBook(saved.book);
      const n = saved.book.wins.length;
      setMessage(n >= WIN_GOAL ? `帳面に足しました（決め手${n}つ）。次の記事から、AIがこの決め手を使って書きます。` : `帳面に足しました（決め手${n}つ。目安は${WIN_GOAL}つ）。次の記事から、AIがこの決め手を使って書きます。`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "帳面に足せませんでした");
    }
    setBusy(false);
  }

  if (!book) return null;
  return (
    <div className="space-y-2 rounded-2xl border-2 border-dashed border-brand-soft px-4 py-3 text-[0.95rem]">
      {wins.length > 0 && (
        <div>
          <p className="font-bold">強みの帳面にためた決め手（この記事に合うものを押すと、答えに入ります）</p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {wins.map((w) => {
              const used = hasWin({ ...book, wins: answer.split("\n") }, w);
              return (
                <li key={w}>
                  <button type="button" disabled={used} className="rounded-full bg-canvas px-3 py-1.5 text-left text-sm hover:bg-brand-soft disabled:cursor-default disabled:text-muted disabled:hover:bg-canvas" onClick={() => onPick(w)}>
                    {used ? `✓ ${w}（答えに入っています）` : w}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {canAdd && !message && (
        <p className="flex flex-wrap items-center gap-2">
          <span className="text-muted">この決め手は、ほかの記事でも使えます。</span>
          <button type="button" className="btn-secondary min-h-10 px-4 text-sm" disabled={busy} onClick={add}>
            {busy ? "足しています…" : "強みの帳面に足す"}
          </button>
        </p>
      )}
      {message && (
        <p role="status" className="animate-pop rounded-xl bg-ok-soft px-3 py-2 font-bold">
          {message}{" "}
          <Link href="/prototype/strengths" className="font-normal text-brand-dark underline">
            帳面を見る
          </Link>
        </p>
      )}
      {error && <p className="font-bold text-danger">{error}</p>}
      {wins.length === 0 && !canAdd && <p className="text-muted">答えた決め手は「強みの帳面」に足せます。ためていくと、次の記事からAIが使います。</p>}
    </div>
  );
}
