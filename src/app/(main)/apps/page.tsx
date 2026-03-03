// src/app/(main)/apps/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { AppsData, AppsCount } from "@/features/app/factory/AppsData"
import AppsList from "@/features/app/components/apps/AppsList"
import PageNation from "@/components/PageNation"

export const revalidate = 300

const LIMIT = 10

export default async function AppsPage() {
    const [apps, totalCount] = await Promise.all([
        AppsData(LIMIT),
        AppsCount(),
    ])

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <AppsList apps={apps} />
            <PageNation numApps={totalCount} limit={LIMIT} currentPage={1} baseUrl="apps/page/" firstPageUrl="/apps" />
        </>
    )
}