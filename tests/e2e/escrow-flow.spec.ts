import { expect, test } from "@playwright/test";

test("tracks shipment and opens final milestone breakdown", async ({ page }) => {
  await page.goto("/en/demo-role");
  await page.locator("[data-role-switcher][data-hydrated=true]").waitFor();
  const role = page.getByRole("button", { name: "Continue as Bulk Buyer" });
  await role.focus();
  await page.keyboard.press("Enter");
  await page.goto("/en/buyer/orders/AB-260914-1072");
  await page.getByRole("link", { name: "Track shipment" }).click();
  await expect(page.getByRole("heading", { name: "Gonda → Lucknow" })).toBeVisible();
  await expect(page.getByText("Tracking timeline")).toBeVisible();
  await page.goto("/en/settlements/AB-260914-1072");
  await expect(page.getByRole("heading", { name: "Milestone releases" })).toBeVisible();
  await expect(page.getByText("Loading release · 50%")).toBeVisible();
  await expect(page.getByText("Delivery release · balance")).toBeVisible();
});
