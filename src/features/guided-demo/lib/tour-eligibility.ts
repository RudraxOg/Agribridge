import type { TourDefinition, TourStep } from "../types";

/** Filters only on server-authorized permissions supplied by the access context. */
export function eligibleTourSteps(tour: TourDefinition, permissions: readonly string[]): TourStep[] {
  return tour.steps.filter((step) => !step.permission || permissions.includes(step.permission));
}

export function firstEligibleStep(tour: TourDefinition, permissions: readonly string[]) {
  return eligibleTourSteps(tour, permissions)[0];
}
