import { AppDTO } from "@/types";
import Link from "next/link";

interface Props {
    apps: AppDTO[]
}

export default function AppsList({ apps }: Props) {
    return (
        <ul className="divide-y divide-gray-200">
            {apps.map((app) => (
                <li key={app.id}>
                    <Link
                        href={`/apps/${app.slug}`}
                        className="block px-2 py-4 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{app.name}</span>
                            <span className="text-xs text-gray-400">{app.pricingType}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{app.description}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            {app.isJpSupport && (
                                <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded">日本語対応</span>
                            )}
                            {app.hasFreePlan && (
                                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded">無料プランあり</span>
                            )}
                            {app.platforms.map((platform) => (
                                <span key={platform} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {platform}
                                </span>
                            ))}
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    )
}