"use client";

import { useState } from "react";
import { useActionState } from "react";

import type { AlternativeCommentDTO } from "@/types/comment";
import { voteComment } from "@/features/comment/actions/vote.action";

interface Props {
    comment: AlternativeCommentDTO;
    hasVoted: boolean;
}

export default function CommentCard({ comment, hasVoted }: Props) {
    const [voted, setVoted] = useState(hasVoted);
    const [displayVotes, setDisplayVotes] = useState(comment.upvotes);

    const [state, formAction, isPending] = useActionState(
        async (_prev: { error: string | null }, formData: FormData) => {
            if (voted) {
                setVoted(false);
                setDisplayVotes((v) => v - 1);
            } else {
                setVoted(true);
                setDisplayVotes((v) => v + 1);
            }
            const result = await voteComment(formData);
            if (result.error) {
                setVoted(voted);
                setDisplayVotes(comment.upvotes);
            }
            return result;
        },
        { error: null }
    );

    const activeClass = voted
        ? "border-sky-500 bg-sky-50"
        : "border-gray-200 hover:bg-sky-50 hover:border-sky-200";

    return (
        <div className="py-3">
            <div className="flex items-start gap-3">
                <form action={formAction}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button
                        type="submit"
                        disabled={isPending}
                        className={`flex flex-col items-center min-w-[36px] min-h-[36px] justify-center rounded-lg border transition-colors disabled:opacity-50 ${activeClass}`}
                        aria-label="いいね"
                    >
                        <span className="text-xs text-sky-500">&#9650;</span>
                        <span className="text-xs font-medium text-gray-700">{displayVotes}</span>
                    </button>
                </form>
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-gray-500">名無し</span>
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                    {state.error && (
                        <p className="mt-1 text-xs text-red-500">{state.error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
