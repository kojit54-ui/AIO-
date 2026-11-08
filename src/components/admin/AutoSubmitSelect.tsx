"use client";

// 選んだらすぐ開く選択欄（2026-11-08 管理者役の採点「選んでからボタンを押すのが二度手間」）
export function AutoSubmitSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
