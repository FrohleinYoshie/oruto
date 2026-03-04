import Link from "next/link";
import { AllCategoriesData } from "@/features/category/queries/categories.query";

export default async function CategoriesPage() {
  const categories = await AllCategoriesData();

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">カテゴリー</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="border border-gray-200 rounded-lg px-4 py-3 hover:bg-sky-50 hover:border-sky-200 transition-colors"
          >
            <span className="text-sm font-medium text-gray-900">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="py-8 text-center text-gray-500">
          カテゴリーがまだ登録されていません。
        </p>
      )}
    </>
  );
}
