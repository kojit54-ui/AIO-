import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TOKUSHOHO } from "@/lib/legal";
import { SERVICE_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: `${TOKUSHOHO.title}｜${SERVICE_NAME}`, robots: { index: false, follow: false } };

export default function Page() {
  return <LegalPage doc={TOKUSHOHO} />;
}
