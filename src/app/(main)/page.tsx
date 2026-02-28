import { createClient } from "@/lib/supabase/server";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";
import CategoryList from "@/features/app/components/CategoryList";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center text-center pt-16 md:pt-24">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          あのツールの代わり、みんな何使ってる？
        </h1>
        <p className="mt-4 text-gray-500 max-w-lg">
          オルトは、ユーザー投票だけで順位が決まる代替ツール検索データベースです。
          アフィリエイトによる順位操作は一切ありません。
        </p>
        <SearchInput />
      </section>

      {/**カテゴリーソートセクション */}
      <section className="mt-12">
        <h3 className="text-xl font-bold text-gray-900">カテゴリーから探す</h3>
        <CategoryList />
      </section>

      {!user && (
        <section className="mt-6">
          <p className="text-gray-500">
            投票するには{" "}
            <Link href="/signup" className="text-sky-500 hover:text-sky-600">
              アカウント登録（無料）
            </Link>
            が必要です
          </p>
        </section>
      )}
    </div>
  );
}
