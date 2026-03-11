import Link from "next/link";
import { ConsultationsData, ConsultationsCount } from "@/features/consultation/queries/consultation.query";
import ConsultationCard from "@/features/consultation/components/ConsultationCard";
import ContentWrapper from "@/components/layout/ContentWrapper";
import Pagination from "@/components/Pagination";

export const revalidate = 60;

const PER_PAGE = 10;

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function ConsultationsPage({ searchParams }: Props) {
    const params = await searchParams;
    const page = Math.max(1, Number(params.page) || 1);

    const [consultations, totalCount] = await Promise.all([
        ConsultationsData(page),
        ConsultationsCount(),
    ]);

    return (
        <ContentWrapper className="py-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">相談一覧</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        困っているアプリの代わりをみんなに聞いてみましょう
                    </p>
                </div>
                <Link
                    href="/consultations/new"
                    className="bg-sky-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-sky-600 transition-colors font-medium"
                >
                    相談する
                </Link>
            </div>

            {consultations.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">まだ相談がありません</p>
                    <Link
                        href="/consultations/new"
                        className="text-sky-500 hover:text-sky-600 text-sm"
                    >
                        最初の相談を投稿する →
                    </Link>
                </div>
            ) : (
                <>
                    <div>
                        {consultations.map((consultation) => (
                            <ConsultationCard
                                key={consultation.id}
                                consultation={consultation}
                            />
                        ))}
                    </div>

                    <Pagination
                        numApps={totalCount}
                        limit={PER_PAGE}
                        currentPage={page}
                        baseUrl="consultations/page/"
                        firstPageUrl="/consultations"
                    />
                </>
            )}
        </ContentWrapper>
    );
}
