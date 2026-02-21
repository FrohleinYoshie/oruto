"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login error:", error.message);
        redirect("/login?error=ログインに失敗しました。時間をおいて再度お試しください。");
    }

    revalidatePath("/", "layout");
    redirect("/search");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error("Signup error:", error.message);
        redirect("/signup?error=アカウント作成に失敗しました。時間をおいて再度お試しください。");
    }

    // 通常はメール確認が必要ですが、ここでは自動確認またはログイン画面へのリダイレクトを想定しています
    revalidatePath("/", "layout");
    redirect("/search");
}

export async function signout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Signout error:", error.message);
        redirect("/?error=ログアウトに失敗しました。");
    }

    revalidatePath("/", "layout");
    redirect("/");
}
