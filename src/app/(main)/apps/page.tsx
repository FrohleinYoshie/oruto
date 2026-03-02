// src/app/(main)/apps/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { AppsData } from "@/features/app/factory/AppsData"
import AppsList from "@/features/app/components/apps/AppsList"
import PageNation from "@/components/PageNation"

export const revalidate = 300

const LIMIT = 10

export default async function AppsPage() {
    const apps = await AppsData()
    const pageApps = apps.slice(0, LIMIT)

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <AppsList apps={pageApps} />
            <PageNation numApps={apps.length} limit={LIMIT} currentPage={1} baseUrl="apps/page/" firstPageUrl="/apps" />
        </>
    )
}