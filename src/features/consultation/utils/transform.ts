import type { App, Category } from "@/generated/prisma/client";
import type { ConsultationDTO, ConsultationReplyDTO } from "@/types/consultation";
import { toAppDTO } from "@/utils/transform";

/** Prisma Consultation → ConsultationDTO に変換 */
export function toConsultationDTO(
    consultation: {
        id: string;
        userId: string;
        appName: string;
        title: string;
        body: string;
        status: string;
        createdAt: Date;
    },
    targetApp: App | null,
    category: Category | null,
    replyCount: number,
): ConsultationDTO {
    return {
        id: consultation.id,
        userId: consultation.userId,
        appName: consultation.appName,
        targetApp: targetApp ? toAppDTO(targetApp) : null,
        categoryName: category?.name ?? null,
        title: consultation.title,
        body: consultation.body,
        status: consultation.status,
        replyCount,
        createdAt: consultation.createdAt,
    };
}

/** Prisma ConsultationReply → ConsultationReplyDTO に変換 */
export function toConsultationReplyDTO(reply: {
    id: string;
    consultationId: string;
    userId: string;
    suggestedApp: App;
    body: string;
    upvotes: number;
    createdAt: Date;
}): ConsultationReplyDTO {
    return {
        id: reply.id,
        consultationId: reply.consultationId,
        userId: reply.userId,
        suggestedApp: toAppDTO(reply.suggestedApp),
        body: reply.body,
        upvotes: reply.upvotes,
        createdAt: reply.createdAt,
    };
}
