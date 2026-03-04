"use client";

import { useActionState, useRef, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { PostAlternative } from "@/features/post/actions/alternative.action";
import type { AlternativeActionState } from "@/features/post/actions/alternative.action";
import type { CategoryDTO } from "@/types/category";
import type { AppDTO } from "@/types/app";
import AppSearchSelect from "./AppSearchSelect";
import InlineAppForm from "./InlineAppForm";

interface Props {
  isLoggedIn: boolean;
  categories: CategoryDTO[];
  preselectedTarget?: AppDTO | null;
}

export default function AlternativeForm({ isLoggedIn, categories, preselectedTarget }: Props) {
  if (!isLoggedIn) {
    redirect("/signup");
  }

  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // 対象アプリの状態（事前選択があればセット）
  const [targetApp, setTargetApp] = useState<AppDTO | null>(preselectedTarget ?? null);
  const [isNewTarget, setIsNewTarget] = useState(false);

  // 代替アプリの状態
  const [altApp, setAltApp] = useState<AppDTO | null>(null);
  const [isNewAlt, setIsNewAlt] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (_prev: AlternativeActionState, formData: FormData) => {
      // 新規アプリフラグをFormDataに追加
      formData.set("isNewTarget", isNewTarget.toString());
      formData.set("isNewAlt", isNewAlt.toString());

      const result = await PostAlternative(formData);
      if (result.success && result.redirectTo) {
        router.push(result.redirectTo);
      }
      return result;
    },
    { error: null }
  );

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        代替アプリを提案する
      </h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        「このアプリの代わりにこれが使える」という代替関係を提案しましょう。
        <br />
        アプリが未登録の場合はその場で登録できます。
      </p>

      <Link
        href="/post"
        className="inline-block border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 hover:bg-sky-50 transition-colors mb-8"
      >
        ← アプリを登録する
      </Link>

      {/* エラー表示 */}
      {state.error && (
        <div className="border border-red-500 rounded-lg px-4 py-3 mb-6 text-red-500 text-sm">
          {state.error}
        </div>
      )}

      {/* 成功メッセージ */}
      {state.success && (
        <div className="border border-green-500 rounded-lg px-4 py-3 mb-6 text-green-600 text-sm">
          代替関係を登録しました。
        </div>
      )}

      {/* 警告表示 */}
      {state.warnings && state.warnings.length > 0 && (
        <div className="border border-amber-500 rounded-lg px-4 py-3 mb-6 text-amber-600 text-sm">
          {state.warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-8">
        {/* ステップ1: 対象アプリ選択 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            1. 対象アプリ
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            代替を探したいアプリを選択してください
          </p>

          {isNewTarget ? (
            <InlineAppForm
              prefix="target"
              categories={categories}
              onCancel={() => setIsNewTarget(false)}
            />
          ) : (
            <AppSearchSelect
              label="対象アプリを検索"
              name="targetAppId"
              selectedApp={targetApp}
              onSelect={(app) => {
                setTargetApp(app);
                setIsNewTarget(false);
              }}
              onClear={() => setTargetApp(null)}
              onRequestNew={() => {
                setTargetApp(null);
                setIsNewTarget(true);
              }}
              error={state.fieldErrors?.targetAppId}
            />
          )}
        </section>

        {/* 区切り線 */}
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-sm text-gray-500">の代わりに</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* ステップ2: 代替アプリ選択 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            2. 代替アプリ
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            代わりに使えるアプリを選択してください
          </p>

          {isNewAlt ? (
            <InlineAppForm
              prefix="alt"
              categories={categories}
              onCancel={() => setIsNewAlt(false)}
            />
          ) : (
            <AppSearchSelect
              label="代替アプリを検索"
              name="altAppId"
              selectedApp={altApp}
              onSelect={(app) => {
                setAltApp(app);
                setIsNewAlt(false);
              }}
              onClear={() => setAltApp(null)}
              onRequestNew={() => {
                setAltApp(null);
                setIsNewAlt(true);
              }}
              error={state.fieldErrors?.altAppId}
            />
          )}
        </section>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-sky-500 text-white rounded-lg px-6 py-3 hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? "登録中..." : "代替関係を提案する"}
        </button>
      </form>
    </div>
  );
}
