import type { MetadataRoute } from "next";
import { COLUMNS } from "@/lib/column";
import { INDEXABLE_PATHS, SITE_URL } from "@/lib/publicPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = COLUMNS.map((c) => c.updated).sort().at(-1);
  return [
    ...INDEXABLE_PATHS.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: p === "/column" ? latest : undefined })),
    ...COLUMNS.map((c) => ({ url: `${SITE_URL}/column/${c.slug}`, lastModified: c.updated })),
  ];
}
