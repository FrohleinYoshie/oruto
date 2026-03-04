import type { Category, App } from "@/generated/prisma/client";
import type { CategoryDTO, CategoryWithAppsDTO } from "@/types";
import type { AppDTO } from "@/types/app";
import type { AlternativeDTO } from "@/types/alternative";
import type { AlternativeCommentDTO } from "@/types/comment";

/** Prisma Category → CategoryDTO に変換 */
export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconName: category.iconName,
  };
}

/** Prisma Category（apps含む） → CategoryWithAppsDTO に変換 */
export function toCategoryWithAppsDTO(
  category: Category & { apps: App[] }
): CategoryWithAppsDTO {
  return {
    ...toCategoryDTO(category),
    apps: category.apps.map(toAppDTO),
  };
}

/** Prisma App → AppDTO に変換 */
export function toAppDTO(app: App): AppDTO {
  return {
    id: app.id,
    name: app.name,
    slug: app.slug,
    description: app.description,
    url: app.url ?? null,
    categoryId: app.categoryId,
    isJpSupport: app.isJpSupport,
    hasFreePlan: app.hasFreePlan,
    pricingType: app.pricingType ?? "",
    platforms: app.platforms,
    createdAt: app.createdAt,
  }
}

// コメントのPrisma型
type PrismaComment = {
  id: string;
  alternativeId: string;
  userId: string;
  body: string;
  upvotes: number;
  createdAt: Date;
};

/** Prisma AlternativeComment → AlternativeCommentDTO に変換 */
export function toAlternativeCommentDTO(comment: PrismaComment): AlternativeCommentDTO {
  return {
    id: comment.id,
    alternativeId: comment.alternativeId,
    userId: comment.userId,
    body: comment.body,
    upvotes: comment.upvotes,
    createdAt: comment.createdAt,
  };
}

/** Prisma Alternative（altApp, comments含む） → AlternativeDTO に変換 */
export function toAlternativeDTO(alternative: {
  id: string;
  targetAppId: string;
  upvotes: number;
  createdAt: Date;
  altApp: App;
  comments: PrismaComment[];
}): AlternativeDTO {
  return {
    id: alternative.id,
    targetAppId: alternative.targetAppId,
    altApp: toAppDTO(alternative.altApp),
    upvotes: alternative.upvotes,
    comments: alternative.comments.map(toAlternativeCommentDTO),
    createdAt: alternative.createdAt,
  };
}
