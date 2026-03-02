import DetailCategory from "@/features/app/components/slug/DetailCategory";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategorySlugPage({ params }: Props) {
  const { slug } = await params;
  return <DetailCategory slug={slug} />;
}
