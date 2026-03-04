"use client";

import { useState } from "react";
import { useActionState } from "react";

import { voteAlternative } from "../../actions/comment.action";

interface Props {
    alternativeId: string;
    upvotes: number;
    hasVoted: boolean;
}

export default function AlternativeVoteButton({ alternativeId, upvotes, hasVoted }: Props) {
    const [voted, setVoted] = useState(hasVoted);
    const [displayVotes, setDisplayVotes] = useState(upvotes);

    const [state, formAction, isPending] = useActionState(
        async (_prev: { error: string | null }, formData: FormData) => {
            // Optimistic UI
            if (voted) {
                setVoted(false);
                setDisplayVotes((v) => v - 1);
            } else {
                setVoted(true);
                setDisplayVotes((v) => v + 1);
            }
            const result = await voteAlternative(formData);
            if (result.error) {
                // ロールバック
                setVoted(voted);
                setDisplayVotes(upvotes);
            }
            return result;
        },
        { error: null }
    );

    const activeClass = voted
        ? "border-sky-500 bg-sky-50"
        : "border-gray-200 hover:bg-sky-50 hover:border-sky-200";

    return (
        <form action={formAction}>
            <input type="hidden" name="alternativeId" value={alternativeId} />
            <button
                type="submit"
                disabled={isPending}
                className={`flex flex-col items-center min-w-[44px] min-h-[44px] justify-center rounded-lg border transition-colors disabled:opacity-50 ${activeClass}`}
                aria-label="いいね"
            >
                <span className="text-xs text-sky-500">&#9650;</span>
                <span className="text-sm font-medium text-gray-700">{displayVotes}</span>
            </button>
            {state.error && (
                <p className="mt-1 text-xs text-red-500">{state.error}</p>
            )}
        </form>
    );
}
