import type { Category, App } from "@/generated/prisma/client";
import type { CategoryDTO, CategoryWithAppsDTO } from "@/types";
import type { AppDTO } from "@/types/app"

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