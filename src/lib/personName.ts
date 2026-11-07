// 担当者の名前（マイページで本人が直す。しおり通信や画面の「〇〇さん」に使う）

export const PERSON_NAME_MAX = 30;

/** 前後の空白と、続く空白をまとめる。使えない名前なら null */
export function normalizePersonName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input.replace(/[\s　]+/g, " ").trim().replace(/\s*さん$/, "");
  if (name.length < 1 || name.length > PERSON_NAME_MAX) return null;
  if (/[\u0000-\u001f<>@]/.test(name) || /https?:\/\//i.test(name)) return null;
  return name;
}
