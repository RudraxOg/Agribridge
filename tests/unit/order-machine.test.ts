import { describe, expect, it } from "vitest";
import { transitionOrder } from "@/domain/orders/order-machine";

describe("order state machine", () => {
  it("returns an audit event for valid transitions", () => expect(transitionOrder("PLACED", "PAYMENT_PENDING", "buyer-1").event).toBe("ORDER_STATE_CHANGED"));
  it("rejects invalid jumps", () => expect(() => transitionOrder("DRAFT", "COMPLETED", "buyer-1")).toThrow(/Invalid order transition/));
});
