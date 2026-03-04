import Link from "next/link";

import type { AlternativeDTO } from "@/types/alternative";
import AlternativeVoteButton from "./AlternativeVoteButton";
import CommentSection from "@/features/comment/components/CommentSection";
import CommentForm from "@/features/comment/components/CommentForm";

interface Props {
    alternatives: AlternativeDTO[];
    isLoggedIn: boolean;
    votedAlternativeIds: string[];
    votedCommentIds: string[];
}

export default function AlternativesList({ alternatives, isLoggedIn, votedAlternativeIds, votedCommentIds }: Props) {
    if (alternatives.length === 0) {
        return (
            <p className="py-8 text-center text-gray-500">
                まだ代替アプリが登録されていません。
            </p>
        );
    }

    const votedAltSet = new Set(votedAlternativeIds);

    return (
        <ul className="divide-y divide-gray-200">
            {alternatives.map((alt) => (
                <li key={alt.id} className="py-4">
                    {/* 代替アプリ情報 */}
                    <div className="flex items-center gap-3">
                        <AlternativeVoteButton
                            alternativeId={alt.id}
                            upvotes={alt.upvotes}
                            hasVoted={votedAltSet.has(alt.id)}
                        />
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/apps/${alt.altApp.slug}`}
                                className="font-medium text-gray-900 hover:text-sky-500 transition-colors"
                            >
                                {alt.altApp.name}
                            </Link>
                            <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{alt.altApp.description}</p>
                            <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                                {alt.altApp.isJpSupport && (
                                    <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded">日本語対応</span>
                                )}
                                {alt.altApp.hasFreePlan && (
                                    <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">無料プランあり</span>
                                )}
                                {alt.altApp.pricingType && (
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{alt.altApp.pricingType}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* コメント一覧（最新3件 + もっと見る） */}
                    <CommentSection comments={alt.comments} votedCommentIds={votedCommentIds} />

                    {/* コメント投稿フォーム */}
                    <div className="ml-12">
                        <CommentForm alternativeId={alt.id} isLoggedIn={isLoggedIn} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
