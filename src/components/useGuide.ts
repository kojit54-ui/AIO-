"use client";

// 選んだ案内役をこのブラウザに覚える（覚えられないときは しおり）。変えたらすぐ同じ画面の絵も変わる。

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { DEFAULT_GUIDE, guideOf, isGuideId, type GuideCharacter, type GuideId } from "@/lib/guideCharacter";

const KEY = "cotam-guide-v1";
const EVENT = "cotam-guide";

function read(): GuideId {
  try {
    const v = window.localStorage.getItem(KEY);
    return isGuideId(v) ? v : DEFAULT_GUIDE;
  } catch {
    return DEFAULT_GUIDE;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** ログイン前の画面（入口・ためす・自己紹介・ログイン・招待・規約）は、サービスの顔の しおり のまま */
const PUBLIC = ["/welcome", "/try", "/shiori", "/login", "/invite", "/terms", "/privacy", "/tokushoho"];
export const isPublicPath = (p: string | null) => !!p && PUBLIC.some((x) => p === x || p.startsWith(`${x}/`));

export function useGuide(): [GuideCharacter, (id: GuideId) => void] {
  const picked = useSyncExternalStore(subscribe, read, () => DEFAULT_GUIDE);
  const id = isPublicPath(usePathname()) ? DEFAULT_GUIDE : picked;
  const set = (next: GuideId) => {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // 覚えられないときは しおり のまま
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [guideOf(id), set];
}
