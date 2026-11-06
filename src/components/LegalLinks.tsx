// 利用規約・プライバシーポリシーへのリンク。文面が案のあいだは何も出さない（src/lib/legal.ts）
import Link from "next/link";
import { legalLinks } from "@/lib/legal";

export function LegalLinks({ className = "" }: { className?: string }) {
  const links = legalLinks();
  if (links.length === 0) return null;
  return (
    <p className={`flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm ${className}`}>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="text-brand-dark underline">
          {l.label}
        </Link>
      ))}
    </p>
  );
}

/** 招待状の「同意してはじめる」の上に出す説明 */
export function ConsentNote() {
  const links = legalLinks();
  return (
    <p className="text-sm text-muted">
      入力した内容は、記事を作るためにAIへ送信します。他の会社に見られることはありません。
      {links.length === 0 ? (
        "利用規約とプライバシーの説明は準備中です。"
      ) : (
        <>
          「同意してはじめる」を押すと、
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && "と"}
              <Link href={l.href} target="_blank" className="font-bold text-brand-dark underline">
                {l.label}
              </Link>
            </span>
          ))}
          に同意したことになります。
        </>
      )}
    </p>
  );
}
