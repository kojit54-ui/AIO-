import { describe, expect, it } from "vitest";
import { parseImport } from "@/lib/ai/growthPrompts";
import { IMPORT_PROMPT, splitByHeadings } from "./aiImport";

describe("ChatGPT などからの取り込み", () => {
  it("頼み文は、推測しない・お客様の名前を書かない、を頼んでいる", () => {
    expect(IMPORT_PROMPT).toContain("推測はしないでください");
    expect(IMPORT_PROMPT).toContain("お客様の名前や連絡先は書かないでください");
  });

  it("試作の読み取りは【見出し】ごとに分け、「不明」は捨てる", () => {
    const items = splitByHeadings("【会社・お仕事の内容】\nリフォーム\n【地域】\n不明\n【選ばれる理由・強み】\n一級建築士");
    expect(items).toEqual([
      { label: "会社・お仕事の内容", text: "リフォーム" },
      { label: "選ばれる理由・強み", text: "一級建築士" },
    ]);
  });

  it("AIの読み取りは、空のものを落とし、20件までにする", () => {
    const many = Array.from({ length: 25 }, (_, i) => ({ label: `l${i}`, text: "t" }));
    expect(parseImport(JSON.stringify({ items: [{ label: "", text: "x" }, ...many] }))).toHaveLength(20);
    expect(() => parseImport("{}")).toThrow();
  });
});
