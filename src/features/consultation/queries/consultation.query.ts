import { prisma } from "@/lib/prisma";
import { toConsultationDTO, toConsultationReplyDTO } from "@/features/consultation/utils/transform";

const PER_PAGE = 10;

/** 相談一覧を取得（ページネーション付き） */
export async function ConsultationsData(page: number = 1) {
    const consultations = await prisma.consultation.findMany({
        include: {
            targetApp: true,
            category: true,
            _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
    });

    return consultations.map((c) =>
        toConsultationDTO(c, c.targetApp, c.category, c._count.replies)
    );
}

/** 相談の総数を取得 */
export async function ConsultationsCount() {
    return prisma.consultation.count();
}

/** 相談詳細を取得 */
export async function ConsultationDetailData(id: string) {
    const consultation = await prisma.consultation.findUnique({
        where: { id },
        include: {
            targetApp: true,
            category: true,
            _count: { select: { replies: true } },
        },
    });

    if (!consultation) return null;

    return toConsultationDTO(
        consultation,
        consultation.targetApp,
        consultation.category,
        consultation._count.replies
    );
}

/** 相談の回答一覧を取得（投票数順） */
export async function ConsultationRepliesData(consultationId: string) {
    const replies = await prisma.consultationReply.findMany({
        where: { consultationId },
        include: { suggestedApp: true },
        orderBy: { upvotes: "desc" },
    });

    return replies.map(toConsultationReplyDTO);
}

/** 回答への投票済みIDを取得 */
export async function VotedReplyIdsData(replyIds: string[], clientIdentifier: string) {
    const votes = await prisma.consultationReplyVoteLog.findMany({
        where: {
            replyId: { in: replyIds },
            clientIdentifier,
        },
        select: { replyId: true },
    });

    return new Set(votes.map((v) => v.replyId));
}

/** トップページ用: 最新の相談を取得 */
export async function RecentConsultationsData(take: number = 5) {
    const consultations = await prisma.consultation.findMany({
        where: { status: "open" },
        include: {
            targetApp: true,
            category: true,
            _count: { select: { replies: true } },
        },
        orderBy: { createdAt: "desc" },
        take,
    });

    return consultations.map((c) =>
        toConsultationDTO(c, c.targetApp, c.category, c._count.replies)
    );
}
