import type { Metadata } from "next";
import { INDEX_ROBOTS } from "@/lib/publicPages";
import { SERVICE_DESCRIPTION, SERVICE_NAME } from "@/lib/brand";
import { mfgShowcase } from "@/lib/manufacturing";
import { Welcome } from "./Welcome";

export const metadata: Metadata = {
  robots: INDEX_ROBOTS,
  title: `AIに選ばれて、これから出会うお客様に選ばれる会社に｜${SERVICE_NAME}`,
  description: SERVICE_DESCRIPTION,
};

/** 入口のページ（サービスのご紹介）。ログインしなくても見られる */
export default function WelcomePage() {
  return <Welcome makers={mfgShowcase()} />;
}
