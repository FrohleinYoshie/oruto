import Link from "next/link";
import type { CategoryWithAppsDTO } from "@/types";

interface Props {
  category: CategoryWithAppsDTO;
}

export default function DetailCategory({ category }: Props) {
  return (
    <>
      {/* カテゴリタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {category.apps.length} 件のアプリ
        </p>
      </div>

      {/* アプリ一覧 */}
      {category.apps.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {category.apps.map((app) => (
            <li key={app.id}>
              <Link
                href={`/apps/${app.slug}`}
                className="block px-2 py-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="font-medium text-gray-900">{app.name}</span>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  {app.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-8 text-center text-gray-500">
          このカテゴリーにはまだアプリが登録されていません。
        </p>
      )}
    </>
  );
}
