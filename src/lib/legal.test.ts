import { describe, expect, it } from "vitest";
import { LEGAL_DOCS, LEGAL_DRAFT, PRIVACY, TERMS, countTodos, isLegalPath, legalLinks } from "./legal";

describe("利用規約・プライバシーポリシー", () => {
  it("案のあいだは利用者の画面にリンクを出さない", () => {
    if (LEGAL_DRAFT) expect(legalLinks()).toEqual([]);
  });

  it("【要確認：…】が残っているうちは案のまま（埋めずに公開しない）", () => {
    const todos = LEGAL_DOCS.reduce((n, d) => n + countTodos(d), 0);
    if (!LEGAL_DRAFT) expect(todos).toBe(0);
    else expect(todos).toBeGreaterThan(0);
  });

  it("AIへ送ることと、送り先の会社を書いている", () => {
    const text = PRIVACY.sections.flatMap((s) => s.items).join("\n");
    for (const name of ["OpenAI", "Anthropic", "Google", "Supabase", "Resend"]) expect(text).toContain(name);
    expect(text).toContain("学習に使われない");
    expect(text).toContain("Stripe");
  });

  it("AIOの成果を約束しない", () => {
    expect(TERMS.sections.flatMap((s) => s.items).join("\n")).toContain("保証しません");
  });

  it("ログインせずに読めるページ", () => {
    expect(isLegalPath("/terms")).toBe(true);
    expect(isLegalPath("/privacy")).toBe(true);
    expect(isLegalPath("/tokushoho")).toBe(true);
    expect(isLegalPath("/mypage")).toBe(false);
  });
});
