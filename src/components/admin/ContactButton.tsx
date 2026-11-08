"use client";

// 担当のトップの「声をかけた」記録（/api/admin/contacts）。押すとひとこと欄が開き、残すと最後に声をかけた日が変わる。

import { useState } from "react";
import { formatDate } from "@/components/ui";

export type LastContact = { at: string; note: string } | null;

export function ContactButton({ organizationId, last, onSaved }: { organizationId: string; last: LastContact; onSaved: (c: LastContact) => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState<{ at: string; note: string }[] | null>(null);
  const loadHistory = () => {
    if (history) return;
    fetch(`/api/admin/contacts?org=${organizationId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { history?: { at: string; note: string }[] } | null) => setHistory(j?.history ?? []))
      .catch(() => setHistory([]));
  };
  const save = async () => {
    setBusy(true);
    setError(false);
    const r = await fetch("/api/admin/contacts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ organizationId, note }) }).catch(() => null);
    const j = r?.ok ? ((await r.json()) as { lastContact: LastContact }) : null;
    setBusy(false);
    if (!j) return setError(true);
    onSaved(j.lastContact);
    setHistory(null);
    setNote("");
    setOpen(false);
  };
  return (
    <div className="space-y-1 text-sm">
      <p className={last ? "text-muted" : "font-bold text-warn"}>
        {last ? `前に声をかけた日：${formatDate(last.at)}${last.note ? `「${last.note}」` : ""}` : "まだ声をかけていません"}
      </p>
      {last && (
        <details onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && loadHistory()}>
          <summary className="cursor-pointer text-xs font-bold text-brand-dark">これまでの記録を見る</summary>
          {history === null ? (
            <p className="text-xs text-muted">読んでいます…</p>
          ) : (
            <ul className="mt-1 space-y-0.5 text-xs text-muted">
              {history.map((h) => (
                <li key={h.at}>
                  {formatDate(h.at)}
                  {h.note ? `「${h.note}」` : ""}
                </li>
              ))}
            </ul>
          )}
        </details>
      )}
      {open ? (
        <div className="flex flex-wrap items-center gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="ひとこと（任意）例）電話。来週書くとのこと" className="field min-h-9 flex-1 py-1" aria-label="声をかけたときのひとこと" />
          <button type="button" className="btn-primary min-h-9 px-3 py-1" disabled={busy} onClick={save}>
            {busy ? "残しています…" : "残す"}
          </button>
          <button type="button" className="font-semibold text-muted underline" onClick={() => setOpen(false)}>
            やめる
          </button>
          {error && <span className="w-full text-danger">残せませんでした。時間をおいて、もう一度押してください。</span>}
        </div>
      ) : (
        <button type="button" className="btn-secondary min-h-9 px-3 py-1" onClick={() => setOpen(true)}>
          声をかけたら記録する
        </button>
      )}
    </div>
  );
}
