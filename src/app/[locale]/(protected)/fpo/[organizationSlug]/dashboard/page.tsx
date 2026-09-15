import OverviewPage from "@/app/[locale]/(fpo)/fpo/overview/page";
export default async function OrganizationDashboard({params}:{params:Promise<{locale:string;organizationSlug:string}>}){const {locale}=await params;return <OverviewPage params={Promise.resolve({locale})}/>}
