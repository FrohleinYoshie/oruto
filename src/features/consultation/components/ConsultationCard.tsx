import Link from "next/link";
import type { ConsultationDTO } from "@/types/consultation";

interface Props {
    consultation: ConsultationDTO;
}

export default function ConsultationCard({ consultation }: Props) {
    const date = new Date(consultation.createdAt);
    const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

    return (
        <Link
            href={`/consultations/${consultation.id}`}
            className="block border-b border-gray-200 py-4 hover:bg-sky-50/30 transition-colors px-2 -mx-2 rounded-lg"
        >
            <div className="flex items-start gap-3">
                {/* 回答数バッジ */}
                <div className="flex flex-col items-center min-w-[44px] min-h-[44px] justify-center rounded-lg border border-gray-200 bg-white">
                    <span className="text-sm font-medium text-gray-700">{consultation.replyCount}</span>
                    <span className="text-[10px] text-gray-500">回答</span>
                </div>

                <div className="flex-1 min-w-0">
                    {/* タイトル */}
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {consultation.title}
                    </h3>

                    {/* メタ情報 */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                            {consultation.appName}
                        </span>
                        {consultation.categoryName && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {consultation.categoryName}
                            </span>
                        )}
                        {consultation.status === "resolved" && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                解決済み
                            </span>
                        )}
                        <span className="text-xs text-gray-400">{dateStr}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
