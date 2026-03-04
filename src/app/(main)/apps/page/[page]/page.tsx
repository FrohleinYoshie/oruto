// src/app/(main)/apps/page/[page]/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { ToolsData, ToolsCount } from "@/features/tool/queries/tools.query"
import ToolsList from "@/features/tool/components/ToolsList"
import Pagination from "@/components/Pagination"
import ContentWrapper from "@/components/layout/ContentWrapper"
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

    const [tools, totalCount] = await Promise.all([
        ToolsData(LIMIT, pageNum),
        ToolsCount(),
    ])

    return (
        <ContentWrapper className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <ToolsList tools={tools} />
            <Pagination numApps={totalCount} limit={LIMIT} currentPage={pageNum} baseUrl="apps/page/" firstPageUrl="/apps" />
        </ContentWrapper>
    )
}
