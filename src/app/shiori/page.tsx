import type { Metadata } from "next";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { SERVICE_NAME } from "@/lib/brand";
import { ShioriIntro } from "./ShioriIntro";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `しおりの自己紹介｜${SERVICE_NAME}`,
  description: "あなたの会社の記事づくりを案内する、しおりの自己紹介。",
};

/** しおりの自己紹介。ログインなしで見られる */
export default function ShioriPage() {
  return <ShioriIntro />;
}
