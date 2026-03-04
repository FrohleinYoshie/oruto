"use client";

import { useState } from "react";

import type { AlternativeCommentDTO } from "@/types/comment";
import CommentCard from "./CommentCard";

interface Props {
    comments: AlternativeCommentDTO[];
    votedCommentIds: string[];
}

const INITIAL_DISPLAY = 3;

export default function CommentSection({ comments, votedCommentIds }: Props) {
    const [expanded, setExpanded] = useState(false);

    if (comments.length === 0) return null;

    const votedSet = new Set(votedCommentIds);
    const visibleComments = expanded ? comments : comments.slice(0, INITIAL_DISPLAY);
    const hiddenCount = comments.length - INITIAL_DISPLAY;

    return (
        <div className="mt-3 ml-12 border-l-2 border-gray-100 pl-4">
            {visibleComments.map((comment) => (
                <CommentCard
                    key={comment.id}
                    comment={comment}
                    hasVoted={votedSet.has(comment.id)}
                />
            ))}
            {!expanded && hiddenCount > 0 && (
                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="mt-1 text-sm text-sky-500 hover:text-sky-600 transition-colors"
                >
                    他 {hiddenCount} 件のコメントを表示
                </button>
            )}
            {expanded && hiddenCount > 0 && (
                <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="mt-1 text-sm text-gray-400 hover:text-gray-500 transition-colors"
                >
                    閉じる
                </button>
            )}
        </div>
    );
}
