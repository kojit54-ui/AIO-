import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, EDITORIAL_POLICY, PRICE_LABEL, SALES_STATUS, organizationJsonLd } from "@/lib/about";
import { SERVICE_NAME } from "@/lib/brand";
import { INDEX_ROBOTS, SITE_URL } from "@/lib/publicPages";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `運営会社と編集方針｜${SERVICE_NAME}`,
  description: `${SERVICE_NAME}を運営する${COMPANY.name}の会社情報と、AIOの読みものを書くときの約束（公式の発表をもとに書く・紹介や売上を約束しない・例は架空と明記する など）です。`,
  alternates: { canonical: "/about" },
};

function jsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `運営会社と編集方針｜${SERVICE_NAME}`,
    url: `${SITE_URL}/about`,
    inLanguage: "ja",
    mainEntity: organizationJsonLd(),
  }).replace(/</g, "\\u003c");
}

const ROWS: [string, string][] = [
  ["会社名", COMPANY.name],
  ["代表者", COMPANY.representative],
  ["所在地", `〒${COMPANY.postalCode} ${COMPANY.address}`],
  ["電話番号", COMPANY.telephone],
  ["メール", COMPANY.email],
  ["設立", COMPANY.founded],
  ["事業内容", COMPANY.business],
];

/** 運営会社と編集方針。読みものの「文責」から来る人に、だれが・どう書いているかを示す */
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-10 sm:px-6">
      <p className="text-sm font-bold text-indigo">運営会社と編集方針</p>
      <h1 className="mt-2 text-3xl font-black leading-snug sm:text-4xl">だれが、どう書いているか</h1>
      <p className="mt-3 leading-relaxed">
        {SERVICE_NAME}と、AIOの読みものは、{COMPANY.name}が運営し、文責を持っています。会社の情報と、記事を書くときの約束をまとめました。
      </p>

      <section className="mt-10" aria-labelledby="company">
        <h2 id="company" className="border-l-4 border-indigo pl-3 text-xl font-black">運営会社</h2>
        <dl className="mt-4 border-t-2 border-sumi">
          {ROWS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 border-b border-sumi/30 py-3 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold">{k}</dt>
              <dd className="min-w-0 break-words">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm">
          会社のホームページ：
          <a href={COMPANY.url} className="font-bold text-indigo underline underline-offset-4" target="_blank" rel="noopener">
            {COMPANY.url}
          </a>
        </p>
      </section>

      <section className="mt-10" aria-labelledby="service">
        <h2 id="service" className="border-l-4 border-indigo pl-3 text-xl font-black">{SERVICE_NAME}について</h2>
        <p className="mt-4 leading-relaxed">
          小さな製造業の会社が、案内役の質問に答えて、自社の仕事を伝える記事を作るためのサービスです。料金は{PRICE_LABEL}です。{SALES_STATUS}
        </p>
        <p className="mt-2 text-sm">
          くわしくは<Link href="/welcome" className="font-bold text-indigo underline underline-offset-4">サービスのご紹介</Link>と
          <Link href="/terms" className="font-bold text-indigo underline underline-offset-4">利用規約</Link>をご覧ください。
        </p>
      </section>

      <section className="mt-10" aria-labelledby="policy">
        <h2 id="policy" className="border-l-4 border-indigo pl-3 text-xl font-black">AIOの読みものの編集方針</h2>
        <ol className="mt-4 border-t-2 border-sumi">
          {EDITORIAL_POLICY.map((p, i) => (
            <li key={p.h} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-sumi/30 py-4">
              <span className="font-[family-name:var(--font-barlow)] text-2xl font-bold text-indigo">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <b className="block leading-snug">{p.h}</b>
                <p className="mt-1 text-sm leading-relaxed">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed">
          記事に誤りを見つけたときは、{COMPANY.email} までお知らせください。確かめて、直します。
        </p>
        <p className="mt-2 text-sm">
          <Link href="/column" className="font-bold text-indigo underline underline-offset-4">AIOの読みものを見る</Link>
        </p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd() }} />
    </main>
  );
}
