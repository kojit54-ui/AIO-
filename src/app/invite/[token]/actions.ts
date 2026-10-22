"use server";

import { siteOrigin } from "@/lib/auth/origin";
import { type AcceptResult, acceptInvitation } from "@/lib/auth/invitations";

export async function acceptInvite(token: string): Promise<AcceptResult> {
  const origin = await siteOrigin();
  return acceptInvitation(token, origin);
}
