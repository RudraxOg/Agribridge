import { expect, test } from "@playwright/test";

test("switches from English to Hindi", async ({ page }) => {
  await page.goto("/en");
  await page.getByLabel("Language").selectOption("hi");
  await expect(page).toHaveURL(/\/hi$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("फसल");
});
