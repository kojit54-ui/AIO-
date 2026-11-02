import { generateKeyPairSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ScError, cleanPrivateKey, fetchSnapshot, normalizeSite, scAccount } from "./searchConsole";

const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const env = { GOOGLE_SERVICE_ACCOUNT_EMAIL: "reader@x.iam.gserviceaccount.com", GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: privateKey.export({ type: "pkcs8", format: "pem" }).toString().replace(/\n/g, "\n") };

describe("サイトのURLをそろえる", () => {
  it("URL・ドメインだけ・sc-domain を受けて、それ以外は断る", () => {
    expect(normalizeSite("https://www.example.jp/blog/1")).toBe("https://www.example.jp/");
    expect(normalizeSite(" example.jp ")).toBe("https://example.jp/");
    expect(normalizeSite("http://example.jp")).toBe("http://example.jp/");
    expect(normalizeSite("sc-domain:Example.jp")).toBe("sc-domain:example.jp");
    expect(normalizeSite("ftp://example.jp")).toBeNull();
    expect(normalizeSite("あいう")).toBeNull();
  });
});

describe("Search Console を読む", () => {
  it("鍵がなければ準備がまだ。環境変数の \n は改行に戻す", async () => {
    await expect(fetchSnapshot("https://example.jp/", { env: {} })).rejects.toMatchObject({ code: "not_configured" });
    expect(scAccount(env)?.key).toContain("\n-----END PRIVATE KEY-----");
  });

  it("トークンをもらってから3つ聞き、28日分（3日前まで）にまとめる", async () => {
    const calls: { url: string; body: string }[] = [];
    const fake = (async (url: string, init?: RequestInit) => {
      calls.push({ url, body: String(init?.body) });
      if (url.includes("oauth2")) return Response.json({ access_token: "tok" });
      const dims = JSON.parse(String(init?.body)).dimensions as string[];
      if (!dims.length) return Response.json({ rows: [{ clicks: 5, impressions: 200, ctr: 0.025, position: 12.34 }] });
      return Response.json({ rows: [{ keys: [dims[0] === "query" ? "浴室 リフォーム" : "https://example.jp/a"], clicks: 3, impressions: 90, ctr: 0.03, position: 8.06 }] });
    }) as typeof fetch;
    const s = await fetchSnapshot("https://example.jp/", { env, fetch: fake, now: new Date("2026-11-10T00:00:00Z") });
    expect(s.range).toEqual({ start: "2026-10-11", end: "2026-11-07" });
    expect(s.totals).toEqual({ clicks: 5, impressions: 200, ctr: 2.5, position: 12.3 });
    expect(s.queries[0]).toEqual({ query: "浴室 リフォーム", clicks: 3, impressions: 90, position: 8.1 });
    expect(s.pages[0].page).toBe("https://example.jp/a");
    expect(calls[1].url).toContain(encodeURIComponent("https://example.jp/"));
    // JWT に秘密鍵そのものは入らない
    expect(calls[0].body).not.toContain("PRIVATE");
  });

  it("権限がないときは no_access、サイトが無いときは not_found", async () => {
    const respond = (status: number) => (async (url: string) => (url.includes("oauth2") ? Response.json({ access_token: "tok" }) : new Response("", { status }))) as typeof fetch;
    await expect(fetchSnapshot("https://example.jp/", { env, fetch: respond(403) })).rejects.toMatchObject({ code: "no_access" });
    await expect(fetchSnapshot("https://example.jp/", { env, fetch: respond(404) })).rejects.toBeInstanceOf(ScError);
  });
});

describe("鍵の貼り付けのゆれ", () => {
  const pem = env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const real = pem.replace(/\n/g, "\n");
  it("前後の \" や , 、本当の改行、JSON 丸ごとでも同じ鍵になる", () => {
    expect(cleanPrivateKey(pem)).toBe(real.trim());
    expect(cleanPrivateKey(`"${pem}",`)).toBe(real.trim());
    expect(cleanPrivateKey(real)).toBe(real.trim());
    expect(cleanPrivateKey(JSON.stringify({ client_email: "x", private_key: real }))).toBe(real.trim());
  });

  it("壊れた鍵は、読めないと分かる文で止まる", async () => {
    await expect(fetchSnapshot("https://example.jp/", { env: { ...env, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----abc" }, fetch: (async () => Response.json({})) as typeof fetch })).rejects.toMatchObject({ code: "not_configured" });
  });
});
