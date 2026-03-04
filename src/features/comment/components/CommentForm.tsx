"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";

import { createComment } from "@/features/comment/actions/comment.action";

interface Props {
    alternativeId: string;
    isLoggedIn: boolean;
}

export default function CommentForm({ alternativeId, isLoggedIn }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(
        async (_prev: { error: string | null }, formData: FormData) => {
            const result = await createComment(formData);
            if (!result.error) {
                formRef.current?.reset();
            }
            return result;
        },
        { error: null }
    );

    if (!isLoggedIn) {
        return (
            <div className="mt-3 text-center py-3">
                <Link
                    href="/login"
                    className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
                >
                    ログインして理由を書く
                </Link>
            </div>
        );
    }

    return (
        <form ref={formRef} action={formAction} className="mt-3">
            <input type="hidden" name="alternativeId" value={alternativeId} />
            <textarea
                name="body"
                placeholder="この代替アプリをおすすめする理由を書いてください..."
                maxLength={500}
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500 resize-none"
                required
            />
            {state.error && (
                <p className="mt-1 text-xs text-red-500">{state.error}</p>
            )}
            <div className="mt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-sky-500 text-white text-sm rounded-lg px-4 py-2 hover:bg-sky-600 transition-colors disabled:opacity-50"
                >
                    {isPending ? "送信中..." : "投稿する"}
                </button>
            </div>
        </form>
    );
}
