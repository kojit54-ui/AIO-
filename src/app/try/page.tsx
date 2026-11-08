import type { Metadata } from "next";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { SERVICE_NAME } from "@/lib/brand";
import { TryOut } from "./TryOut";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `登録せずに、記事の書き出しを試す｜${SERVICE_NAME}`,
  description: "最近うれしかった仕事を1つ書くと、その場で記事の書き出しができます。登録はいりません。診断つきの形でもためせます。",
};

/** 登録の前にためせるページ。ログインなしで見られる。?mode=quick は診断なしで1問だけ（入口ページから） */
export default async function TryPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return <TryOut quick={mode === "quick"} />;
}
