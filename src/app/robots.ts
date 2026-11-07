import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/publicPages";

// 検索とAIの読みとりを止めない（OAI-SearchBot・Googlebot など）。docs/AIO.md「いま分かっている公式の考え方」。
// アプリの中の画面は、ページごとに noindex を付けている（src/app/layout.tsx）。ここでは API と管理画面だけ読ませない。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin/", "/auth/", "/invite/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
