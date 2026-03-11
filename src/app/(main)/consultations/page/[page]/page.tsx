import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ConsultationsData, ConsultationsCount } from "@/features/consultation/queries/consultation.query";
import ConsultationCard from "@/features/consultation/components/ConsultationCard";
import ContentWrapper from "@/components/layout/ContentWrapper";
import Pagination from "@/components/Pagination";

export const revalidate = 60;

const PER_PAGE = 10;

interface Props {
    params: Promise<{ page: string }>;
}

export default async function ConsultationsPagedPage({ params }: Props) {
    const { page } = await params;
    const pageNum = Number(page);

    if (!Number.isInteger(pageNum) || pageNum < 1) {
        notFound();
    }

    if (pageNum === 1) {
        redirect("/consultations");
    }

    const [consultations, totalCount] = await Promise.all([
        ConsultationsData(pageNum),
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
                currentPage={pageNum}
                baseUrl="consultations/page/"
                firstPageUrl="/consultations"
            />
        </ContentWrapper>
    );
}
