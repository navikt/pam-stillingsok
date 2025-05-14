import { test, expect } from "@playwright/test";

test.use({
    baseURL: "http://localhost:3000",
});

test("has correct h1 heading", async ({ page }) => {
    await page.goto("/stillinger");

    // Get the h1 element and check its text content
    const heading = page.locator("h1").first();
    await expect(heading).toHaveText("Søk etter jobber");
});
