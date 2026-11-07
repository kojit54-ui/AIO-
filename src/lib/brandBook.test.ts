import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICE_NAME } from "@/lib/brand";
import * as book from "@/lib/brandBook";
import { BRAND_COLORS, BRAND_LINE, BRAND_PROMISES, BRAND_VOICE, LOGO_COLORWAYS, LOGO_VARIANTS } from "@/lib/brandBook";
import { INDEXABLE_PATHS } from "@/lib/publicPages";

const pub = (f: string) => join(process.cwd(), "public", "brand", f);

describe("ブランドブック", () => {
  it("ページに出すロゴは、すべて public/brand/ にある", () => {
    for (const v of [...LOGO_VARIANTS, ...LOGO_COLORWAYS]) expect(existsSync(pub(`${v.file}.svg`)), v.file).toBe(true);
    expect(existsSync(pub("aio-erabare-logo.zip"))).toBe(true);
  });

  it("ロゴのSVGは文字を輪郭にしてあり、書体が無いパソコンでも同じに見える", () => {
    for (const v of [...LOGO_VARIANTS, ...LOGO_COLORWAYS]) {
      const svg = readFileSync(pub(`${v.file}.svg`), "utf8");
      expect(svg, v.file).not.toMatch(/<text/);
      expect(svg, v.file).toContain(`<title>`);
    }
  });

  it("名前と言葉：AIの定型句を使わない（2026-11-07 田村さん「AIっぽい」）", () => {
    expect(SERVICE_NAME).toBe("AIOえらばれ帳");
    // 「使わない言葉」の一覧（BRAND_VOICE）だけは、その言葉を書いてよい
    const { BRAND_VOICE: _voice, ...rest } = book;
    const words = JSON.stringify(rest);
    expect(JSON.stringify(_voice)).toBe(JSON.stringify(BRAND_VOICE));
    for (const ng of ["寄り添", "世の中へ", "伴走"]) expect(words, ng).not.toContain(ng);
    expect(BRAND_LINE).toBe("いつもの仕事を、誰かの頼む理由に。");
    expect(BRAND_PROMISES).toHaveLength(5);
  });

  it("マークにAIのきらめき（4つ角の星）を使わない", () => {
    const svg = readFileSync(pub("logo-mark.svg"), "utf8");
    expect(svg).not.toMatch(/ C/);
  });

  it("ブランドの色は画面の色（globals.css）と食い違わない", () => {
    const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8").toLowerCase();
    for (const c of BRAND_COLORS) expect(css, c.name).toContain(c.hex);
  });

  it("ブランドのページは検索とAIに見つけてもらう", () => {
    expect(INDEXABLE_PATHS).toContain("/brand");
  });

  it("カラー反転のロゴは、真鍮をしおりだけに使う（AIOを真鍮にしない）", () => {
    const svg = readFileSync(join(process.cwd(), "public/brand/logo-horizontal-reverse.svg"), "utf8");
    expect(svg.match(/#E9B53B/gi)?.length).toBe(1);
  });
});
