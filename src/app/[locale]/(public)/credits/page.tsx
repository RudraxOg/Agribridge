import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { BadgeCheck, ExternalLink, ImageIcon } from "lucide-react";
import { PageMotion } from "@/components/shared/page-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireLocale } from "@/lib/i18n/locale";
import type { AssetManifestEntry } from "@/lib/storage/asset-policy";

export default async function CreditsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = requireLocale((await params).locale);
  const manifest = JSON.parse(await readFile(path.join(process.cwd(), "assets/manifest/assets.json"), "utf8")) as AssetManifestEntry[];
  const generated = manifest.filter((entry) => entry.status === "generated");
  const thirdParty = manifest.filter((entry) => entry.status !== "generated");
  return <PageMotion><main id="main-content" className="mx-auto min-h-dvh max-w-5xl px-4 py-10 md:px-8"><Link className="inline-flex min-h-12 items-center font-bold text-[var(--forest)]" href={`/${locale}`}>← Back to AgriBridge</Link><div className="mt-8 max-w-3xl"><Badge><BadgeCheck aria-hidden size={15} />Reproducible asset register</Badge><h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--forest-deep)] md:text-6xl">Visual provenance, kept visible.</h1><p className="mt-5 text-lg text-[var(--text-muted)]">Every checked-in image is synthetic demo artwork. Wikimedia candidates remain unused until a human approves their source and license metadata.</p></div><div className="mt-10 grid gap-4 md:grid-cols-3"><Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Generated assets</p><p className="tabular mt-2 text-3xl font-black">{generated.length}</p></Card><Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Third-party assets in use</p><p className="tabular mt-2 text-3xl font-black">0</p></Card><Card className="p-5"><p className="text-sm text-[var(--text-muted)]">Awaiting manual review</p><p className="tabular mt-2 text-3xl font-black">{thirdParty.filter((entry) => entry.status === "needs-review").length}</p></Card></div><section className="mt-10"><h2 className="text-2xl font-black">Generated collections</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{[...new Set(generated.map((entry) => entry.kind))].map((kind) => <Card className="flex items-center gap-3 p-4" key={kind}><ImageIcon aria-hidden className="text-[var(--field)]" /><div><p className="font-black">{kind.replaceAll("-", " ")}</p><p className="text-sm text-[var(--text-muted)]">{generated.filter((entry) => entry.kind === kind).length} assets · AgriBridge generation pipeline · CC0</p></div></Card>)}</div></section><section className="mt-10"><h2 className="text-2xl font-black">License guardrail</h2><Card className="mt-4 p-5"><p>Automated ingestion permits CC0, public domain, and CC BY 4.0. CC BY-SA 4.0 requires an explicit share-alike review. Unknown, NC, and ND licenses are rejected.</p><a className="mt-3 inline-flex min-h-12 items-center gap-2 font-bold text-[var(--forest)]" href="https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia/licenses" rel="noreferrer" target="_blank">Wikimedia reuse guidance<ExternalLink aria-hidden size={17} /></a></Card></section></main></PageMotion>;
}
