import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";
import type { AppDTO } from "@/types/app";

/** 最近登録されたアプリを取得（トップページ用） */
export async function RecentToolsData(limit: number = 6): Promise<AppDTO[]> {
  const apps = await prisma.app.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return apps.map(toAppDTO);
}
