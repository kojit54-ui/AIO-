// お客様が Search Console に足す、コタムのサービス用アカウントのアドレス（秘密ではない）。準備がまだなら null。

import { NextResponse } from "next/server";
import { scServiceEmail } from "@/lib/growth/searchConsoleServer";

export async function GET() {
  return NextResponse.json({ email: scServiceEmail() });
}
