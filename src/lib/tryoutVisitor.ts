// 30秒でためすの、ためした人の目印（サーバー側だけで使う）。回数を数えるためだけに使い、元の IP は残さない。

import { createHash } from "node:crypto";

/**
 * 元に戻せない目印。IP を、サーバーの秘密といっしょにハッシュする。
 * ブラウザの種類（User-Agent）は入れない：書きかえるだけで別の人になれてしまうため
 */
export function visitorId(headers: Headers, salt = process.env.TRIAL_SALT?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY || ""): string {
  // Vercel が付ける x-real-ip を先に見る
  const ip = headers.get("x-real-ip")?.trim() || (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  return createHash("sha256").update(`${ip}|${salt}`).digest("hex");
}
