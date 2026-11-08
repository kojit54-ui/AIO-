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

// 2026-11-08 田村さん「既存のお客様は無料、は絶対に出さないで」。外から見えるページの元になるファイルに書かない
describe("外向けのページに、既存のお客様が無料だと書かない", () => {
  const files = ["src/app/welcome/Welcome.tsx", "src/lib/column.ts", "src/lib/faq.ts", "src/lib/legal.ts", "src/lib/about.ts", "src/app/try/TryOut.tsx", "src/lib/publicPages.ts"];
  it.each(files)("%s", (f) => {
    if (!fs.existsSync(f)) return;
    const s = fs.readFileSync(f, "utf8");
    expect(s).not.toMatch(/(コタムの(既存の)?お客様|招待(した|された)?お客様|ご招待|既存のお客様)[^。\n]{0,40}無料/);
    expect(s).not.toMatch(/無料[^。\n]{0,20}(コタムのお客様|既存のお客様)/);
  });
});
