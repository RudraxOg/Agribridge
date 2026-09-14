export const orderStates = [
  "DRAFT", "QUOTED", "PLACED", "PAYMENT_PENDING", "FUNDS_SECURED", "TRUCK_ASSIGNED", "LOADING",
  "LOADING_VERIFIED", "IN_TRANSIT", "DELIVERED", "DELIVERY_CONFIRMED", "COMPLETED", "CANCELLED",
  "DISPUTED", "PARTIALLY_REFUNDED", "REFUNDED",
] as const;
export type OrderState = (typeof orderStates)[number];

const transitions: Record<OrderState, readonly OrderState[]> = {
  DRAFT: ["QUOTED", "CANCELLED"], QUOTED: ["PLACED", "CANCELLED"], PLACED: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["FUNDS_SECURED", "CANCELLED"], FUNDS_SECURED: ["TRUCK_ASSIGNED", "DISPUTED", "REFUNDED"],
  TRUCK_ASSIGNED: ["LOADING", "CANCELLED", "DISPUTED"], LOADING: ["LOADING_VERIFIED", "DISPUTED"],
  LOADING_VERIFIED: ["IN_TRANSIT", "DISPUTED"], IN_TRANSIT: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["DELIVERY_CONFIRMED", "DISPUTED"], DELIVERY_CONFIRMED: ["COMPLETED", "DISPUTED"],
  COMPLETED: ["DISPUTED"], CANCELLED: [], DISPUTED: ["PARTIALLY_REFUNDED", "REFUNDED", "COMPLETED"],
  PARTIALLY_REFUNDED: ["COMPLETED"], REFUNDED: [],
};

export type AuditEvent = { event: "ORDER_STATE_CHANGED"; from: OrderState; to: OrderState; actorId: string; occurredAt: string };

export function transitionOrder(from: OrderState, to: OrderState, actorId: string, now = new Date()): AuditEvent {
  if (!transitions[from].includes(to)) throw new Error(`Invalid order transition: ${from} → ${to}`);
  return { event: "ORDER_STATE_CHANGED", from, to, actorId, occurredAt: now.toISOString() };
}

export function canTransitionOrder(from: OrderState, to: OrderState) {
  return transitions[from].includes(to);
}
