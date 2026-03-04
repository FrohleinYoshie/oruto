"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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
    const forwarded = headersList.get("x-forwarded-for");
    const clientIdentifier = forwarded?.split(",")[0]?.trim() ?? "unknown";

    // 既にいいね済みか確認
    const existing = await prisma.commentVoteLog.findFirst({
        where: {
            commentId: result.data.commentId,
            clientIdentifier,
        },
    });

    try {
        if (existing) {
            // いいね取り消し
            await prisma.$transaction([
                prisma.commentVoteLog.delete({
                    where: { id: existing.id },
                }),
                prisma.alternativeComment.update({
                    where: { id: result.data.commentId },
                    data: { upvotes: { decrement: 1 } },
                }),
            ]);
        } else {
            // いいね追加
            await prisma.$transaction([
                prisma.commentVoteLog.create({
                    data: {
                        commentId: result.data.commentId,
                        clientIdentifier,
                    },
                }),
                prisma.alternativeComment.update({
                    where: { id: result.data.commentId },
                    data: { upvotes: { increment: 1 } },
                }),
            ]);
        }
    } catch (error) {
        console.error("Comment vote error:", error);
        return { error: "いいねに失敗しました。" };
    }

    revalidatePath("/apps", "layout");
    return { error: null };
}
