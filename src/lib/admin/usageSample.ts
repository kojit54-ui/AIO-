import type { UsageInput } from "./usage";

// 見本表示用の架空の会社。実在の会社・数字ではない。
export function sampleUsageInput(now: Date): UsageInput {
  const ago = (days: number, hour = 1) => new Date(now.getTime() - days * 24 * 3600_000 - hour * 3600_000).toISOString();
  const orgs = [
    { id: "s1", name: "（見本）山田精工" },
    { id: "s2", name: "（見本）昇文堂印刷" },
    { id: "s3", name: "（見本）北川金型" },
    { id: "s4", name: "（見本）みどり樹脂" },
  ];
  const activity = [
    ...[0, 1, 2, 4, 6, 9, 12, 15, 20].map((d) => ({ organization_id: "s1", at: ago(d) })),
    ...[9, 11, 18].map((d) => ({ organization_id: "s2", at: ago(d) })),
    ...[22, 25].map((d) => ({ organization_id: "s3", at: ago(d) })),
  ];
  const runs = [
    ...[0, 1, 2, 4, 6].flatMap((d) => [
      { organization_id: "s1", kind: "body", status: "succeeded", cost_yen: 38, created_at: ago(d) },
      { organization_id: "s1", kind: "aio_check", status: "succeeded", cost_yen: 12, created_at: ago(d) },
      { organization_id: "s1", kind: "image", status: d === 4 ? "failed" : "succeeded", cost_yen: 9, created_at: ago(d) },
    ]),
    { organization_id: "s2", kind: "hearing", status: "succeeded", cost_yen: 4, created_at: ago(9) },
    { organization_id: "s2", kind: "keyword_proposal", status: "succeeded", cost_yen: 6, created_at: ago(11) },
    { organization_id: "s1", kind: "body", status: "succeeded", cost_yen: 410, created_at: ago(40) },
    { organization_id: "s3", kind: "body", status: "succeeded", cost_yen: 120, created_at: ago(40) },
  ];
  return {
    now,
    orgs,
    runs,
    trialRuns: [0, 1, 1, 3].map((d) => ({ cost_yen: 2, created_at: ago(d) })),
    activity,
    articles: [
      { organization_id: "s1", status: "published" },
      { organization_id: "s1", status: "published" },
      { organization_id: "s1", status: "drafting" },
      { organization_id: "s2", status: "drafting" },
      { organization_id: "s3", status: "published" },
    ],
    hearing: [
      ...Array.from({ length: 10 }, () => ({ organization_id: "s1", is_draft: false })),
      ...Array.from({ length: 4 }, () => ({ organization_id: "s2", is_draft: false })),
      ...Array.from({ length: 7 }, () => ({ organization_id: "s3", is_draft: false })),
    ],
    budgetYen: 10000,
  };
}
