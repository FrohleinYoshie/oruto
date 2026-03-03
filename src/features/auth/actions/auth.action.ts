"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const authSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください。"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください。"),
});

/** FormDataからバリデーション済みのemail/passwordを取得する */
function parseAuthForm(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function login(formData: FormData) {
  const result = parseAuthForm(formData);
  if (!result.success) {
    const message = result.error.errors[0].message;
    redirect("/login?error=" + encodeURIComponent(message));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    console.error("Login error:", error.message, error.status);
    redirect("/login?error=" + encodeURIComponent("ログインに失敗しました。"));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const result = parseAuthForm(formData);
  if (!result.success) {
    const message = result.error.errors[0].message;
    redirect("/signup?error=" + encodeURIComponent(message));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(result.data);

  if (error) {
    console.error("Signup error:", error.message, error.status);
    redirect("/signup?error=" + encodeURIComponent("登録に失敗しました。"));
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("SignoutError:", error.message, error.status);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
