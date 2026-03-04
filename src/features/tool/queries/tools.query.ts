// prismaを用いて登録されているツールを取得する。

import { prisma } from "@/lib/prisma"
import { toAppDTO } from "@/utils/transform"

/** ページネーション付きでツールを取得する */
export async function ToolsData(limit: number, page: number = 1) {
    const skip = (page - 1) * limit
    const data = await prisma.app.findMany({
        take: limit,
        skip,
        orderBy: {
            createdAt: "desc"
        }
    })
    return data.map(toAppDTO)
}

/** ツールの総数を取得する */
export async function ToolsCount() {
    return prisma.app.count()
}
