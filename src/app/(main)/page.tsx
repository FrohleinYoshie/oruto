import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/features/search/components/SearchInput";
import Link from "next/link";
import ContentWrapper from "@/components/layout/ContentWrapper";
import CategoryList from "@/features/category/components/CategoryList";
import { CategoriesData } from "@/features/category/queries/categories.query";
import { TrendingAlternativesData } from "@/features/alternative/queries/trending.query";
import { RecentToolsData } from "@/features/tool/queries/recent-tools.query";
import { RecentConsultationsData } from "@/features/consultation/queries/consultation.query";

export default async function Home() {
  const [categories, trending, recentApps, recentConsultations, supabase] = await Promise.all([
    CategoriesData(),
    TrendingAlternativesData(5),
    RecentToolsData(6),
    RecentConsultationsData(3),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ContentWrapper>
      {/* ヒーローセクション */}
      <section className="flex flex-col items-center text-center pt-16 md:pt-24 pb-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-relaxed">
          あのツールの代わり、みんな何使ってる？
        </h1>
        <p className="mt-4 text-gray-500 max-w-lg leading-relaxed">
          コミュニティが選ぶ、広告なしのアプリ代替データベース。
          アフィリエイトによる順位操作は一切ありません。
        </p>
        <div className="mt-8 w-full flex justify-center">
          <SearchInput />
        </div>
      </section>

      {/* カテゴリーセクション */}
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">カテゴリーから探す</h2>
          <Link
            href="/categories"
            className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
          >
            すべて見る →
          </Link>
        </div>
        <CategoryList categories={categories} />
      </section>

      {/* 人気の代替関係 */}
      {trending.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            みんなが注目している乗り換え先
          </h2>
          <div className="space-y-3">
            {trending.map((alt) => (
              <Link
                key={alt.id}
                href={`/apps/${alt.targetApp.slug}`}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-sky-50 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm min-w-0">
                  <span className="font-medium text-gray-900 truncate">
                    {alt.targetApp.name}
                  </span>
                  <span className="text-gray-400 shrink-0">→</span>
                  <span className="text-sky-500 font-medium truncate">
                    {alt.altApp.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 shrink-0 ml-3">
                  {alt.upvotes} 票
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最近登録されたアプリ */}
      {recentApps.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              最近登録されたアプリ
            </h2>
            <Link
              href="/apps"
              className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentApps.map((app) => (
              <Link
                key={app.id}
                href={`/apps/${app.slug}`}
                className="border border-gray-200 rounded-lg px-4 py-3 hover:bg-sky-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">{app.name}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {app.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {app.isJpSupport && (
                    <span className="text-xs bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded">
                      日本語対応
                    </span>
                  )}
                  {app.pricingType && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {app.pricingType}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 最新の相談 */}
      {recentConsultations.length > 0 && (
        <section className="mt-12 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              みんなの相談
            </h2>
            <Link
              href="/consultations"
              className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
            >
              すべて見る →
            </Link>
          </div>
          <div className="space-y-3">
            {recentConsultations.map((c) => (
              <Link
                key={c.id}
                href={`/consultations/${c.id}`}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-sky-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {c.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                      {c.appName}
                    </span>
                    {c.categoryName && (
                      <span className="text-xs text-gray-500">
                        {c.categoryName}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 shrink-0 ml-3">
                  {c.replyCount} 件の回答
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 未ログイン時の登録CTA */}
      {!user && (
        <section className="mt-12 mb-8 text-center">
          <div className="border border-gray-200 rounded-lg px-6 py-8">
            <p className="text-gray-900 font-medium">
              投票に参加して、みんなのツール選びを手助けしよう
            </p>
            <p className="mt-2 text-sm text-gray-500">
              アカウント登録は無料です
            </p>
            <Link
              href="/signup"
              className="mt-4 inline-block bg-sky-500 text-white rounded-lg px-6 py-2 hover:bg-sky-600 transition-colors"
            >
              無料で登録する
            </Link>
          </div>
        </section>
      )}
    </ContentWrapper>
  );
}
