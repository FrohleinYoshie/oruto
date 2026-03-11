import type { AppDTO } from "./app";

export interface ConsultationDTO {
    id: string;
    userId: string;
    appName: string;
    targetApp: AppDTO | null;
    categoryName: string | null;
    title: string;
    body: string;
    status: string;
    replyCount: number;
    createdAt: Date;
}

export interface ConsultationReplyDTO {
    id: string;
    consultationId: string;
    userId: string;
    suggestedApp: AppDTO;
    body: string;
    upvotes: number;
    createdAt: Date;
}
