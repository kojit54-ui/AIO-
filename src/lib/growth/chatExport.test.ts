import { deflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { parseChatExport, readChatExportFile, relevance, relevanceWords, threadsToImportText } from "./chatExport";

const CHATGPT = [
  {
    id: "c1",
    title: "内窓の見積もり",
    create_time: 1761900000,
    mapping: {
      a: { message: { author: { role: "system" }, content: { parts: ["sys"] }, create_time: 1 } },
      b: { message: { author: { role: "assistant" }, content: { parts: ["答えです"] }, create_time: 3 } },
      c: { message: { author: { role: "user" }, content: { parts: ["うちは札幌で内窓をやっています"] }, create_time: 2 } },
      d: { message: null },
    },
  },
];
const CLAUDE = [
  { uuid: "u1", name: "夕飯の献立", created_at: "2026-10-01T00:00:00Z", chat_messages: [{ sender: "human", text: "今日の夕飯" }, { sender: "assistant", content: [{ type: "text", text: "カレー" }] }] },
  { uuid: "u2", name: "ブログの相談", created_at: "2026-10-05T00:00:00Z", chat_messages: [{ sender: "human", text: "浴室の断熱の記事を書きたい" }] },
];
const GEMINI = [
  { header: "Gemini Apps", title: "Prompted 内窓の結露について", time: "2026-10-02T03:00:00Z", safeHtmlItem: [{ html: "<p>結露は&amp;減ります</p>" }] },
  { header: "Gemini Apps", title: "Prompted 価格の目安", time: "2026-10-02T01:00:00Z" },
  { header: "YouTube", title: "Watched x", time: "2026-10-02T00:00:00Z" },
];

/** 最小の zip（1ファイル、deflate）を作る */
function zip(name: string, text: string): ArrayBuffer {
  const nameBuf = Buffer.from(name);
  const data = deflateRawSync(Buffer.from(text));
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(8, 8);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt16LE(nameBuf.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(8, 10);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt32LE(0, 42);
  const cdStart = local.length + nameBuf.length + data.length;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(central.length + nameBuf.length, 12);
  end.writeUInt32LE(cdStart, 16);
  const all = Buffer.concat([local, nameBuf, data, central, nameBuf, end]);
  return all.buffer.slice(all.byteOffset, all.byteOffset + all.byteLength);
}

describe("書き出しファイルを読む", () => {
  it("ChatGPT：発言の順に並べ、システムの発言は外す", () => {
    const [t] = parseChatExport(JSON.stringify(CHATGPT));
    expect(t.source).toBe("chatgpt");
    expect(t.title).toBe("内窓の見積もり");
    expect(t.messages).toEqual([
      { role: "user", text: "うちは札幌で内窓をやっています" },
      { role: "ai", text: "答えです" },
    ]);
  });

  it("Claude：新しい会話が先", () => {
    const list = parseChatExport(JSON.stringify(CLAUDE));
    expect(list.map((t) => t.title)).toEqual(["ブログの相談", "夕飯の献立"]);
    expect(list[1].messages[1]).toEqual({ role: "ai", text: "カレー" });
  });

  it("Gemini：Gemini の記録だけを、日ごとに1つの会話にまとめる", () => {
    const [t, ...rest] = parseChatExport(JSON.stringify(GEMINI));
    expect(rest).toHaveLength(0);
    expect(t.source).toBe("gemini");
    expect(t.messages.map((m) => m.text)).toEqual(["価格の目安", "内窓の結露について", "結露は&減ります"]);
  });

  it("知らない形や壊れたファイルは空", () => {
    expect(parseChatExport("{}")).toEqual([]);
    expect(parseChatExport("not json")).toEqual([]);
    expect(parseChatExport(JSON.stringify([{ foo: 1 }]))).toEqual([]);
  });

  it("zip の中の conversations.json を開く", async () => {
    const buf = zip("conversations.json", JSON.stringify(CLAUDE));
    const list = await readChatExportFile({ name: "data-2026.zip", arrayBuffer: async () => buf });
    expect(list).toHaveLength(2);
  });
});

describe("会社に関係する会話を選ぶ", () => {
  it("会社のことの言葉が、題名やお客様の発言に出る会話ほど高い", () => {
    const words = relevanceWords(["例：内窓、浴室の断熱", "札幌市"]);
    expect(words).toContain("内窓");
    const [blog, dinner] = parseChatExport(JSON.stringify(CLAUDE));
    expect(relevance(blog, words)).toBeGreaterThan(relevance(dinner, words));
  });

  it("しおりに渡す文は上限に収め、お客様の発言を残す", () => {
    const long = parseChatExport(JSON.stringify(Array.from({ length: 30 }, (_, i) => ({ uuid: `u${i}`, name: `会話${i}`, created_at: "2026-10-01T00:00:00Z", chat_messages: [{ sender: "human", text: "あ".repeat(2000) }, { sender: "assistant", text: "い".repeat(2000) }] }))));
    const text = threadsToImportText(long, 12000);
    expect(Array.from(text).length).toBeLessThanOrEqual(12000);
    expect(text).toContain("【会話：会話0（Claude）】");
    expect(text).toContain("お客様：あ");
  });
});
