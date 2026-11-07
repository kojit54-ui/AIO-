import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import { COLUMNS, jpDate } from "@/lib/column";
import { INDEX_ROBOTS } from "@/lib/publicPages";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `AIOの読みもの｜${SERVICE_NAME}`,
  description: "ものづくりの会社が、AIに紹介されて、これから出会うお客様に選ばれるための読みもの。むずかしい言葉なしで、まずやることをまとめています。",
  alternates: { canonical: "/column" },
};

/** AIOの読みもの（記事の一覧）。ログインなしで読める */
export default function ColumnIndex() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-10 pt-8 sm:px-6">
        <p className="text-sm font-black text-brand">むずかしい言葉なしで</p>
        <h1 className="mt-1 text-3xl font-black leading-snug sm:text-4xl">AIOの読みもの</h1>
        <p className="mt-2 text-muted">ものづくりの会社が、AIに紹介されて、これから出会うお客様に選ばれるために。まず知っておきたいことを、{SERVICE_OPERATOR}がまとめています。</p>
        <ul className="mt-6 space-y-3">
          {COLUMNS.map((c) => (
            <li key={c.slug}>
              <Link href={`/column/${c.slug}`} className="card flex items-start gap-4 transition-transform hover:-translate-y-0.5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-soft text-3xl" aria-hidden>
                  {c.icon}
                </span>
                <span className="min-w-0 space-y-1">
                  <b className="block text-lg leading-snug">{c.title}</b>
                  <span className="block text-sm text-muted">{c.lead}</span>
                  <time dateTime={c.published} className="block text-xs text-muted">
                    {jpDate(c.published)}
                  </time>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
