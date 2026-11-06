// メールに書いた6桁の番号でログイン（docs/TASKS.md T6-8）。
// 番号は Supabase が作る（メールの文面の {{ .Token }}）。リンクがスマホでうまく開けない人や、
// 別の端末でメールを読む人のため。番号の入力欄は NEXT_PUBLIC_LOGIN_CODE=on のときだけ出す
// （Supabase のメールの文面に番号を足してから on にする。docs/SUPABASE_SETUP.md）

export function isLoginCodeEnabled(value: string | undefined = process.env.NEXT_PUBLIC_LOGIN_CODE): boolean {
  return value?.trim().toLowerCase() === "on";
}

/** 全角の数字・すきま・ハイフンを直して、6〜8桁の数字だけを返す。形がちがえば null */
export function normalizeLoginCode(raw: string): string | null {
  const half = raw.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/[\s\-ー－]/g, "");
  return /^\d{6,8}$/.test(half) ? half : null;
}
