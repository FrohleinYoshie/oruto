"use client";

import { useState } from "react";
import { useActionState } from "react";
import { voteReply } from "@/features/consultation/actions/vote-reply.action";

interface Props {
    replyId: string;
    upvotes: number;
    hasVoted: boolean;
}

export default function ReplyVoteButton({ replyId, upvotes, hasVoted }: Props) {
    const [voted, setVoted] = useState(hasVoted);
    const [displayVotes, setDisplayVotes] = useState(upvotes);

    const [state, formAction, isPending] = useActionState(
        async (_prev: { error: string | null }, formData: FormData) => {
            const wasVoted = voted;
            // Optimistic UI
            if (wasVoted) {
                setVoted(false);
                setDisplayVotes((v) => v - 1);
            } else {
                setVoted(true);
                setDisplayVotes((v) => v + 1);
            }
            const result = await voteReply(formData);
            if (result.error) {
                // ロールバック: 楽観的更新を反転
                setVoted(wasVoted);
                setDisplayVotes((v) => wasVoted ? v + 1 : v - 1);
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
            <input type="hidden" name="replyId" value={replyId} />
            <button
                type="submit"
                disabled={isPending}
                className={`flex flex-col items-center min-w-[44px] min-h-[44px] justify-center rounded-lg border transition-colors disabled:opacity-50 ${activeClass}`}
                aria-label="投票する"
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
