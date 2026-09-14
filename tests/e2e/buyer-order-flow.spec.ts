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
  await lot.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Three independent grade sources")).toBeVisible();
  await activate(page, "Request call");
  await expect(page.getByText(/Mock grading call requested/)).toBeVisible();
  await follow(page, /Add to order/);
  await expect(page.getByText("What the buyer pays")).toBeVisible();
  await activate(page, "Complete mock UPI payment");
  await expect(page.getByText("FUNDS SECURED", { exact: true })).toBeVisible();
  await follow(page, "Open order");
  await expect(page.getByText("How the order amount is distributed")).toBeVisible();
});
