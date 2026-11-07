import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SERVICE_NAME, SERVICE_PROMISE } from "@/lib/brand";
import { BRAND_COLORS, BRAND_MISSION, LOGO_COLORWAYS, LOGO_VARIANTS } from "@/lib/brandBook";
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

  it("ミッションはサービスのひとことと同じ言葉", () => {
    expect(BRAND_MISSION.title).toBe(SERVICE_PROMISE);
    expect(SERVICE_NAME).toBe("AIOえらばれ帳");
  });

  it("ブランドの色は画面の色（globals.css）と食い違わない", () => {
    const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8").toLowerCase();
    for (const c of BRAND_COLORS) expect(css, c.name).toContain(c.hex);
  });

  it("ブランドのページは検索とAIに見つけてもらう", () => {
    expect(INDEXABLE_PATHS).toContain("/brand");
  });
});
