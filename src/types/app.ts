export interface AppDTO {
    id: string;
    name: string;
    slug: string;
    description: string;
    url: string | null;
    categoryId: string;
    isJpSupport: boolean;
    hasFreePlan: boolean;
    pricingType: string;
    platforms: string[];
    createdAt: Date;
}
