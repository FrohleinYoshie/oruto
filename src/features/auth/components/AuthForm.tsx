"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type AuthFormProps = {
  title: string;
  buttonText: string;
  action: (formData: FormData) => void;
  isLogin?: boolean;
};

export function AuthForm({
  title,
  buttonText,
  action,
  isLogin = true,
}: AuthFormProps) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={action}>
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="メールアドレス"
            />
            <input
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="パスワード"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer"
          >
            {buttonText}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              アカウントをお持ちでない方は{" "}
              <Link href="/signup" className="text-indigo-600 hover:underline">
                登録
              </Link>
            </>
          ) : (
            <>
              既にアカウントをお持ちの方は{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                ログイン
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
