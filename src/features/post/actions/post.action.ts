"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { validateUrl } from "@/features/post/utils/url-validation";
import { sanitizeText } from "@/utils/sanitize";
import { generateSlug } from "@/utils/slug";
import { VALID_PLATFORMS, VALID_PRICING_TYPES } from "@/utils/constants";

// zodバリデーションスキーマ
const postAppSchema = z.object({
  name: z
    .string()
    .min(2, "アプリ名は2文字以上で入力してください。")
    .max(100, "アプリ名は100文字以内で入力してください。"),
  description: z
    .string()
    .min(10, "説明は10文字以上で入力してください。")
    .max(500, "説明は500文字以内で入力してください。"),
  url: z
    .string()
    .max(2000, "URLは2000文字以内で入力してください。")
    .optional()
    .or(z.literal("")),
  categoryId: z.string().uuid("カテゴリを選択してください。"),
  platforms: z
    .array(z.enum(VALID_PLATFORMS))
    .min(1, "プラットフォームを1つ以上選択してください。"),
  isJpSupport: z.boolean(),
  hasFreePlan: z.boolean(),
  pricingType: z.enum(VALID_PRICING_TYPES, {
    errorMap: () => ({ message: "価格タイプを選択してください。" }),
  }),
});

export interface PostAppState {
  error: string | null;
  fieldErrors?: Record<string, string>;
  warnings?: string[];
  success?: boolean;
}

export async function PostApp(formData: FormData): Promise<PostAppState> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "ログインが必要です。" };
  }

  // フォームデータ取得
  const rawName = formData.get("name") as string | null;
  const rawDescription = formData.get("description") as string | null;
  const rawUrl = formData.get("url") as string | null;
  const categoryId = formData.get("categoryId") as string | null;
  const rawPlatforms = formData.getAll("platforms") as string[];
  const isJpSupport = formData.get("isJpSupport") === "true";
  const hasFreePlan = formData.get("hasFreePlan") === "true";
  const pricingType = formData.get("pricingType") as string | null;

  // サニタイズ
  const name = rawName ? sanitizeText(rawName) : "";
  const description = rawDescription ? sanitizeText(rawDescription) : "";
  const url = rawUrl ? rawUrl.trim() : "";

  // zodバリデーション
  const parsed = postAppSchema.safeParse({
    name,
    description,
    url: url || undefined,
    categoryId,
    platforms: rawPlatforms,
    isJpSupport,
    hasFreePlan,
    pricingType,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { error: "入力内容を確認してください。", fieldErrors };
  }

  // URL検証（5層防御）
  const warnings: string[] = [];
  if (url) {
    const urlValidation = validateUrl(url, name);
    if (!urlValidation.valid) {
      return {
        error: null,
        fieldErrors: { url: urlValidation.error! },
      };
    }
    warnings.push(...urlValidation.warnings);
  }

  // slug生成・重複チェック
  const slug = generateSlug(name);
  if (!slug) {
    return {
      error: null,
      fieldErrors: {
        name: "アプリ名からURLスラッグを生成できません。英数字を含む名前を入力してください。",
      },
    };
  }

  const existingApp = await prisma.app.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existingApp) {
    return {
      error: null,
      fieldErrors: {
        name: "同名のアプリが既に登録されています。",
      },
    };
  }

  // カテゴリ存在チェック
  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });
  if (!category) {
    return {
      error: null,
      fieldErrors: { categoryId: "選択されたカテゴリが存在しません。" },
    };
  }

  // DB登録
  try {
    await prisma.app.create({
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description,
        url: url || null,
        categoryId: parsed.data.categoryId,
        platforms: parsed.data.platforms as string[],
        isJpSupport: parsed.data.isJpSupport,
        hasFreePlan: parsed.data.hasFreePlan,
        pricingType: parsed.data.pricingType,
      },
    });
  } catch (error) {
    console.error("App registration error:", error);
    return { error: "アプリの登録に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/apps", "layout");
  revalidatePath("/", "layout");

  return { error: null, warnings, success: true };
}
