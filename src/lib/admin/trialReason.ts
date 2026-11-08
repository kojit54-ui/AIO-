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

/** 「unavailable_400」「unavailable_400:invalid_request_error」のような理由を、見出しと補足に分ける */
export function trialReason(code: string): {
  label: string;
  detail: string | null;
} {
  const m = /^([a-z_]+?)_(\d{3})(?::(.+))?$/.exec(code);
  if (m && REASON[m[1]]) {
    const status = m[2];
    const hint =
      STATUS_HINT[status] ??
      (status.startsWith("5")
        ? "AIの提供元で不具合が起きていた"
        : REASON[m[1]]);
    return {
      label: hint,
      detail: `技術的な記録：${status}${m[3] ? ` ${m[3]}` : ""}`,
    };
  }
  return {
    label: REASON[code] ?? "そのほかの失敗",
    detail: REASON[code] ? null : `技術的な記録：${code}`,
  };
}
