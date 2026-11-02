"use client";

// 会話の記録をまるごと取り込む（ChatGPT・Claude・Gemini の書き出しファイルから。docs/DECISIONS.md 2026-11-03）。
// ファイルはこの画面の中だけで開き、会社に関係ありそうな会話に先に印を付ける。しおりに送るのは、お客様が選んだ会話の文だけ。

import { useMemo, useState } from "react";
import { type ChatThread, SOURCE_LABEL, readChatExportFile, relevance, relevanceWords, threadsToImportText } from "@/lib/growth/chatExport";

const HOW_TO = [
  { name: "ChatGPT", steps: "左下の名前 →「設定」→「データコントロール」→「データをエクスポートする」。届いたメールのリンクから zip を保存", url: "https://chatgpt.com/#settings/DataControls" },
  { name: "Claude", steps: "左下の名前 →「設定」→「プライバシー」→「データをエクスポート」。届いたメールのリンクから zip を保存", url: "https://claude.ai/settings/data-privacy-controls" },
  { name: "Gemini", steps: "Google データ エクスポートで「選択をすべて解除」→「マイアクティビティ」だけ選び、「Gemini アプリ」だけ・形式は JSON にして書き出し。zip を保存", url: "https://takeout.google.com/" },
];
/** 先に印を付ける会話の数 */
const PRESELECT = 10;

export function ChatExportImport({ hints, busy, onRead }: { hints: string[]; busy: boolean; onRead: (text: string) => void }) {
  const [threads, setThreads] = useState<(ChatThread & { score: number; on: boolean })[] | null>(null);
  const [opening, setOpening] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const words = useMemo(() => relevanceWords(hints), [hints]);

  async function open(file: File | undefined) {
    if (!file) return;
    setOpening(true);
    setProblem(null);
    try {
      const list = await readChatExportFile(file);
      if (!list.length) {
        setThreads(null);
        setProblem("会話が見つかりませんでした。各AIの「データのエクスポート」で届いた zip ファイルを、そのまま選んでください");
      } else {
        const scored = list.map((t) => ({ ...t, score: relevance(t, words) })).sort((a, b) => b.score - a.score || b.createdAt.localeCompare(a.createdAt));
        setThreads(scored.map((t, i) => ({ ...t, on: t.score > 0 && i < PRESELECT })));
      }
    } catch {
      setProblem("ファイルを開けませんでした。zip のまま選んでください");
    }
    setOpening(false);
  }

  const shown = (threads ?? []).filter((t) => !filter.trim() || t.title.includes(filter.trim()) || t.messages.some((m) => m.role === "user" && m.text.includes(filter.trim())));
  const chosen = (threads ?? []).filter((t) => t.on);
  const toggle = (id: string, on: boolean) => setThreads((threads ?? []).map((t) => (t.id === id ? { ...t, on } : t)));

  return (
    <div className="space-y-3 rounded-2xl border-2 border-dashed border-brand-soft p-4">
      <p className="font-black">会話の記録をまるごと取り込む（ファイルから）</p>
      <p className="text-sm text-muted">各AIの「データのエクスポート」で届くファイルを選ぶと、しおりが会社に関係ありそうな会話を探します。ファイルはこの画面の中だけで開き、送るのはあなたが選んだ会話の文だけです。</p>
      <details className="rounded-2xl bg-canvas p-3 text-sm">
        <summary className="cursor-pointer font-bold text-brand-dark">ファイルの取り出し方（AIごと）</summary>
        <ul className="mt-2 space-y-2">
          {HOW_TO.map((h) => (
            <li key={h.name}>
              <b>{h.name}</b>：{h.steps}
              <a href={h.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-brand-dark underline">
                開く ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">メールが届くまで、数分〜1日ほどかかることがあります。</p>
      </details>
      <label className="btn-secondary inline-flex cursor-pointer">
        {opening ? "開いています…" : "ファイルを選ぶ（zip）"}
        <input type="file" accept=".zip,.json,application/zip,application/json" className="sr-only" disabled={opening} onChange={(e) => open(e.target.files?.[0])} />
      </label>
      {problem && <p className="text-sm text-warn">{problem}</p>}

      {threads && (
        <div className="animate-pop space-y-3">
          <p className="text-sm font-bold">
            {threads.length}件の会話がありました。会社に関係ありそうなものに先に印を付けています（{chosen.length}件を選択中）。
          </p>
          <input className="field" placeholder="例：見積もり（題名とあなたの発言から探します）" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="会話を探す" />
          <ul className="max-h-80 space-y-1 overflow-y-auto rounded-2xl bg-canvas p-2">
            {shown.slice(0, 200).map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-surface p-2">
                  <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand" checked={t.on} onChange={(e) => toggle(t.id, e.target.checked)} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold">{t.title}</span>
                    <span className="block text-xs text-muted">
                      {SOURCE_LABEL[t.source]}・{t.createdAt.slice(0, 10)}・発言{t.messages.filter((m) => m.role === "user").length}回{t.score > 0 ? "・関係ありそう" : ""}
                    </span>
                  </span>
                </label>
              </li>
            ))}
            {shown.length > 200 && <li className="p-2 text-xs text-muted">ほかに{shown.length - 200}件あります。上の欄で探してください。</li>}
          </ul>
          <button type="button" className="btn-primary" disabled={busy || chosen.length === 0} onClick={() => onRead(threadsToImportText(chosen))}>
            選んだ{chosen.length}件を、しおりに読んでもらう
            <span className="inline-block animate-nudge" aria-hidden>
              ✨
            </span>
          </button>
          {chosen.length > 20 && <p className="text-xs text-muted">たくさん選ぶと、1つの会話から読める量が少なくなります。20件くらいまでがおすすめです。</p>}
        </div>
      )}
    </div>
  );
}
