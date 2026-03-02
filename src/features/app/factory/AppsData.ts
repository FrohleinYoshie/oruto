// prismaを用いて登録されているアプリを取得する。
// 引数に取得データ数が入る。なにもなければ全件取得。指定があればその数だけ最新のデータを取得する。

import { prisma } from "@/lib/prisma"
import { toAppDTO } from "@/features/app/utils/transform"

export async function AppsData(limit?: number) {
    if (limit) {
        const data = await prisma.app.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        })
        return data.map(toAppDTO)
    } else {
        const data = await prisma.app.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return data.map(toAppDTO)
    }
}