"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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
    const forwarded = headersList.get("x-forwarded-for");
    const clientIdentifier = forwarded?.split(",")[0]?.trim() ?? "unknown";

    // 既に投票済みか確認
    const existing = await prisma.consultationReplyVoteLog.findFirst({
        where: {
            replyId: result.data.replyId,
            clientIdentifier,
        },
    });

    try {
        if (existing) {
            // 投票取り消し
            await prisma.$transaction([
                prisma.consultationReplyVoteLog.delete({
                    where: { id: existing.id },
                }),
                prisma.consultationReply.update({
                    where: { id: result.data.replyId },
                    data: { upvotes: { decrement: 1 } },
                }),
            ]);
        } else {
            // 投票追加
            await prisma.$transaction([
                prisma.consultationReplyVoteLog.create({
                    data: {
                        replyId: result.data.replyId,
                        clientIdentifier,
                    },
                }),
                prisma.consultationReply.update({
                    where: { id: result.data.replyId },
                    data: { upvotes: { increment: 1 } },
                }),
            ]);
        }
    } catch (error) {
        console.error("Reply vote error:", error);
        return { error: "投票に失敗しました。" };
    }

    revalidatePath("/consultations", "layout");
    return { error: null };
}
