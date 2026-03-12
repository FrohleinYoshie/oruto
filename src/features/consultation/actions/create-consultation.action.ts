"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/utils/sanitize";

const consultationSchema = z.object({
    appName: z.string().min(1, "アプリ名を入力してください。").max(100, "アプリ名は100文字以内"),
    targetAppId: z.string().uuid().optional().or(z.literal("")),
    categoryId: z.string().uuid().optional().or(z.literal("")),
    title: z.string().min(5, "タイトルは5文字以上で入力してください。").max(200, "タイトルは200文字以内"),
    body: z.string().min(10, "詳細は10文字以上で入力してください。").max(2000, "詳細は2000文字以内"),
});

export interface ConsultationActionState {
    error: string | null;
    fieldErrors?: Record<string, string>;
    success?: boolean;
    redirectTo?: string;
}

export async function createConsultation(
    formData: FormData
): Promise<ConsultationActionState> {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "ログインが必要です。" };
    }

    const rawData = {
        appName: sanitizeText((formData.get("appName") as string) ?? ""),
        targetAppId: (formData.get("targetAppId") as string) ?? "",
        categoryId: (formData.get("categoryId") as string) ?? "",
        title: sanitizeText((formData.get("title") as string) ?? ""),
        body: sanitizeText((formData.get("body") as string) ?? ""),
    };

    const parsed = consultationSchema.safeParse(rawData);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            fieldErrors[issue.path[0]?.toString() ?? ""] = issue.message;
        }
        return { error: "入力内容を確認してください。", fieldErrors };
    }

    try {
        const consultation = await prisma.consultation.create({
            data: {
                userId: user.id,
                appName: parsed.data.appName,
                targetAppId: parsed.data.targetAppId || null,
                categoryId: parsed.data.categoryId || null,
                title: parsed.data.title,
                body: parsed.data.body,
            },
        });

        revalidatePath("/consultations", "layout");
        revalidatePath("/", "layout");

        return {
            error: null,
            success: true,
            redirectTo: `/consultations/${consultation.id}`,
        };
    } catch (error) {
        console.error("Consultation create error:", error);
        return { error: "相談の投稿に失敗しました。時間をおいて再度お試しください。" };
    }
}
