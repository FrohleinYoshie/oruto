import { createHash } from "crypto";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

// x-real-ip（プロキシが設定）を優先し、なければ x-forwarded-for の末尾を使用
// SHA-256でハッシュ化してからDBに保存する（プライバシー保護）
export function getClientIdentifier(headersList: ReadonlyHeaders): string | null {
  const ip =
    headersList.get("x-real-ip") ??
    headersList.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    null;
  return ip ? createHash("sha256").update(ip).digest("hex") : null;
}
