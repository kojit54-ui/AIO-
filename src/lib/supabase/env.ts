// Supabase の接続先。NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY が無いあいだは、
// 画面はブラウザ内の架空データ（src/mock/）で動く。設定方法は docs/SUPABASE_SETUP.md。

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/** ブラウザにも埋め込まれる値だけを返す。NEXT_PUBLIC_ の変数はビルド時に置き換わるため、名前を直接書く */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return url && anonKey ? { url, anonKey } : null;
}

export const isSupabaseConfigured = () => getSupabaseEnv() !== null;
