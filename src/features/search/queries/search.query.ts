import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";
import type { AppDTO } from "@/types/app";

/** クエリ文字列を正規化（前後空白除去 + 連続スペースを1つに） */
function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

/** アプリ名で検索（大文字小文字を区別しない） */
export async function SearchAppsData(
  query: string,
  limit: number,
  page: number
): Promise<AppDTO[]> {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const apps = await prisma.app.findMany({
    where: {
      name: {
        contains: normalized,
        mode: "insensitive",
      },
    },
    orderBy: { name: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return apps.map(toAppDTO);
}

/** 検索結果の総件数を取得 */
export async function SearchAppsCount(query: string): Promise<number> {
  const normalized = normalizeQuery(query);
  if (!normalized) return 0;

  return prisma.app.count({
    where: {
      name: {
        contains: normalized,
        mode: "insensitive",
      },
    },
  });
}
