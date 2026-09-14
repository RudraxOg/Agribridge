import { describe, expect, it } from "vitest";
import { transitionEscrow } from "@/domain/escrow/escrow-machine";

describe("settlement milestone state machine", () => {
  it("allows a dispute hold", () => expect(transitionEscrow("FIRST_RELEASED", "HELD_FOR_DISPUTE", "operator-1").to).toBe("HELD_FOR_DISPUTE"));
  it("rejects browser-style arbitrary release", () => expect(() => transitionEscrow("AWAITING_PAYMENT", "SECOND_RELEASED", "buyer-1")).toThrow());
});
