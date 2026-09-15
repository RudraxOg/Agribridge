import { notFound } from "next/navigation";
import { BadgeCheck, Box, CalendarDays, MapPin, Rotate3D, ShieldCheck } from "lucide-react";
import { SequenceViewer } from "@/components/features/sequence-viewer";
import { GradingReport } from "@/components/features/grading-report";
import { ProductActions } from "@/components/features/product-actions";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { lots, fpo } from "@/lib/demo-data";
import { requireLocale } from "@/lib/i18n/locale";
import { getCropAsset } from "@/lib/media/crop-assets";
import { CropVisual } from "@/components/features/crop-visual";

export default async function ProductPage({ params }: { params: Promise<{ locale: string; lotId: string }> }) {
  const { locale: raw, lotId } = await params;
  const locale = requireLocale(raw);
  const lot = lots.find((item) => item.id === lotId);
  if (!lot) notFound();
  const asset = getCropAsset(lot.image);
  return <><PageHeader eyebrow={`Verified lot · ${lot.id}`} title={lot.name} description={`${lot.variety} from ${lot.location}`} /><div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]"><Card className="overflow-hidden">{asset.sequenceKey ? <SequenceViewer crop={asset.sequenceKey} /> : <CropVisual code={lot.image} colour={lot.colour} alt={`AI-generated demo view of ${lot.variety} ${asset.label} offered by ${lot.fpo}`} priority />}<div className="flex items-center gap-3 p-5"><Rotate3D className="text-[var(--field)]" aria-hidden /><div><p className="font-black">{asset.sequenceKey ? "360° evidence viewer" : "Stock image · 360° capture pending"}</p><p className="text-sm text-[var(--text-muted)]">{asset.sequenceKey ? "12 guided demo angles · real deployments capture the listed lot at its FPO centre" : "AI-generated demo photograph only · a real lot must be captured and verified before publication"}</p></div></div></Card><div><div className="flex flex-wrap gap-2">{lot.certifications.map((certification) => <Badge key={certification}><BadgeCheck size={14} aria-hidden />{certification}</Badge>)}</div><p className="tabular mt-5 text-4xl font-black">₹{(lot.pricePaise / 100).toFixed(2)}<span className="text-lg font-medium text-[var(--text-muted)]"> / kg</span></p><div className="my-6 grid grid-cols-3 gap-3"><div className="rounded-xl bg-[var(--surface-muted)] p-3"><Box size={18} aria-hidden /><p className="mt-2 text-xs text-[var(--text-muted)]">Available</p><strong>{lot.quantityKg / 1000} t</strong></div><div className="rounded-xl bg-[var(--surface-muted)] p-3"><CalendarDays size={18} aria-hidden /><p className="mt-2 text-xs text-[var(--text-muted)]">Harvest</p><strong>{lot.harvest}</strong></div><div className="rounded-xl bg-[var(--surface-muted)] p-3"><MapPin size={18} aria-hidden /><p className="mt-2 text-xs text-[var(--text-muted)]">Pickup</p><strong>FPO gate</strong></div></div><Card className="mb-5 p-5"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[var(--surface-muted)]"><ShieldCheck className="text-[var(--field)]" aria-hidden /></span><div><h2 className="font-black">{lot.fpo}</h2><p className="text-sm text-[var(--text-muted)]">{fpo.trustScore}% trust score · verified since {fpo.verifiedSince}</p></div></div></Card><ProductActions locale={locale} lotId={lot.id} /></div></div><div className="mt-6"><GradingReport /></div></>;
}
