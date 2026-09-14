import type { EscrowState } from "./escrow.types";

const transitions: Record<EscrowState, readonly EscrowState[]> = {
  AWAITING_PAYMENT: ["SECURED", "REFUNDED"], SECURED: ["LOADING_PROOF_PENDING", "HELD_FOR_DISPUTE", "REFUNDED"],
  LOADING_PROOF_PENDING: ["FIRST_RELEASE_PENDING", "HELD_FOR_DISPUTE"], FIRST_RELEASE_PENDING: ["FIRST_RELEASED", "HELD_FOR_DISPUTE"],
  FIRST_RELEASED: ["DELIVERY_PROOF_PENDING", "HELD_FOR_DISPUTE"], DELIVERY_PROOF_PENDING: ["SECOND_RELEASE_PENDING", "HELD_FOR_DISPUTE"],
  SECOND_RELEASE_PENDING: ["SECOND_RELEASED", "HELD_FOR_DISPUTE"], SECOND_RELEASED: ["COMPLETED"], COMPLETED: [],
  HELD_FOR_DISPUTE: ["FIRST_RELEASE_PENDING", "SECOND_RELEASE_PENDING", "REFUNDED"], REFUNDED: [],
};

export function transitionEscrow(from: EscrowState, to: EscrowState, actorId: string, now = new Date()) {
  if (!transitions[from].includes(to)) throw new Error(`Invalid settlement transition: ${from} → ${to}`);
  return { event: "ESCROW_STATE_CHANGED" as const, from, to, actorId, occurredAt: now.toISOString() };
}
