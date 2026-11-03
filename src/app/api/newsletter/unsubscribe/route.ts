// しおり通信の「受け取らない」のリンク。署名を確かめて、受け取らない人に足す。ログインは要らない。

import { type NextRequest } from "next/server";
import { verifyUnsubscribe } from "@/lib/newsletter/send";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:sans-serif;background:#eef4fc;color:#1e2a3b;padding:40px 16px;text-align:center"><h1 style="font-size:20px">${title}</h1><p>${body}</p></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );

export async function GET(request: NextRequest) {
  const u = request.nextUrl.searchParams.get("u") ?? "";
  const s = request.nextUrl.searchParams.get("s") ?? "";
  if (!UUID.test(u) || !verifyUnsubscribe(u, s) || !isSupabaseConfigured()) return page("リンクが正しくありません", "お手数ですが、アプリのホームの「しおり通信」から設定を変えてください。", 400);
  const { error } = await createAdminSupabase().from("newsletter_optouts").upsert({ user_id: u });
  if (error) return page("設定を変えられませんでした", "少し待ってから、もう一度リンクを開いてください。", 500);
  return page("しおり通信のメールを止めました", "これからは、毎月のメールは届きません。また受け取りたくなったら、アプリのホームの「しおり通信」から戻せます。");
}
