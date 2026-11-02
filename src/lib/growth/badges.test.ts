import { describe, expect, it } from "vitest";
import type { MockDb } from "@/mock/store";
import { badges, newlyGot } from "./badges";

const base = {
  organizations: [],
  coachingNotes: [],
  internalNotes: [],
  themes: [],
  referenceArticles: [],
  articles: [],
  versions: [],
  factChecks: [],
  reviews: [],
  aioChecks: [],
  hearing: {},
  draftAnswers: {},
} as unknown as MockDb;

describe("スタンプ帳", () => {
  it("記録が無ければ、どれも取れていない", () => {
    expect(badges(base, "o1").every((b) => !b.got)).toBe(true);
  });

  it("書いた・載せた・つないだ記録からバッジが付く（ほかの会社の記録は数えない）", () => {
    const db = {
      ...base,
      articles: [
        { id: "a1", organizationId: "o1", status: "published", currentVersionId: "v1" },
        { id: "a2", organizationId: "o2", status: "published", currentVersionId: "v2" },
      ],
      versions: [{ id: "v1", articleId: "a1", body: [{ type: "paragraph", text: "x" }], createdAt: "2026-11-01T00:00:00Z" }],
      searchConsole: [{ organizationId: "o1", verifiedAt: "2026-11-02T00:00:00Z" }],
      aioChecks: [{ organizationId: "o1", status: "done", items: [{ ok: true }, { ok: true }], answers: [] }],
    } as unknown as MockDb;
    const got = badges(db, "o1", new Date("2026-11-03T00:00:00Z"))
      .filter((b) => b.got)
      .map((b) => b.id);
    expect(got).toEqual(["first", "publish", "check", "search", "perfect"]);
  });

  it("新しく取ったものだけを返す", () => {
    const list = [
      { id: "a", got: true },
      { id: "b", got: true },
      { id: "c", got: false },
    ] as ReturnType<typeof badges>;
    expect(newlyGot(list, ["a"]).map((b) => b.id)).toEqual(["b"]);
  });
});
