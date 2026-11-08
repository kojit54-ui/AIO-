import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shiori } from "@/components/fun";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import Image from "next/image";
import { Reveal } from "@/components/landing";
import { COLUMNS, isNewColumn, jpDate, newestColumns, publishedColumns, type ChatTurn, type Column, type ColumnPhoto, type Interview } from "@/lib/column";
import { INDEX_ROBOTS, SITE_URL } from "@/lib/publicPages";
import { TRY_HREF } from "@/lib/signup";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
// 公開日を先にして入れた記事は、その日（日本時間）になってから1時間以内に読めるようになる
export const revalidate = 3600;

/** 公開日を迎えた記事だけ返す */
function findPublished(slug: string): Column | undefined {
  return publishedColumns().find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return COLUMNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = findPublished((await params).slug);
  if (!c) return {};
  return {
    robots: INDEX_ROBOTS,
    title: `${c.title}｜${SERVICE_NAME}`,
    description: c.lead,
    alternates: { canonical: `/column/${c.slug}`, types: { "application/atom+xml": "/column/feed.xml" } },
    openGraph: { type: "article", title: c.title, description: c.lead, publishedTime: c.published, modifiedTime: c.updated, ...(c.hero ? { images: [{ url: c.hero.src, alt: c.hero.alt }] } : {}) },
  };
}

/** 検索とAIに、記事であることと、書いた会社・日付を伝える。画面に出ている中身だけを書く */
function jsonLd(c: Column) {
  const url = `${SITE_URL}/column/${c.slug}`;
  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: c.title,
      description: c.lead,
      datePublished: c.published,
      dateModified: c.updated,
      author: { "@type": "Organization", name: SERVICE_OPERATOR, url: `${SITE_URL}/about` },
      publisher: { "@type": "Organization", name: SERVICE_OPERATOR, url: `${SITE_URL}/about` },
      mainEntityOfPage: url,
      ...(c.hero ? { image: `${SITE_URL}${c.hero.src}` } : {}),
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

const maru = "font-[family-name:var(--font-maru)]";

/** 案内役のせりふ（丸ゴシック）。しおりは「聞く人」なので、問いかけと確認の声かけだけ */
function ShioriLine({ text, mood }: { text: string; mood: "ask" | "bow" }) {
  return (
    <div className="flex items-end gap-3 border-y border-sumi/30 py-3">
      <Shiori mood={mood} as="shiori" className="h-20 w-auto shrink-0 sm:h-24" />
      <p className={`${maru} pb-2 font-bold leading-relaxed`}>
        <span className="mb-0.5 block text-xs text-sumi/60">しおり（案内役）</span>
        {text}
      </p>
    </div>
  );
}

/** 聞き書きの例。台本の形で、架空であることを枠の上に出す */
function InterviewBox({ iv }: { iv: Interview }) {
  return (
    <figure className="border-2 border-sumi bg-white">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 border-b-2 border-sumi px-4 py-2 text-xs font-bold">
        <span>聞き書きの例</span>
        <span className="text-sumi/60">架空の例です（{iv.who}）</span>
      </figcaption>
      <dl className="text-sm sm:text-base">
        {iv.lines.map((l, i) => (
          <div key={i} className={`grid grid-cols-[4.5rem_1fr] ${i > 0 ? "border-t border-sumi/20" : ""}`}>
            <dt className={`px-3 py-2.5 text-xs font-bold sm:text-sm ${l.by === "しおり" ? "text-indigo" : "text-sumi/70"}`}>{l.by}</dt>
            <dd className={`border-l border-sumi/20 px-3 py-2.5 leading-relaxed ${l.by === "しおり" ? maru : ""}`}>{l.text}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

/** 写真。実在の会社・製品ではないので「写真はイメージです」と添える */
function PhotoFigure({ photo, priority = false }: { photo: ColumnPhoto; priority?: boolean }) {
  return (
    <figure className="border-2 border-sumi bg-white">
      <Image src={photo.src} alt={photo.alt} width={1600} height={900} priority={priority} sizes="(min-width: 768px) 720px, 100vw" className="block h-auto w-full" />
      <figcaption className="border-t-2 border-sumi px-3 py-1.5 text-xs text-sumi/60">写真はイメージです（実在の会社・製品ではありません）</figcaption>
    </figure>
  );
}

/** しおりに聞いてみた：読んでいる方の質問に、しおりがチャットのように答える */
function ChatBox({ turns }: { turns: ChatTurn[] }) {
  return (
    <aside aria-label="しおりに聞いてみた" className="border-2 border-sumi bg-[#eef3f8]">
      <p className="border-b-2 border-sumi bg-white px-4 py-2 text-xs font-bold">しおりに聞いてみた</p>
      <div className="space-y-4 px-3 py-4 sm:px-5">
        {turns.map((t, i) => (
          <div key={t.q} className="space-y-3">
            <Reveal delay={i * 0.1} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm border border-sumi/30 bg-white px-4 py-2.5 leading-relaxed shadow-sm">
                <span className="mb-0.5 block text-xs font-bold text-sumi/60">読んでいる方</span>
                {t.q}
              </p>
            </Reveal>
            <Reveal delay={i * 0.1 + 0.25} className="flex items-end gap-2">
              <Shiori mood="joy" as="shiori" className="h-12 w-auto shrink-0 sm:h-14" />
              <div className={`${maru} max-w-[85%] rounded-2xl rounded-bl-sm bg-indigo px-4 py-2.5 leading-relaxed text-white shadow-sm`}>
                <span className="mb-0.5 block text-xs font-bold text-white/70">しおり</span>
                {t.a.map((x) => (
                  <p key={x} className="mt-1 first:mt-0">
                    {x}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </aside>
  );
}

/** AIOの読みもの（1本）。地の文が8割：見出しは問い、最初に短い答え。聞き書きの例は架空と明記 */
export default async function ColumnPage({ params }: Props) {
  const c = findPublished((await params).slug);
  if (!c) notFound();
  // 新しく出た記事3本を先に、続けて優先順の記事（あわせて5本まで）。毎日出る記事にも、ほかの記事からのリンクがつく
  const others = [...newestColumns().slice(0, 4), ...publishedColumns()]
    .filter((x, i, all) => x.slug !== c.slug && all.findIndex((y) => y.slug === x.slug) === i)
    .slice(0, 5);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 sm:px-6">
      <nav aria-label="いまの場所" className="text-sm">
        <Link href="/column" className="font-bold text-indigo underline underline-offset-4">
          AIOの読みもの
        </Link>
      </nav>

      <article className="mt-5">
        <header className="border-b-2 border-sumi pb-4">
          <h1 className="text-[1.6rem] font-black leading-snug sm:text-4xl sm:leading-snug">{c.title}</h1>
          <p className="mt-3 text-sm text-sumi/70">
            <time dateTime={c.updated}>{jpDate(c.updated)}</time> 更新・内容の確認 <time dateTime={c.checked}>{jpDate(c.checked)}</time>・文責 <Link href="/about" className="underline underline-offset-4">{SERVICE_OPERATOR}</Link>
          </p>
        </header>

        <section aria-labelledby="summary" className="mt-6 border-2 border-sumi bg-white">
          <h2 id="summary" className="border-b-2 border-sumi px-4 py-2 text-sm font-bold">
            この記事の答え
          </h2>
          <ol className="px-4 py-3">
            {c.summary.map((s, i) => (
              <li key={s} className={`grid grid-cols-[1.75rem_1fr] py-1.5 font-bold leading-relaxed ${i > 0 ? "border-t border-sumi/15" : ""}`}>
                <span className="font-[family-name:var(--font-barlow)] text-indigo">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        {c.hero && (
          <div className="mt-6">
            <PhotoFigure photo={c.hero} priority />
          </div>
        )}

        <div className="mt-6">
          <ShioriLine text={c.opening} mood="ask" />
        </div>

        <div className="mt-10 space-y-12">
          {c.sections.map((s) => (
            <section key={s.h} className="space-y-4">
              <h2 className="border-l-4 border-indigo pl-3 text-xl font-black leading-snug sm:text-2xl">{s.h}</h2>
              <p className="font-bold leading-relaxed">{s.answer}</p>
              {s.photo && <PhotoFigure photo={s.photo} />}
              {s.body?.map((b) => (
                <p key={b} className="leading-loose">
                  {b}
                </p>
              ))}
              {s.list && (
                <ul className="border-t border-sumi/30">
                  {s.list.map((l) => (
                    <li key={l} className="border-b border-sumi/30 py-2 pl-4 leading-relaxed [text-indent:-1rem]">
                      ・{l}
                    </li>
                  ))}
                </ul>
              )}
              {s.interview && <InterviewBox iv={s.interview} />}
              {s.chat && <ChatBox turns={s.chat} />}
            </section>
          ))}
        </div>

        <div className="mt-12">
          <ShioriLine text={c.shiori} mood="bow" />
        </div>

        <footer className="mt-8 space-y-3 text-sm">
          {c.sources && (
            <div>
              <h2 className="font-bold">もとにした公式の情報</h2>
              <ul className="mt-1 space-y-1">
                {c.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-indigo underline underline-offset-4">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sumi/70">
            「聞き書きの例」は、イメージをつかむための架空の例で、実在のお客様の事例ではありません。AIの検索の仕組みは変わるため、内容は確認日の時点のものです。
          </p>
        </footer>
      </article>

      <aside className="mt-12 bg-indigo p-5 text-paper sm:p-7">
        <p className="text-xl font-black leading-snug">仕事の話を1つ書くと、その場で記事の書き出しができます。</p>
        <p className="mt-2 text-paper/90">登録はいりません。会社の名前・地域・仕事の3つと、最近うれしかった仕事を1つ。</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={TRY_HREF} className="btn min-h-12 border-brass bg-brass px-5 text-sumi">
            登録せずに、記事づくりを試す
          </Link>
          <Link href="/welcome" className="btn min-h-12 border-paper/70 bg-transparent px-5 text-paper">
            サービスのご紹介
          </Link>
        </div>
      </aside>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="font-black">ほかの読みもの</h2>
          <ul className="mt-3 border-t-2 border-sumi">
            {others.map((o) => (
              <li key={o.slug} className="border-b border-sumi/30">
                <Link href={`/column/${o.slug}`} className="block py-3 font-bold leading-snug hover:bg-white">
                  {isNewColumn(o) && <span className="mr-2 inline-block bg-brass px-1.5 align-middle text-xs font-bold text-sumi">新着</span>}
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(c) }} />
    </main>
  );
}
