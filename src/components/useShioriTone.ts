"use client";

// しおりの話し方をこのブラウザに覚える（覚えられないときは「ふつう」）。
// 同じ画面のほかの部品にも、変えたらすぐ伝わるようにする。

import { useSyncExternalStore } from "react";
import { DEFAULT_TONE, isTone, type ShioriTone } from "@/lib/shioriTone";

const KEY = "cotam-shiori-tone-v1";
const EVENT = "cotam-shiori-tone";

function read(): ShioriTone {
  try {
    const v = window.localStorage.getItem(KEY);
    return isTone(v) ? v : DEFAULT_TONE;
  } catch {
    return DEFAULT_TONE;
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

export function useShioriTone(): [ShioriTone, (t: ShioriTone) => void] {
  const tone = useSyncExternalStore(subscribe, read, () => DEFAULT_TONE);
  const set = (t: ShioriTone) => {
    try {
      window.localStorage.setItem(KEY, t);
    } catch {
      // 覚えられないときは「ふつう」のまま
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [tone, set];
}
