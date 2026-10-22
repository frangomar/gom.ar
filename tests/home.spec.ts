import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { publishedLocales } from "../src/i18n/routing";

for (const locale of publishedLocales) {
  test(`/${locale}: lang, un H1, sin violaciones serias de axe`, async ({ page }, info) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toHaveCount(1);

    const { violations } = await new AxeBuilder({ page }).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

    await page.screenshot({ path: `test-results/shots/${locale}-home-${info.project.name}.png`, fullPage: true });
  });
}

test("/ redirige a /es", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es$/);
});

test("los idiomas no publicados dan 404", async ({ request }) => {
  for (const locale of ["pt", "fr", "zh"]) {
    expect((await request.get(`/${locale}`)).status()).toBe(404);
  }
});
