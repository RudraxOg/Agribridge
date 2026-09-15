import MarketplacePage from "@/app/[locale]/(buyer)/buyer/marketplace/page";
export default async function OrganizationMarketplace({params}:{params:Promise<{locale:string;organizationSlug:string}>}){const {locale}=await params;return <MarketplacePage params={Promise.resolve({locale})}/>}
