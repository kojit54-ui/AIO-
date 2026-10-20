import { describe, expect, it } from "vitest";
import { blocksToHtml, blocksToPlainText } from "./exportText";

describe("blocksToHtml", () => {
  it("見出し・段落・箇条書きを許可したタグだけで出力する", () => {
    const html = blocksToHtml([
      { type: "heading", level: 2, text: "見出し" },
      { type: "paragraph", text: "本文" },
      { type: "list", ordered: false, items: ["一", "二"] },
      { type: "list", ordered: true, items: ["手順"] },
    ]);
    expect(html).toBe("<h2>見出し</h2>\n<p>本文</p>\n<ul>\n  <li>一</li>\n  <li>二</li>\n</ul>\n<ol>\n  <li>手順</li>\n</ol>");
  });

  it("本文中のHTMLやスクリプトはエスケープする", () => {
    const html = blocksToHtml([
      { type: "paragraph", text: '<script>alert("x")</script><img src=x onerror=alert(1)>' },
    ]);
    expect(html).not.toContain("<script");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("blocksToPlainText", () => {
  it("段落を空行で区切り、箇条書きに記号を付ける", () => {
    expect(
      blocksToPlainText([
        { type: "heading", level: 2, text: "見出し" },
        { type: "list", ordered: false, items: ["一", "二"] },
      ]),
    ).toBe("見出し\n\n・一\n・二");
  });
});
