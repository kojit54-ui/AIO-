// service role（RLSを通らない管理用の鍵）で Supabase を使う。サーバー側の決まった処理だけで使い、
// 画面のコードから import しない。鍵は SUPABASE_SERVICE_ROLE_KEY（ブラウザに出さない、NEXT_PUBLIC_ を付けない）。

import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

export function createAdminSupabase() {
  const env = getSupabaseEnv();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!env || !key) throw new Error("Supabase service role is not configured");
  if (typeof window !== "undefined") throw new Error("service role must not be used in the browser");
  return createClient(env.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
