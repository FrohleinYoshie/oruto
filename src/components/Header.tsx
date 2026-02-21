import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/features/auth/actions/auth.action";

export default async function Header() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link href="/" className="flex flex-shrink-0 items-center font-bold text-xl text-indigo-600">
              Oruto
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/search"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  探す
                </Link>
                <form action={signout}>
                  <button
                    type="submit"
                    className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  >
                    ログアウト
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  登録
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
