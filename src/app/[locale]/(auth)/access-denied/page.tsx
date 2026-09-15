import { AccessDeniedState } from "@/components/auth/access-denied-state";
import { requireLocale } from "@/lib/i18n/locale";
export default async function AccessDeniedPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{reason?:string}>}){const locale=requireLocale((await params).locale);return <AccessDeniedState locale={locale} reason={(await searchParams).reason}/>}
