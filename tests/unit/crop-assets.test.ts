import { describe, expect, it } from "vitest";
import { getCropAsset } from "@/lib/media/crop-assets";

describe("crop stock assets", () => {
  it.each([
    ["POTATO", "/stocks/potatoes.jpg"],
    ["ONION", "/stocks/onion.jpg"],
    ["TOMATO", "/stocks/tomato.jpg"],
    ["Basmati paddy", "/stocks/basmati.jpg"],
    ["GREEN PEAS", "/stocks/peas.jpg"],
    ["MANGO", "/stocks/mango.jpg"],
  ])("maps %s to its crop-specific stock photo", (crop, expected) => {
    expect(getCropAsset(crop).photoSrc).toBe(expected);
  });

  it("offers 360 sequences only for generated sequence crops", () => {
    expect(getCropAsset("tomato").sequenceKey).toBe("tomato");
    expect(getCropAsset("potato").sequenceKey).toBe("potato");
    expect(getCropAsset("onion").sequenceKey).toBeUndefined();
  });
});
