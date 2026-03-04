// このファイルは、複数のコンポーネントで使用するカテゴリーのデータを取得するためのクエリです。

import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/utils/transform";

export async function CategoriesData() {
    const rawCategories = await prisma.category.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
    });
    const categories = rawCategories.map(toCategoryDTO);
    return categories;
}

// 全カテゴリーを名前順で取得
export async function AllCategoriesData() {
    const rawCategories = await prisma.category.findMany({
        orderBy: { createdAt: "desc" }
    });
    return rawCategories.map(toCategoryDTO);
}
