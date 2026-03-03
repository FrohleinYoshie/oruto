// src/app/(main)/apps/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { AppsData, AppsCount } from "@/features/app/factory/AppsData"
import AppsList from "@/features/app/components/apps/AppsList"
import PageNation from "@/components/PageNation"
import ContentWrapper from "@/components/ContentWrapper"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

interface Props {
    params: Promise<{ page: string }>
}

export const revalidate = 300

const LIMIT = 10

export default async function AppsPage({ params }: Props) {
    const { page } = await params
    const pageNum = Number(page)

    // 不正なページ番号は404
    if (!Number.isInteger(pageNum) || pageNum < 1) {
        notFound()
    }

    // ページ1は /apps にリダイレクト（重複URLを避ける）
    if (pageNum === 1) {
        redirect('/apps')
    }

    const [apps, totalCount] = await Promise.all([
        AppsData(LIMIT, pageNum),
        AppsCount(),
    ])

    return (
        <ContentWrapper className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <AppsList apps={apps} />
            <PageNation numApps={totalCount} limit={LIMIT} currentPage={pageNum} baseUrl="apps/page/" firstPageUrl="/apps" />
        </ContentWrapper>
    )
}