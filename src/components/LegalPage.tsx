// 利用規約・プライバシーポリシー・特商法の表記を出す（src/lib/legal.ts）。ログインなしで開ける
import Link from "next/link";
import { ShioriTalk } from "@/components/talk";
import { CONTACT_EMAIL, LEGAL_DOCS, LEGAL_DRAFT, LEGAL_VERSION, TODO_MARK, type LegalDoc } from "@/lib/legal";
import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";

/** 【要確認：…】を黄色の札にする */
function Text({ text }: { text: string }) {
  const parts = text.split(/(【要確認：[^】]*】)/);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith(TODO_MARK) ? (
          <mark key={i} className="rounded bg-warn-soft px-1 font-bold text-warn">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const list = doc.path !== "/tokushoho";
  return (
    <main className="page max-w-2xl space-y-5">
      <Link href="/" className="text-sm text-brand-dark underline">
        {SERVICE_NAME}へ戻る
      </Link>
      {LEGAL_DRAFT && (
        <p className="rounded-2xl border border-warn-soft bg-warn-soft px-4 py-3 text-sm font-bold text-warn" role="status">
          この文面は案です（コタムで確認中）。黄色の札のところは、まだ決まっていません。
        </p>
      )}
      <div className="space-y-1">
        <h1 className="text-2xl font-black sm:text-3xl">{doc.title}</h1>
        <p className="text-sm text-muted">{LEGAL_VERSION}</p>
      </div>
      {doc.path !== "/tokushoho" && (
        <ShioriTalk mood="point" lines={["かたい言葉はなるべく使わずに書きました。", "大事なところは、各章の「かんたんに言うと」を読んでくださいね。"]} />
      )}
      <p>{doc.lead}</p>
      {doc.sections.map((s) => (
        <section key={s.title} className="card space-y-2">
          <h2 className="text-lg font-black">{s.title}</h2>
          {s.plain && (
            <p className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-bold text-brand-dark">かんたんに言うと：{s.plain}</p>
          )}
          {list ? (
            <ol className="list-decimal space-y-1 pl-5">
              {s.items.map((t) => (
                <li key={t}>
                  <Text text={t} />
                </li>
              ))}
            </ol>
          ) : (
            <dl className="space-y-2">
              {s.items.map((t) => {
                const [k, ...v] = t.split("：");
                return (
                  <div key={t} className="border-b border-line pb-2 last:border-0">
                    <dt className="text-sm font-bold text-muted">{k}</dt>
                    <dd>
                      <Text text={v.join("：")} />
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
        </section>
      ))}
      <section className="card space-y-1">
        <h2 className="font-black">お問い合わせ</h2>
        <p>
          {SERVICE_OPERATOR}　<a className="font-bold text-brand-dark underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>
      <nav className="flex flex-wrap gap-4 pb-6 text-sm">
        {LEGAL_DOCS.filter((d) => d.path !== doc.path).map((d) => (
          <Link key={d.path} href={d.path} className="font-bold text-brand-dark underline">
            {d.title}
          </Link>
        ))}
      </nav>
    </main>
  );
}
