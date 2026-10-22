"use client";

import Link from "next/link";
import type { ArticleStatus } from "@/types/domain";
import { STATUS_LABEL } from "@/lib/workflow";

const STATUS_STYLE: Record<ArticleStatus, string> = {
  drafting: "bg-canvas text-ink border-line",
  in_review: "bg-brand-soft text-brand-dark border-brand-soft",
  changes_requested: "bg-warn-soft text-warn border-warn-soft",
  approved: "bg-ok-soft text-ok border-ok-soft",
  published: "bg-ink text-white border-ink",
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-3 py-0.5 text-sm font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SampleNotice({ className = "" }: { className?: string }) {
  return (
    <p className={`rounded-lg border border-warn-soft bg-warn-soft px-3 py-2 text-sm text-warn ${className}`} role="note">
      画面試作のサンプルです。AIはまだ接続していません。文章は回答を並べ替えて作っています。
    </p>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warn" | "danger" | "ok"; title?: string; children?: React.ReactNode }) {
  const style = {
    info: "border-brand-soft bg-brand-soft text-brand-dark",
    warn: "border-warn-soft bg-warn-soft text-warn",
    danger: "border-danger-soft bg-danger-soft text-danger",
    ok: "border-ok-soft bg-ok-soft text-ok",
  }[tone];
  return (
    <div className={`rounded-lg border px-4 py-3 ${style}`} role={tone === "danger" ? "alert" : "status"}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className="text-sm">{children}</div>}
    </div>
  );
}

export function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3" aria-label="読み込み中" role="status">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="h-5 rounded bg-line" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <main className="page">
      <div className="card">
        <Skeleton lines={5} />
      </div>
    </main>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="card text-center">
      <p className="text-lg font-semibold">{title}</p>
      {children && <div className="mt-1 text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Forbidden() {
  return (
    <main className="page">
      <EmptyState title="この記事を表示する権限がありません" action={<Link className="btn-secondary" href="/">ホームへ戻る</Link>}>
        別の会社の記事か、担当から外れた会社の記事です。
      </EmptyState>
    </main>
  );
}

export function NotFound({ what = "記事" }: { what?: string }) {
  return (
    <main className="page">
      <EmptyState title={`${what}が見つかりません`} action={<Link className="btn-secondary" href="/">ホームへ戻る</Link>} />
    </main>
  );
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${y}年${Number(m)}月`;
}

/** 生成中の表示。画面を閉じても続く前提の文言にする */
export function GeneratingOverlay({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4" role="alertdialog" aria-live="assertive" aria-label={label}>
      <div className="card max-w-sm text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" aria-hidden />
        <p className="font-semibold">{label}</p>
        <p className="mt-1 text-sm text-muted">この画面を閉じても続きます。</p>
      </div>
    </div>
  );
}

export function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="card w-full max-w-md">
        <h2 id="dialog-title" className="mb-3 text-lg font-bold">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
