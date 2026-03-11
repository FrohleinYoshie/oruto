// ページネーションコンポーネント
// 前へ/次へ + ページ番号のUI
import { notFound } from "next/navigation"
import Link from "next/link"

interface Props {
    numApps: number,
    limit: number,
    currentPage: number,
    baseUrl: string,
    firstPageUrl?: string  // ページ1のURL（省略時は /${baseUrl}1）
    queryString?: string   // リンクに付与するクエリ文字列（例: "?q=notion"）
}

export default function Pagination({ numApps, limit, currentPage, baseUrl, firstPageUrl, queryString = "" }: Props) {
    const page1Url = `${firstPageUrl ?? `/${baseUrl}1`}${queryString}`
    const totalPages = Math.ceil(numApps / limit)

    // 1ページ以下なら表示しない
    if (totalPages <= 1) {
        return null
    }

    // 範囲外のページは404
    if (currentPage < 1 || currentPage > totalPages) {
        return notFound()
    }

    function pageUrl(page: number) {
        return page === 1 ? page1Url : `/${baseUrl}${page}${queryString}`
    }

    // 表示するページ番号の範囲を計算
    const range = 2
    let start = Math.max(1, currentPage - range)
    let end = Math.min(totalPages, currentPage + range)

    if (currentPage <= range + 1) {
        end = Math.min(totalPages, 1 + range * 2)
    } else if (currentPage > totalPages - range) {
        start = Math.max(1, totalPages - range * 2)
    }

    const visiblePages: number[] = []
    for (let i = start; i <= end; i++) {
        visiblePages.push(i)
    }

    const baseStyle = "flex items-center justify-center min-w-[44px] h-11 rounded-lg text-sm transition-colors"
    const activeStyle = `${baseStyle} bg-sky-500 text-white font-medium`
    const inactiveStyle = `${baseStyle} border border-gray-200 text-gray-700 hover:bg-gray-50`
    const disabledStyle = `${baseStyle} text-gray-300 cursor-default`

    return (
        <nav aria-label="ページネーション" className="mt-8 flex justify-center">
            <div className="flex items-center gap-1">
                {/* 前へ */}
                {currentPage > 1 ? (
                    <Link href={pageUrl(currentPage - 1)} className={inactiveStyle} aria-label="前のページ">
                        &lt;
                    </Link>
                ) : (
                    <span className={disabledStyle} aria-hidden="true">&lt;</span>
                )}

                {/* 最初のページ */}
                {visiblePages[0] > 1 && (
                    <>
                        <Link href={page1Url} className={inactiveStyle}>1</Link>
                        {visiblePages[0] > 2 && (
                            <span className="flex items-center justify-center min-w-[44px] h-11 text-gray-400 text-sm">...</span>
                        )}
                    </>
                )}

                {/* ページ番号 */}
                {/* モバイル: ±1、sm以上: ±2 */}
                {visiblePages.map((page) => {
                    const distance = Math.abs(page - currentPage)
                    // 現在ページから2離れているものはモバイルで非表示
                    const responsiveClass = distance >= 2 ? "hidden sm:flex" : ""

                    return page === currentPage ? (
                        <span key={page} className={activeStyle} aria-current="page">{page}</span>
                    ) : (
                        <Link key={page} href={pageUrl(page)} className={`${inactiveStyle} ${responsiveClass}`}>
                            {page}
                        </Link>
                    )
                })}

                {/* 最後のページ */}
                {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <span className="flex items-center justify-center min-w-[44px] h-11 text-gray-400 text-sm">...</span>
                        )}
                        <Link href={pageUrl(totalPages)} className={inactiveStyle}>{totalPages}</Link>
                    </>
                )}

                {/* 次へ */}
                {currentPage < totalPages ? (
                    <Link href={pageUrl(currentPage + 1)} className={inactiveStyle} aria-label="次のページ">
                        &gt;
                    </Link>
                ) : (
                    <span className={disabledStyle} aria-hidden="true">&gt;</span>
                )}
            </div>
        </nav>
    )
}
