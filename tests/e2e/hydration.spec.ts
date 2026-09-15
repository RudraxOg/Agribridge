import { expect, test } from "@playwright/test";

test("landing page hydrates without a mismatch warning", async ({ page }) => {
  const hydrationWarnings: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrated|hydration/i.test(message.text())) hydrationWarnings.push(message.text());
  });

  await page.goto("/en");
  await expect(page.getByRole("heading", { name: "Good harvests deserve clear deals." })).toBeVisible();
  await page.waitForTimeout(500);

  expect(hydrationWarnings).toEqual([]);
});
