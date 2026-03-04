"use client";

import { useActionState, useRef, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PostApp } from "@/features/post/actions/post.action";
import type { PostAppState } from "@/features/post/actions/post.action";
import type { CategoryDTO } from "@/types/category";

interface Props {
  isLoggedIn: boolean;
  categories: CategoryDTO[];
}

const PLATFORMS = [
  "Web",
  "iOS",
  "Android",
  "Windows",
  "Mac",
  "Linux",
  "Chrome Extension",
  "Firefox Extension",
  "Edge Extension",
  "Safari Extension",
  "Other",
] as const;

const PRICING_TYPES = ["無料", "無料プランあり", "有料", "その他"] as const;

// フィールドエラー表示コンポーネント
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-sm mt-1">{message}</p>;
}

export default function PostForm({ isLoggedIn, categories }: Props) {
  if (!isLoggedIn) {
    redirect("/signup");
  }

  const formRef = useRef<HTMLFormElement>(null);
  const [urlWarningConfirmed, setUrlWarningConfirmed] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (_prev: PostAppState, formData: FormData) => {
      const result = await PostApp(formData);
      if (result.success) {
        formRef.current?.reset();
        setUrlWarningConfirmed(false);
      }
      return result;
    },
    { error: null }
  );

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-900 mb-1.5";

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        アプリを登録する
      </h1>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        新しいアプリやツールをデータベースに登録しましょう。
        <br />
        登録されたアプリは代替ツールの提案対象になります。
      </p>

      <Link
        href="/post/alternative"
        className="inline-block border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-900 hover:bg-sky-50 transition-colors mb-8"
      >
        代替アプリを提案する →
      </Link>

      {/* 全体エラー */}
      {state.error && (
        <div className="border border-red-500 rounded-lg px-4 py-3 mb-6 text-red-500 text-sm">
          {state.error}
        </div>
      )}

      {/* 成功メッセージ */}
      {state.success && (
        <div className="border border-green-500 rounded-lg px-4 py-3 mb-6 text-green-600 text-sm">
          アプリを登録しました。
        </div>
      )}

      {/* URL警告 */}
      {state.warnings && state.warnings.length > 0 && !urlWarningConfirmed && (
        <div className="border border-amber-500 rounded-lg px-4 py-3 mb-6 text-amber-600 text-sm">
          {state.warnings.map((w, i) => (
            <p key={i}>{w}</p>
          ))}
          <button
            type="button"
            onClick={() => setUrlWarningConfirmed(true)}
            className="mt-2 text-sky-500 hover:text-sky-600 text-sm underline"
          >
            確認しました（問題ありません）
          </button>
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-6">
        {/* アプリ名 */}
        <div>
          <label htmlFor="post-name" className={labelClass}>
            アプリ名 <span className="text-red-500">*</span>
          </label>
          <input
            id="post-name"
            type="text"
            name="name"
            placeholder="例: Notion"
            maxLength={100}
            required
            className={inputClass}
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>

        {/* 説明 */}
        <div>
          <label htmlFor="post-description" className={labelClass}>
            説明 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="post-description"
            name="description"
            placeholder="アプリの概要を10文字以上で入力してください"
            maxLength={500}
            required
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <FieldError message={state.fieldErrors?.description} />
        </div>

        {/* 公式URL */}
        <div>
          <label htmlFor="post-url" className={labelClass}>
            公式サイトURL
          </label>
          <input
            id="post-url"
            type="url"
            name="url"
            placeholder="https://example.com"
            maxLength={2000}
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1">
            HTTPSのトップページURLのみ登録可能です
          </p>
          <FieldError message={state.fieldErrors?.url} />
        </div>

        {/* カテゴリ */}
        <div>
          <label htmlFor="post-categoryId" className={labelClass}>
            カテゴリ <span className="text-red-500">*</span>
          </label>
          <select
            id="post-categoryId"
            name="categoryId"
            required
            className={inputClass}
          >
            <option value="">カテゴリを選択</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.categoryId} />
        </div>

        {/* プラットフォーム（複数選択） */}
        <fieldset>
          <legend className={labelClass}>
            プラットフォーム <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-3 mt-1">
            {PLATFORMS.map((platform) => (
              <label
                key={platform}
                className="flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="platforms"
                  value={platform}
                  className="rounded border-gray-200 text-sky-500 focus:ring-sky-500"
                />
                {platform}
              </label>
            ))}
          </div>
          <FieldError message={state.fieldErrors?.platforms} />
        </fieldset>

        {/* 日本語対応・無料プラン */}
        <div className="flex gap-8">
          <fieldset>
            <legend className={labelClass}>日本語対応</legend>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  name="isJpSupport"
                  value="true"
                  defaultChecked
                  className="border-gray-200 text-sky-500 focus:ring-sky-500"
                />
                対応
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  name="isJpSupport"
                  value="false"
                  className="border-gray-200 text-sky-500 focus:ring-sky-500"
                />
                非対応
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className={labelClass}>無料プラン</legend>
            <div className="flex gap-4 mt-1">
              <label className="flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  name="hasFreePlan"
                  value="true"
                  defaultChecked
                  className="border-gray-200 text-sky-500 focus:ring-sky-500"
                />
                あり
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-900 cursor-pointer">
                <input
                  type="radio"
                  name="hasFreePlan"
                  value="false"
                  className="border-gray-200 text-sky-500 focus:ring-sky-500"
                />
                なし
              </label>
            </div>
          </fieldset>
        </div>

        {/* 価格タイプ */}
        <div>
          <label htmlFor="post-pricingType" className={labelClass}>
            価格タイプ <span className="text-red-500">*</span>
          </label>
          <select
            id="post-pricingType"
            name="pricingType"
            required
            className={inputClass}
          >
            <option value="">価格タイプを選択</option>
            {PRICING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.pricingType} />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-sky-500 text-white rounded-lg px-6 py-3 hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isPending ? "登録中..." : "アプリを登録する"}
        </button>
      </form>
    </div>
  );
}
