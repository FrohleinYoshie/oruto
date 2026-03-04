import Link from "next/link";
import CategoryDetail from "@/features/category/components/CategoryDetail";
import { CategoryDetailData } from "@/features/category/queries/category-detail.query";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategorySlugPage({ params }: Props) {
  const { slug } = await params;
  const category = await CategoryDetailData(slug);

  if (!category) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">カテゴリーが見つかりませんでした。</p>
        <Link
          href="/categories"
          className="mt-4 inline-block text-sky-500 hover:text-sky-600 text-sm"
        >
          カテゴリー一覧に戻る
        </Link>
      </div>
    );
  }

  return <CategoryDetail category={category} />;
}
