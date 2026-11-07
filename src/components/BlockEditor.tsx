"use client";

import { useState } from "react";
import type { Block } from "@/types/domain";
import { VoiceInput } from "@/components/VoiceInput";
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

/**
 * 本文の編集。最初は「読む形」で、読みながら気になる段落を押すと、そこだけ直せる（2026-11-07 3AIの検討）。
 * 「まとめて直す」では全部の段落が入力欄になる。段落を選んで「短くする」「伝わりやすくする」を適用し、変更案を確認してから採用する
 */
export function BlockEditor({ blocks, onChange, readOnly }: { blocks: Block[]; onChange: (b: Block[]) => void; readOnly: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [mode, setMode] = useState<"read" | "all">("read");

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

  const modeSwitch = (
    <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="本文の直し方">
      <button type="button" role="tab" aria-selected={mode === "read"} className={mode === "read" ? "btn-primary min-h-11 text-sm" : "btn-secondary min-h-11 text-sm"} onClick={() => { setMode("read"); setSuggestion(null); }}>
        📖 読みながら直す
      </button>
      <button type="button" role="tab" aria-selected={mode === "all"} className={mode === "all" ? "btn-primary min-h-11 text-sm" : "btn-secondary min-h-11 text-sm"} onClick={() => { setMode("all"); setSuggestion(null); }}>
        ✏️ まとめて直す
      </button>
    </div>
  );

  const suggestionBox = suggestion && (
    <SuggestionBox
      suggestion={suggestion}
      onAdopt={() => {
        update(suggestion.index, withText(blocks[suggestion.index], suggestion.after));
        setSuggestion(null);
      }}
      onCancel={() => setSuggestion(null)}
    />
  );

  if (mode === "read") {
    return (
      <div className="space-y-3">
        {modeSwitch}
        <p className="rounded-2xl bg-sun-soft px-3 py-2 text-sm font-bold">読んでみて、気になる所を押すと、そこだけ直せます。</p>
        <div className="space-y-2">
          {blocks.map((b, i) =>
            selected === i ? (
              <div key={i} className="animate-pop space-y-2 rounded-2xl border-2 border-brand bg-brand-soft/40 p-3">
                {b.type === "heading" ? (
                  <input aria-label="見出し" className="field text-lg font-bold" autoFocus value={b.text} onChange={(e) => update(i, { ...b, text: e.target.value })} />
                ) : (
                  <>
                    <textarea
                      aria-label={b.type === "list" ? "箇条書き（1行に1項目）" : "段落"}
                      className="field"
                      autoFocus
                      rows={Math.max(3, Math.ceil(blockText(b).length / 32), b.type === "list" ? b.items.length : 0)}
                      value={blockText(b)}
                      onChange={(e) => update(i, withText(b, e.target.value))}
                    />
                    <VoiceInput onText={(t) => update(i, withText(b, `${blockText(b)}${blockText(b) ? "。" : ""}${t}`))} />
                  </>
                )}
                {suggestionBox}
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn-primary min-h-11" onClick={() => { setSelected(null); setSuggestion(null); }}>
                    直した ✓
                  </button>
                  {b.type !== "heading" && (
                    <>
                      <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" onClick={() => suggest("短くする")}>
                        短くする
                      </button>
                      <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" onClick={() => suggest("伝わりやすくする")}>
                        伝わりやすくする
                      </button>
                    </>
                  )}
                  <span className="ml-auto flex gap-3 text-xs">
                    <button type="button" className="text-brand-dark underline" onClick={() => { addParagraph(i); setSelected(i + 1); setSuggestion(null); }}>
                      下に段落を追加
                    </button>
                    <button type="button" className="text-danger underline" onClick={() => remove(i)}>
                      削除
                    </button>
                  </span>
                </div>
              </div>
            ) : (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}番目の${b.type === "heading" ? "見出し" : "段落"}を直す`}
                className="group relative block w-full rounded-2xl border-2 border-transparent px-2 py-1 text-left transition-colors hover:border-brand/40 hover:bg-brand-soft/30 focus-visible:border-brand"
                onClick={() => { setSelected(i); setSuggestion(null); }}
              >
                <BlockView block={b} />
                <span aria-hidden className="absolute right-2 top-1 rounded-full bg-surface px-2 text-xs font-bold text-brand opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  ✏️ 直す
                </span>
              </button>
            ),
          )}
        </div>
        {blocks.length === 0 && (
          <button type="button" className="btn-secondary" onClick={() => { onChange([{ type: "paragraph", text: "" }]); setSelected(0); }}>
            段落を追加
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modeSwitch}
      <div className="sticky top-2 z-10 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface/95 p-2 shadow-[0_4px_0_var(--color-line)] backdrop-blur" role="toolbar" aria-label="選んだ段落の書き直し">
        <span className="text-sm text-muted">{selected === null ? "段落を選ぶと書き直しの提案を出せます" : `${selected + 1}番目を選択中`}</span>
        <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" disabled={selected === null || blocks[selected]?.type === "heading"} onClick={() => suggest("短くする")}>
          短くする
        </button>
        <button type="button" className="btn-secondary min-h-9 px-3 py-1 text-sm" disabled={selected === null || blocks[selected]?.type === "heading"} onClick={() => suggest("伝わりやすくする")}>
          伝わりやすくする
        </button>
      </div>

      {suggestionBox}

      {blocks.map((b, i) => {
        const id = `block-${i}`;
        const label = b.type === "heading" ? "見出し" : b.type === "list" ? "箇条書き（1行に1項目）" : "段落";
        return (
          <div
            key={i}
            className={`group rounded-2xl border-2 p-2 transition-colors ${selected === i ? "border-brand bg-brand-soft/40" : "border-transparent hover:border-line"}`}
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

function SuggestionBox({ suggestion, onAdopt, onCancel }: { suggestion: Suggestion; onAdopt: () => void; onCancel: () => void }) {
  return (
    <div className="animate-pop rounded-2xl border-2 border-brand bg-brand-soft p-3" role="region" aria-label="変更案">
      <p className="mb-2 font-semibold">「{suggestion.kind}」の変更案（サンプル）</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">いまの文章</p>
          <p className="rounded-xl bg-surface p-2 line-through decoration-danger/60">{suggestion.before}</p>
        </div>
        <div>
          <p className="text-sm text-muted">変更案</p>
          <p className="rounded-xl bg-surface p-2">{suggestion.after}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary" onClick={onAdopt}>
          採用する
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          やめる
        </button>
      </div>
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
