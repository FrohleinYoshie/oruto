"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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
    const forwarded = headersList.get("x-forwarded-for");
    const clientIdentifier = forwarded?.split(",")[0]?.trim() ?? "unknown";

    // 既にいいね済みか確認
    const existing = await prisma.voteLog.findFirst({
        where: {
            alternativeId: result.data.alternativeId,
            clientIdentifier,
        },
    });

    try {
        if (existing) {
            // いいね取り消し
            await prisma.$transaction([
                prisma.voteLog.delete({
                    where: { id: existing.id },
                }),
                prisma.alternative.update({
                    where: { id: result.data.alternativeId },
                    data: { upvotes: { decrement: 1 } },
                }),
            ]);
        } else {
            // いいね追加
            await prisma.$transaction([
                prisma.voteLog.create({
                    data: {
                        alternativeId: result.data.alternativeId,
                        clientIdentifier,
                    },
                }),
                prisma.alternative.update({
                    where: { id: result.data.alternativeId },
                    data: { upvotes: { increment: 1 } },
                }),
            ]);
        }
    } catch (error) {
        console.error("Alternative vote error:", error);
        return { error: "いいねに失敗しました。" };
    }

    revalidatePath("/apps", "layout");
    return { error: null };
}
