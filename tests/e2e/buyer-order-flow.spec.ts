import { expect, test, type Page } from "@playwright/test";

async function activate(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  await button.focus();
  await page.keyboard.press("Enter");
}

async function follow(page: Page, name: string | RegExp) {
  const link = page.getByRole("link", { name });
  await link.focus();
  await page.keyboard.press("Enter");
}

test("filters a lot, requests grading and completes mock UPI", async ({ page }) => {
  await page.goto("/en/demo-role");
  await page.locator("[data-role-switcher][data-hydrated=true]").waitFor();
  await activate(page, "Continue as Bulk Buyer");
  await page.getByPlaceholder("Search crop or district").fill("potato");
  const lot = page.getByRole("link", { name: "Grade A potato", exact: true });
  await expect(lot).toBeVisible();
  await lot.click();
  await expect(page.getByAltText("potato crate multi-angle demo, frame 1 of 12")).toBeVisible();
  await activate(page, "Next viewing angle");
  await expect(page.getByAltText("potato crate multi-angle demo, frame 2 of 12")).toBeVisible();
  await expect(page.getByText("Three independent grade sources")).toBeVisible();
  await activate(page, "Request call");
  await expect(page.getByText(/Mock grading call requested/)).toBeVisible();
  await page.getByRole("link", { name: /Add to order/ }).click();
  await expect(page.getByText("What the buyer pays")).toBeVisible();
  await activate(page, "Complete mock UPI payment");
  await expect(page.getByText("FUNDS SECURED", { exact: true })).toBeVisible();
  // On a short mobile viewport the confirmation card can overlap the link.
  // Keyboard activation verifies the link's accessible, real navigation path.
  await follow(page, "Open order");
  await expect(page.getByText("How the order amount is distributed")).toBeVisible();
});
