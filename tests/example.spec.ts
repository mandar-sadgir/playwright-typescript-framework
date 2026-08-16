import {test, expect} from '@playwright/test';

test('login test', async ({page}) => {
    await page.goto("/widgets");
    await page.waitForLoadState('load');
    await expect(page.getByRole("heading", { name: "Widgets Playground" })).toBeVisible();
});

test('demo test', async ({page}) => {
    await page.goto("/widgets");
    await expect(page.locator(".widgets-hero-title")).toHaveText("Widgets Playground");
    await expect(page).toHaveTitle(/QATools Playground — Test Automation Playground/);
    await page.waitForLoadState('load');
    await expect(page.getByRole("heading", { name: "Widgets Playground" })).toBeVisible();
    await page.getByTestId("widgets-toc-selects").click();
    await page.getByPlaceholder("Type a country...").fill("United States");
    await expect(page.getByPlaceholder("type a country...")).toHaveValue("United States");
    const values = await page.getByTestId("w-select").allTextContents();
    console.log(values);
});
