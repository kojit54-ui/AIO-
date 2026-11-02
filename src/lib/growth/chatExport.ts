// ChatGPT・Claude・Gemini の「書き出し（エクスポート）」ファイルを、ブラウザの中だけで読む（docs/DECISIONS.md 2026-11-03）。
// ファイルそのものはサーバーへ送らない。お客様が選んだ会話の文だけを、今の取り込み（しおりの読み取り）に渡す。
// ChatGPT・Claude：書き出しの zip の中の conversations.json。Gemini：Google データ エクスポート（Takeout）の「Gemini アプリ」の MyActivity.json。

import { MAX_IMPORT_CHARS } from "./aiImport";

export type ChatSource = "chatgpt" | "claude" | "gemini";

export interface ChatThread {
  id: string;
  source: ChatSource;
  title: string;
  createdAt: string;
  messages: { role: "user" | "ai"; text: string }[];
}

export const SOURCE_LABEL: Record<ChatSource, string> = { chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini" };

/** 一度に読む会話の数の上限（とても長い書き出しでも画面が固まらないように） */
export const MAX_THREADS = 2000;

const str = (v: unknown) => (typeof v === "string" ? v : "");
const iso = (v: unknown) => {
  const d = typeof v === "number" ? new Date(v * 1000) : typeof v === "string" ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString() : "";
};
const ENTITIES: Record<string, string> = { "&nbsp;": " ", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&amp;": "&" };
const stripHtml = (s: string) =>
  s
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&(nbsp|lt|gt|quot|#39|amp);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

type GptNode = { message?: { author?: { role?: string }; content?: { parts?: unknown[] }; create_time?: number } };

function fromChatGpt(c: Record<string, unknown>, i: number): ChatThread | null {
  const mapping = c.mapping as Record<string, GptNode> | undefined;
  if (!mapping || typeof mapping !== "object") return null;
  const nodes = Object.values(mapping)
    .map((n) => n?.message)
    .filter((m): m is NonNullable<GptNode["message"]> => !!m && (m.author?.role === "user" || m.author?.role === "assistant"))
    .sort((a, b) => (a.create_time ?? 0) - (b.create_time ?? 0));
  const messages = nodes
    .map((m) => ({
      role: m.author?.role === "user" ? ("user" as const) : ("ai" as const),
      text: (m.content?.parts ?? [])
        .filter((p): p is string => typeof p === "string")
        .join("\n")
        .trim(),
    }))
    .filter((m) => m.text);
  return messages.length ? { id: str(c.id) || `chatgpt-${i}`, source: "chatgpt", title: str(c.title) || "（題名なし）", createdAt: iso(c.create_time), messages } : null;
}

type ClaudeMessage = { sender?: string; text?: string; content?: { type?: string; text?: string }[] };

function fromClaude(c: Record<string, unknown>, i: number): ChatThread | null {
  const list = c.chat_messages as ClaudeMessage[] | undefined;
  if (!Array.isArray(list)) return null;
  const messages = list
    .map((m) => ({
      role: m.sender === "human" ? ("user" as const) : ("ai" as const),
      text: (
        str(m.text) ||
        (m.content ?? [])
          .filter((x) => x.type === "text")
          .map((x) => str(x.text))
          .join("\n")
      ).trim(),
    }))
    .filter((m) => m.text);
  return messages.length ? { id: str(c.uuid) || `claude-${i}`, source: "claude", title: str(c.name) || "（題名なし）", createdAt: iso(c.created_at), messages } : null;
}

/** Gemini の活動の記録は1回のやり取りずつなので、同じ日のものを1つの会話にまとめる */
function fromGemini(items: Record<string, unknown>[]): ChatThread[] {
  const days = new Map<string, ChatThread>();
  // 記録は新しい順なので、古い順に並べ直してから積む
  for (const a of [...items].reverse()) {
    const prompt = str(a.title)
      .replace(/^(Prompted|Asked|プロンプト[:：]?|質問[:：]?)\s*/i, "")
      .trim();
    const answer = Array.isArray(a.safeHtmlItem)
      ? (a.safeHtmlItem as { html?: string }[])
          .map((h) => stripHtml(str(h.html)))
          .join("\n")
          .trim()
      : "";
    if (!prompt && !answer) continue;
    const at = iso(a.time);
    const day = at.slice(0, 10) || "日付なし";
    const t = days.get(day) ?? { id: `gemini-${day}`, source: "gemini" as const, title: "", createdAt: at, messages: [] };
    if (prompt) t.messages.push({ role: "user", text: prompt });
    if (answer) t.messages.push({ role: "ai", text: answer });
    if (!t.title && prompt) t.title = `${day}：${Array.from(prompt).slice(0, 30).join("")}`;
    days.set(day, t);
  }
  return [...days.values()].map((t) => ({ ...t, title: t.title || `${t.id.slice(7)}の会話` }));
}

/** 書き出しの JSON を、会話の一覧にする（新しい順）。形が分からなければ空 */
export function parseChatExport(json: string): ChatThread[] {
  let v: unknown;
  try {
    v = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(v)) return [];
  const items = v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object");
  const first = items[0] ?? {};
  let out: (ChatThread | null)[];
  if ("mapping" in first) out = items.map(fromChatGpt);
  else if ("chat_messages" in first) out = items.map(fromClaude);
  else if ("header" in first || "safeHtmlItem" in first) out = fromGemini(items.filter((a) => /gemini|bard/i.test(str(a.header)) || "safeHtmlItem" in a));
  else return [];
  return out
    .filter((t): t is ChatThread => !!t)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX_THREADS);
}

/** 会社のこと（ヒアリング・会社名）から、探す言葉を作る。区切りで分けた短い言葉と、文の中の漢字・カタカナのまとまり */
const COMMON = new Set(["お客様", "会社", "地域", "サービス", "仕事", "ブログ", "記事", "相談", "対応", "自分"]);
export function relevanceWords(texts: string[]): string[] {
  const split = texts
    .flatMap((t) => t.split(/[\s、。,，・／/「」（）()\n]+/))
    .map((w) => w.replace(/^例[:：]/, "").trim())
    .filter((w) => Array.from(w).length >= 2 && Array.from(w).length <= 12);
  const runs = texts.flatMap((t) => t.match(/[一-鿿々ァ-ヿー]{2,10}/g) ?? []);
  return [...new Set([...split, ...runs])].filter((w) => !COMMON.has(w)).slice(0, 80);
}

/** 会社に関係ありそうな度合い（探す言葉のうち、題名とお客様の発言に出てくるものの数） */
export function relevance(t: ChatThread, words: string[]): number {
  const mine = `${t.title}\n${t.messages
    .filter((m) => m.role === "user")
    .map((m) => m.text)
    .join("\n")}`;
  return words.reduce((n, w) => n + (mine.includes(w) ? 1 : 0), 0);
}

const cut = (s: string, n: number) => (Array.from(s).length > n ? `${Array.from(s).slice(0, n).join("")}…` : s);

/**
 * 選んだ会話を、しおりに渡す文にする。お客様の発言は長めに、AI の返事は短く切る。
 * 全体を MAX_IMPORT_CHARS に収めるよう、会話ごとの長さをそろえる
 */
export function threadsToImportText(threads: ChatThread[], max = MAX_IMPORT_CHARS): string {
  if (!threads.length) return "";
  const per = Math.max(300, Math.floor(max / threads.length) - 40);
  const blocks = threads.map((t) => {
    let left = per;
    const lines: string[] = [];
    for (const m of t.messages) {
      if (left <= 0) break;
      const line = m.role === "user" ? `お客様：${cut(m.text, Math.min(left, 600))}` : `AI：${cut(m.text, Math.min(left, 200))}`;
      lines.push(line);
      left -= Array.from(line).length;
    }
    return `【会話：${cut(t.title, 40)}（${SOURCE_LABEL[t.source]}）】\n${lines.join("\n")}`;
  });
  return Array.from(blocks.join("\n\n")).slice(0, max).join("");
}

/** zip の中から、名前が合う1つのファイルを文字として取り出す（ブラウザと Node の DecompressionStream を使う） */
export async function readZipText(buf: ArrayBuffer, match: (name: string) => boolean): Promise<string | null> {
  const v = new DataView(buf);
  // 末尾の「中央ディレクトリの終わり」を探す
  let eocd = -1;
  for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65_557); i--) {
    if (v.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) return null;
  const count = v.getUint16(eocd + 10, true);
  let p = v.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count && p + 46 <= buf.byteLength; n++) {
    if (v.getUint32(p, true) !== 0x02014b50) return null;
    const method = v.getUint16(p + 10, true);
    const size = v.getUint32(p + 20, true);
    const nameLen = v.getUint16(p + 28, true);
    const extraLen = v.getUint16(p + 30, true);
    const commentLen = v.getUint16(p + 32, true);
    const local = v.getUint32(p + 42, true);
    const name = dec.decode(new Uint8Array(buf, p + 46, nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (!match(name)) continue;
    const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
    const data = new Uint8Array(buf, start, size);
    if (method === 0) return dec.decode(data);
    if (method !== 8) return null;
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return await new Response(stream).text();
  }
  return null;
}

const EXPORT_FILE = (n: string) => /(^|\/)conversations\.json$/i.test(n) || /(^|\/)MyActivity\.json$/i.test(n);

/** 選ばれたファイル（zip か json）を、会話の一覧にする */
export async function readChatExportFile(file: { name: string; arrayBuffer(): Promise<ArrayBuffer> }): Promise<ChatThread[]> {
  const buf = await file.arrayBuffer();
  if (/\.zip$/i.test(file.name)) {
    const text = await readZipText(buf, EXPORT_FILE);
    return text ? parseChatExport(text) : [];
  }
  return parseChatExport(new TextDecoder().decode(buf));
}
