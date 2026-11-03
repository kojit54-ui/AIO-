"use client";

import { useActionState, useState } from "react";
import { DEFAULT_INVITE_MESSAGE, InviteLetter } from "@/components/InviteLetter";
import { Notice } from "@/components/ui";
import { createInvitation, type InviteState } from "./actions";

/** 招待を作る。宛名とひとことを書くと、相手に届く招待状の見え方をその場で確かめられる（2026-11-03） */
export function InviteForm({ organizationId, organizationName }: { organizationId: string; organizationName: string }) {
  const [state, action, pending] = useActionState<InviteState, FormData>(createInvitation, {});
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState("client_member");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [preview, setPreview] = useState(false);
  const client = role === "client_member";

  return (
    <div className="space-y-3">
      <form action={action} className="space-y-3">
        <input type="hidden" name="organizationId" value={organizationId} />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="block">
            <span className="field-label">招待する人のメールアドレス</span>
            <input name="email" type="email" required className="field" />
          </label>
          <label className="block">
            <span className="field-label">役割</span>
            <select name="role" className="field" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="client_member">顧客担当者</option>
              <option value="coach">コタム担当者</option>
            </select>
          </label>
        </div>
        <label className="block">
          <span className="field-label">宛名（任意）</span>
          <input name="recipientName" maxLength={40} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="例）山田 太郎" className="field" />
          <span className="text-sm text-muted">招待状に「〇〇様」と出ます。空なら「ご担当者様」です。</span>
        </label>
        <label className="block">
          <span className="field-label">ひとこと（任意）</span>
          <textarea name="message" maxLength={400} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={DEFAULT_INVITE_MESSAGE} className="field" />
          <span className="text-sm text-muted">空なら、薄い字の文が入ります。</span>
        </label>
        {client && (
          <label className="flex items-center gap-2 font-bold">
            <input type="checkbox" name="isFree" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="h-5 w-5" />
            無料でご招待（招待状に「無料ご招待」の札を付ける）
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => setPreview((v) => !v)} aria-expanded={preview}>
            {preview ? "見え方を閉じる" : "招待状の見え方を確かめる"}
          </button>
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "作成中…" : "招待リンクを作る"}
          </button>
        </div>
      </form>
      {preview && (
        <div className="rounded-3xl border-2 border-dashed border-brand bg-canvas p-2">
          <p className="px-2 pt-1 text-sm font-black text-brand-dark">相手に届く招待状（見え方の確認。ボタンは押せません）</p>
          <InviteLetter preview organizationName={organizationName} recipientName={recipientName} message={message} isFree={client && isFree}>
            <span className="btn-primary pointer-events-none min-h-14 w-full text-lg opacity-80">同意してはじめる</span>
          </InviteLetter>
        </div>
      )}
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
