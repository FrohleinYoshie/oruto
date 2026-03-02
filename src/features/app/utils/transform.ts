import type { Category } from "@/generated/prisma/client";
import type { CategoryDTO } from "@/types";

import type { App } from "@/generated/prisma/client"
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

export function toAppDTO(app: App): AppDTO {
  return {
    id: app.id,
    name: app.name,
    slug: app.slug,
    description: app.description,
    url: app.url!,
    categoryId: app.categoryId,
    isJpSupport: app.isJpSupport,
    hasFreePlan: app.hasFreePlan,
    pricingType: app.pricingType!,
    platforms: app.platforms,
    createdAt: app.createdAt,
  }
}