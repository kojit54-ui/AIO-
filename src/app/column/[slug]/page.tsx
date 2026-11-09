import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import Image from "next/image";
import { ColumnChat } from "@/components/ColumnChat";
import { ColumnIntro } from "@/components/ColumnIntro";
import { COLUMNS, isNewColumn, jpDate, newestColumns, publishedColumns, type Column, type ColumnFigure, type ColumnPhoto, type Interview } from "@/lib/column";
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
/** 記事の写真・イラスト（いちばん上の写真が先） */
function columnImages(c: Column) {
  return [c.hero, ...c.sections.map((s) => s.photo)].filter((p): p is NonNullable<typeof p> => !!p);
}

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
      // 写真・イラストは、何が写っているか（alt）も添えて伝える
      ...(columnImages(c).length
        ? { image: columnImages(c).map((p) => ({ "@type": "ImageObject", contentUrl: `${SITE_URL}${p.src}`, url: `${SITE_URL}${p.src}`, caption: p.alt, description: p.alt })) }
        : {}),
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

/** 図や表（罫線と藍）。文字はHTMLのまま（読み上げ・検索・AIが読める）。スマホでは縦に並ぶ */
function FigureBox({ f }: { f: ColumnFigure }) {
  return (
    <figure className="border-2 border-sumi bg-white">
      <figcaption className="border-b-2 border-sumi px-4 py-2 text-sm font-bold">{f.title}</figcaption>
      <div className="px-4 py-4">
        {f.kind === "flow" && (
          <ol className="space-y-2">
            {f.steps.map((st, i) => (
              <li key={st.label}>
                {i > 0 && (
                  <span className="mb-2 block pl-5 text-indigo" aria-hidden>
                    ↓
                  </span>
                )}
                <div className="border border-indigo/50 bg-paper px-3 py-2">
                  <p className="font-bold text-indigo">{st.label}</p>
                  {st.note && <p className="mt-0.5 text-sm leading-relaxed">{st.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
        {f.kind === "table" && (
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead className="max-sm:hidden">
              <tr className="border-b-2 border-sumi text-left">
                <th className="w-32 py-2 pr-3">{f.head[0]}</th>
                <th className="py-2">{f.head[1]}</th>
              </tr>
            </thead>
            <tbody>
              {f.rows.map(([k, v]) => (
                <tr key={k} className="border-b border-sumi/30 max-sm:block max-sm:py-2">
                  <th scope="row" className="py-2 pr-3 text-left align-top font-bold text-indigo max-sm:block max-sm:py-0">
                    {k}
                  </th>
                  <td className="py-2 leading-relaxed max-sm:block max-sm:py-0">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {f.kind === "pair" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[f.left, f.right].map((side, i) => (
              <div key={side.label} className={`border px-3 py-3 ${f.strong === undefined ? "border-sumi/40" : (f.strong === "left") === (i === 0) ? "border-indigo bg-paper" : "border-dashed border-sumi/50"}`}>
                <p className={`font-bold ${f.strong !== undefined && (f.strong === "left") !== (i === 0) ? "text-sumi/70" : "text-indigo"}`}>{side.label}</p>
                <ul className="mt-1 space-y-1 text-sm leading-relaxed">
                  {side.items.map((it) => (
                    <li key={it} className="pl-4 [text-indent:-1rem]">
                      ・{it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {f.kind === "check" && (
          <ul className="border-t border-sumi/30">
            {f.items.map((it) => (
              <li key={it.label} className="flex gap-3 border-b border-sumi/30 py-2.5 leading-relaxed">
                <span className="mt-1 inline-block h-4 w-4 shrink-0 border-2 border-sumi" aria-hidden />
                <span>
                  <span className="block font-bold">{it.label}</span>
                  {it.note && <span className="mt-1 block text-sm text-sumi/80">{it.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
        {f.note && <p className="mt-3 text-xs leading-relaxed text-sumi/70">※{f.note}</p>}
      </div>
    </figure>
  );
}

/** 写真。実在の会社・製品ではないので「写真はイメージです」と添える */
// 冒頭の写真は横長に切って高さを抑える（2026-11-08 3AI会議「写真の存在感を下げるほうが帳面らしい」）
function PhotoFigure({ photo, priority = false, wide = false }: { photo: ColumnPhoto; priority?: boolean; wide?: boolean }) {
  return (
    <figure className="border-2 border-sumi bg-white">
      <Image src={photo.src} alt={photo.alt} width={1600} height={900} priority={priority} sizes="(min-width: 768px) 720px, 100vw" className={`block h-auto w-full ${wide ? "aspect-[2/1] object-cover" : ""}`} />
      {/* しおりのイラストには注意書きを付けない（2026-11-08 田村さん「AIにやらせてるっぽさが出る」）。写真は実在に見えるので付ける */}
      {!photo.illustration && <figcaption className="border-t-2 border-sumi px-3 py-1.5 text-xs text-sumi/60">写真はイメージです</figcaption>}
    </figure>
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
          <h1 className="text-[1.6rem] font-black leading-snug [word-break:auto-phrase] sm:text-4xl sm:leading-snug">{c.title}</h1>
          <p className="mt-3 text-sm text-sumi/70">
            <time dateTime={c.updated}>{jpDate(c.updated)}</time> 更新・内容の確認 <time dateTime={c.checked}>{jpDate(c.checked)}</time>・文責 <Link href="/about" className="underline underline-offset-4">{SERVICE_OPERATOR}</Link>
          </p>
        </header>

        {(c.intro ?? c.opening) && (
          <ColumnIntro mood={c.introMood ?? "point"}>
            {c.intro ?? c.opening}
            {c.jump && (
              <>
                {c.jump.lead}
                <a href={`#s${c.jump.section}`} className="font-bold text-indigo underline underline-offset-4">
                  {c.sections[c.jump.section - 1]?.h}
                </a>
                {c.jump.after}
              </>
            )}
          </ColumnIntro>
        )}

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
            <PhotoFigure photo={c.hero} priority wide />
          </div>
        )}


        <div className="mt-10 space-y-12">
          {c.sections.map((s, i) => (
            <section key={s.h} id={`s${i + 1}`} className="scroll-mt-20 space-y-4">
              <h2 className="border-l-4 border-indigo pl-3 text-xl font-black leading-snug [word-break:auto-phrase] sm:text-2xl">{s.h}</h2>
              <p className="font-bold leading-relaxed">{s.answer}</p>
              {s.photo && <PhotoFigure photo={s.photo} />}
              {s.figure && <FigureBox f={s.figure} />}
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
              {s.after?.map((b) => (
                <p key={b} className="leading-loose">
                  {b}
                </p>
              ))}
              {s.see && (
                <p className="leading-loose">
                  {s.see.lead}
                  <Link href={`/column/${s.see.slug}`} className="font-bold text-indigo underline underline-offset-4">
                    {s.see.label}
                  </Link>
                </p>
              )}
              {s.interview && <InterviewBox iv={s.interview} />}
              {s.chat && <ColumnChat turns={s.chat} />}
            </section>
          ))}
        </div>

        {c.closing && <p className="mt-12 border-t border-sumi/40 pt-6 leading-loose">{c.closing}</p>}

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
            {c.sections.some((x) => x.chat) && "「しおりに聞いてみた」は、よくある疑問をもとに編集部がまとめた一問一答です。"}
            {c.sections.some((x) => x.interview) && "「聞き書きの例」は、イメージをつかむための架空の例で、実在のお客様の事例ではありません。"}
            AIの検索のしくみは変わるため、内容は確認日の時点のものです。
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
