// 30秒でためすで、見本に切り替えた理由の言葉（/admin/trial）。
// 2026-11-08 管理者役の採点「エラーがプログラム用語のままで原因がわからない」を受け、
// 状態コードは人の言葉にし、細かいコードは小さく添える。

export const REASON: Record<string, string> = {
  number: "入力にない数字が入っていた",
  boast: "大げさな言葉が入っていた",
  link: "URLが入っていた",
  format: "答えの形が違った",
  off_topic: "仕事の話でなかった",
  timeout: "時間切れ",
  provider_error: "AIの失敗",
  auth: "AIのキーが正しくない",
  billing: "AIの提供元の残高が足りない",
  rate_limited: "AIの利用上限",
  refused: "AIが断った",
  truncated: "AIの答えが途中で切れた",
  unavailable: "AIにつながらなかった",
  parse: "答えの形が違った",
  other: "そのほかの失敗",
  disabled: "止めている",
  visitor_limit: "1人1日の上限",
  daily_limit: "全体の1日の上限",
  budget_exceeded: "月の予算の上限",
};

/** 「unavailable_400」「unavailable_400:invalid_value:model」のように状態コード付きの理由も読めるように */

/** 状態コードごとの、管理者に向けた言い方とやること */
const STATUS_HINT: Record<string, string> = {
  "400": "AIへの頼み方が合わなかった（設定の見直しが要ります）",
  "401": "AIのキーが使えなかった",
  "403": "AIのキーに権限がなかった",
  "404": "AIのモデルが見つからなかった（設定の見直しが要ります）",
  "408": "AIの返事が時間切れになった",
  "429": "AIが混んでいたか、利用上限に着いた",
};

/** 理由ごとに、管理者が次にすること（2026-11-08 管理者役の採点「次の行動が分からない」） */
const NEXT: Record<string, string> = {
  dev: "開発の担当に、この記録を伝えてください。お客様の画面は見本で最後まで動くので、急ぎません。",
  key: "VercelのAIのキーが正しいか、開発の担当に確かめてもらってください。",
  billing: "AIの提供元の管理画面で、残高を足してください。",
  wait: "しばらくすると戻ります。何度も続くときは開発の担当に伝えてください。",
  limit: "下の「上限を変える」で変えられます。",
  input: "ためした人の入力が理由です。対応はいりません。",
};
const NEXT_BY_CODE: Record<string, keyof typeof NEXT> = {
  number: "input", boast: "input", link: "input", off_topic: "input",
  format: "dev", parse: "dev", refused: "dev", truncated: "dev", other: "dev",
  timeout: "wait", provider_error: "wait", rate_limited: "wait", unavailable: "wait",
  auth: "key", billing: "billing",
  visitor_limit: "limit", daily_limit: "limit", budget_exceeded: "limit",
};
const NEXT_BY_STATUS: Record<string, keyof typeof NEXT> = { "400": "dev", "404": "dev", "401": "key", "403": "key", "408": "wait", "429": "wait" };

/** 「unavailable_400」「unavailable_400:invalid_request_error」のような理由を、見出しと補足とやることに分ける */
export function trialReason(code: string): {
  label: string;
  detail: string | null;
  next: string | null;
} {
  const m = /^([a-z_]+?)_(\d{3})(?::(.+))?$/.exec(code);
  if (m && REASON[m[1]]) {
    const status = m[2];
    const hint =
      STATUS_HINT[status] ??
      (status.startsWith("5")
        ? "AIの提供元で不具合が起きていた"
        : REASON[m[1]]);
    const key = NEXT_BY_STATUS[status] ?? (status.startsWith("5") ? "wait" : NEXT_BY_CODE[m[1]]);
    return {
      label: hint,
      detail: `技術的な記録：${status}${m[3] ? ` ${m[3]}` : ""}`,
      next: key ? NEXT[key] : null,
    };
  }
  const key = REASON[code] ? NEXT_BY_CODE[code] : "dev";
  return {
    label: REASON[code] ?? "そのほかの失敗",
    detail: REASON[code] ? null : `技術的な記録：${code}`,
    next: key ? NEXT[key] : null,
  };
}
