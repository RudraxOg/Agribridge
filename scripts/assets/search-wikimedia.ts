import { normalizeLicenseCode, type AssetManifestEntry } from "../../src/lib/storage/asset-policy";
import { readManifest, slugify, stripHtml, writeManifest } from "./common";

type MetadataValue = { value?: string };
type CommonsPage = { title: string; imageinfo?: Array<{ url?: string; descriptionurl?: string; user?: string; extmetadata?: Record<string, MetadataValue> }> };

const query = process.argv.slice(2).join(" ").trim();
if (!query) throw new Error('Usage: pnpm assets:search -- "tomato crates agricultural market India"');
const userAgent = process.env.ASSET_PIPELINE_USER_AGENT ?? "AgriBridgePrototype/1.0 contact@example.com";
const url = new URL("https://commons.wikimedia.org/w/api.php");
Object.entries({ action: "query", generator: "search", gsrnamespace: "6", gsrsearch: query, gsrlimit: "12", prop: "imageinfo", iiprop: "url|user|size|mime|extmetadata", format: "json", origin: "*" }).forEach(([key, value]) => url.searchParams.set(key, value));

const response = await fetch(url, { headers: { "user-agent": userAgent, accept: "application/json" }, signal: AbortSignal.timeout(15_000) });
if (!response.ok) throw new Error(`Wikimedia search failed with HTTP ${response.status}`);
const body = await response.json() as { query?: { pages?: Record<string, CommonsPage> } };
const existing = await readManifest();
const existingUrls = new Set(existing.map((entry) => entry.downloadUrl));
const candidates: AssetManifestEntry[] = [];

for (const page of Object.values(body.query?.pages ?? {})) {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata ?? {};
  if (!info?.url || !info.descriptionurl || existingUrls.has(info.url)) continue;
  const title = stripHtml(metadata.ObjectName?.value ?? page.title.replace(/^File:/, ""));
  const author = stripHtml(metadata.Artist?.value ?? info.user ?? "");
  const licenseCode = normalizeLicenseCode(stripHtml(metadata.LicenseShortName?.value ?? "UNKNOWN"));
  const licenseUrl = stripHtml(metadata.LicenseUrl?.value ?? "https://commons.wikimedia.org/wiki/Commons:Licensing");
  candidates.push({
    slug: `${slugify(title)}-${candidates.length + 1}`,
    kind: "listing-photo",
    query,
    sourceProvider: "wikimedia-commons",
    sourcePageUrl: info.descriptionurl,
    downloadUrl: info.url,
    author: author || "AUTHOR REVIEW REQUIRED",
    licenseCode,
    licenseUrl,
    attributionText: author ? `${title} — ${author}, ${licenseCode}` : "ATTRIBUTION REVIEW REQUIRED",
    allowedUses: ["demo", "listing-seed"],
    altText: { en: title, hi: `डेमो कृषि चित्र: ${title}` },
    targetVariants: ["thumb", "card", "detail"],
    status: "needs-review",
  });
}

await writeManifest([...existing, ...candidates]);
console.log(`Added ${candidates.length} review candidates. No files were downloaded.`);
