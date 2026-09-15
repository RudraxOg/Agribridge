import { z } from "zod";

export const allowedLicenseCodes = ["CC0", "PDM", "PUBLIC-DOMAIN", "CC-BY-4.0"] as const;
export const reviewLicenseCodes = ["CC-BY-SA-4.0"] as const;

const licenseAliases: Record<string, string> = {
  "CC0 1.0": "CC0",
  "CC0-1.0": "CC0",
  "PUBLIC DOMAIN": "PUBLIC-DOMAIN",
  "PUBLIC-DOMAIN-MARK": "PDM",
  "CC BY 4.0": "CC-BY-4.0",
  "CC-BY-4.0": "CC-BY-4.0",
  "CC BY-SA 4.0": "CC-BY-SA-4.0",
  "CC-BY-SA-4.0": "CC-BY-SA-4.0",
};

export function normalizeLicenseCode(value: string) {
  const normalized = value.trim().toUpperCase().replaceAll("_", "-");
  return licenseAliases[normalized] ?? normalized;
}

export function licenseDecision(value: string, shareAlikeHandled = false) {
  const code = normalizeLicenseCode(value);
  if ((allowedLicenseCodes as readonly string[]).includes(code)) return { allowed: true, code, reason: "allowlisted" as const };
  if ((reviewLicenseCodes as readonly string[]).includes(code) && shareAlikeHandled) return { allowed: true, code, reason: "share-alike-reviewed" as const };
  return { allowed: false, code, reason: code.includes("-NC") || code.includes("-ND") ? "restricted-license" as const : "manual-review-required" as const };
}

export const assetManifestEntrySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.string().min(1),
  query: z.string().min(1),
  sourceProvider: z.string().min(1),
  sourcePageUrl: z.string().url(),
  downloadUrl: z.string().url(),
  author: z.string().min(1),
  licenseCode: z.string().min(1),
  licenseUrl: z.string().url(),
  attributionText: z.string().min(1),
  allowedUses: z.array(z.string().min(1)).min(1),
  cropSlug: z.string().optional(),
  altText: z.object({ en: z.string().min(1), hi: z.string().min(1) }),
  targetVariants: z.array(z.enum(["thumb", "card", "detail", "original"])).min(1),
  status: z.enum(["candidate", "needs-review", "approved", "rejected", "generated"]),
  shareAlikeHandled: z.boolean().optional(),
  checksumSha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
});

export type AssetManifestEntry = z.infer<typeof assetManifestEntrySchema>;

const acceptedMimeTypes = new Set([
  "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif",
  "video/mp4", "video/webm", "application/pdf",
]);

const limits = { image: 15 * 1024 * 1024, video: 80 * 1024 * 1024, document: 10 * 1024 * 1024 } as const;

export type UploadPurpose = keyof typeof limits;

export function sniffMime(bytes: Uint8Array): string | null {
  const at = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  if (at(0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "image/webp";
  if (at(0x25, 0x50, 0x44, 0x46, 0x2d)) return "application/pdf";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(4, 8)) === "ftyp") {
    const brand = String.fromCharCode(...bytes.slice(8, 12)).toLowerCase();
    return brand.includes("heic") || brand.includes("heif") ? "image/heic" : "video/mp4";
  }
  if (at(0x1a, 0x45, 0xdf, 0xa3)) return "video/webm";
  return null;
}

export function validateUpload(input: { claimedMime: string; detectedMime: string | null; byteSize: number; purpose: UploadPurpose }) {
  if (!acceptedMimeTypes.has(input.claimedMime)) return { valid: false, error: "This file type is not supported." } as const;
  if (!input.detectedMime) return { valid: false, error: "The file contents could not be recognized." } as const;
  const heicPair = [input.claimedMime, input.detectedMime].every((mime) => mime === "image/heic" || mime === "image/heif");
  if (input.claimedMime !== input.detectedMime && !heicPair) return { valid: false, error: "The file extension and contents do not match." } as const;
  if (input.byteSize <= 0 || input.byteSize > limits[input.purpose]) return { valid: false, error: `File must be smaller than ${Math.round(limits[input.purpose] / 1024 / 1024)} MB.` } as const;
  return { valid: true } as const;
}

const uuid = z.string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);
const safeExtension = z.string().regex(/^[a-z0-9]{2,5}$/);

export function stockOriginalPath(input: { organizationId: string; lotId: string; assetId: string; extension: string; date?: Date }) {
  const date = input.date ?? new Date();
  return `${uuid.parse(input.organizationId)}/${uuid.parse(input.lotId)}/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${uuid.parse(input.assetId)}.${safeExtension.parse(input.extension.toLowerCase())}`;
}

export function listingDerivativePath(input: { organizationId: string; lotId: string; assetId: string; variant: "cover" | "gallery"; width: 960 | 1280 }) {
  return `${uuid.parse(input.organizationId)}/${uuid.parse(input.lotId)}/${input.variant}/${uuid.parse(input.assetId)}-${input.width}.webp`;
}

export function farmerDocumentPath(input: { organizationId: string; farmerId: string; documentType: string; assetId: string }) {
  const documentType = z.string().regex(/^[a-z0-9-]+$/).parse(input.documentType);
  return `${uuid.parse(input.organizationId)}/${uuid.parse(input.farmerId)}/${documentType}/${uuid.parse(input.assetId)}.pdf`;
}
