import { AllCategoriesData } from "@/features/category/queries/categories.query";
import CategorySidebar from "@/components/CategorySidebar";
import ContentWrapper from "@/components/layout/ContentWrapper";

export default async function CategoriesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const categories = await AllCategoriesData();

    return (
        <ContentWrapper className="py-6">
            <div className="flex gap-8">
                {/* サイドバー: カテゴリー一覧（デスクトップのみ表示） */}
                <aside className="hidden lg:block w-56 shrink-0">
                    <div className="sticky top-16">
                        <CategorySidebar categories={categories} />
                    </div>
                </aside>

                {/* メインコンテンツ */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </ContentWrapper>
    );
}
