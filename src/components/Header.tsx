import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/features/auth/actions/auth.action";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-indigo-600">
          オルト
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <form action={signout}>
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                ログアウト
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
              >
                登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
