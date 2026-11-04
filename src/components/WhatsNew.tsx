"use client";

// ホームで、まだ見ていない「新しくなったこと」を、しおりが1つずつ伝える（docs/TASKS.md T6-3）。
// 見たかどうかはこのブラウザに覚える（覚えられなくても、毎回出るだけで画面は使える）。

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShioriTalk } from "@/components/talk";
import { UPDATES, unseenUpdates, updateDateLabel, type AppUpdate } from "@/lib/updates";

const KEY = "cotam-updates-seen-v1";

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function writeSeen(id: string) {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    // 覚えられなくても続ける
  }
}

export function WhatsNew() {
  const [items, setItems] = useState<AppUpdate[] | null>(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setItems(unseenUpdates(readSeen())), 0);
    return () => clearTimeout(t);
  }, []);
  if (!items || items.length === 0 || step >= items.length) return null;

  const item = items[step];
  const last = step === items.length - 1;
  const done = () => {
    writeSeen(UPDATES[0].id);
    setStep(items.length);
  };
  return (
    <section className="card animate-rise border-2 border-sun bg-sun-soft/60" aria-label="新しくなったこと">
      <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-sun px-3 py-0.5 text-sm font-black">
        ✨ 新しくなりました
        {items.length > 1 && (
          <span className="font-bold">
            {step + 1} / {items.length}
          </span>
        )}
      </p>
      <ShioriTalk key={item.id} mood="idea" lines={[item.title, item.body]}>
        <div className="flex flex-wrap items-center gap-2">
          {item.href && (
            <Link href={item.href} className="btn-secondary" onClick={last ? done : undefined}>
              {item.linkLabel ?? "見てみる"}
            </Link>
          )}
          <button type="button" className="btn-primary" onClick={() => (last ? done() : setStep(step + 1))}>
            {last ? "わかりました" : "次のお知らせ →"}
          </button>
          {!last && (
            <button type="button" className="text-sm text-muted underline" onClick={done}>
              あとで一覧で見る
            </button>
          )}
        </div>
      </ShioriTalk>
      <p className="mt-2 text-right text-xs text-muted">
        {updateDateLabel(item.date)}・
        <Link href="/updates" className="underline">
          新しくなったことの一覧
        </Link>
      </p>
    </section>
  );
}
