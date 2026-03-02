// src/app/(main)/apps/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { AppsData } from "@/features/app/factory/AppsData"
import AppsList from "@/features/app/components/apps/AppsList"
import PageNation from "@/components/PageNation"
import { redirect } from "next/navigation"

interface Props {
    params: Promise<{ page: string }>
}

export const revalidate = 300

const LIMIT = 10

export async function generateStaticParams() {
    const apps = await AppsData()
    const totalPages = Math.ceil(apps.length / LIMIT)
    // ページ1は /apps が担当するので2ページ目以降を生成
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
        page: String(i + 2),
    }))
}

export default async function AppsPage({ params }: Props) {
    const { page } = await params
    const pageNum = Number(page)

    // ページ1は /apps にリダイレクト（重複URLを避ける）
    if (page === '1') {
        redirect('/apps')
    }

    const apps = await AppsData()
    const pageApps = apps.slice((pageNum - 1) * LIMIT, pageNum * LIMIT)

    return (
        <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <AppsList apps={pageApps} />
            <PageNation numApps={apps.length} limit={LIMIT} currentPage={pageNum} baseUrl="apps/page/" firstPageUrl="/apps" />
        </>
    )
}