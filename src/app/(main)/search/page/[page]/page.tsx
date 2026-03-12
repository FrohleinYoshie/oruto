import { SearchApps } from "@/features/search/queries/search.query";
import ToolsList from "@/features/tool/components/ToolsList";
import Pagination from "@/components/Pagination";
import ContentWrapper from "@/components/layout/ContentWrapper";
import SearchInput from "@/features/search/components/SearchInput";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ q?: string }>;
}

const LIMIT = 10;

export default async function SearchPaginatedPage({ params, searchParams }: Props) {
  const { page } = await params;
  const { q = "" } = await searchParams;
  const query = q.trim();
  const pageNum = Number(page);

  // 不正なページ番号は404
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    notFound();
  }

  // ページ1は /search?q= にリダイレクト（重複URLを避ける）
  if (pageNum === 1) {
    redirect(`/search?q=${encodeURIComponent(query)}`);
  }

  // クエリが空の場合は検索トップへ
  if (!query) {
    redirect("/search");
  }

  const { apps, total: totalCount } = await SearchApps(query, LIMIT, pageNum);

  const queryString = `?q=${encodeURIComponent(query)}`;

  return (
    <ContentWrapper className="py-6">
      <div className="mb-6">
        <SearchInput defaultValue={query} />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        「{query}」の検索結果: {totalCount}件
      </p>

      {apps.length > 0 ? (
        <>
          <ToolsList tools={apps} />
          <Pagination
            numApps={totalCount}
            limit={LIMIT}
            currentPage={pageNum}
            baseUrl="search/page/"
            firstPageUrl="/search"
            queryString={queryString}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            該当するアプリが見つかりませんでした
          </p>
          <Link
            href={`/search${queryString}`}
            className="text-sky-500 hover:text-sky-600 text-sm transition-colors"
          >
            最初のページに戻る →
          </Link>
        </div>
      )}
    </ContentWrapper>
  );
}
