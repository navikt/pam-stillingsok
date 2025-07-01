import { test, expect } from "@playwright/test";

test.use({
    baseURL: "http://localhost:3000/stillinger",
});

test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("Arbeidsplassen.no - Alle ledige jobber, samlet på én plass");
});
