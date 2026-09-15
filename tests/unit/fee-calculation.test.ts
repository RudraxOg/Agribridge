import { describe, expect, it } from "vitest";
import { calculateOrder } from "@/domain/money/calculate-order";

describe("order money calculation", () => {
  it("matches the required ₹2,00,000 distribution", () => {
    const result = calculateOrder({ quantity: 1000, unitPricePaise: 20000n, charges: [{ code: "assaying", label: "Assaying", bearer: "seller", amountPaise: 150000n }] });
    expect(result.produceValuePaise).toBe(20000000n);
    expect(result.fpoSharePaise).toBe(800000n);
    expect(result.agriBridgeSharePaise).toBe(200000n);
    expect(result.netFarmerPayoutPaise).toBe(18850000n);
    expect(result.firstReleasePaise).toBe(9425000n);
    expect(result.secondReleasePaise).toBe(9425000n);
  });

  it("keeps an odd paise in the second release", () => {
    const result = calculateOrder({ quantity: 1, unitPricePaise: 100n });
    expect(result.firstReleasePaise + result.secondReleasePaise).toBe(result.netFarmerPayoutPaise);
    expect(result.secondReleasePaise - result.firstReleasePaise).toBe(1n);
  });

  it("does not double deduct buyer and seller charges", () => {
    const result = calculateOrder({ quantity: 1, unitPricePaise: 10000n, charges: [
      { code: "freight", label: "Freight", bearer: "buyer", amountPaise: 500n },
      { code: "assaying", label: "Assaying", bearer: "seller", amountPaise: 100n },
    ] });
    expect(result.buyerPayablePaise).toBe(10500n);
    expect(result.netFarmerPayoutPaise).toBe(9400n);
  });
});
