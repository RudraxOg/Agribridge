import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { assetManifestEntrySchema, type AssetManifestEntry } from "../../src/lib/storage/asset-policy";

export const root = process.cwd();
export const manifestPath = path.join(root, "assets/manifest/assets.json");

export async function readManifest(): Promise<AssetManifestEntry[]> {
  const input: unknown = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!Array.isArray(input)) throw new Error("Asset manifest must be an array");
  return input.map((entry) => assetManifestEntrySchema.parse(entry));
}

export async function writeManifest(entries: AssetManifestEntry[]) {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(entries.sort((a, b) => a.slug.localeCompare(b.slug)), null, 2)}\n`);
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

export function sha256(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72);
}

export async function ensureDirectory(directory: string) {
  await mkdir(directory, { recursive: true });
}
