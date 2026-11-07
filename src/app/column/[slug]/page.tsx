import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site";
import { ShioriTalk } from "@/components/talk";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import { COLUMNS, findColumn, jpDate } from "@/lib/column";
import { INDEX_ROBOTS, SITE_URL } from "@/lib/publicPages";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return COLUMNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = findColumn((await params).slug);
  if (!c) return {};
  return {
    robots: INDEX_ROBOTS,
    title: `${c.title}｜${SERVICE_NAME}`,
    description: c.lead,
    alternates: { canonical: `/column/${c.slug}` },
    openGraph: { type: "article", title: c.title, description: c.lead, publishedTime: c.published, modifiedTime: c.updated },
  };
}

/** 検索とAIに、記事であることと、書いた会社・日付を伝える */
function jsonLd(c: NonNullable<ReturnType<typeof findColumn>>) {
  const url = `${SITE_URL}/column/${c.slug}`;
  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.lead,
      datePublished: c.published,
      dateModified: c.updated,
      author: { "@type": "Organization", name: SERVICE_OPERATOR },
      publisher: { "@type": "Organization", name: SERVICE_OPERATOR },
      mainEntityOfPage: url,
      inLanguage: "ja",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SERVICE_NAME, item: `${SITE_URL}/welcome` },
        { "@type": "ListItem", position: 2, name: "AIOの読みもの", item: `${SITE_URL}/column` },
        { "@type": "ListItem", position: 3, name: c.title, item: url },
      ],
    },
  ]).replace(/</g, "\\u003c");
}

/** AIOの読みもの（1本）。見出しは問い、各節の最初に短く答える（このサービスがすすめる書き方と同じ） */
export default async function ColumnPage({ params }: Props) {
  const c = findColumn((await params).slug);
  if (!c) notFound();
  const others = COLUMNS.filter((x) => x.slug !== c.slug).slice(0, 2);

  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-10 pt-6 sm:px-6">
        <nav aria-label="いまの場所" className="text-sm text-muted">
          <Link href="/column" className="font-bold text-brand-dark underline">
            AIOの読みもの
          </Link>
          <span aria-hidden> ／ </span>
          <span>この記事</span>
        </nav>

        <article className="mt-4">
          <header className="space-y-2">
            <span className="text-4xl" aria-hidden>
              {c.icon}
            </span>
            <h1 className="text-2xl font-black leading-snug sm:text-4xl sm:leading-snug">{c.title}</h1>
            <p className="text-sm text-muted">
              <time dateTime={c.published}>{jpDate(c.published)}</time>
              {c.updated !== c.published && (
                <>
                  （更新 <time dateTime={c.updated}>{jpDate(c.updated)}</time>）
                </>
              )}
              ・{SERVICE_OPERATOR}
            </p>
          </header>

          <section aria-labelledby="summary" className="mt-6 rounded-3xl border-2 border-sun bg-sun-soft p-4 sm:p-5">
            <h2 id="summary" className="font-black">
              💡 この記事の答え
            </h2>
            <ul className="mt-2 space-y-1.5">
              {c.summary.map((s) => (
                <li key={s} className="flex gap-2 font-bold">
                  <span className="text-brand" aria-hidden>
                    ✓
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8 space-y-8">
            {c.sections.map((s) => (
              <section key={s.h} className="space-y-3">
                <h2 className="text-xl font-black leading-snug sm:text-2xl">{s.h}</h2>
                <p className="rounded-2xl border-l-4 border-brand bg-brand-soft/60 px-4 py-2 font-bold">{s.answer}</p>
                {s.body?.map((b) => (
                  <p key={b} className="leading-loose">
                    {b}
                  </p>
                ))}
                {s.list && (
                  <ul className="list-disc space-y-1 pl-6 leading-relaxed">
                    {s.list.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8">
            <ShioriTalk mood="point" size="md" lines={[c.shiori]} />
          </div>

          {c.sources && (
            <section className="mt-8 text-sm">
              <h2 className="font-black">もとにした公式の情報</h2>
              <ul className="mt-1 space-y-1">
                {c.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-brand-dark underline">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <aside className="mt-10 space-y-3 rounded-[2rem] bg-gradient-to-br from-brand to-[#4f8ff0] p-5 text-white shadow-[0_6px_0_var(--color-brand-dark)] sm:p-7">
          <p className="text-xl font-black leading-snug">あなたの会社は、AIとお客様に選ばれる準備ができていますか？</p>
          <p className="text-white/90">登録なし・30秒で診断できます。</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/try" className="btn min-h-12 border-sun bg-sun px-5 text-ink shadow-[0_4px_0_var(--color-sun-dark)]">
              30秒でためす →
            </Link>
            <Link href="/welcome" className="btn min-h-12 border-white/70 bg-white/10 px-5 text-white">
              サービスのご紹介
            </Link>
          </div>
        </aside>

        {others.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 font-black">ほかの読みもの</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/column/${o.slug}`} className="card flex h-full items-start gap-3">
                    <span className="text-2xl" aria-hidden>
                      {o.icon}
                    </span>
                    <b className="leading-snug">{o.title}</b>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(c) }} />
    </div>
  );
}
