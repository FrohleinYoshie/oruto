"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CategoryDTO } from "@/types";

interface Props {
    categories: CategoryDTO[];
}

export default function CategorySidebar({ categories }: Props) {
    const pathname = usePathname();
    const activeSlug = pathname.split("/")[2] || null;

    return (
        <nav aria-label="カテゴリーナビゲーション">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">
                カテゴリー
            </h2>
            <ul className="space-y-1">
                {categories.map((category) => {
                    const isActive = category.slug === activeSlug;
                    return (
                        <li key={category.id}>
                            <Link
                                href={`/categories/${category.slug}`}
                                className={`
                                    block px-3 py-2 rounded-lg text-sm transition-colors
                                    ${isActive
                                        ? "bg-sky-50 text-sky-600 border-l-2 border-sky-500 font-medium"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                {category.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
