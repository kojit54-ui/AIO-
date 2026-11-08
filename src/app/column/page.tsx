import type { Metadata } from "next";
import Link from "next/link";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import { isNewColumn, jpDate, publishedColumns } from "@/lib/column";
import { INDEX_ROBOTS } from "@/lib/publicPages";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `AIOの読みもの｜${SERVICE_NAME}`,
  description: "小さな製造業の社長に向けて、AIOの基本と、AIOえらばれ帳の中身を、公式の発表と確かめられたことだけで書いています。",
  alternates: { canonical: "/column", types: { "application/atom+xml": "/column/feed.xml" } },
};

// 公開日を迎えた記事が、作り直しなしで1時間以内に出るように
export const revalidate = 3600;

/** AIOの読みもの（記事の一覧）。ログインなしで読める */
export default function ColumnIndex() {
  const columns = publishedColumns();
  return (
    <main className="mx-auto max-w-4xl px-4 pb-14 pt-10 sm:px-6">
      <p className="text-sm font-bold text-indigo">読みもの</p>
      <h1 className="mt-2 text-3xl font-black leading-snug sm:text-4xl">AIOの読みもの</h1>
      <p className="mt-3 leading-relaxed">
        小さな製造業の社長に向けて、AIOの基本と、このサービスの中身を書いています。公式の発表で確かめられたことと、まだ分からないことを分けて書くのが決まりです。文責：<Link href="/about" className="underline underline-offset-4">{SERVICE_OPERATOR}</Link>（編集方針）
      </p>
      <ol className="mt-8 border-t-2 border-sumi">
        {columns.map((c, i) => (
          <li key={c.slug} className="border-b border-sumi/30">
            <Link href={`/column/${c.slug}`} className="grid grid-cols-[2.5rem_1fr] gap-3 py-5 hover:bg-white sm:grid-cols-[3.5rem_1fr]">
              <span className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-indigo sm:text-3xl">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <b className="block text-lg leading-snug">
                  {isNewColumn(c) && <span className="mr-2 inline-block bg-brass px-1.5 align-middle text-xs font-bold text-sumi">新着</span>}
                  {c.title}
                </b>
                <span className="mt-1 block text-sm leading-relaxed text-sumi/75">{c.lead}</span>
                <span className="mt-1 block text-xs text-sumi/60">
                  <time dateTime={c.updated}>{jpDate(c.updated)}</time> 更新
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
