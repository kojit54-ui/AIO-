// 読みものの Atom フィード。Google はサイトマップと RSS/Atom の両方を使うことをすすめている（新しいページを早く見つけるため）。
import { SERVICE_OPERATOR } from "@/lib/brand";
import { columnFeed } from "@/lib/indexing";

// 公開日を迎えた記事が、作り直しなしで1時間以内に出るように
export const revalidate = 3600;

export function GET() {
  return new Response(columnFeed(new Date(), "AIOの読みもの", SERVICE_OPERATOR), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
