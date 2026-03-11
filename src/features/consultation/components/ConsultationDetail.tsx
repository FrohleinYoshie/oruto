import Link from "next/link";
import type { ConsultationDTO } from "@/types/consultation";

interface Props {
    consultation: ConsultationDTO;
}

export default function ConsultationDetail({ consultation }: Props) {
    const date = new Date(consultation.createdAt);
    const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    return (
        <div className="border border-gray-200 rounded-lg p-6">
            {/* ステータス */}
            {consultation.status === "resolved" && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded mb-3 inline-block">
                    解決済み
                </span>
            )}

            {/* タイトル */}
            <h1 className="text-xl font-bold text-gray-900 mb-3">
                {consultation.title}
            </h1>

            {/* メタ情報 */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-sky-600">
                    {consultation.targetApp ? (
                        <Link
                            href={`/apps/${consultation.targetApp.slug}`}
                            className="hover:text-sky-700 transition-colors"
                        >
                            {consultation.appName} ↗
                        </Link>
                    ) : (
                        consultation.appName
                    )}
                </span>
                {consultation.categoryName && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {consultation.categoryName}
                    </span>
                )}
                <span className="text-xs text-gray-400">{dateStr}</span>
            </div>

            {/* 本文 */}
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {consultation.body}
            </p>
        </div>
    );
}
