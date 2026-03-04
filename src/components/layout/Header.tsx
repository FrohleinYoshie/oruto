import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { signout } from "@/features/auth/actions/auth.action";
import ContentWrapper from "@/components/layout/ContentWrapper";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <ContentWrapper className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-sky-500">
            オルト
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/categories" className="text-gray-700 hover:text-sky-500 transition-colors">
              カテゴリー
            </Link>
            <Link href="/apps" className="text-gray-700 hover:text-sky-500 transition-colors">
              アプリ一覧
            </Link>
          </div>
        </div>
        <nav aria-label="メインナビゲーション">
          {user ? (
            <div className="flex items-center gap-4 text-sm">
              <Link href="/post" className="text-gray-700 hover:text-sky-500 transition-colors">
                アプリ登録
              </Link>
              <form action={signout}>
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  ログアウト
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-900 hover:text-sky-500">
                ログイン
              </Link>
              <Link
                href="/signup"
                className="bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-600"
              >
                登録
              </Link>
            </div>
          )}
        </nav>
      </ContentWrapper>
    </header>
  );
}
