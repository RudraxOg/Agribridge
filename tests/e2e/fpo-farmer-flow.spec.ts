import { expect, test, type Page } from "@playwright/test";

async function activate(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  await button.focus();
  await page.keyboard.press("Enter");
}

test("enters FPO dashboard and registers farmer in assisted mode", async ({ page }) => {
  await page.goto("/en/demo-role");
  await page.locator("[data-role-switcher][data-hydrated=true]").waitFor();
  await activate(page, "Continue as FPO Operator");
  await expect(page.getByRole("heading", { name: /Namaste/ })).toBeVisible();
  const register = page.getByRole("link", { name: "Register farmer" }).first();
  await register.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Assisted registration")).toBeVisible();
  await page.getByLabel("Farmer full name *").fill("Meera Devi");
  await page.getByLabel("Phone number").fill("9876543210");
  await page.getByLabel("Village").fill("Mankapur");
  await activate(page, "Continue");
  await page.getByLabel("Masked identity reference").fill("OFFLINE-••••-9921");
  await activate(page, "Continue");
  await page.getByLabel("Land area").fill("2.4 acres");
  await page.getByLabel("Current crop").selectOption({ label: "Potato" });
  await page.getByLabel("Expected harvest date").fill("2026-09-28");
  await activate(page, "Continue");
  await page.getByLabel(/I confirm the farmer/).evaluate((element) => (element as HTMLInputElement).click());
  await activate(page, "Save registration");
  await expect(page.getByText("Farmer registration saved in assisted mode")).toBeVisible();
});
