// 強みの帳面を画面から読む・決め手を1つ足す（記事の質問「選ばれた決め手」から使う。2026-11-12）。
// 試作ではブラウザに保存、本物では strength_books に RLS で直接読み書きする（src/app/prototype/strengths/page.tsx と同じ置き場所）。

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { EMPTY_BOOK, normalizeBook, withWin, type StrengthBook } from "@/lib/strength/book";

export const LOCAL_BOOK_KEY = "cotam-strength-book-v1";

export interface SavedBook {
  book: StrengthBook;
  confirmedAt: string | null;
}

const client = () => {
  const env = getSupabaseEnv();
  return env ? createBrowserClient(env.url, env.anonKey) : null;
};

export function readLocalBook(): SavedBook {
  try {
    const raw = window.localStorage.getItem(LOCAL_BOOK_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { book?: unknown; confirmedAt?: unknown };
      return { book: normalizeBook(v.book), confirmedAt: typeof v.confirmedAt === "string" ? v.confirmedAt : null };
    }
  } catch {
    // 読めなければ空の帳面から
  }
  return { book: EMPTY_BOOK, confirmedAt: null };
}

/** 帳面を読む。読めなければ null */
export async function loadBook(remote: boolean, orgId: string | null): Promise<SavedBook | null> {
  if (!remote) return readLocalBook();
  const db = client();
  if (!db || !orgId) return null;
  const { data, error } = await db.from("strength_books").select("book, confirmed_at").eq("organization_id", orgId).maybeSingle();
  if (error) return null;
  return { book: normalizeBook(data?.book ?? {}), confirmedAt: (data?.confirmed_at as string | null) ?? null };
}

/**
 * 記事の質問で答えた決め手を、帳面の「実際に選ばれた決め手」に足す。お客様が自分で書いて押すので、確かめた扱いにする。
 * 足せたら新しい帳面を返す。
 */
export async function addWinToBook(remote: boolean, orgId: string | null, win: string): Promise<SavedBook> {
  const now = new Date().toISOString();
  if (!remote) {
    const cur = readLocalBook();
    const next = { book: withWin(cur.book, win), confirmedAt: now };
    window.localStorage.setItem(LOCAL_BOOK_KEY, JSON.stringify(next));
    return next;
  }
  const db = client();
  const { data: auth } = (await db?.auth.getUser()) ?? { data: { user: null } };
  if (!db || !orgId || !auth.user) throw new Error("ログインの有効期限が切れました。ログインし直してください");
  const cur = await loadBook(true, orgId);
  if (!cur) throw new Error("帳面を読み込めませんでした。少し待ってからお試しください");
  const book = withWin(cur.book, win);
  const { error } = await db
    .from("strength_books")
    .upsert({ organization_id: orgId, book, confirmed_at: now, updated_by: auth.user.id, updated_at: now }, { onConflict: "organization_id" });
  if (error) throw new Error(error.code === "42501" ? "帳面を直せるのは、会社の担当の方です" : "帳面に足せませんでした。もう一度お試しください");
  return { book, confirmedAt: now };
}
