import { describe, expect, it } from "vitest";
import { createRakkoClient, getRakkoClient, normalizeSeedKeyword, RakkoError } from "./rakko";

type Call = { url: string; init: RequestInit };

function fakeFetch(status: number, body: unknown, calls: Call[] = []): typeof fetch {
  return (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(typeof body === "string" ? body : JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  }) as unknown as typeof fetch;
}

const ok = (items: unknown[], extra: Record<string, unknown> = {}) => ({ result: true, meta: { consumedCredit: 1.5 }, data: { summary: { totalCount: 345, returnedCount: items.length }, items, ...extra } });

describe("ラッコキーワード API", () => {
  it("キーが無ければ使わない（画面は未接続と出す）", () => {
    expect(getRakkoClient({})).toBeNull();
    expect(getRakkoClient({ RAKKO_API_KEY: "  " })).toBeNull();
    expect(getRakkoClient({ RAKKO_API_KEY: "k" })).not.toBeNull();
  });

  it("サジェスト：キーはヘッダーだけで送り、検索回数の無いものは null のまま", async () => {
    const calls: Call[] = [];
    const client = createRakkoClient({
      apiKey: "secret-key",
      fetch: fakeFetch(
        200,
        ok([
          { keyword: "浴室 断熱 リフォーム", metrics: { searchVolume: 1300, seoDifficulty: 32 } },
          { keyword: "浴室 断熱 リフォーム", metrics: { searchVolume: 1300, seoDifficulty: 32 } },
          { keyword: "浴室断熱　リフォーム", metrics: { searchVolume: 1300, seoDifficulty: 32 } },
          { keyword: "浴室 断熱 diy", metrics: { searchVolume: null, seoDifficulty: null } },
          { keyword: "", metrics: {} },
          "壊れた行",
        ]),
        calls,
      ),
    });
    const r = await client.suggestKeywords("  浴室　断熱  ", { limit: 5000 });
    expect(r.items).toEqual([
      { keyword: "浴室 断熱 リフォーム", monthlySearches: 1300, seoDifficulty: 32 },
      { keyword: "浴室 断熱 diy", monthlySearches: null, seoDifficulty: null },
    ]);
    expect(r.totalCount).toBe(345);
    expect(r.consumedCredit).toBe(1.5);
    expect(calls[0].url).toBe("https://api.rakkokeyword.com/v1/suggest-keywords");
    expect((calls[0].init.headers as Record<string, string>)["X-API-Key"]).toBe("secret-key");
    const sent = JSON.parse(String(calls[0].init.body));
    expect(sent).toMatchObject({ keyword: "浴室 断熱", modes: ["google"], limit: 200 });
    expect(String(calls[0].init.body)).not.toContain("secret-key");
  });

  it("よくある質問：相対需要の順のまま返す", async () => {
    const client = createRakkoClient({
      apiKey: "k",
      fetch: fakeFetch(200, ok([{ question: "浴室の断熱リフォームはいくらかかる？", metrics: { relativeDemand: 100 } }, { question: "  ", metrics: { relativeDemand: 50 } }])),
    });
    const r = await client.questionSearch("浴室 断熱");
    expect(r.items).toEqual([{ question: "浴室の断熱リフォームはいくらかかる？", relativeDemand: 100 }]);
  });

  it("アカウント情報：プランとクレジット残高", async () => {
    const client = createRakkoClient({
      apiKey: "k",
      fetch: fakeFetch(200, { result: true, meta: { consumedCredit: 0 }, data: { contract: { planName: "スタンダード", dueDate: "2027-11-01" }, credit: { balance: 1234.5 } } }),
    });
    expect(await client.accountInfo()).toEqual({ planName: "スタンダード", dueDate: "2027-11-01", creditBalance: 1234.5 });
  });

  it.each([
    [400, "invalid_input"],
    [401, "auth"],
    [403, "auth"],
    [402, "no_credit"],
    [429, "rate_limited"],
    [500, "unavailable"],
    [503, "unavailable"],
  ] as const)("%i は %s として伝え、キーをエラー文に出さない", async (status, code) => {
    const client = createRakkoClient({ apiKey: "secret-key", fetch: fakeFetch(status, { result: false, data: {}, errors: ["x"] }) });
    const err = await client.questionSearch("断熱").catch((e: unknown) => e);
    expect(err).toBeInstanceOf(RakkoError);
    expect((err as RakkoError).code).toBe(code);
    expect((err as RakkoError).message).not.toContain("secret-key");
  });

  it("形の違う返事は読み取れないと伝える", async () => {
    for (const body of ["not json", { result: false, data: {} }, { result: true, data: { items: "x" } }]) {
      const client = createRakkoClient({ apiKey: "k", fetch: fakeFetch(200, body) });
      await expect(client.suggestKeywords("断熱")).rejects.toMatchObject({ code: "bad_response" });
    }
  });

  it("つながらないときは接続エラー", async () => {
    const client = createRakkoClient({
      apiKey: "k",
      fetch: (async () => {
        throw new TypeError("fetch failed");
      }) as unknown as typeof fetch,
    });
    await expect(client.accountInfo()).rejects.toMatchObject({ code: "unavailable" });
  });

  it("調べたい言葉は空と長すぎを断る（API を呼ばない）", async () => {
    const calls: Call[] = [];
    const client = createRakkoClient({ apiKey: "k", fetch: fakeFetch(200, ok([]), calls) });
    await expect(client.suggestKeywords(" 　")).rejects.toMatchObject({ code: "invalid_input" });
    await expect(client.questionSearch("あ".repeat(81))).rejects.toMatchObject({ code: "invalid_input" });
    expect(calls).toHaveLength(0);
    expect(normalizeSeedKeyword("a　 b")).toBe("a b");
  });
});
