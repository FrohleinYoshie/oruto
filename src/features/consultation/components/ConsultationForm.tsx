"use client";

import { useActionState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createConsultation } from "@/features/consultation/actions/create-consultation.action";
import type { ConsultationActionState } from "@/features/consultation/actions/create-consultation.action";
import type { CategoryDTO } from "@/types/category";
import AppNameInput from "./AppNameInput";

interface Props {
    isLoggedIn: boolean;
    categories: CategoryDTO[];
}

export default function ConsultationForm({ isLoggedIn, categories }: Props) {
    if (!isLoggedIn) {
        redirect("/signup");
    }

    const router = useRouter();

    const [state, formAction, isPending] = useActionState(
        async (_prev: ConsultationActionState, formData: FormData) => {
            const result = await createConsultation(formData);
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
                代替アプリを相談する
            </h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                今使っているアプリで困っていることを相談しましょう。
                <br />
                コミュニティが代わりに使えるアプリを提案してくれます。
            </p>

            {/* エラー表示 */}
            {state.error && (
                <div className="border border-red-500 rounded-lg px-4 py-3 mb-6 text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                {/* 対象アプリ名 */}
                <AppNameInput error={state.fieldErrors?.appName} />

                {/* カテゴリ（任意） */}
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-900 mb-1.5">
                        カテゴリ
                    </label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors"
                    >
                        <option value="">選択しない</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        カテゴリを選ぶと他のユーザーが見つけやすくなります
                    </p>
                </div>

                {/* タイトル */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1.5">
                        タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="例: Evernoteの検索が遅くて困っています"
                        maxLength={200}
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors"
                    />
                    {state.fieldErrors?.title && (
                        <p className="text-red-500 text-sm mt-1">{state.fieldErrors.title}</p>
                    )}
                </div>

                {/* 困りごとの詳細 */}
                <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-900 mb-1.5">
                        困りごとの詳細 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        placeholder="どんな用途で使っていて、何に困っているかを詳しく教えてください"
                        maxLength={2000}
                        required
                        rows={5}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:border-sky-500 transition-colors resize-none"
                    />
                    {state.fieldErrors?.body && (
                        <p className="text-red-500 text-sm mt-1">{state.fieldErrors.body}</p>
                    )}
                </div>

                {/* 送信ボタン */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-sky-500 text-white rounded-lg px-6 py-3 hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isPending ? "投稿中..." : "相談を投稿する"}
                </button>
            </form>
        </div>
    );
}
