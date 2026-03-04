"use client";

import type { CategoryDTO } from "@/types/category";

interface Props {
  /** フォームフィールドのname属性プレフィックス（例: "target" → "target-name"） */
  prefix: string;
  categories: CategoryDTO[];
  onCancel: () => void;
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

/** 代替提案フォーム内で新規アプリをインライン登録するためのコンパクトフォーム */
export default function InlineAppForm({
  prefix,
  categories,
  onCancel,
}: Props) {
  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-900 mb-1";

  return (
    <div className="border border-sky-500 rounded-lg p-4 space-y-4 bg-sky-50/30">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          新しいアプリを登録
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-900 text-xs"
        >
          キャンセル
        </button>
      </div>

      {/* アプリ名 */}
      <div>
        <label htmlFor={`${prefix}-name`} className={labelClass}>
          アプリ名 <span className="text-red-500">*</span>
        </label>
        <input
          id={`${prefix}-name`}
          type="text"
          name={`${prefix}-name`}
          placeholder="例: Notion"
          maxLength={100}
          required
          className={inputClass}
        />
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor={`${prefix}-description`} className={labelClass}>
          説明 <span className="text-red-500">*</span>
        </label>
        <textarea
          id={`${prefix}-description`}
          name={`${prefix}-description`}
          placeholder="アプリの概要を10文字以上で入力"
          maxLength={500}
          required
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* 公式URL */}
      <div>
        <label htmlFor={`${prefix}-url`} className={labelClass}>
          公式サイトURL
        </label>
        <input
          id={`${prefix}-url`}
          type="url"
          name={`${prefix}-url`}
          placeholder="https://example.com"
          maxLength={2000}
          className={inputClass}
        />
        <p className="text-xs text-gray-500 mt-0.5">
          HTTPSのトップページURLのみ
        </p>
      </div>

      {/* カテゴリ */}
      <div>
        <label htmlFor={`${prefix}-categoryId`} className={labelClass}>
          カテゴリ <span className="text-red-500">*</span>
        </label>
        <select
          id={`${prefix}-categoryId`}
          name={`${prefix}-categoryId`}
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
      </div>

      {/* プラットフォーム */}
      <fieldset>
        <legend className={labelClass}>
          プラットフォーム <span className="text-red-500">*</span>
        </legend>
        <div className="flex flex-wrap gap-2 mt-1">
          {PLATFORMS.map((platform) => (
            <label
              key={platform}
              className="flex items-center gap-1 text-xs text-gray-900 cursor-pointer"
            >
              <input
                type="checkbox"
                name={`${prefix}-platforms`}
                value={platform}
                className="rounded border-gray-200 text-sky-500 focus:ring-sky-500"
              />
              {platform}
            </label>
          ))}
        </div>
      </fieldset>

      {/* 日本語対応・無料プラン・価格タイプ */}
      <div className="flex flex-wrap gap-6">
        <fieldset>
          <legend className={labelClass}>日本語対応</legend>
          <div className="flex gap-3 mt-1">
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name={`${prefix}-isJpSupport`}
                value="true"
                defaultChecked
                className="border-gray-200 text-sky-500 focus:ring-sky-500"
              />
              対応
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name={`${prefix}-isJpSupport`}
                value="false"
                className="border-gray-200 text-sky-500 focus:ring-sky-500"
              />
              非対応
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>無料プラン</legend>
          <div className="flex gap-3 mt-1">
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name={`${prefix}-hasFreePlan`}
                value="true"
                defaultChecked
                className="border-gray-200 text-sky-500 focus:ring-sky-500"
              />
              あり
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="radio"
                name={`${prefix}-hasFreePlan`}
                value="false"
                className="border-gray-200 text-sky-500 focus:ring-sky-500"
              />
              なし
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${prefix}-pricingType`} className={labelClass}>
            価格タイプ <span className="text-red-500">*</span>
          </label>
          <select
            id={`${prefix}-pricingType`}
            name={`${prefix}-pricingType`}
            required
            className={inputClass}
          >
            <option value="">選択</option>
            {PRICING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
