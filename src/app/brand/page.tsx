import type { Metadata } from "next";
import { SERVICE_NAME } from "@/lib/brand";
import { BRAND_CONCEPT } from "@/lib/brandBook";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { BrandBook } from "./BrandBook";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `ブランドとロゴ｜${SERVICE_NAME}`,
  description: `${SERVICE_NAME}のブランドコンセプト・理念・ミッション・バリューと、ロゴの使い方。${BRAND_CONCEPT.title}`,
  alternates: { canonical: "/brand" },
};

/** ブランドとロゴのページ。ログインなしで見られる */
export default function BrandPage() {
  return <BrandBook />;
}
