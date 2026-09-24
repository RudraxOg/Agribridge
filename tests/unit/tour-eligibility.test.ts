import { describe, expect, it } from "vitest";
import { eligibleTourSteps } from "@/features/guided-demo/lib/tour-eligibility";
import { fpoTour } from "@/features/guided-demo/tours/fpo";
import { financeTour } from "@/features/guided-demo/tours/finance";

describe("guided tour eligibility", () => {
  it("keeps only steps authorized for the member", () => {
    const steps = eligibleTourSteps(fpoTour, ["farmers.read"]);
    expect(steps.map((step) => step.key)).toContain("calendar");
    expect(steps.map((step) => step.key)).not.toContain("farmers");
    expect(steps.map((step) => step.key)).not.toContain("quality");
  });

  it("does not include finance-only steps without settlement access", () => {
    expect(eligibleTourSteps(financeTour, []).length).toBe(0);
    expect(eligibleTourSteps(financeTour, ["settlements.read"]).length).toBeGreaterThan(0);
  });
});
