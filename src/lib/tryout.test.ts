import { describe, expect, it } from "vitest";
import { READINESS_QUESTIONS, SAMPLE_STORY_SLOT, customerQuestion, missingMaterials, readinessRank, readinessScore, sampleOpening, storyProblem } from "./tryout";

const all = (a: "yes" | "some" | "no") => Object.fromEntries(READINESS_QUESTIONS.map((q) => [q.id, a]));

describe("準備度の診断", () => {
  it("全部はいで100点、全部いいえで0点、少しは半分", () => {
    expect(readinessScore(all("yes"))).toBe(100);
    expect(readinessScore(all("no"))).toBe(0);
    expect(readinessScore(all("some"))).toBe(50);
    expect(readinessScore({})).toBe(0);
  });
  it("足りない材料は、はい以外", () => {
    expect(missingMaterials(all("yes"))).toEqual([]);
    expect(missingMaterials({ ...all("yes"), case: "some" }).map((q) => q.id)).toEqual(["case"]);
  });
  it("段はどの点数でも決まる", () => {
    expect(readinessRank(0).name).toBe("たまご級");
    expect(readinessRank(30).name).toBe("ひよこ級");
    expect(readinessRank(60).name).toBe("わかば級");
    expect(readinessRank(100).name).toBe("エース級");
  });
  it("お客さんの質問に地域と仕事が入る", () => {
    expect(customerQuestion("名古屋", "板金加工")).toBe("名古屋で板金加工を頼むなら、どこがいい？");
    expect(customerQuestion(" ", "")).toBe("近くで仕事を頼むなら、どこがいい？");
  });
});

describe("記事の書き出し（サンプル）", () => {
  it("会社・地域・仕事は使い、答えはそのまま載せない（AIが整える場所を示す）", () => {
    const o = sampleOpening({ company: "山田製作所", region: "岐阜", job: "金属加工", answer: "急ぎの試作を間に合わせて喜ばれた" });
    expect(o.title).toContain("岐阜");
    expect(o.title).toContain("山田製作所");
    expect(o.paragraphs.join("")).not.toContain("急ぎの試作を間に合わせて喜ばれた");
    expect(o.paragraphs[o.storyAt]).toBe(SAMPLE_STORY_SLOT);
  });
  it("答えにない数字を足さない", () => {
    const o = sampleOpening({ company: "A社", region: "愛知", job: "溶接", answer: "難しい溶接を引き受けた" });
    expect(`${o.title}${o.paragraphs.join("")}`).not.toMatch(/[0-9０-９]/);
  });
  it("長い答えは切る", () => {
    const o = sampleOpening({ company: "A", region: "", job: "", answer: "あ".repeat(500) });
    expect(o.paragraphs.join("").length).toBeLessThan(420);
  });
});

describe("1年後のイメージ", () => {
  it("入力した言葉だけで作り、数字を足さない", async () => {
    const { futureScene } = await import("./tryout");
    const s = futureScene({ company: "山田製作所", region: "岐阜県関市", job: "金属の部品加工", answer: "急ぎの試作を間に合わせた" });
    expect(s.ask).toContain("岐阜県関市");
    expect(s.company).toBe("山田製作所");
    expect(s.after).not.toContain("急ぎの試作を間に合わせた");
    expect(`${s.before}${s.after}${s.readerThinks}`).not.toMatch(/[0-9０-９]/);
  });

  it("空の入力でもこわれない", async () => {
    const { futureScene } = await import("./tryout");
    const s = futureScene({ company: "", region: "", job: "", answer: "" });
    expect(s.company).toBe("あなたの会社");
    expect(s.after).not.toContain("「」");
  });
});

describe("答えが記事にできる文か", () => {
  it("意味のない文字は止める", () => {
    for (const bad of ["aaaaaaa", "ああああああ", "asdfghjkl", "！！！！！！", "あいあいあいあい", "テスト"]) expect(storyProblem(bad)).not.toBeNull();
  });
  it("ふつうの答えは通す", () => {
    for (const ok of ["急ぎの試作を間に合わせた", "お客様に喜ばれた仕事", "企業ブランディングが活きて、問い合わせの質が変わった"]) expect(storyProblem(ok)).toBeNull();
  });
});
