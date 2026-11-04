// 会社の名前（社名）の決まり。マイページで顧客担当者が直す。

export const ORG_NAME_MAX = 60;

/** 前後の空白と、続く空白をまとめる。使えない名前なら null */
export function normalizeOrgName(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const name = input.replace(/[\s　]+/g, " ").trim();
  if (name.length < 1 || name.length > ORG_NAME_MAX) return null;
  // 改行・制御文字やURLは社名に入れない
  if (/[\u0000-\u001f<>]/.test(name) || /https?:\/\//i.test(name)) return null;
  return name;
}
