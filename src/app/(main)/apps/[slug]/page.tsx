import { notFound } from "next/navigation"
import { headers } from "next/headers"

import { DetailAppsData } from "@/features/app/factory/slug/DetailAppsData"
import { AlternativesWithCommentsData, VotedIdsData } from "@/features/app/factory/slug/AlternativesWithCommentsData"
import AlternativesList from "@/features/app/components/slug/AlternativesList"
import ContentWrapper from "@/components/ContentWrapper"
import { createClient } from "@/lib/supabase/server"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    const app = await DetailAppsData(slug)

    if (!app) {
        notFound()
    }

    const [alternatives, supabase, headersList] = await Promise.all([
        AlternativesWithCommentsData(slug),
        createClient(),
        headers(),
    ])
    const { data: { user } } = await supabase.auth.getUser()

    // クライアントIPから投票済み状態を取得
    const forwarded = headersList.get("x-forwarded-for")
    const clientIdentifier = forwarded?.split(",")[0]?.trim() ?? "unknown"

    const alternativeIds = alternatives.map((a) => a.id)
    const commentIds = alternatives.flatMap((a) => a.comments.map((c) => c.id))

    const { votedAlternativeIds, votedCommentIds } = await VotedIdsData(
        alternativeIds,
        commentIds,
        clientIdentifier,
    )

    return (
        <ContentWrapper className="py-6">
            {/* アプリ詳細 */}
            <h1 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h1>
            <p className="text-sm text-gray-500">{app.description}</p>
            {app.url && (
                <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-sky-500 hover:text-sky-600 transition-colors"
                >
                    公式サイト &#8599;
                </a>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {app.isJpSupport && (
                    <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded">日本語対応</span>
                )}
                {app.hasFreePlan && (
                    <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">無料プランあり</span>
                )}
                {app.pricingType && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{app.pricingType}</span>
                )}
                {app.platforms.map((platform) => (
                    <span key={platform} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {platform}
                    </span>
                ))}
            </div>

            {/* 代替アプリ一覧 */}
            <section className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    {app.name} の代替アプリ
                </h2>
                <AlternativesList
                    alternatives={alternatives}
                    isLoggedIn={!!user}
                    votedAlternativeIds={[...votedAlternativeIds]}
                    votedCommentIds={[...votedCommentIds]}
                />
            </section>
        </ContentWrapper>
    )
}
