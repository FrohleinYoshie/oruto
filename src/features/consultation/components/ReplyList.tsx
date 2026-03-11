import Link from "next/link";
import type { ConsultationReplyDTO } from "@/types/consultation";
import ReplyVoteButton from "./ReplyVoteButton";

interface Props {
    replies: ConsultationReplyDTO[];
    votedReplyIds: string[];
}

export default function ReplyList({ replies, votedReplyIds }: Props) {
    if (replies.length === 0) {
        return (
            <p className="text-sm text-gray-500 py-4">
                まだ回答がありません。最初の提案をしてみましょう！
            </p>
        );
    }

    return (
        <ul className="divide-y divide-gray-200">
            {replies.map((reply) => (
                <li key={reply.id} className="py-4 flex items-start gap-3">
                    {/* 投票ボタン */}
                    <ReplyVoteButton
                        replyId={reply.id}
                        upvotes={reply.upvotes}
                        hasVoted={votedReplyIds.includes(reply.id)}
                    />

                    <div className="flex-1 min-w-0">
                        {/* 提案アプリ */}
                        <Link
                            href={`/apps/${reply.suggestedApp.slug}`}
                            className="text-sm font-medium text-gray-900 hover:text-sky-500 transition-colors"
                        >
                            {reply.suggestedApp.name}
                        </Link>

                        {/* バッジ */}
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {reply.suggestedApp.isJpSupport && (
                                <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded">
                                    日本語対応
                                </span>
                            )}
                            {reply.suggestedApp.hasFreePlan && (
                                <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">
                                    無料プランあり
                                </span>
                            )}
                            {reply.suggestedApp.pricingType && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                    {reply.suggestedApp.pricingType}
                                </span>
                            )}
                        </div>

                        {/* 推薦理由 */}
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                            {reply.body}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
