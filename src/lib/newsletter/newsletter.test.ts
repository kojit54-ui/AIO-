import { describe, expect, it } from "vitest";
import type { MockDb } from "@/mock/store";
import { newsletterInput, renderNewsletter } from "./content";
import { smtpConfig, unsubscribeSig, verifyUnsubscribe } from "./send";
import { currentMonthJstFor, previousMonthJst, sendTestNewsletter } from "./server";
import type { SupabaseClient } from "@supabase/supabase-js";

const db = {
  organizations: [{ id: "o1", name: "さくら<住まい>工房" }],
  articles: [{ id: "a1", organizationId: "o1", status: "published", currentVersionId: "v1", publishedAt: "2026-10-20T00:00:00Z" }],
  versions: [{ id: "v1", articleId: "a1", body: [{ type: "paragraph", text: "x" }], createdAt: "2026-10-10T00:00:00Z" }],
  aioChecks: [],
  referenceArticles: [],
  knowledgeNotes: [],
  hearing: {},
  searchConsole: [
    {
      organizationId: "o1",
      verifiedAt: "2026-10-01T00:00:00Z",
      snapshot: { range: { start: "", end: "" }, totals: { clicks: 12, impressions: 3400, ctr: 0.4, position: 20 }, queries: [{ query: "内窓 札幌", clicks: 1, impressions: 300, position: 14.6 }], pages: [] },
    },
  ],
  aioMentions: [],
} as unknown as MockDb;

describe("しおり通信の中身", () => {
  it("その月の記録から、まとめ・続けた月・検索の数字・あと一歩の言葉を出す", () => {
    const i = newsletterInput(db, "o1", "2026-10");
    expect(i).toMatchObject({ written: 1, published: 1, streak: 1, search: { impressions: 3400, near: [{ query: "内窓 札幌", position: 15 }] } });
    expect(i.newStamps).toEqual([]);
    expect(i.stampIds).toContain("publish");
  });

  it("前に送ったときのスタンプと比べて、新しく取ったものを出す", () => {
    expect(newsletterInput(db, "o1", "2026-10", ["first"]).newStamps).toEqual(["デビュー", "検索とつながった"]);
  });

  it("すごろくの進み具合と次のマスを出す（スタンプ帳ではなく、すごろくの言い方で）", () => {
    const i = newsletterInput(db, "o1", "2026-10");
    expect(i.town.total).toBe(7);
    expect(i.town.at).toBeGreaterThan(0);
    const m = renderNewsletter(i, { appUrl: "https://app.example", unsubscribeUrl: "#" });
    expect(m.text).toContain(`■ AIの町すごろく（${i.town.at} / 7マス）`);
    expect(m.text).not.toContain("スタンプ帳");
  });

  it("会社名などはエスケープし、受け取らないのリンクを入れる", () => {
    const m = renderNewsletter(newsletterInput(db, "o1", "2026-10"), { appUrl: "https://app.example", unsubscribeUrl: "https://app.example/u?x=1" });
    expect(m.subject).toBe("しおり通信 2026年10月号｜さくら<住まい>工房さまの今月のまとめ");
    expect(m.html).toContain("さくら&lt;住まい&gt;工房");
    expect(m.html).not.toContain("さくら<住まい>");
    expect(m.text).toContain("このメールを受け取らない：https://app.example/u?x=1");
    expect(m.text).toContain("「内窓 札幌」（いま15位）");
  });

  it("その月に新しくなったことがあれば、一覧へのリンクと一緒に入れる", () => {
    const nov = renderNewsletter(newsletterInput(db, "o1", "2026-11"), { appUrl: "https://app.example", unsubscribeUrl: "#" });
    expect(nov.text).toContain("■ 今月、新しくなったこと");
    expect(nov.text).toContain("https://app.example/updates");
    expect(nov.html).toContain("今月、新しくなったこと");
    const oct = renderNewsletter(newsletterInput(db, "o1", "2026-10"), { appUrl: "https://app.example", unsubscribeUrl: "#" });
    expect(oct.text).not.toContain("新しくなったこと");
  });
});

describe("送る準備", () => {
  it("前の月は日本時間で数える（1日の朝9時に送る）", () => {
    expect(previousMonthJst(new Date("2026-11-01T00:00:00Z"))).toBe("2026-10");
    expect(previousMonthJst(new Date("2026-12-31T16:00:00Z"))).toBe("2026-12");
  });

  it("SMTP の設定がそろわなければ送らない。アプリ パスワードの空白は取る", () => {
    expect(smtpConfig({})).toBeNull();
    expect(smtpConfig({ SMTP_USER: "aio@co-tam.co.jp", SMTP_PASS: "abcd efgh ijkl mnop" })).toMatchObject({ host: "smtp.gmail.com", port: 465, pass: "abcdefghijklmnop", from: "aio@co-tam.co.jp" });
  });

  it("試しに送るのは、会社の担当の方だけ。送る準備が無ければ送らない", async () => {
    expect(currentMonthJstFor(new Date("2026-10-31T15:30:00Z"))).toBe("2026-11");
    const userDb = (role: string | null) =>
      ({
        auth: { getUser: async () => ({ data: { user: { id: "u1", email: "a@example.jp" } } }) },
        from: () => {
          const q = { select: () => q, eq: () => q, is: () => q, limit: () => q, maybeSingle: async () => ({ data: role ? { organization_id: "o1", role } : null }) };
          return q;
        },
      }) as unknown as SupabaseClient;
    const admin = {} as SupabaseClient;
    expect(await sendTestNewsletter({ user: userDb(null), admin, appUrl: "", env: {} })).toMatchObject({ ok: false, code: "forbidden" });
    expect(await sendTestNewsletter({ user: userDb("client_member"), admin, appUrl: "", env: {} })).toMatchObject({ ok: false, code: "not_configured" });
  });

  it("受け取らないのリンクは、署名が合うときだけ通す", () => {
    const env = { NEWSLETTER_SECRET: "s3cret" };
    const sig = unsubscribeSig("u1", env);
    expect(verifyUnsubscribe("u1", sig, env)).toBe(true);
    expect(verifyUnsubscribe("u2", sig, env)).toBe(false);
    expect(verifyUnsubscribe("u1", sig, {})).toBe(false);
  });
});
