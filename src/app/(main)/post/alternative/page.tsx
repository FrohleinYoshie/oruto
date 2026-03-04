import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ContentWrapper from "@/components/layout/ContentWrapper";
import AlternativeForm from "@/features/post/components/AlternativeForm";
import { AllCategoriesData } from "@/features/category/queries/categories.query";
import { prisma } from "@/lib/prisma";
import { toAppDTO } from "@/utils/transform";

interface Props {
  searchParams: Promise<{ target?: string }>;
}

export default async function AlternativePostPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const [categories, { target }] = await Promise.all([
    AllCategoriesData(),
    searchParams,
  ]);

  // ?target=slug が指定されていれば対象アプリを事前取得
  let preselectedTarget = null;
  if (target) {
    const app = await prisma.app.findUnique({ where: { slug: target } });
    if (app) {
      preselectedTarget = toAppDTO(app);
    }
  }

  return (
    <ContentWrapper>
      <AlternativeForm
        isLoggedIn={!!user}
        categories={categories}
        preselectedTarget={preselectedTarget}
      />
    </ContentWrapper>
  );
}
