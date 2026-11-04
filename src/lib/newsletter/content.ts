// 毎月のしおり通信（メール）の中身（docs/DECISIONS.md 2026-11-03）。画面の見本とサーバーの送信で同じものを使う。
// 数字はどれも実際の記録から出す（src/lib/growth/monthly.ts・badges.ts・nearQueries.ts）。

import { SERVICE_NAME, SERVICE_OPERATOR } from "@/lib/brand";
import { badges } from "@/lib/growth/badges";
import { monthlySummary, writingStreak } from "@/lib/growth/monthly";
import { nearQueries } from "@/lib/growth/nearQueries";
import type { MockDb } from "@/mock/store";
import { updatesInMonth } from "@/lib/updates";

export interface NewsletterInput {
  orgName: string;
  /** まとめる月（YYYY-MM） */
  month: string;
  written: number;
  published: number;
  aioScore: number | null;
  learned: number;
  streak: number;
  stampsGot: number;
  stampsTotal: number;
  newStamps: string[];
  /** 取ったスタンプの id（次の月に「新しく取ったもの」を出すため、送った記録に残す） */
  stampIds: string[];
  nextStamp: { title: string; how: string } | null;
  search: { impressions: number; clicks: number; near: { query: string; position: number }[] } | null;
  mentioned: boolean;
}

const monthEnd = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0, 23, 59, 59));
};

/** 記録（MockDb の形）から、その月のしおり通信の材料を作る */
export function newsletterInput(db: MockDb, orgId: string, month: string, prevStampIds?: string[]): NewsletterInput {
  const org = db.organizations.find((o) => o.id === orgId);
  const s = monthlySummary(db, orgId, month);
  const end = monthEnd(month);
  const list = badges(db, orgId, end);
  const sc = (db.searchConsole ?? []).find((x) => x.organizationId === orgId && x.verifiedAt && x.snapshot);
  const next = list.find((b) => !b.got);
  return {
    orgName: org?.name ?? "",
    month,
    written: s.written,
    published: s.published,
    aioScore: s.score,
    learned: s.learned,
    streak: writingStreak(db, orgId, end),
    stampsGot: list.filter((b) => b.got).length,
    stampsTotal: list.length,
    // 前の月に送ったときのスタンプと比べる。前の記録が無ければ出さない
    newStamps: prevStampIds ? list.filter((b) => b.got && !prevStampIds.includes(b.id)).map((b) => b.title) : [],
    stampIds: list.filter((b) => b.got).map((b) => b.id),
    nextStamp: next ? { title: next.title, how: next.how } : null,
    search: sc?.snapshot
      ? {
          impressions: sc.snapshot.totals.impressions,
          clicks: sc.snapshot.totals.clicks,
          near: nearQueries(sc.snapshot, { exclude: [org?.name ?? ""] }).map((q) => ({ query: q.query, position: Math.round(q.position) })),
        }
      : null,
    mentioned: (db.aioMentions ?? []).some((x) => x.organizationId === orgId && x.mentioned && x.createdAt.slice(0, 7) === month),
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (n: number) => n.toLocaleString("ja-JP");

/** しおりのひとこと。その月の様子で変える */
export function shioriLine(i: NewsletterInput): string {
  if (i.mentioned) return "今月、AIの答えにあなたの会社が出てきました！積み重ねが実ってきています。";
  if (i.published > 0) return `今月は${i.published}本の記事をブログに載せましたね。おつかれさまでした！`;
  if (i.written > 0) return "今月も記事を書きましたね。でも、ブログに載せるまではお客様に届きません。載せるところまで進めましょう。";
  return "今月は1本もありませんでしたよ。続けて書くほど、AIにもお客様にも見つけてもらいやすくなります。来月は質問に答えるだけの1本から、また始めましょう。";
}

/** 件名・本文（テキスト）・本文（HTML） */
export function renderNewsletter(i: NewsletterInput, links: { appUrl: string; unsubscribeUrl: string }) {
  const [y, m] = i.month.split("-");
  const label = `${y}年${Number(m)}月`;
  const subject = `しおり通信 ${label}号｜${i.orgName}さまの今月のまとめ`;
  const stats = [
    { label: "書いた記事", value: `${i.written}本` },
    { label: "公開した記事", value: `${i.published}本` },
    { label: "しおりが覚えたこと", value: `+${i.learned}` },
    { label: "AIOのチェック", value: i.aioScore === null ? "—" : `${i.aioScore}点` },
  ];
  const lines: string[] = [
    `${i.orgName}さま`,
    "",
    `しおり通信 ${label}号です。`,
    shioriLine(i),
    "",
    "■ 今月のまとめ",
    ...stats.map((x) => `・${x.label}：${x.value}`),
    i.streak > 0 ? `・🔥 ${i.streak}か月つづけて書いています` : "",
    "",
    `■ スタンプ帳（${i.stampsGot} / ${i.stampsTotal}）`,
    ...(i.newStamps.length ? [`・今月もらったスタンプ：${i.newStamps.join("、")}`] : []),
    i.nextStamp ? `・次のスタンプ「${i.nextStamp.title}」：${i.nextStamp.how}` : "・スタンプが全部そろいました！",
  ];
  const news = updatesInMonth(i.month);
  if (news.length) lines.push("", "■ 今月、新しくなったこと", ...news.map((u) => `・${u.title}`), `${links.appUrl}/updates`);
  if (i.search) {
    lines.push("", "■ 検索での見られ方（Search Console、28日分）", `・検索に出た回数：${num(i.search.impressions)}回`, `・クリックされた回数：${num(i.search.clicks)}回`);
    if (i.search.near.length) lines.push("・あと一歩で上位の言葉：", ...i.search.near.map((q) => `　「${q.query}」（いま${q.position}位）`));
  }
  lines.push("", "■ 来月の1本", "質問に答えるだけで記事になります。", links.appUrl, "", "――", `${SERVICE_NAME}（案内役：しおり）`, `このメールを受け取らない：${links.unsubscribeUrl}`);
  const text = lines.filter((x, n, all) => !(x === "" && all[n - 1] === "")).join("\n");

  const card = (inner: string) => `<tr><td style="padding:8px 24px"><div style="background:#ffffff;border:2px solid #dbe7fb;border-radius:18px;padding:16px 18px">${inner}</div></td></tr>`;
  const h = (t: string) => `<p style="margin:0 0 8px;font-size:15px;font-weight:900;color:#1e2a3b">${t}</p>`;
  const statCells = stats
    .map((x) => `<td style="width:25%;padding:4px;text-align:center"><div style="background:#f3f7fd;border-radius:14px;padding:10px 4px"><div style="font-size:20px;font-weight:900;color:#2f6fdb">${esc(x.value)}</div><div style="font-size:11px;color:#5b6b80">${esc(x.label)}</div></div></td>`)
    .join("");
  const searchHtml = i.search
    ? card(
        h("🔍 検索での見られ方（28日分）") +
          `<p style="margin:0;font-size:14px">検索に出た回数 <b style="color:#2f6fdb">${num(i.search.impressions)}回</b>・クリック <b style="color:#2f6fdb">${num(i.search.clicks)}回</b></p>` +
          (i.search.near.length
            ? `<p style="margin:10px 0 4px;font-size:13px;font-weight:700">💡 あと一歩で上位の言葉</p>${i.search.near.map((q) => `<span style="display:inline-block;margin:2px 4px 2px 0;padding:4px 10px;border-radius:999px;background:#fff4cc;font-size:13px">「${esc(q.query)}」いま${q.position}位</span>`).join("")}`
            : ""),
      )
    : "";
  const newsHtml = news.length
    ? card(
        h("✨ 今月、新しくなったこと") +
          `<ul style="margin:0;padding-left:18px;font-size:14px">${news.map((u) => `<li style="margin:2px 0">${esc(u.title)}</li>`).join("")}</ul>` +
          `<p style="margin:8px 0 0;font-size:13px"><a href="${esc(links.appUrl)}/updates" style="color:#2f6fdb">くわしく見る</a></p>`,
      )
    : "";
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;background:#eef4fc;font-family:'Hiragino Maru Gothic ProN','Hiragino Sans','Yu Gothic UI',Meiryo,sans-serif;color:#1e2a3b">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4fc"><tr><td align="center" style="padding:16px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:8px 24px"><p style="margin:0;font-size:12px;color:#5b6b80">${SERVICE_NAME}</p><p style="margin:4px 0 0;font-size:22px;font-weight:900">📰 しおり通信 ${esc(label)}号</p><p style="margin:2px 0 0;font-size:14px">${esc(i.orgName)}さま</p></td></tr>
<tr><td style="padding:8px 24px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:bottom;padding-right:8px"><img src="${esc(links.appUrl)}/guide/shiori-face.webp" width="56" height="56" alt="しおり" style="border-radius:50%;background:#cfe2ff;display:block"></td>
<td style="vertical-align:bottom"><div style="background:#ffffff;border:2px solid #dbe7fb;border-radius:18px 18px 18px 4px;padding:10px 14px;font-size:14px;font-weight:700">${esc(shioriLine(i))}</div></td>
</tr></table></td></tr>
${card(h("今月のまとめ") + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${statCells}</tr></table>` + (i.streak > 0 ? `<p style="margin:10px 0 0;text-align:center"><span style="display:inline-block;padding:4px 12px;border-radius:999px;background:#ffc93c;font-weight:900;font-size:13px">🔥 ${i.streak}か月つづけて書いています</span></p>` : ""))}
${card(h(`🎖️ スタンプ帳 ${i.stampsGot} / ${i.stampsTotal}`) + (i.newStamps.length ? `<p style="margin:0 0 6px;font-size:14px">今月もらったスタンプ：<b>${esc(i.newStamps.join("、"))}</b></p>` : "") + `<p style="margin:0;font-size:13px;color:#5b6b80">${i.nextStamp ? `次は「${esc(i.nextStamp.title)}」：${esc(i.nextStamp.how)}` : "スタンプが全部そろいました！"}</p>`)}
${newsHtml}
${searchHtml}
<tr><td style="padding:16px 24px;text-align:center"><a href="${esc(links.appUrl)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#2f6fdb;color:#ffffff;font-weight:900;font-size:16px;text-decoration:none">来月の1本を書く →</a><p style="margin:8px 0 0;font-size:12px;color:#5b6b80">質問に答えるだけで記事になります。</p></td></tr>
<tr><td style="padding:8px 24px 24px;font-size:11px;color:#5b6b80;text-align:center">${SERVICE_NAME}（案内役：しおり）<br>${SERVICE_OPERATOR}<br><a href="${esc(links.unsubscribeUrl)}" style="color:#5b6b80">このメールを受け取らない</a></td></tr>
</table></td></tr></table></body></html>`;
  return { subject, text, html };
}
