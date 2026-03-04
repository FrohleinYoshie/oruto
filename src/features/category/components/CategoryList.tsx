import Link from "next/link";
import { CategoryDTO } from "@/types";

interface Props {
    categories: CategoryDTO[];
}

export default async function CategoryList({ categories }: Props) {

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="border border-gray-200 rounded-lg px-4 py-4 hover:bg-sky-50 hover:border-sky-200 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">{category.name}</span>
        </Link>
      ))}
      {categories.length === 0 && (
        <p className="text-gray-500 col-span-full">カテゴリーがありません</p>
      )}
    </div>
  );
}
