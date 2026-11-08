import { describe, expect, it, vi } from "vitest";
import { COLUMNS, isNewColumn, newestColumns, publishedColumns, todayJst } from "./column";
import { INDEXNOW_KEY, columnFeed, freshUrls, pingWebSub, scProperties, submitIndexNow, xmlEscape } from "./indexing";
import { readFileSync } from "node:fs";

const at = (iso: string) => new Date(iso);

describe("公開日での出し分け", () => {
  it("日本時間で日付をそろえる（UTC 15時＝翌日0時）", () => {
    expect(todayJst(at("2026-11-08T14:59:00Z"))).toBe("2026-11-08");
    expect(todayJst(at("2026-11-08T15:00:00Z"))).toBe("2026-11-09");
  });
  it("公開日より前は出さない", () => {
    const first = [...COLUMNS].map((c) => c.published).sort()[0];
    const dayBefore = new Date(Date.parse(`${first}T00:00:00+09:00`) - 1000);
    expect(publishedColumns(dayBefore)).toEqual([]);
    expect(publishedColumns(at("2030-01-01T00:00:00Z"))).toHaveLength(COLUMNS.length);
  });
  it("新しい順は公開日の新しい順", () => {
    const list = newestColumns(at("2030-01-01T00:00:00Z"));
    for (let i = 1; i < list.length; i++) expect(list[i - 1].published >= list[i].published).toBe(true);
  });
  it("新着は公開から7日", () => {
    const c = { ...COLUMNS[0], published: "2026-11-08" };
    expect(isNewColumn(c, at("2026-11-14T10:00:00+09:00"))).toBe(true);
    expect(isNewColumn(c, at("2026-11-15T10:00:00+09:00"))).toBe(false);
  });
});

describe("検索エンジンへの知らせ", () => {
  it("直近に出た・直した記事と、一覧・入口を知らせる。何も無ければ空", () => {
    const c = newestColumns(at("2030-01-01T00:00:00Z"))[0];
    const urls = freshUrls(at(`${c.updated}T12:00:00+09:00`));
    expect(urls).toContain(`https://aio-erabare.jp/column/${c.slug}`);
    expect(urls).toContain("https://aio-erabare.jp/column");
    expect(freshUrls(at("2030-01-01T00:00:00Z"))).toEqual([]);
  });
  it("IndexNow の鍵ファイルが public にあり、中身が鍵と同じ", () => {
    expect(readFileSync(`public/${INDEXNOW_KEY}.txt`, "utf8").trim()).toBe(INDEXNOW_KEY);
  });
  it("IndexNow には host・key・keyLocation・urlList を送る。202 も成功", async () => {
    const f = vi.fn(async () => new Response(null, { status: 202 }));
    const r = await submitIndexNow(["https://aio-erabare.jp/column/a"], f as unknown as typeof fetch);
    expect(r.ok).toBe(true);
    const body = JSON.parse((f.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body).toEqual({ host: "aio-erabare.jp", key: INDEXNOW_KEY, keyLocation: `https://aio-erabare.jp/${INDEXNOW_KEY}.txt`, urlList: ["https://aio-erabare.jp/column/a"] });
    expect(await submitIndexNow([], f as unknown as typeof fetch)).toMatchObject({ ok: true });
    expect(f).toHaveBeenCalledTimes(1);
  });
  it("WebSub はフィードのURLを publish で知らせる", async () => {
    const f = vi.fn(async () => new Response(null, { status: 204 }));
    expect((await pingWebSub(f as unknown as typeof fetch)).ok).toBe(true);
    const body = String((f.mock.calls[0] as unknown as [string, RequestInit])[1].body);
    expect(body).toContain("hub.mode=publish");
    expect(body).toContain(encodeURIComponent("https://aio-erabare.jp/column/feed.xml"));
  });
  it("Search Console はドメイン→URLの順に試す", () => {
    expect(scProperties("https://aio-erabare.jp")).toEqual(["sc-domain:aio-erabare.jp", "https://aio-erabare.jp/"]);
  });
});

describe("フィード", () => {
  it("公開日を迎えた記事だけ、ハブと自分のURLつきで出す", () => {
    const now = at("2030-01-01T00:00:00Z");
    const xml = columnFeed(now);
    expect(xml).toContain('<link rel="hub" href="https://pubsubhubbub.appspot.com/"/>');
    expect(xml).toContain('<link rel="self" type="application/atom+xml" href="https://aio-erabare.jp/column/feed.xml"/>');
    expect(xml.match(/<entry>/g)?.length).toBe(Math.min(50, COLUMNS.length));
    expect(columnFeed(at("2000-01-01T00:00:00Z"))).not.toContain("<entry>");
  });
  it("記号を逃がす", () => {
    expect(xmlEscape(`A&B<"'>`)).toBe("A&amp;B&lt;&quot;&apos;&gt;");
  });
});
