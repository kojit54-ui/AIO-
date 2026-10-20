"use client";

import { useState } from "react";
import type { CoachingInternalNote, CoachingNote, CompanyProfile, ReferenceArticle } from "@/types/domain";

export const PROFILE_FIELDS: [keyof CompanyProfile, string, string][] = [
  ["business", "事業内容", "例：戸建て住宅のリフォーム（断熱・水回り）"],
  ["targetCustomers", "対象顧客", "例：市内在住の50〜70代の持ち家世帯"],
  ["strengths", "強み", "例：一級建築士が現地調査から施工管理まで担当"],
  ["tone", "文体", "例：ですます調。専門用語には短い説明を添える"],
  ["bannedExpressions", "禁止表現", "例：「業界最安」など根拠を示せない表現"],
  ["contact", "問い合わせ先", "例：無料の住まい点検（電話またはWebフォーム）"],
];

const EMPTY_PROFILE: CompanyProfile = { business: "", targetCustomers: "", strengths: "", tone: "", bannedExpressions: "", contact: "" };

export function ProfileForm({ initial, onSave, onCancel }: { initial: CompanyProfile | null; onSave: (p: CompanyProfile) => Promise<boolean>; onCancel?: () => void }) {
  const [p, setP] = useState<CompanyProfile>(initial ?? EMPTY_PROFILE);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSave(p);
        setBusy(false);
      }}
    >
      {PROFILE_FIELDS.map(([k, label, ex]) => (
        <div key={k}>
          <label htmlFor={`profile-${k}`} className="field-label">
            {label}
          </label>
          <textarea id={`profile-${k}`} className="field" rows={2} required placeholder={ex} value={p[k]} onChange={(e) => setP({ ...p, [k]: e.target.value })} />
        </div>
      ))}
      <p className="text-sm text-muted">保存すると、顧客に内容の確認を依頼します。確認されるまでAIには渡しません。</p>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={busy}>
          保存する
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            やめる
          </button>
        )}
      </div>
    </form>
  );
}

type NoteInput = Omit<CoachingNote, "id" | "organizationId" | "targetMonth">;

export function CoachingNoteForm({
  initial,
  internal,
  onSave,
  onCancel,
}: {
  initial: CoachingNote | undefined;
  internal: CoachingInternalNote | undefined;
  onSave: (n: NoteInput, internal: string) => Promise<boolean>;
  onCancel?: () => void;
}) {
  const [n, setN] = useState<NoteInput>({
    focus: initial?.focus ?? "",
    audience: initial?.audience ?? "",
    purpose: initial?.purpose ?? "",
    avoid: initial?.avoid ?? "",
    clientVisibleNote: initial?.clientVisibleNote ?? "",
  });
  const [internalNote, setInternalNote] = useState(internal?.note ?? "");
  const [busy, setBusy] = useState(false);
  const fields: [keyof NoteInput, string][] = [
    ["focus", "重点テーマ"],
    ["audience", "想定読者"],
    ["purpose", "記事の目的"],
    ["avoid", "避ける内容"],
  ];
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSave(n, internalNote);
        setBusy(false);
      }}
    >
      <div>
        <label htmlFor="note-client" className="field-label">
          顧客向けメモ（顧客に表示し、AIにも渡します）
        </label>
        <textarea id="note-client" className="field" rows={3} required value={n.clientVisibleNote} onChange={(e) => setN({ ...n, clientVisibleNote: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([k, label]) => (
          <div key={k}>
            <label htmlFor={`note-${k}`} className="field-label">
              {label}
            </label>
            <input id={`note-${k}`} className="field" required={k !== "avoid"} value={n[k]} onChange={(e) => setN({ ...n, [k]: e.target.value })} />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-dashed border-line p-3">
        <label htmlFor="note-internal" className="field-label">
          コタム内部メモ（顧客には見えません。AIにも渡しません）
        </label>
        <textarea id="note-internal" className="field" rows={2} value={internalNote} onChange={(e) => setInternalNote(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={busy}>
          保存する
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            やめる
          </button>
        )}
      </div>
    </form>
  );
}

type RefInput = Omit<ReferenceArticle, "id" | "organizationId">;

export function ReferenceArticleForm({ onSave, onCancel }: { onSave: (r: RefInput) => Promise<boolean>; onCancel: () => void }) {
  const [r, setR] = useState<RefInput>({ title: "", body: "", url: null, publishedOn: null, usableForAi: true });
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-3 space-y-3 rounded-lg bg-canvas p-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        if (await onSave(r)) onCancel();
        setBusy(false);
      }}
    >
      <div>
        <label htmlFor="ref-title" className="field-label">
          タイトル
        </label>
        <input id="ref-title" className="field" required value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} />
      </div>
      <div>
        <label htmlFor="ref-body" className="field-label">
          本文（ブログから貼り付け）
        </label>
        <textarea id="ref-body" className="field" rows={5} required value={r.body} onChange={(e) => setR({ ...r, body: e.target.value })} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="ref-url" className="field-label">
            公開URL（任意）
          </label>
          <input id="ref-url" type="url" className="field" value={r.url ?? ""} onChange={(e) => setR({ ...r, url: e.target.value || null })} />
        </div>
        <div>
          <label htmlFor="ref-date" className="field-label">
            公開日（任意）
          </label>
          <input id="ref-date" type="date" className="field" value={r.publishedOn ?? ""} onChange={(e) => setR({ ...r, publishedOn: e.target.value || null })} />
        </div>
      </div>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={r.usableForAi} onChange={(e) => setR({ ...r, usableForAi: e.target.checked })} />
        AIの参考に使う
      </label>
      <p className="text-sm text-muted">URLからの自動取得はしません。本文を貼り付けてください。</p>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary" disabled={busy}>
          登録する
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          やめる
        </button>
      </div>
    </form>
  );
}
