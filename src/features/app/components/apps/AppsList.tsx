import { AppDTO } from "@/types";
import Link from "next/link";

interface Props {
    apps: AppDTO[]
}

export default function AppsList( { apps } : Props ) {
    return (
        <>
            {apps.map((app) => (
                <Link href={`/apps/${app.slug}`} key={app.id}>
                    <p>{app.name}</p>
                    <p>{app.description}</p>
                    <p>{app.categoryId}</p>
                    <p>{app.isJpSupport}</p>
                    <p>{app.hasFreePlan}</p>
                    <p>{app.pricingType}</p>
                    <p>{app.platforms}</p>
                    <p>{app.createdAt.toDateString()}</p>
                </Link>
            ))}
        </>
    )
}