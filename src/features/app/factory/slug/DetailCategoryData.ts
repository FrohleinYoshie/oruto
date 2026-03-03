import { prisma } from "@/lib/prisma"
import { toCategoryWithAppsDTO } from "../../utils/transform";

export async function DetailCategoryData(slug: string) {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            apps: {
                orderBy: { createdAt: "desc" },
            }
        }
    })
    if (!category) {
        return null;
    }
    return toCategoryWithAppsDTO(category);
}