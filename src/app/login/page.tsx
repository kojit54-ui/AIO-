import { safeNextPath } from "@/lib/auth/token";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { EmailLogin } from "./EmailLogin";
import { MockLogin } from "./MockLogin";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (!isSupabaseConfigured()) return <MockLogin />;
  const { next, error } = await searchParams;
  return <EmailLogin next={safeNextPath(next)} linkError={error === "link"} />;
}
