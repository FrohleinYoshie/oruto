import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

// リクエストヘッダーからクライアント識別子を取得する
// x-forwarded-for → x-real-ip の順で試し、取得できなければ null を返す
export function getClientIdentifier(headersList: ReadonlyHeaders): string | null {
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return null;
}
