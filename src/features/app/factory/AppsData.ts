// prismaを用いて登録されているアプリを取得する。

import { prisma } from "@/lib/prisma"
import { toAppDTO } from "@/features/app/utils/transform"

/** ページネーション付きでアプリを取得する */
export async function AppsData(limit: number, page: number = 1) {
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

/** アプリの総数を取得する */
export async function AppsCount() {
    return prisma.app.count()
}