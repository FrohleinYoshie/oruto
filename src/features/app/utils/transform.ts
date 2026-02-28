import type { Category } from "@/generated/prisma/client";

import type { CategoryDTO } from "@/types";

/** Prisma Category → CategoryDTO に変換 */
export function toCategoryDTO(category: Category): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    iconName: category.iconName,
  };
}
