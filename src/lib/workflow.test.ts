import { describe, expect, it } from "vitest";
import type { Article } from "@/types/domain";
import { applyAction, TransitionError } from "./workflow";

const base: Article = {
  id: "a1",
  organizationId: "o1",
  themeId: "t1",
  status: "drafting",
  currentVersionId: "v1",
  approvedVersionId: null,
  reviewRequestedVersionId: null,
  publishedUrl: null,
  publishedAt: null,
  publishedWithoutApproval: false,
  lockVersion: 0,
  updatedAt: "2026-10-20T00:00:00Z",
};
const publish = { type: "publish", url: "https://example.com/blog/1", at: "2026-10-21T00:00:00Z" } as const;

function code(fn: () => unknown) {
  try {
    fn();
  } catch (e) {
    return (e as TransitionError).code;
  }
  return null;
}

describe("applyAction", () => {
  it("確認依頼で確認待ちになり、その版が固定対象になる", () => {
    const a = applyAction(base, { type: "request_review" }, "client_member", "optional");
    expect(a.status).toBe("in_review");
    expect(a.reviewRequestedVersionId).toBe("v1");
  });

  it("確認待ち中の編集は状態を変えず、確認待ちの版も変えない", () => {
    const inReview = applyAction(base, { type: "request_review" }, "client_member", "optional");
    const edited = applyAction(inReview, { type: "edit", newVersionId: "v2" }, "client_member", "optional");
    expect(edited.status).toBe("in_review");
    expect(edited.reviewRequestedVersionId).toBe("v1");
    expect(edited.currentVersionId).toBe("v2");
  });

  it("承認すると確認依頼した版が承認版になる", () => {
    const inReview = applyAction(base, { type: "request_review" }, "client_member", "optional");
    const edited = applyAction(inReview, { type: "edit", newVersionId: "v2" }, "client_member", "optional");
    const approved = applyAction(edited, { type: "approve" }, "coach", "optional");
    expect(approved.status).toBe("approved");
    expect(approved.approvedVersionId).toBe("v1");
  });

  it("承認後に編集すると承認が無効になり作成中に戻る", () => {
    const approved: Article = { ...base, status: "approved", approvedVersionId: "v1" };
    const edited = applyAction(approved, { type: "edit", newVersionId: "v2" }, "client_member", "required");
    expect(edited.status).toBe("drafting");
    expect(edited.approvedVersionId).toBeNull();
  });

  it("修正依頼の記事は編集で作成中に戻り、再び確認依頼できる", () => {
    const cr: Article = { ...base, status: "changes_requested" };
    const edited = applyAction(cr, { type: "edit", newVersionId: "v2" }, "client_member", "required");
    expect(edited.status).toBe("drafting");
    expect(applyAction(cr, { type: "request_review" }, "client_member", "required").status).toBe("in_review");
  });

  it("確認依頼が必須の会社では未承認の記事を公開済みにできない", () => {
    expect(code(() => applyAction(base, publish, "client_member", "required"))).toBe("approval_required");
  });

  it("任意の会社では作成中から公開済みにでき、未承認公開として記録する", () => {
    const p = applyAction(base, publish, "client_member", "optional");
    expect(p.status).toBe("published");
    expect(p.publishedWithoutApproval).toBe(true);
  });

  it("承認済みからの公開は未承認公開にならない", () => {
    const p = applyAction({ ...base, status: "approved", approvedVersionId: "v1" }, publish, "client_member", "required");
    expect(p.publishedWithoutApproval).toBe(false);
  });

  it("公開後の修正は作成中に戻り、公開URLは残る", () => {
    const p = applyAction(base, publish, "client_member", "optional");
    const edited = applyAction(p, { type: "edit", newVersionId: "v2" }, "client_member", "optional");
    expect(edited.status).toBe("drafting");
    expect(edited.publishedUrl).toBe(publish.url);
  });

  it("役割に合わない操作は拒否する", () => {
    const inReview: Article = { ...base, status: "in_review", reviewRequestedVersionId: "v1" };
    expect(code(() => applyAction(inReview, { type: "approve" }, "client_member", "optional"))).toBe("forbidden");
    expect(code(() => applyAction(base, { type: "edit", newVersionId: "v2" }, "coach", "optional"))).toBe("forbidden");
  });

  it("http(s)以外の公開URLは拒否する", () => {
    expect(code(() => applyAction(base, { ...publish, url: "javascript:alert(1)" }, "client_member", "optional"))).toBe(
      "invalid_url",
    );
  });

  it("操作のたびに lockVersion が増える", () => {
    expect(applyAction(base, { type: "request_review" }, "client_member", "optional").lockVersion).toBe(1);
  });
});
