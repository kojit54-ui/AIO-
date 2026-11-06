import { isGoogleLoginEnabled } from "@/lib/auth/google";
import { isLoginCodeEnabled } from "@/lib/auth/loginCode";
import { safeNextPath } from "@/lib/auth/token";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { EmailLogin } from "./EmailLogin";
import { MockLogin } from "./MockLogin";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (!isSupabaseConfigured()) return <MockLogin />;
  const { next, error } = await searchParams;
  const googleError = error === "google_not_invited" || error === "google_failed" ? error : null;
  return <EmailLogin next={safeNextPath(next)} linkError={error === "link"} googleError={googleError} googleEnabled={isGoogleLoginEnabled()} codeEnabled={isLoginCodeEnabled()} />;
}
