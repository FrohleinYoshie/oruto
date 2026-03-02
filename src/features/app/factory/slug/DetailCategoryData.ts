import { prisma } from "@/lib/prisma"

export async function DetailCategoryData(slug: string) {
        const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            apps: {
                orderBy: { createdAt: "desc" },
            }
        }
    })
    return category;
}