"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getClientIdentifier } from "@/utils/client-identifier";

const voteSchema = z.object({
    replyId: z.string().uuid("不正なIDです。"),
});

/** 相談回答への投票トグル（IPベース） */
export async function voteReply(formData: FormData) {
    const result = voteSchema.safeParse({
        replyId: formData.get("replyId"),
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
            // 既に投票済みか確認（トランザクション内）
            const existing = await tx.consultationReplyVoteLog.findFirst({
                where: {
                    replyId: result.data.replyId,
                    clientIdentifier,
                },
            });

            if (existing) {
                // 投票取り消し
                await tx.consultationReplyVoteLog.delete({ where: { id: existing.id } });
                await tx.consultationReply.update({
                    where: { id: result.data.replyId },
                    data: { upvotes: { decrement: 1 } },
                });
            } else {
                // 投票追加
                await tx.consultationReplyVoteLog.create({
                    data: {
                        replyId: result.data.replyId,
                        clientIdentifier,
                    },
                });
                await tx.consultationReply.update({
                    where: { id: result.data.replyId },
                    data: { upvotes: { increment: 1 } },
                });
            }
        });
    } catch (error) {
        console.error("Reply vote error:", error);
        return { error: "投票に失敗しました。" };
    }

    revalidatePath("/consultations", "layout");
    return { error: null };
}
