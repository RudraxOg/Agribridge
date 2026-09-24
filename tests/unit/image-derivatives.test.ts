import { createHash } from "node:crypto";
import sharp from "sharp";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

let createListingDerivative: typeof import("@/integrations/media/image-derivatives").createListingDerivative;

beforeAll(async () => {
  ({ createListingDerivative } = await import("@/integrations/media/image-derivatives"));
});

describe("listing image derivatives", () => {
  it("normalizes orientation, bounds dimensions, and removes source metadata", async () => {
    const source = await sharp({ create: { width: 1800, height: 1200, channels: 3, background: "#517a43" } })
      .withMetadata({ orientation: 6, comment: "private camera metadata" })
      .jpeg()
      .toBuffer();
    const derivative = await createListingDerivative(source);
    const metadata = await sharp(derivative.bytes).metadata();

    expect(derivative.mimeType).toBe("image/webp");
    expect(derivative.width).toBeLessThanOrEqual(1280);
    expect(derivative.height).toBeLessThanOrEqual(854);
    expect(metadata.exif).toBeUndefined();
    expect(metadata.icc).toBeUndefined();
    expect(derivative.checksumSha256).toBe(createHash("sha256").update(derivative.bytes).digest("hex"));
  });
});
