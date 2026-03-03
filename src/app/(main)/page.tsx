import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import ContentWrapper from "@/components/ContentWrapper";
import CategoryList from "@/features/app/components/CategoryList";
import { CategoriesData } from "@/features/app/factory/CategoryData";

export default async function Home() {
  const categories = await CategoriesData();

  const supabase = await createClient();
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
        <h2 className="text-xl font-bold text-gray-900">カテゴリーから探す</h2>
        <CategoryList categories={categories} />
      </section>

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
