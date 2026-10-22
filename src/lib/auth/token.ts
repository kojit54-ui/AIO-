// 招待リンクのトークン。リンクに載せるのは元の値、DBに保存するのはハッシュだけ。

import { createHash, randomBytes } from "node:crypto";

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function newInviteToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashInviteToken(token) };
}

/** 形の合わない値は、DBに問い合わせずに無効とする */
export const isWellFormedToken = (token: string) => /^[A-Za-z0-9_-]{43}$/.test(token);

/** 戻り先は同じサイト内のパスだけを受け付ける（他サイトへのリダイレクトを防ぐ） */
export function safeNextPath(next: string | null | undefined, fallback = "/"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
