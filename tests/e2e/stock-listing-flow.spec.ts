import { expect, test, type Page } from "@playwright/test";

async function activate(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  await button.focus();
  await page.keyboard.press("Enter");
}

test("creates and publishes stock", async ({ page }) => {
  await page.goto("/en/demo-role");
  await page.locator("[data-role-switcher][data-hydrated=true]").waitFor();
  await activate(page, "Continue as FPO Operator");
  const create = page.getByRole("link", { name: "Create stock lot" }).first();
  await create.focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Available quantity (kg)").fill("42000");
  await page.getByLabel("Price per kg (₹)").fill("18.5");
  await activate(page, "Continue");
  await activate(page, "Continue");
  await activate(page, "Add crop photos");
  await activate(page, "Run failed-upload retry demo");
  await expect(page.getByText("Simulated weak-network interruption. Retry is safe.")).toBeVisible();
  await activate(page, "Upload or retry retry-demo-crop.png");
  await expect(page.getByText("complete · 100%")).toBeVisible();
  await activate(page, "Continue");
  await activate(page, "Publish lot");
  await expect(page.getByText("Stock lot published to the buyer marketplace")).toBeVisible();
});
