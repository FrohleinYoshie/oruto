"use client";

import { useActionState, useRef, useState } from "react";
import { createReply } from "@/features/consultation/actions/create-reply.action";
import type { ReplyActionState } from "@/features/consultation/actions/create-reply.action";
import AppSearchSelect from "@/features/post/components/AppSearchSelect";
import type { AppDTO } from "@/types/app";

interface Props {
    consultationId: string;
    isLoggedIn: boolean;
}

export default function ReplyForm({ consultationId, isLoggedIn }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedApp, setSelectedApp] = useState<AppDTO | null>(null);

    const [state, formAction, isPending] = useActionState(
        async (_prev: ReplyActionState, formData: FormData) => {
            formData.set("consultationId", consultationId);
            const result = await createReply(formData);
            if (result.success) {
                formRef.current?.reset();
                setSelectedApp(null);
            }
            return result;
        },
        { error: null }
    );

    if (!isLoggedIn) {
        return (
            <div className="border border-gray-200 rounded-lg px-4 py-6 text-center">
                <p className="text-sm text-gray-500">
                    <a href="/login" className="text-sky-500 hover:text-sky-600">ログイン</a>
                    して代替アプリを提案しましょう
                </p>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
                代替アプリを提案する
            </h3>

            {state.error && (
                <div className="border border-red-500 rounded-lg px-4 py-3 mb-4 text-red-500 text-sm">
                    {state.error}
                </div>
            )}

            {state.success && (
                <div className="border border-green-500 rounded-lg px-4 py-3 mb-4 text-green-600 text-sm">
                    回答を投稿しました。
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-4">
                {/* 提案アプリ選択 */}
                <AppSearchSelect
                    label="提案するアプリ"
                    name="suggestedAppId"
                    selectedApp={selectedApp}
                    onSelect={(app) => setSelectedApp(app)}
                    onClear={() => setSelectedApp(null)}
                    onRequestNew={() => {
                        // 相談の回答では新規登録は /post へ誘導
                        window.open("/post", "_blank");
                    }}
                    error={state.fieldErrors?.suggestedAppId}
                />

                {/* 推薦理由 */}
                <div>
                    <label htmlFor="reply-body" className="block text-sm font-medium text-gray-900 mb-1.5">
                        推薦理由 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="reply-body"
                        name="body"
                        placeholder="なぜこのアプリがおすすめなのか、どう困りごとを解決できるか教えてください"
                        maxLength={1000}
                        required
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500 transition-colors resize-none"
                    />
                    {state.fieldErrors?.body && (
                        <p className="text-red-500 text-sm mt-1">{state.fieldErrors.body}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isPending ? "投稿中..." : "回答を投稿する"}
                </button>
            </form>
        </div>
    );
}
