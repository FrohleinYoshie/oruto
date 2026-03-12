"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getClientIdentifier } from "@/utils/client-identifier";

const altVoteSchema = z.object({
    alternativeId: z.string().uuid("不正なIDです。"),
});

/** 代替アプリいいねトグル（IPベース） */
export async function voteAlternative(formData: FormData) {
    const result = altVoteSchema.safeParse({
        alternativeId: formData.get("alternativeId"),
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
            const existing = await tx.voteLog.findFirst({
                where: {
                    alternativeId: result.data.alternativeId,
                    clientIdentifier,
                },
            });

            if (existing) {
                // いいね取り消し
                await tx.voteLog.delete({ where: { id: existing.id } });
                await tx.alternative.update({
                    where: { id: result.data.alternativeId },
                    data: { upvotes: { decrement: 1 } },
                });
            } else {
                // いいね追加
                await tx.voteLog.create({
                    data: {
                        alternativeId: result.data.alternativeId,
                        clientIdentifier,
                    },
                });
                await tx.alternative.update({
                    where: { id: result.data.alternativeId },
                    data: { upvotes: { increment: 1 } },
                });
            }
        });
    } catch (error) {
        console.error("Alternative vote error:", error);
        return { error: "いいねに失敗しました。" };
    }

    revalidatePath("/apps", "layout");
    return { error: null };
}
