// ページネーションコンポーネント
// 引数のデータ数に応じてページネーションを表示する
// 第一引数は親がデータの数をlenthで数えたもの、第2引数は1ページあたりの表示数、第3引数は現在のページ番号
// ページネーションの表示は左から「1」「現在のページ-1」「現在ページ」「現在のページ+1」「最後のページ」
// 最初のページの場合「1」は表示しない。　最後のページの場合「最後のページ」は表示しない。現在のページを表示中は表示はするが入力不可
// リンクは「hogehoge/?page/(現在ページ)」のようにする。しかし、現在のページが1の場合は「hogehoge」と「hogehoge/?page/1」は同様なものとする。
import { notFound } from "next/navigation"
import Link from "next/link"

interface Props {
    numApps: number,
    limit: number,
    currentPage: number,
    baseUrl: string,
    firstPageUrl?: string  // ページ1のURL（省略時は /${baseUrl}1）
}

export default function PageNation({ numApps, limit, currentPage, baseUrl, firstPageUrl }: Props) {
    const page1Url = firstPageUrl ?? `/${baseUrl}1`

    const totalPages: number = Math.ceil(numApps / limit)

    // 範囲外のページは404
    if (currentPage < 1 || currentPage > totalPages) {
        return notFound()
    }

    const range: number = 2
    let start: number = Math.max(1, currentPage - range)
    let end: number = Math.min(totalPages, currentPage + range)

    if (currentPage <= range + 1) {
        end = Math.min(totalPages, 1 + range * 2)
    } else if (currentPage > totalPages - range) {
        start = Math.max(1, totalPages - range * 2)
    }

    const visiblePages: number[] = []
    for (let i = start; i <= end; i++) {
        visiblePages.push(i)
    }

    return (
        <div className="flex gap-2">
            {/* 最初のページへのリンク */}
            {visiblePages[0] > 1 && (
                <>
                    <Link href={page1Url}>1</Link>
                    {visiblePages[0] > 2 && <span>...</span>}
                </>
            )}

            {/* 周辺のページ番号 */}
            {visiblePages.map((page) => (
                <Link
                    key={page}
                    href={page === 1 ? page1Url : `/${baseUrl}${page}`}
                    className={page === currentPage ? 'font-bold text-sky-500' : ''}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </Link>
            ))}

            {/* 最後のページへのリンク */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
                <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span>...</span>}
                    <Link href={`/${baseUrl}${totalPages}`}>{totalPages}</Link>
                </>
            )}
        </div>
    )
}