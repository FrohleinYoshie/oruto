import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";
import type { AppDTO } from "@/types/app";

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

export async function SearchApps(
  query: string,
  limit: number,
  page: number
): Promise<{ apps: AppDTO[]; total: number }> {
  const normalized = normalizeQuery(query);
  if (!normalized) return { apps: [], total: 0 };

  const where = { name: { contains: normalized, mode: "insensitive" as const } };
  const [apps, total] = await Promise.all([
    prisma.app.findMany({ where, orderBy: { name: "asc" }, skip: (page - 1) * limit, take: limit }),
    prisma.app.count({ where }),
  ]);

  return { apps: apps.map(toAppDTO), total };
}
