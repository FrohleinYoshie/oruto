import { DetailAppsData } from "@/features/app/factory/slug/DetailAppsData"

interface Props {
    params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
    const { slug } = await params
    const app = await DetailAppsData(slug)
    return (
        <>
            <h1 className="text-xl font-bold text-gray-900 mb-6">{app?.name}</h1>
            <p>{app?.description}</p>
            <p>{app?.url}</p>
            <p>{app?.hasFreePlan}</p>
            <p>{app?.isJpSupport}</p>
        </>
    )
}