import { describe, expect, it } from "vitest";
import type { MockDb } from "@/mock/store";
import { publishedCount, skippedSteps, townLevel, townPosition, townSteps, type TownStep } from "./town";

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

describe("AIの町すごろく", () => {
  it("記録が無ければスタートのマスにいて、建物は空き地", () => {
    const steps = townSteps(base, "o1", false);
    expect(townPosition(steps)).toBe(0);
    expect(townLevel(publishedCount(base, "o1")).level.name).toBe("空き地");
  });

  it("コマは、いちばん先まで進んだマスの次。飛ばしたマスがあっても戻さない", () => {
    const st = (done: boolean[]) => done.map((d, i) => ({ id: String(i), icon: "", label: String(i), how: "", done: d }) as TownStep);
    // 会社のことはまだだが、書いてチェックして載せた
    const steps = st([false, true, true, true, false, false, false]);
    expect(townPosition(steps)).toBe(4);
    expect(skippedSteps(steps).map((s) => s.id)).toEqual(["0"]);
    expect(townPosition(st([true, true, true, true, true, true, true]))).toBe(7);
  });

  it("最後の2マスは、AIに選ばれる・お客様に選ばれるの順", () => {
    const steps = townSteps(base, "o1", false);
    expect(steps.slice(-2).map((s) => s.stage)).toEqual(["ai", "people"]);
  });

  it("お問い合わせのマスは、会社の人が押したときだけ進む", () => {
    expect(townSteps(base, "o1", false).at(-1)!.done).toBe(false);
    expect(townSteps(base, "o1", true).at(-1)!.done).toBe(true);
  });

  it("載せた本数で建物が育つ（ほかの会社の記事は数えない）", () => {
    const db = {
      ...base,
      articles: [
        ...[1, 2, 3].map((i) => ({ id: `a${i}`, organizationId: "o1", status: "published" })),
        { id: "x", organizationId: "o2", status: "published" },
        { id: "d", organizationId: "o1", status: "drafting" },
      ],
    } as unknown as MockDb;
    expect(publishedCount(db, "o1")).toBe(3);
    const l = townLevel(3);
    expect(l.level.name).toBe("町のお店");
    expect(l.next?.min).toBe(5);
    expect(townLevel(99).next).toBeNull();
  });
});
