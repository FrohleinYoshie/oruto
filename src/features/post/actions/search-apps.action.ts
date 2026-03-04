"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";
import type { AppDTO } from "@/types/app";

const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

/** アプリ名で部分一致検索（代替提案フォーム用） */
export async function searchApps(
  query: string
): Promise<{ apps: AppDTO[]; error?: string }> {
  const parsed = searchSchema.safeParse({ query });
  if (!parsed.success) {
    return { apps: [], error: "検索クエリが不正です。" };
  }

  const sanitizedQuery = parsed.data.query.trim();

  try {
    const apps = await prisma.app.findMany({
      where: {
        name: {
          contains: sanitizedQuery,
          mode: "insensitive",
        },
      },
      take: 10,
      orderBy: { name: "asc" },
    });

    return { apps: apps.map(toAppDTO) };
  } catch (error) {
    console.error("App search error:", error);
    return { apps: [], error: "検索に失敗しました。" };
  }
}
