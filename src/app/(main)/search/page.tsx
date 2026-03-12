import { SearchAppsData, SearchAppsCount } from "@/features/search/queries/search.query";
import ToolsList from "@/features/tool/components/ToolsList";
import Pagination from "@/components/Pagination";
import ContentWrapper from "@/components/layout/ContentWrapper";
import SearchInput from "@/features/search/components/SearchInput";
import Link from "next/link";
import { sanitizeText } from "@/utils/sanitize";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

const LIMIT = 10;

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  // クエリが空の場合
  if (!query) {
    return (
      <ContentWrapper className="py-6">
        <div className="mb-6">
          <SearchInput />
        </div>
        <p className="text-gray-500 text-center py-12">
          検索キーワードを入力してください
        </p>
      </ContentWrapper>
    );
  }

  const [apps, totalCount] = await Promise.all([
    SearchAppsData(query, LIMIT, 1),
    SearchAppsCount(query),
  ]);

  const queryString = `?q=${encodeURIComponent(query)}`;

  return (
    <ContentWrapper className="py-6">
      <div className="mb-6">
        <SearchInput defaultValue={query} />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        「{sanitizeText(query)}」の検索結果: {totalCount}件
      </p>

      {apps.length > 0 ? (
        <>
          <ToolsList tools={apps} />
          <Pagination
            numApps={totalCount}
            limit={LIMIT}
            currentPage={1}
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
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/categories"
              className="text-sky-500 hover:text-sky-600 text-sm transition-colors"
            >
              カテゴリーから探す →
            </Link>
            <Link
              href="/post"
              className="text-sky-500 hover:text-sky-600 text-sm transition-colors"
            >
              アプリを登録する →
            </Link>
          </div>
        </div>
      )}
    </ContentWrapper>
  );
}
