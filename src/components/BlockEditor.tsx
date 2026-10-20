"use client";

import { useState } from "react";
import type { Block } from "@/types/domain";
import { sampleClarify, sampleShorten } from "@/mock/sampleGenerator";

const blockText = (b: Block) => (b.type === "list" ? b.items.join("\n") : b.text);

function withText(b: Block, text: string): Block {
  if (b.type === "list") return { ...b, items: text.split("\n").filter((l) => l.trim() !== "") };
  return { ...b, text };
}

interface Suggestion {
  index: number;
  kind: "短くする" | "伝わりやすくする";
  before: string;
  after: string;
}

/** 本文の編集。段落を選んで「短くする」「伝わりやすくする」を適用し、変更案を確認してから採用する */
export function BlockEditor({ blocks, onChange, readOnly }: { blocks: Block[]; onChange: (b: Block[]) => void; readOnly: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  function update(i: number, b: Block) {
    onChange(blocks.map((x, n) => (n === i ? b : x)));
  }

  function suggest(kind: Suggestion["kind"]) {
    if (selected === null) return;
    const b = blocks[selected];
    const before = blockText(b);
    const after = kind === "短くする" ? sampleShorten(before) : sampleClarify(before);
    setSuggestion({ index: selected, kind, before, after });
  }

  function remove(i: number) {
    onChange(blocks.filter((_, n) => n !== i));
    setSelected(null);
  }

  function addParagraph(after: number) {
    const next = [...blocks];
    next.splice(after + 1, 0, { type: "paragraph", text: "" });
    onChange(next);
  }

  if (readOnly) {
    return (
      <div className="space-y-4">
        {blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-2" role="toolbar" aria-label="選んだ段落の書き直し">
        <span className="text-sm text-muted">{selected === null ? "段落を選ぶと書き直しの提案を出せます" : `第${selected + 1}ブロックを選択中`}</span>
        <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" disabled={selected === null || blocks[selected]?.type === "heading"} onClick={() => suggest("短くする")}>
          短くする
        </button>
        <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" disabled={selected === null || blocks[selected]?.type === "heading"} onClick={() => suggest("伝わりやすくする")}>
          伝わりやすくする
        </button>
      </div>

      {suggestion && (
        <div className="rounded-lg border border-brand bg-brand-soft p-3" role="region" aria-label="変更案">
          <p className="mb-2 font-semibold">「{suggestion.kind}」の変更案（サンプル）</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">いまの文章</p>
              <p className="rounded bg-surface p-2 line-through decoration-danger/60">{suggestion.before}</p>
            </div>
            <div>
              <p className="text-sm text-muted">変更案</p>
              <p className="rounded bg-surface p-2">{suggestion.after}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                update(suggestion.index, withText(blocks[suggestion.index], suggestion.after));
                setSuggestion(null);
              }}
            >
              採用する
            </button>
            <button type="button" className="btn-secondary" onClick={() => setSuggestion(null)}>
              やめる
            </button>
          </div>
        </div>
      )}

      {blocks.map((b, i) => {
        const id = `block-${i}`;
        const label = b.type === "heading" ? "見出し" : b.type === "list" ? "箇条書き（1行に1項目）" : "段落";
        return (
          <div
            key={i}
            className={`group rounded-lg border p-2 ${selected === i ? "border-brand bg-brand-soft/40" : "border-transparent hover:border-line"}`}
            onFocus={() => setSelected(i)}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <label htmlFor={id} className="text-xs text-muted">
                {label}
              </label>
              <span className="flex gap-3 text-xs">
                <button type="button" className="text-brand-dark underline" onClick={() => addParagraph(i)}>
                  下に段落を追加
                </button>
                <button type="button" className="text-danger underline" onClick={() => remove(i)}>
                  削除
                </button>
              </span>
            </div>
            {b.type === "heading" ? (
              <input id={id} className="field text-lg font-bold" value={b.text} onChange={(e) => update(i, { ...b, text: e.target.value })} />
            ) : (
              <textarea
                id={id}
                className="field"
                rows={Math.max(2, Math.ceil(blockText(b).length / 40), b.type === "list" ? b.items.length : 0)}
                value={blockText(b)}
                onChange={(e) => update(i, withText(b, e.target.value))}
              />
            )}
          </div>
        );
      })}
      {blocks.length === 0 && (
        <button type="button" className="btn-secondary" onClick={() => onChange([{ type: "paragraph", text: "" }])}>
          段落を追加
        </button>
      )}
    </div>
  );
}

export function BlockView({ block: b }: { block: Block }) {
  if (b.type === "heading") return <h2 className="pt-2 text-xl font-bold">{b.text}</h2>;
  if (b.type === "paragraph") return <p>{b.text}</p>;
  const List = b.ordered ? "ol" : "ul";
  return (
    <List className={`${b.ordered ? "list-decimal" : "list-disc"} space-y-1 pl-6`}>
      {b.items.map((it, n) => (
        <li key={n}>{it}</li>
      ))}
    </List>
  );
}
