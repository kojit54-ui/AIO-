"use client";

import { useState } from "react";

/** 文をそのままコピーするボタン（開発の担当への報告など） */
export function CopyText({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="mt-1 rounded-full border border-line px-3 py-0.5 text-xs font-bold text-brand-dark hover:bg-brand-soft"
      onClick={() => navigator.clipboard.writeText(text).then(() => setDone(true), () => setDone(false))}
    >
      {done ? "コピーしました" : label}
    </button>
  );
}
