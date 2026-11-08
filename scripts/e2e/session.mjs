// 自動テスト用：テスト専用アカウント（本番の「テスト製作所（自動テスト用）」）でログインし、ブラウザのクッキーを作る。
// パスワードは環境変数 E2E_PASSWORD で渡す（コード・Gitに書かない）。
import { createServerClient } from "@supabase/ssr";

export async function loginCookies({ url, anon, email, password, domain }) {
  const jar = [];
  const sb = createServerClient(url, anon, {
    cookies: {
      getAll: () => jar.map(({ name, value }) => ({ name, value })),
      setAll: (list) => {
        for (const c of list) {
          const i = jar.findIndex((x) => x.name === c.name);
          if (i >= 0) jar.splice(i, 1);
          if (c.value) jar.push({ name: c.name, value: c.value });
        }
      },
    },
  });
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`login failed: ${error.message}`);
  return jar.map((c) => ({ ...c, domain, path: "/", httpOnly: false, secure: true, sameSite: "Lax" }));
}
