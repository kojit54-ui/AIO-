"use client";

// 会社ごとの連絡先（担当者名・電話番号）。担当のトップの「声をかけたい会社」に出し、その場で直せる（/api/admin/contact-info）。

import { useState } from "react";

export type OrgContactInfo = { name: string; phone: string } | null;

export function ContactInfo({ organizationId, info, onSaved }: { organizationId: string; info: OrgContactInfo; onSaved: (i: OrgContactInfo) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(info?.name ?? "");
  const [phone, setPhone] = useState(info?.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const save = async () => {
    setBusy(true);
    setError(false);
    const r = await fetch("/api/admin/contact-info", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ organizationId, name, phone }) }).catch(() => null);
    const j = r?.ok ? ((await r.json()) as { info: OrgContactInfo }) : null;
    setBusy(false);
    if (!j) return setError(true);
    onSaved(j.info);
    setOpen(false);
  };
  if (open) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="担当者名 例）山田さん" className="field min-h-9 w-40 py-1" aria-label="お客様の担当者名" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} inputMode="tel" placeholder="電話 例）03-1234-5678" className="field min-h-9 w-48 py-1" aria-label="お客様の電話番号" />
        <button type="button" className="btn-primary min-h-9 px-3 py-1" disabled={busy} onClick={save}>
          {busy ? "残しています…" : "残す"}
        </button>
        <button type="button" className="font-semibold text-muted underline" onClick={() => setOpen(false)}>
          やめる
        </button>
        {error && <span className="w-full text-danger">残せませんでした。時間をおいて、もう一度押してください。</span>}
      </div>
    );
  }
  const has = info && (info.name || info.phone);
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      {has ? (
        <>
          {info.name && <b>{info.name}</b>}
          {info.phone && (
            <a href={`tel:${info.phone.replace(/[^\d+]/g, "")}`} className="font-bold text-brand-dark underline">
              電話 {info.phone}
            </a>
          )}
        </>
      ) : (
        <span className="text-muted">担当者名・電話番号はまだ入っていません</span>
      )}
      <button type="button" className="text-xs font-bold text-brand-dark underline" onClick={() => setOpen(true)}>
        {has ? "直す" : "入れる"}
      </button>
    </p>
  );
}
