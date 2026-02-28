import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { signout } from "@/features/auth/actions/auth.action";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex h-14 items-center justify-between">
        <Link href="/" className="text-lg font-bold text-sky-500">
          オルト
        </Link>
        <nav aria-label="メインナビゲーション">
          {user ? (
            <form action={signout}>
              <button type="submit">ログアウト</button>
            </form>
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
      </div>
    </header>
  );
}
