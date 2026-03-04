import { prisma } from "@/lib/prisma";
import { toAlternativeDTO } from "../../utils/transform";

// あるアプリ(slug)の代替一覧をコメント付きで取得
export async function AlternativesWithCommentsData(targetAppSlug: string) {
    const app = await prisma.app.findUnique({
        where: { slug: targetAppSlug },
        select: { id: true },
    });

    if (!app) return [];

    const alternatives = await prisma.alternative.findMany({
        where: { targetAppId: app.id },
        include: {
            altApp: true,
            comments: {
                orderBy: { upvotes: "desc" },
            },
        },
        orderBy: { upvotes: "desc" },
    });

    return alternatives.map(toAlternativeDTO);
}

// クライアントが投票済みの代替アプリID・コメントIDを取得
export async function VotedIdsData(alternativeIds: string[], commentIds: string[], clientIdentifier: string) {
    const [altVotes, commentVotes] = await Promise.all([
        prisma.voteLog.findMany({
            where: {
                alternativeId: { in: alternativeIds },
                clientIdentifier,
            },
            select: { alternativeId: true },
        }),
        prisma.commentVoteLog.findMany({
            where: {
                commentId: { in: commentIds },
                clientIdentifier,
            },
            select: { commentId: true },
        }),
    ]);

    return {
        votedAlternativeIds: new Set(altVotes.map((v) => v.alternativeId)),
        votedCommentIds: new Set(commentVotes.map((v) => v.commentId)),
    };
}
