import { prisma } from "@/lib/prisma"
import { toAppDTO } from "@/features/app/utils/transform"

export async function DetailAppsData(slug: string) {
    const app = await prisma.app.findUnique({
        where: { slug },
    })
    if (!app) {
        return null;
    }
    return toAppDTO(app);
}