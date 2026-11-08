import type { MetadataRoute } from "next";
import { newestColumns } from "@/lib/column";
import { INDEXABLE_PATHS, SITE_URL } from "@/lib/publicPages";

// 公開日を迎えた読みものが、作り直しなしで1時間以内に載るように。
// lastmod は中身を本当に変えた日だけ（Google は lastmod が正確なサイトだけ、それを使う）。
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const columns = newestColumns();
  const latest = columns.map((c) => c.updated).sort().at(-1);
  return [
    ...INDEXABLE_PATHS.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: p === "/column" ? latest : undefined })),
    ...columns.map((c) => ({ url: `${SITE_URL}/column/${c.slug}`, lastModified: c.updated })),
  ];
}
