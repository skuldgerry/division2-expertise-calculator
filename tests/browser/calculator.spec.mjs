import { expect, test } from "@playwright/test";

const planKey = "expertise-calculator-plan-v3";

async function openCalculator(page) {
  const errors = [];
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("./");
  // Persisted state is written only after the client has hydrated.
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), planKey))
    .not.toBeNull();
  return errors;
}

function exoticTotal(page) {
  return page.locator(".resource-card")
    .filter({ hasText: /Exotic components/i }).locator(".required-value");
}

test("export hydrates, recalculates quantity and restores the saved plan", async ({ page }) => {
  const errors = await openCalculator(page);
  await expect(exoticTotal(page)).toHaveText("45");
  await page.getByRole("button", { name: "Increase Quantity for item 1", exact: true }).click();
  await expect(page.getByRole("spinbutton", { name: "Quantity for item 1", exact: true })).toHaveValue("2");
  await expect(exoticTotal(page)).toHaveText("90");
  await page.reload();
  await expect(page.getByRole("spinbutton", { name: "Quantity for item 1", exact: true })).toHaveValue("2");
  await expect(exoticTotal(page)).toHaveText("90");
  expect(errors).toEqual([]);
});

test("export enforces the level cap and calculates a final-level upgrade", async ({ page }) => {
  const errors = await openCalculator(page);
  const target = page.getByRole("spinbutton", { name: "Target level for Weapon 1", exact: true });
  await target.fill("99");
  await expect(target).toHaveValue("30");
  await page.getByRole("spinbutton", { name: "Current level for Weapon 1", exact: true }).fill("29");
  await expect(exoticTotal(page)).toHaveText("5");
  expect(errors).toEqual([]);
});

test("export supports adding/removing items and persists an explicit theme", async ({ page }) => {
  const errors = await openCalculator(page);
  await page.getByRole("button", { name: /Add item/ }).first().click();
  await expect(page.locator(".item-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Remove Weapon 2", exact: true }).click();
  await expect(page.locator(".item-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});
