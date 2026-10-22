// サーバー側（Server Component・Server Action・Route Handler）で、ログイン中の利用者として Supabase を使う。
// 権限はDBのRLSで判定される。リクエストごとに作り直す。

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

export async function createServerSupabase() {
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase is not configured");
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component からは書けない。セッションの更新は proxy.ts が行う
        }
      },
    },
  });
}
