"use client";

// 「今売りたいもの」の順位。つまみをドラッグして入れかえる（マウスでも指でも）。
// キーボードや細かい操作がしにくい人のために、▲▼のボタンでも動かせる。

import { useRef, useState } from "react";
import { MAX_SELL_ITEMS, MAX_SELL_NAME, type SellItem, moveItem } from "./keywords";

const MEDALS = ["🥇", "🥈", "🥉"];

export function SellRanking({ items, onChange, onMoved }: { items: SellItem[]; onChange: (items: SellItem[]) => void; onMoved?: (top: SellItem) => void }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const startOrder = useRef<string>("");

  function onPointerDown(e: React.PointerEvent, id: string) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startOrder.current = items.map((x) => x.id).join();
    setDragId(id);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragId || !listRef.current) return;
    const lis = Array.from(listRef.current.children) as HTMLElement[];
    let to = lis.findIndex((li) => {
      const r = li.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    if (to === -1) to = lis.length - 1;
    const from = items.findIndex((x) => x.id === dragId);
    if (to > from) to -= 1;
    if (to !== from) onChange(moveItem(items, from, to));
  }

  function onPointerUp() {
    if (dragId && items.map((x) => x.id).join() !== startOrder.current) onMoved?.(items[0]);
    setDragId(null);
  }

  function move(i: number, d: -1 | 1) {
    const next = moveItem(items, i, i + d);
    onChange(next);
    onMoved?.(next[0]);
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.replace(/\s+/g, " ").trim();
    if (!name) return setError("売りたいものの名前を入れてください。");
    if (items.length >= MAX_SELL_ITEMS) return setError(`売りたいものは${MAX_SELL_ITEMS}個までです。どれかを消してから足してください。`);
    if (name.length > MAX_SELL_NAME) return setError(`名前は${MAX_SELL_NAME}字までにしてください。`);
    if (items.some((x) => x.name.replace(/\s+/g, "") === name.replace(/\s+/g, ""))) return setError("それは、もう入っています。");
    onChange([...items, { id: `sell_${Date.now().toString(36)}`, name }]);
    setDraft("");
    setError(null);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted">まだありません。下から足してください。</p>
      ) : (
        <ol ref={listRef} className="grid gap-2" aria-label="今売りたいもの（上ほど優先）">
          {items.map((x, i) => (
            <li
              key={x.id}
              className={`flex items-center gap-2 rounded-xl border bg-surface px-2 py-2 transition-shadow ${
                dragId === x.id ? "scale-[1.02] border-brand shadow-lg" : "border-line"
              }`}
            >
              <button
                type="button"
                aria-label={`${x.name}をドラッグして順番を入れかえる`}
                className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-xl text-muted hover:bg-canvas active:cursor-grabbing"
                onPointerDown={(e) => onPointerDown(e, x.id)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <span aria-hidden>⠿</span>
              </button>
              <span className="w-8 shrink-0 text-center text-lg font-black" aria-label={`${i + 1}位`}>
                {MEDALS[i] ?? `${i + 1}`}
              </span>
              <span className="min-w-0 flex-1 font-bold">{x.name}</span>
              <span className="flex shrink-0 items-center">
                <button type="button" className="h-9 w-8 rounded-lg text-muted hover:bg-canvas disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${x.name}を上へ`}>
                  ▲
                </button>
                <button
                  type="button"
                  className="h-9 w-8 rounded-lg text-muted hover:bg-canvas disabled:opacity-30"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label={`${x.name}を下へ`}
                >
                  ▼
                </button>
                <button type="button" className="h-9 w-8 rounded-lg text-muted hover:bg-canvas" onClick={() => onChange(items.filter((y) => y.id !== x.id))} aria-label={`${x.name}を消す`}>
                  ×
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <label htmlFor="new-sell" className="sr-only">
          売りたいものを足す
        </label>
        <input
          id="new-sell"
          className="field min-w-[10rem] flex-1"
          placeholder="例：浴室の断熱リフォーム"
          value={draft}
          maxLength={MAX_SELL_NAME}
          onChange={(e) => setDraft(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "sell-error" : undefined}
        />
        <button type="submit" className="btn-secondary">
          足す
        </button>
      </form>
      {error && (
        <p id="sell-error" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
