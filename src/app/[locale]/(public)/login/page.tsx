import { redirect } from "next/navigation";
import { requireLocale } from "@/lib/i18n/locale";
export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) { const locale = requireLocale((await params).locale); redirect(`/${locale}/sign-in`); }
