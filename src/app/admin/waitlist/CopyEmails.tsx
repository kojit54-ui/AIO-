"use client";

import { useState } from "react";

/** まだ知らせていない人のアドレスを、メールソフトの BCC に貼れる形（, 区切り）でまとめてコピー */
export function CopyEmails({ emails }: { emails: string[] }) {
  const [done, setDone] = useState(false);
  if (emails.length === 0) return null;
  return (
    <button
      type="button"
      className="btn-secondary min-h-10 px-4 py-1"
      onClick={() => navigator.clipboard.writeText(emails.join(", ")).then(() => setDone(true), () => setDone(false))}
    >
      {done ? `${emails.length}人分をコピーしました` : `まだの${emails.length}人のアドレスをまとめてコピー`}
    </button>
  );
}
