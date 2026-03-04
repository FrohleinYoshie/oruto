"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const commentSchema = z.object({
    alternativeId: z.string().uuid("不正なIDです。"),
    body: z.string().min(1, "コメントを入力してください。").max(500, "コメントは500文字以内で入力してください。"),
});

const voteSchema = z.object({
    commentId: z.string().uuid("不正なIDです。"),
});

const altVoteSchema = z.object({
    alternativeId: z.string().uuid("不正なIDです。"),
});

/** コメント投稿（ログイン必須） */
export async function createComment(formData: FormData) {
    const result = commentSchema.safeParse({
        alternativeId: formData.get("alternativeId"),
        body: formData.get("body"),
    });

    if (!result.success) {
        return { error: result.error.errors[0].message };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "ログインが必要です。" };
    }

    try {
        await prisma.alternativeComment.create({
            data: {
                alternativeId: result.data.alternativeId,
                userId: user.id,
                body: result.data.body,
            },
        });
    } catch (error) {
        console.error("Comment create error:", error);
        return { error: "コメントの投稿に失敗しました。" };
    }

    revalidatePath("/apps", "layout");
    return { error: null };
}

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
