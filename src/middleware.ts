import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// POST リクエストの簡易レート制限（500ms以内の連続リクエストを拒否）
const postTimestamps = new Map<string, number>();

export async function middleware(request: NextRequest) {
  if (request.method === "POST") {
    const ip = request.headers.get("x-real-ip") ?? "unknown";
    const last = postTimestamps.get(ip) ?? 0;
    if (Date.now() - last < 500) return new NextResponse(null, { status: 429 });
    postTimestamps.set(ip, Date.now());
  }
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
