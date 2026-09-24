import { FileSearch, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { requirePlatformPermission } from "@/lib/auth/require-platform-permission";
import { requireLocale } from "@/lib/i18n/locale";

export default async function PlatformAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  await requirePlatformPermission(locale, "platform.audit_case.read", { requireMfa: true });
  return <main id="main-content" className="mx-auto min-h-dvh max-w-4xl px-4 py-10 md:px-8"><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-[var(--forest-deep)] text-white"><FileSearch aria-hidden/></span><div><p className="text-xs font-black tracking-[.16em] text-[var(--field)] uppercase">Restricted audit workspace</p><h1 className="text-3xl font-black">Assigned compliance cases</h1></div></div><Card className="mt-8 flex gap-4 p-5"><ShieldCheck className="shrink-0 text-[var(--forest)]" aria-hidden/><div><h2 className="font-black">No assigned demo cases</h2><p className="mt-1 text-sm text-[var(--text-muted)]">Auditors can read only explicitly assigned case records. Platform configuration and tenant data remain unavailable.</p></div></Card></main>;
}
