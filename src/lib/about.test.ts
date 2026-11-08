import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { COMPANY, EDITORIAL_POLICY, PRICE_JPY, PRICE_LABEL, SALES_STATUS, serviceJsonLd } from "@/lib/about";
import { FAQ } from "@/lib/faq";
import { TOKUSHOHO } from "@/lib/legal";
import sitemap from "@/app/sitemap";

const tokushoho = TOKUSHOHO.sections.flatMap((s) => s.items).join("\n").replace(/\s/g, "");

describe("運営会社と編集方針・構造化データ", () => {
  it("会社の情報は、特定商取引法の表記と同じ", () => {
    expect(tokushoho).toContain(COMPANY.address.replace(/\s/g, ""));
    expect(tokushoho).toContain(COMPANY.telephone);
    expect(tokushoho).toContain(COMPANY.representative.replace(/\s/g, ""));
  });

  it("料金と受付の状態は、画面・よくある質問・表記と食い違わない", () => {
    expect(tokushoho).toContain("月額50,000円（税抜。税込55,000円）");
    expect(PRICE_LABEL).toContain("月額50,000円（税抜。税込55,000円）");
    expect(PRICE_JPY).toBe(50000);
    expect(FAQ.map((f) => f.a).join("")).toContain("新規のお申し込みは準備中");
    expect(fs.readFileSync("src/app/welcome/Welcome.tsx", "utf8")).toContain(SALES_STATUS);
    const s = serviceJsonLd();
    expect(s.offers.price).toBe(PRICE_JPY);
    expect(s.offers.priceSpecification.valueAddedTaxIncluded).toBe(false);
    expect(s.description).toContain(SALES_STATUS);
  });

  it("編集方針は、紹介を約束しないことと、架空の例の明記を含む", () => {
    const text = EDITORIAL_POLICY.map((p) => p.h + p.text).join("");
    expect(text).toContain("約束しません");
    expect(text).toContain("架空");
  });

  it("/about はサイトマップに載る", () => {
    expect(sitemap().map((u) => new URL(u.url).pathname)).toContain("/about");
  });
});

describe("既存のお客様の扱いを、サイトに出さない（2026-11-08 田村さん）", () => {
  it("入口・よくある質問・読みもの・規約・運営会社のページに「既存のお客様は無料」の言葉がない", async () => {
    const { COLUMNS } = await import("@/lib/column");
    const { LEGAL_DOCS } = await import("@/lib/legal");
    const text = [
      fs.readFileSync("src/app/welcome/Welcome.tsx", "utf8"),
      fs.readFileSync("src/app/about/page.tsx", "utf8"),
      JSON.stringify(FAQ),
      JSON.stringify(COLUMNS),
      JSON.stringify(LEGAL_DOCS),
      JSON.stringify(serviceJsonLd()),
    ].join("\n");
    expect(text).not.toMatch(/(コタムの|既存の|ご招待した|招待した)お客様.{0,40}無料/);
    expect(text).not.toMatch(/招待制で(、)?.{0,20}無料/);
    expect(text).not.toMatch(/ご契約のあいだ無料/);
  });
});

describe("記事の本数は「毎月1本から10本まで」（2026-11-08 田村さん「最低1本。毎月10本まで」）", () => {
  it("料金の文・規約・特商法・構造化データに、同じ本数が入っている", async () => {
    const { ARTICLES_PER_MONTH_LABEL, ARTICLES_PER_MONTH_MAX } = await import("@/lib/articleQuota");
    const { TERMS } = await import("@/lib/legal");
    expect(ARTICLES_PER_MONTH_MAX).toBe(10);
    expect(ARTICLES_PER_MONTH_LABEL).toBe("毎月1本から10本まで");
    expect(PRICE_LABEL).toContain(ARTICLES_PER_MONTH_LABEL);
    expect(tokushoho).toContain(ARTICLES_PER_MONTH_LABEL);
    expect(JSON.stringify(TERMS)).toContain(ARTICLES_PER_MONTH_LABEL);
    expect(serviceJsonLd().description).toContain(ARTICLES_PER_MONTH_LABEL);
    expect(FAQ.map((f) => f.a).join("")).toContain("毎月1本から10本まで");
  });

  it("サイトのどこにも「記事は毎月1本」だけの書き方が残っていない（読みものを足しても見張る）", async () => {
    const { COLUMNS } = await import("@/lib/column");
    const { LEGAL_DOCS } = await import("@/lib/legal");
    const brand = await import("@/lib/brandBook");
    const text = [
      fs.readFileSync("src/app/welcome/Welcome.tsx", "utf8"),
      fs.readFileSync("src/app/welcome/page.tsx", "utf8"),
      fs.readFileSync("src/app/about/page.tsx", "utf8"),
      fs.readFileSync("src/app/brand/BrandBook.tsx", "utf8"),
      JSON.stringify(brand),
      JSON.stringify(FAQ),
      JSON.stringify(COLUMNS),
      JSON.stringify(LEGAL_DOCS),
      PRICE_LABEL,
      JSON.stringify(serviceJsonLd()),
    ].join("\n");
    // 「毎月1本から」はよい。「記事は毎月1本です」「毎月1本の記事づくり」「毎月1本。」のように本数を1本と言い切る形はだめ
    expect(text).not.toMatch(/(記事は|記事：|発行", ")毎月1本(?!から)/);
    expect(text).not.toMatch(/毎月1本(の記事づくり|。|です|、自社)/);
  });
});
