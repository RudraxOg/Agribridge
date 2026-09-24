import "server-only";

import { createHash } from "node:crypto";
import sharp from "sharp";

export type ListingDerivative = {
  bytes: Buffer;
  checksumSha256: string;
  width: number;
  height: number;
  mimeType: "image/webp";
};

export async function createListingDerivative(source: Uint8Array): Promise<ListingDerivative> {
  const bytes = await sharp(source, { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: 1280, height: 854, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
  const metadata = await sharp(bytes).metadata();
  if (!metadata.width || !metadata.height) throw new Error("derivative_dimensions_missing");
  return {
    bytes,
    checksumSha256: createHash("sha256").update(bytes).digest("hex"),
    width: metadata.width,
    height: metadata.height,
    mimeType: "image/webp",
  };
}
