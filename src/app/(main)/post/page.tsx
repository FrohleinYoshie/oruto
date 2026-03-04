import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ContentWrapper from "@/components/layout/ContentWrapper";
import PostForm from "@/features/post/components/PostForm";
import { AllCategoriesData } from "@/features/category/queries/categories.query";

export default async function PostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const categories = await AllCategoriesData();
  return (
    <ContentWrapper>
      <PostForm isLoggedIn={!!user} categories={categories} />
    </ContentWrapper>
  );
}
