import { prisma } from "@/lib/prisma"
import { toAppDTO } from "@/utils/transform"

export async function ToolDetailData(slug: string) {
    const app = await prisma.app.findUnique({
        where: { slug },
    })
    if (!app) {
        return null;
    }
    return toAppDTO(app);
}
