"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

function sanitizeText(input: string): string {
    return input.replace(/<[^>]*>/g, "").trim();
}

const replySchema = z.object({
    consultationId: z.string().uuid("不正な相談IDです。"),
    suggestedAppId: z.string().uuid("提案するアプリを選択してください。"),
    body: z.string().min(5, "理由は5文字以上で入力してください。").max(1000, "理由は1000文字以内"),
});

export interface ReplyActionState {
    error: string | null;
    fieldErrors?: Record<string, string>;
    success?: boolean;
}

export async function createReply(
    formData: FormData
): Promise<ReplyActionState> {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "ログインが必要です。" };
    }

    const rawData = {
        consultationId: formData.get("consultationId") as string,
        suggestedAppId: formData.get("suggestedAppId") as string,
        body: sanitizeText((formData.get("body") as string) ?? ""),
    };

    const parsed = replySchema.safeParse(rawData);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            fieldErrors[issue.path[0]?.toString() ?? ""] = issue.message;
        }
        return { error: "入力内容を確認してください。", fieldErrors };
    }

    try {
        // 相談が存在するか確認
        const consultation = await prisma.consultation.findUnique({
            where: { id: parsed.data.consultationId },
            select: { id: true },
        });
        if (!consultation) {
            return { error: "相談が見つかりません。" };
        }

        // 提案アプリが存在するか確認
        const app = await prisma.app.findUnique({
            where: { id: parsed.data.suggestedAppId },
            select: { id: true },
        });
        if (!app) {
            return { error: "提案するアプリが見つかりません。" };
        }

        // 同じ相談に同じアプリの重複チェック
        const existing = await prisma.consultationReply.findUnique({
            where: {
                consultationId_suggestedAppId: {
                    consultationId: parsed.data.consultationId,
                    suggestedAppId: parsed.data.suggestedAppId,
                },
            },
        });
        if (existing) {
            return { error: "このアプリは既に提案されています。" };
        }

        await prisma.consultationReply.create({
            data: {
                consultationId: parsed.data.consultationId,
                userId: user.id,
                suggestedAppId: parsed.data.suggestedAppId,
                body: parsed.data.body,
            },
        });

        revalidatePath(`/consultations/${parsed.data.consultationId}`);

        return { error: null, success: true };
    } catch (error) {
        console.error("Reply create error:", error);
        return { error: "回答の投稿に失敗しました。時間をおいて再度お試しください。" };
    }
}
