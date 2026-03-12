"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getClientIdentifier } from "@/utils/client-identifier";

const voteSchema = z.object({
    commentId: z.string().uuid("不正なIDです。"),
});

/** コメントいいねトグル（IPベース） */
export async function voteComment(formData: FormData) {
    const result = voteSchema.safeParse({
        commentId: formData.get("commentId"),
    });

    if (!result.success) {
        return { error: result.error.errors[0].message };
    }

    const headersList = await headers();
    const clientIdentifier = getClientIdentifier(headersList);
    if (!clientIdentifier) {
        return { error: "クライアント識別子を取得できませんでした。" };
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 既にいいね済みか確認（トランザクション内）
            const existing = await tx.commentVoteLog.findFirst({
                where: {
                    commentId: result.data.commentId,
                    clientIdentifier,
                },
            });

            if (existing) {
                // いいね取り消し
                await tx.commentVoteLog.delete({ where: { id: existing.id } });
                await tx.alternativeComment.update({
                    where: { id: result.data.commentId },
                    data: { upvotes: { decrement: 1 } },
                });
            } else {
                // いいね追加
                await tx.commentVoteLog.create({
                    data: {
                        commentId: result.data.commentId,
                        clientIdentifier,
                    },
                });
                await tx.alternativeComment.update({
                    where: { id: result.data.commentId },
                    data: { upvotes: { increment: 1 } },
                });
            }
        });
    } catch (error) {
        console.error("Comment vote error:", error);
        return { error: "いいねに失敗しました。" };
    }

    revalidatePath("/apps", "layout");
    return { error: null };
}
