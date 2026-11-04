// しおり通信の送信（サーバー側だけで使う）。Google Workspace の SMTP（smtp.gmail.com）で送る想定（docs/DECISIONS.md 2026-11-03）。
// 認証情報はサーバーの環境変数だけ（SMTP_USER・SMTP_PASS はアプリ パスワード）。画面・ログには出さない。

import { createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { SERVICE_NAME } from "@/lib/brand";

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export function smtpConfig(env: Record<string, string | undefined> = process.env) {
  const user = env.SMTP_USER?.trim();
  const pass = env.SMTP_PASS?.replace(/\s/g, "");
  const from = env.NEWSLETTER_FROM?.trim() || user;
  if (!user || !pass || !from) return null;
  return { host: env.SMTP_HOST?.trim() || "smtp.gmail.com", port: Number(env.SMTP_PORT) || 465, user, pass, from };
}

/** 送る。設定が無ければ送らずに false */
export async function sendMail(mail: Mail, env: Record<string, string | undefined> = process.env): Promise<boolean> {
  const c = smtpConfig(env);
  if (!c) return false;
  const transport = nodemailer.createTransport({ host: c.host, port: c.port, secure: c.port === 465, auth: { user: c.user, pass: c.pass } });
  await transport.sendMail({ from: `しおり（${SERVICE_NAME}） <${c.from}>`, to: mail.to, subject: mail.subject, text: mail.text, html: mail.html });
  return true;
}

/** 「受け取らない」のリンクの署名。リンクを知っている本人だけが止められるように */
function secret(env: Record<string, string | undefined>) {
  return env.NEWSLETTER_SECRET || env.CRON_SECRET || "";
}
export function unsubscribeSig(userId: string, env: Record<string, string | undefined> = process.env): string {
  return createHmac("sha256", secret(env)).update(`unsubscribe:${userId}`).digest("base64url");
}
export function verifyUnsubscribe(userId: string, sig: string, env: Record<string, string | undefined> = process.env): boolean {
  if (!secret(env)) return false;
  const a = Buffer.from(unsubscribeSig(userId, env));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}
