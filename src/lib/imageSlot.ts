// 記事の画像の枠（article_images.slot）。画面とサーバーで同じ名前を使う。

/** 枠の名前の長さの上限（DBの slot は200字まで） */
export const MAX_SLOT_CHARS = 200;

/** 文字列の短い指紋（FNV-1a、16進8桁）。暗号の用途には使わない */
function fingerprint(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(16).padStart(8, "0");
}

/**
 * 見出しから枠の名前を作る。アイキャッチは "eyecatch"。長い見出しは先頭と指紋にして、上限の中でも見出しごとに別の名前にする。
 * 文字数はDBと同じく1文字（コードポイント）ずつ数え、絵文字などを途中で切らない
 */
export function slotOf(heading: string): string {
  const chars = Array.from(heading);
  return chars.length <= MAX_SLOT_CHARS ? heading : `${chars.slice(0, MAX_SLOT_CHARS - 9).join("")}#${fingerprint(heading)}`;
}
