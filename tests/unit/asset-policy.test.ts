import { describe, expect, it } from "vitest";
import { assetManifestEntrySchema, farmerDocumentPath, licenseDecision, listingDerivativePath, sniffMime, stockOriginalPath, validateUpload } from "@/lib/storage/asset-policy";

const organizationId = "10000000-0000-0000-0000-000000000001";
const lotId = "50000000-0000-0000-0000-000000000001";
const assetId = "90000000-0000-0000-0000-000000000001";

describe("asset policy", () => {
  it("allowlists attribution-compatible licenses and rejects NC/ND", () => {
    expect(licenseDecision("CC BY 4.0").allowed).toBe(true);
    expect(licenseDecision("CC BY-SA 4.0").allowed).toBe(false);
    expect(licenseDecision("CC BY-SA 4.0", true).allowed).toBe(true);
    expect(licenseDecision("CC BY-NC 4.0").reason).toBe("restricted-license");
  });

  it("rejects incomplete or unapproved license metadata", () => {
    expect(assetManifestEntrySchema.safeParse({ slug: "unapproved-file", status: "approved" }).success).toBe(false);
    expect(licenseDecision("UNKNOWN").allowed).toBe(false);
  });

  it("detects file signatures and rejects MIME mismatches", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(sniffMime(png)).toBe("image/png");
    expect(validateUpload({ claimedMime: "image/jpeg", detectedMime: "image/png", byteSize: 512, purpose: "image" }).valid).toBe(false);
    expect(validateUpload({ claimedMime: "image/png", detectedMime: "image/png", byteSize: 512, purpose: "image" }).valid).toBe(true);
  });

  it("constructs deterministic paths without personal data", () => {
    expect(stockOriginalPath({ organizationId, lotId, assetId, extension: "JPG", date: new Date("2026-09-15T00:00:00Z") })).toBe(`${organizationId}/${lotId}/2026/09/${assetId}.jpg`);
    expect(listingDerivativePath({ organizationId, lotId, assetId, variant: "cover", width: 1280 })).toBe(`${organizationId}/${lotId}/cover/${assetId}-1280.webp`);
    expect(farmerDocumentPath({ organizationId, farmerId: lotId, documentType: "khatauni", assetId })).not.toMatch(/name|phone|aadhaar/i);
  });
});
