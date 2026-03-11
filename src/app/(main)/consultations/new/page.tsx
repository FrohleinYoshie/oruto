import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AllCategoriesData } from "@/features/category/queries/categories.query";
import ConsultationForm from "@/features/consultation/components/ConsultationForm";
import ContentWrapper from "@/components/layout/ContentWrapper";

export default async function NewConsultationPage() {
    const [supabase, categories] = await Promise.all([
        createClient(),
        AllCategoriesData(),
    ]);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    return (
        <ContentWrapper>
            <ConsultationForm
                isLoggedIn={!!user}
                categories={categories}
            />
        </ContentWrapper>
    );
}
