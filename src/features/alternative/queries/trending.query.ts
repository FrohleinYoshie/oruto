import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";
import type { AppDTO } from "@/types/app";

export interface TrendingAlternativeDTO {
  id: string;
  targetApp: AppDTO;
  altApp: AppDTO;
  upvotes: number;
}

/** 投票数が多い代替関係を取得（トップページ用） */
export async function TrendingAlternativesData(
  limit: number = 5
): Promise<TrendingAlternativeDTO[]> {
  const alternatives = await prisma.alternative.findMany({
    where: { upvotes: { gt: 0 } },
    include: {
      targetApp: true,
      altApp: true,
    },
    orderBy: { upvotes: "desc" },
    take: limit,
  });

  return alternatives.map((alt) => ({
    id: alt.id,
    targetApp: toAppDTO(alt.targetApp),
    altApp: toAppDTO(alt.altApp),
    upvotes: alt.upvotes,
  }));
}
