import Link from "next/link";
import ContentWrapper from "@/components/ContentWrapper";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-8">
      <ContentWrapper className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="text-lg font-bold text-sky-500">
            オルト
          </Link>
          <nav
            aria-label="フッターナビゲーション"
            className="flex items-center gap-4 text-sm text-gray-500"
          >
            <Link href="/categories" className="hover:text-gray-900 transition-colors">
              カテゴリー
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-400">
            アフィリエイトリンクや有料掲載は一切ありません
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} オルト
          </p>
        </div>
      </ContentWrapper>
    </footer>
  );
}
