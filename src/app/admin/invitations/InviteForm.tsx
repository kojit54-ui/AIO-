"use client";

import { useActionState, useState } from "react";
import { Notice } from "@/components/ui";
import { createInvitation, type InviteState } from "./actions";

export function InviteForm({ organizationId }: { organizationId: string }) {
  const [state, action, pending] = useActionState<InviteState, FormData>(createInvitation, {});
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-3">
      <form action={action} className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <input type="hidden" name="organizationId" value={organizationId} />
        <label className="block">
          <span className="field-label">招待する人のメールアドレス</span>
          <input name="email" type="email" required className="field" />
        </label>
        <label className="block">
          <span className="field-label">役割</span>
          <select name="role" className="field" defaultValue="client_member">
            <option value="client_member">顧客担当者</option>
            <option value="coach">コタム担当者</option>
          </select>
        </label>
        <button type="submit" className="btn-primary" disabled={pending}>
          {pending ? "作成中…" : "招待リンクを作る"}
        </button>
      </form>
      {state.error && <Notice tone="danger">{state.error}</Notice>}
      {state.link && (
        <Notice tone="ok" title={`${state.email} への招待リンクを作りました（7日間有効）`}>
          <p className="mb-2">このリンクは今だけ表示します。コピーして、ご本人にメールなどで送ってください。</p>
          <p className="mb-2 break-all rounded bg-surface px-2 py-1 font-mono text-ink">{state.link}</p>
          <button
            type="button"
            className="btn-secondary min-h-9 px-3 py-1 text-sm"
            onClick={() => navigator.clipboard.writeText(state.link!).then(() => setCopied(true), () => setCopied(false))}
          >
            {copied ? "コピーしました" : "リンクをコピー"}
          </button>
        </Notice>
      )}
    </div>
  );
}
