"use client";

// Googleアナリティクス（GA4）のタグ。測定ID（NEXT_PUBLIC_GA_ID）が無いときは何も読み込まない。
// 数えるのは src/lib/analytics.ts の isTrackedPath が許すページだけ。ほかのページでは送信を止める。

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cleanPageLocation, gaMeasurementId, isTrackedPath } from "@/lib/analytics";

export function Analytics() {
  const id = gaMeasurementId();
  const pathname = usePathname();
  const tracked = isTrackedPath(pathname);

  useEffect(() => {
    if (!id) return;
    const w = window as unknown as Record<string, unknown>;
    // 数えないページでは、GA4 の送信そのものを止める（Google 公式のオプトアウトの仕組み）
    w[`ga-disable-${id}`] = !tracked;
    if (!tracked) return;
    // タグの読み込み前でも、dataLayer にためておけば読み込み後に送られる
    if (typeof window.gtag !== "function") {
      const dl = ((w.dataLayer as unknown[] | undefined) ??= []);
      window.gtag = function gtag() {
        // gtag.js は arguments オブジェクトそのものを受け取る決まり
        // eslint-disable-next-line prefer-rest-params
        dl.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", id, { send_page_view: false });
    }
    window.gtag("event", "page_view", {
      page_location: cleanPageLocation(window.location.origin, pathname, window.location.search),
      page_title: document.title,
    });
  }, [id, pathname, tracked]);

  // 一度も数えるページを開いていない人には、タグそのものを読み込まない
  if (!id || !tracked) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />;
}
