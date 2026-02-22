import { createClient } from "@/utils/supabase/server";
import SearchInput from "@/components/SearchInput";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          あのツールの代わり、みんな何使ってる？
        </h1>
        <p className="max-w-xl text-gray-600">
          オルトは、ユーザー投票だけで順位が決まる代替ツール検索データベースです。
          アフィリエイトによる順位操作は一切ありません。
        </p>
        <SearchInput />
      </section>

      {/* ゲスト向けCTA */}
      {!user && (
        <section className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            投票するには{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              アカウント登録（無料）
            </Link>
            が必要です
          </p>
        </section>
      )}
    </div>
  );
}
