import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/features/app/utils/transform";

export default async function CategoryList() {
  const rawCategories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    take: 8,
  });
  const categories = rawCategories.map(toCategoryDTO);

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="border border-gray-200 rounded-lg px-4 py-3 hover:bg-sky-50 transition-colors"
        >
          <span className="text-gray-900">{category.name}</span>
        </Link>
      ))}
      {categories.length === 0 && (
        <p className="text-gray-500">カテゴリーがありません</p>
      )}
    </div>
  );
}
