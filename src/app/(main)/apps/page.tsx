// src/app/(main)/apps/page.tsx
// 最新のアプリを10件表示し、ページネーションも実装。
// isrで5分ごとに更新

import { ToolsData, ToolsCount } from "@/features/tool/queries/tools.query"
import ToolsList from "@/features/tool/components/ToolsList"
import Pagination from "@/components/Pagination"
import ContentWrapper from "@/components/layout/ContentWrapper"

export const revalidate = 300

const LIMIT = 10

export default async function AppsPage() {
    const [tools, totalCount] = await Promise.all([
        ToolsData(LIMIT),
        ToolsCount(),
    ])

    return (
        <ContentWrapper className="py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">アプリ一覧</h1>
            <ToolsList tools={tools} />
            <Pagination numApps={totalCount} limit={LIMIT} currentPage={1} baseUrl="apps/page/" firstPageUrl="/apps" />
        </ContentWrapper>
    )
}
