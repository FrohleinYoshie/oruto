"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { validateUrl } from "@/features/post/utils/url-validation";

// HTMLタグ除去
function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// slug生成
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s　]+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const VALID_PLATFORMS = [
  "Web", "iOS", "Android", "Windows", "Mac", "Linux",
  "Chrome Extension", "Firefox Extension", "Edge Extension", "Safari Extension", "Other",
] as const;

const VALID_PRICING_TYPES = ["無料", "無料プランあり", "有料", "その他"] as const;

// 既存アプリ同士の代替提案スキーマ
const alternativeSchema = z.object({
  targetAppId: z.string().uuid("対象アプリを選択してください。"),
  altAppId: z.string().uuid("代替アプリを選択してください。"),
});

// 新規アプリ登録用のスキーマ
const newAppSchema = z.object({
  name: z.string().min(2, "アプリ名は2文字以上").max(100, "アプリ名は100文字以内"),
  description: z.string().min(10, "説明は10文字以上").max(500, "説明は500文字以内"),
  url: z.string().max(2000).optional().or(z.literal("")),
  categoryId: z.string().uuid("カテゴリを選択してください。"),
  platforms: z.array(z.enum(VALID_PLATFORMS)).min(1, "プラットフォームを1つ以上選択"),
  isJpSupport: z.boolean(),
  hasFreePlan: z.boolean(),
  pricingType: z.enum(VALID_PRICING_TYPES),
});

export interface AlternativeActionState {
  error: string | null;
  fieldErrors?: Record<string, string>;
  warnings?: string[];
  success?: boolean;
  redirectTo?: string;
}

/** インラインフォームからアプリデータを抽出する */
function extractNewAppData(formData: FormData, prefix: string) {
  return {
    name: sanitizeText((formData.get(`${prefix}-name`) as string) ?? ""),
    description: sanitizeText((formData.get(`${prefix}-description`) as string) ?? ""),
    url: (formData.get(`${prefix}-url`) as string)?.trim() ?? "",
    categoryId: formData.get(`${prefix}-categoryId`) as string,
    platforms: formData.getAll(`${prefix}-platforms`) as string[],
    isJpSupport: formData.get(`${prefix}-isJpSupport`) === "true",
    hasFreePlan: formData.get(`${prefix}-hasFreePlan`) === "true",
    pricingType: formData.get(`${prefix}-pricingType`) as string,
  };
}

/** 新規アプリをDB登録し、IDを返す */
async function createNewApp(
  data: z.infer<typeof newAppSchema>,
  url: string
): Promise<{ id: string; error?: string; fieldErrors?: Record<string, string> }> {
  const slug = generateSlug(data.name);
  if (!slug) {
    return { id: "", error: "アプリ名からURLスラッグを生成できません。" };
  }

  // slug重複チェック
  const existing = await prisma.app.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    return { id: "", error: "同名のアプリが既に登録されています。" };
  }

  // カテゴリ存在チェック
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });
  if (!category) {
    return { id: "", error: "選択されたカテゴリが存在しません。" };
  }

  const app = await prisma.app.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      url: url || null,
      categoryId: data.categoryId,
      platforms: data.platforms as string[],
      isJpSupport: data.isJpSupport,
      hasFreePlan: data.hasFreePlan,
      pricingType: data.pricingType,
    },
  });

  return { id: app.id };
}

export async function PostAlternative(
  formData: FormData
): Promise<AlternativeActionState> {
  // 認証チェック
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "ログインが必要です。" };
  }

  const warnings: string[] = [];
  let targetAppId = formData.get("targetAppId") as string | null;
  let altAppId = formData.get("altAppId") as string | null;
  const isNewTarget = formData.get("isNewTarget") === "true";
  const isNewAlt = formData.get("isNewAlt") === "true";

  try {
    // 新規対象アプリの登録
    if (isNewTarget) {
      const rawData = extractNewAppData(formData, "target");
      const parsed = newAppSchema.safeParse(rawData);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fieldErrors[`target-${issue.path[0]}`] = issue.message;
        }
        return { error: "対象アプリの入力内容を確認してください。", fieldErrors };
      }

      // URL検証
      if (rawData.url) {
        const urlResult = validateUrl(rawData.url, rawData.name);
        if (!urlResult.valid) {
          return { error: null, fieldErrors: { "target-url": urlResult.error! } };
        }
        warnings.push(...urlResult.warnings);
      }

      const result = await createNewApp(parsed.data, rawData.url);
      if (result.error) {
        return { error: result.error };
      }
      targetAppId = result.id;
    }

    // 新規代替アプリの登録
    if (isNewAlt) {
      const rawData = extractNewAppData(formData, "alt");
      const parsed = newAppSchema.safeParse(rawData);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          fieldErrors[`alt-${issue.path[0]}`] = issue.message;
        }
        return { error: "代替アプリの入力内容を確認してください。", fieldErrors };
      }

      // URL検証
      if (rawData.url) {
        const urlResult = validateUrl(rawData.url, rawData.name);
        if (!urlResult.valid) {
          return { error: null, fieldErrors: { "alt-url": urlResult.error! } };
        }
        warnings.push(...urlResult.warnings);
      }

      const result = await createNewApp(parsed.data, rawData.url);
      if (result.error) {
        return { error: result.error };
      }
      altAppId = result.id;
    }

    // 既存アプリ同士のバリデーション
    const altParsed = alternativeSchema.safeParse({
      targetAppId,
      altAppId,
    });
    if (!altParsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of altParsed.error.issues) {
        fieldErrors[issue.path[0]?.toString() ?? ""] = issue.message;
      }
      return { error: "対象アプリと代替アプリを選択してください。", fieldErrors };
    }

    // 自己参照チェック
    if (altParsed.data.targetAppId === altParsed.data.altAppId) {
      return { error: "対象アプリと代替アプリは異なるアプリを選択してください。" };
    }

    // 両方のアプリが存在するか確認（slugも取得してリダイレクト用に使う）
    const [targetApp, altApp] = await Promise.all([
      prisma.app.findUnique({ where: { id: altParsed.data.targetAppId }, select: { id: true, slug: true } }),
      prisma.app.findUnique({ where: { id: altParsed.data.altAppId }, select: { id: true } }),
    ]);
    if (!targetApp) {
      return { error: "対象アプリが見つかりません。" };
    }
    if (!altApp) {
      return { error: "代替アプリが見つかりません。" };
    }

    // 重複チェック
    const existingAlt = await prisma.alternative.findUnique({
      where: {
        targetAppId_altAppId: {
          targetAppId: altParsed.data.targetAppId,
          altAppId: altParsed.data.altAppId,
        },
      },
      select: { id: true },
    });
    if (existingAlt) {
      return { error: "この代替関係は既に登録されています。" };
    }

    // Alternative レコード作成
    await prisma.alternative.create({
      data: {
        targetAppId: altParsed.data.targetAppId,
        altAppId: altParsed.data.altAppId,
      },
    });
  } catch (error) {
    console.error("Alternative post error:", error);
    return { error: "代替提案の登録に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/apps", "layout");
  revalidatePath("/", "layout");

  return { error: null, warnings, success: true, redirectTo: `/apps/${targetApp!.slug}` };
}
