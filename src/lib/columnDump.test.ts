// 校閲用に、読みものを文章で書き出す（scripts/column/review.mjs）。COLUMN_DUMP=slug,slug のときだけ動く
import fs from "node:fs";
import { describe, it } from "vitest";
import { COLUMNS } from "./column";

const slugs = (process.env.COLUMN_DUMP ?? "").split(",").filter(Boolean);

describe.skipIf(slugs.length === 0)("読みものの書き出し", () => {
  it("書き出す", () => {
    let s = "";
    for (const c of COLUMNS.filter((x) => slugs.includes(x.slug))) {
      s += `\n\n## ${c.title}\n（説明文：${c.lead}）\n答え：${c.summary.join("／")}\n${c.hero ? `［写真：${c.hero.alt}］\n` : ""}前置き（しおりの吹き出し）：${c.intro ?? c.opening ?? ""}\n`;
      for (const x of c.sections) {
        s += `\n### ${x.h}\n【答え】${x.answer}\n${x.photo ? `［写真：${x.photo.alt}］\n` : ""}${x.figure ? `［図：${JSON.stringify(x.figure)}］\n` : ""}${(x.body ?? []).join("\n")}\n${(x.list ?? []).map((l) => "・" + l).join("\n")}\n${(x.after ?? []).join("\n")}\n${x.see ? `${x.see.lead}「${x.see.label}」（リンク）\n` : ""}`;
        if (x.interview) s += `［聞き書きの例（架空）：${x.interview.who}］\n${x.interview.lines.map((l) => `${l.by}：${l.text}`).join("\n")}\n`;
        if (x.chat) s += `［しおりに聞いてみた］\n${x.chat.map((t) => `読んでいる方：${t.q}\nしおり：${t.a.join(" ")}`).join("\n")}\n`;
      }
      s += `結び：${c.closing ?? ""}\n${c.sources ? `出典：${c.sources.map((x) => x.label).join("、")}\n` : ""}`;
    }
    fs.mkdirSync("/tmp/column-review", { recursive: true });
    fs.writeFileSync("/tmp/column-review/articles.md", s);
  });
});
