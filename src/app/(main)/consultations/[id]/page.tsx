import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getClientIdentifier } from "@/utils/client-identifier";
import {
    ConsultationDetailData,
    ConsultationRepliesData,
    VotedReplyIdsData,
} from "@/features/consultation/queries/consultation.query";
import ConsultationDetail from "@/features/consultation/components/ConsultationDetail";
import ReplyList from "@/features/consultation/components/ReplyList";
import ReplyForm from "@/features/consultation/components/ReplyForm";
import ContentWrapper from "@/components/layout/ContentWrapper";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ConsultationDetailPage({ params }: Props) {
    const { id } = await params;

    // UUID形式の検証
    if (!z.string().uuid().safeParse(id).success) {
        notFound();
    }

    const consultation = await ConsultationDetailData(id);
    if (!consultation) {
        notFound();
    }

    const [replies, supabase, headersList] = await Promise.all([
        ConsultationRepliesData(id),
        createClient(),
        headers(),
    ]);

    const { data: { user } } = await supabase.auth.getUser();

    // クライアントIPから投票済み状態を取得
    const clientIdentifier = getClientIdentifier(headersList) ?? "";

    const replyIds = replies.map((r) => r.id);
    const votedReplyIds = await VotedReplyIdsData(replyIds, clientIdentifier);

    return (
        <ContentWrapper className="py-6">
            {/* 相談内容 */}
            <ConsultationDetail consultation={consultation} />

            {/* 回答一覧 */}
            <section className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    提案された代替アプリ
                    {replies.length > 0 && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            {replies.length}件
                        </span>
                    )}
                </h2>
                <ReplyList
                    replies={replies}
                    votedReplyIds={[...votedReplyIds]}
                />
            </section>

            {/* 回答フォーム */}
            <section className="mt-8">
                <ReplyForm
                    consultationId={id}
                    isLoggedIn={!!user}
                />
            </section>
        </ContentWrapper>
    );
}
