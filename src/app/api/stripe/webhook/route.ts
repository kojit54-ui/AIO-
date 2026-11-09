// Stripe からの知らせ（Webhook）。中身は信じず、イベントのIDで Stripe から読み直してから、会社の利用状態に写す（src/lib/billing/server.ts）。

import { type NextRequest, NextResponse } from "next/server";
import { handleWebhookEvent } from "@/lib/billing/server";
import { isStripeConfigured } from "@/lib/billing/stripe";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !isSupabaseConfigured()) return NextResponse.json({ code: "not_configured" }, { status: 503 });
  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  try {
    const result = await handleWebhookEvent(createAdminSupabase(), id);
    return NextResponse.json({ received: true, ...result });
  } catch {
    // Stripe はしばらく送り直してくれる。中身はログに出さない
    console.error("stripe webhook failed", id.slice(0, 40));
    return NextResponse.json({ code: "retry" }, { status: 500 });
  }
}
