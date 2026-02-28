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
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {error && (
          <p className="mt-3 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="sr-only">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="メールアドレス"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              placeholder="パスワード"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-500 text-white rounded-lg px-4 py-2 hover:bg-sky-600"
          >
            {buttonText}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500">
          {isLogin ? (
            <>
              アカウントをお持ちでない方は{" "}
              <Link href="/signup" className="text-sky-500 hover:text-sky-600">
                登録
              </Link>
            </>
          ) : (
            <>
              既にアカウントをお持ちの方は{" "}
              <Link href="/login" className="text-sky-500 hover:text-sky-600">
                ログイン
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
