// 本物のラッコキーワード API で1回だけ試す。通常の npm test では飛ばす。
// 使い方：.env.local に RAKKO_API_KEY を入れてから
//   RAKKO_LIVE=1 npx vitest run src/lib/keywords/rakko.live.test.ts --silent=false
// （--silent=false を付けないと、取れた中身が表示されない）
// 消費クレジット：アカウント情報 0、よくある質問 1.5、サジェスト 1.5（合計3）。

import { describe, expect, it } from "vitest";
import { getRakkoClient } from "./rakko";

const live = process.env.RAKKO_LIVE === "1";
if (live) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // .env.local が無ければ、すでに設定された環境変数だけを使う
  }
}

describe.skipIf(!live)("本物のラッコキーワード API", () => {
  it("アカウント情報・よくある質問・サジェストを取る", async () => {
    const client = getRakkoClient();
    expect(client, "RAKKO_API_KEY が設定されていません").not.toBeNull();
    const account = await client!.accountInfo();
    console.log(`プラン：${account.planName}、クレジット残高：${account.creditBalance}`);

    const questions = await client!.questionSearch("断熱リフォーム", { limit: 10 });
    console.log("よくある質問", questions.items);
    const suggest = await client!.suggestKeywords("断熱リフォーム", { limit: 10 });
    console.log("サジェスト", suggest.items);
    expect(questions.items.length + suggest.items.length).toBeGreaterThan(0);
  }, 120_000);
});
