"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const commentSchema = z.object({
    alternativeId: z.string().uuid("不正なIDです。"),
    body: z.string().min(1, "コメントを入力してください。").max(500, "コメントは500文字以内で入力してください。"),
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
