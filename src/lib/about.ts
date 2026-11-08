// 運営会社と編集方針（/about）。2026-11-08 3AI会議の「記事以外にやること」：だれが書いているか・どう確かめているかを固定のページで示す。
// 会社の情報は、コタムのホームページ（https://co-tam.co.jp/company/）と特定商取引法の表記（src/lib/legal.ts）に合わせる。
// 料金・受付の状態は、入口ページ・よくある質問・利用規約と同じ文にする（食い違うと、AIにも人にも信用されない）。

import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import { CONTACT_EMAIL } from "@/lib/legal";
import { SITE_URL } from "@/lib/publicPages";

export const COMPANY = {
  name: SERVICE_OPERATOR,
  representative: "田村 巧次",
  postalCode: "103-0007",
  address: "東京都中央区日本橋浜町2-61-11 飯森ビル6F",
  telephone: "03-4570-5405",
  email: CONTACT_EMAIL,
  founded: "2010年11月",
  business: "ブランド事業、デジタルマーケティング事業（中小企業のホームページ制作・ウェブマーケティングの支援）",
  url: "https://co-tam.co.jp/",
} as const;

/** 料金と受付の状態（画面に出している文と同じ） */
export const PRICE_JPY = 50000;
export const PRICE_LABEL = "月額50,000円（税抜。税込55,000円）、記事は毎月1本";
export const SALES_STATUS = "新規のお申し込みは準備中です。";

/** 読みもの（/column）の編集方針。記事の書き方の約束 */
export const EDITORIAL_POLICY: { h: string; text: string }[] = [
  { h: "公式に発表されたことをもとに書きます", text: "GoogleやOpenAIなどの仕組みについては、各社が公式に発表している資料をもとに書き、記事の最後に出典を載せます。報道やうわさだけで書くことはしません。" },
  { h: "主語をはっきりさせます", text: "Googleの案内は「Googleは」と書き、ほかのAIにも同じことが言えるかのようには書きません。分からないことは「分からない」と書きます。" },
  { h: "紹介や売上は約束しません", text: "AIの答えで紹介されるか、問い合わせが増えるかは、誰にも約束できません。「〇〇すれば引用される」のような言い切りはしません。" },
  { h: "例は「架空」と明記します", text: "記事の中の会社の例や、案内役との会話の例は、実在のお客様の事例ではなく、イメージをつかむための架空の例です。そのことを例のそばに書きます。" },
  { h: "ほかの会社と比べません", text: "ほかの会社の料金やサービスと比べることはしません。このサービスについては、料金・含まれるもの・含まれないものを、利用規約と同じ内容で書きます。" },
  { h: "確かめた日を載せ、変わったら直します", text: "記事ごとに、中身を確かめた日を載せています。仕組みや料金が変わったときは、記事を直して日付を新しくします。" },
];

/** 運営会社（検索とAIに伝える形）。画面に出している内容だけを書く */
export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/about#org`,
    name: COMPANY.name,
    url: COMPANY.url,
    telephone: COMPANY.telephone,
    email: COMPANY.email,
    foundingDate: "2010-11",
    address: { "@type": "PostalAddress", postalCode: COMPANY.postalCode, addressRegion: "東京都", addressLocality: "中央区", streetAddress: "日本橋浜町2-61-11 飯森ビル6F", addressCountry: "JP" },
  };
}

/** サービスと料金（入口ページ）。受付前であることも説明に入れる */
export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: SERVICE_NAME,
    url: `${SITE_URL}/welcome`,
    serviceType: "ホームページの記事づくりの支援（AIO）",
    description: `小さな製造業の会社が、案内役の質問に答えて、自社の仕事を伝える記事を作るためのサービスです。${PRICE_LABEL}。${SALES_STATUS}`,
    areaServed: { "@type": "Country", name: "JP" },
    audience: { "@type": "BusinessAudience", audienceType: "ひとり親方から30人くらいまでの、ものづくりの会社" },
    provider: organizationJsonLd(),
    offers: {
      "@type": "Offer",
      price: PRICE_JPY,
      priceCurrency: "JPY",
      priceSpecification: { "@type": "UnitPriceSpecification", price: PRICE_JPY, priceCurrency: "JPY", valueAddedTaxIncluded: false, unitText: "月" },
      url: `${SITE_URL}/welcome#price`,
    },
  };
}
