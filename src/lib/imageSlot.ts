// 記事の画像の枠（article_images.slot）。画面とサーバーで同じ名前を使う。

/** 枠の名前の長さの上限（DBの slot は200字まで） */
export const MAX_SLOT_CHARS = 200;

/** 見出しから枠の名前を作る。アイキャッチは "eyecatch" */
export const slotOf = (heading: string) => heading.slice(0, MAX_SLOT_CHARS);
