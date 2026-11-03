import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { SERVICE_DESCRIPTION, SERVICE_NAME } from "@/lib/brand";
import { StoreProvider } from "@/mock/store";
import "./globals.css";

// 丸ゴシックで、事務の書類っぽさを消す（docs/UI.md「見た目」）
const maru = Zen_Maru_Gothic({ weight: ["500", "700", "900"], subsets: ["latin"], variable: "--font-maru", display: "swap", preload: false });

export const metadata: Metadata = {
  title: SERVICE_NAME,
  description: SERVICE_DESCRIPTION,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={maru.variable}>
      <body>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
