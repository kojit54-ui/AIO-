// 書き出し。本文は構造化ブロックで持ち、HTMLは書き出し時に生成する。
// 生成するタグは h2 / h3 / p / ul / ol / li だけ。文字列はすべてエスケープする。

import type { Block } from "@/types/domain";

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return `<h${b.level}>${escapeHtml(b.text)}</h${b.level}>`;
        case "paragraph":
          return `<p>${escapeHtml(b.text)}</p>`;
        case "list": {
          const tag = b.ordered ? "ol" : "ul";
          const items = b.items.map((i) => `  <li>${escapeHtml(i)}</li>`).join("\n");
          return `<${tag}>\n${items}\n</${tag}>`;
        }
      }
    })
    .join("\n");
}

export function blocksToPlainText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
          return b.text;
        case "paragraph":
          return b.text;
        case "list":
          return b.items.map((i, n) => (b.ordered ? `${n + 1}. ${i}` : `・${i}`)).join("\n");
      }
    })
    .join("\n\n");
}
