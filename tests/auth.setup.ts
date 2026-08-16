//tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';

setup('Authenticate', async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("tour-skip").click();
    // await page.getByRole("textbox", { name: "Email" }).fill("demo@promptqa.test");
    // await page.getByRole("textbox", { name: "Password" }).fill("Demo@1234");

    await page.getByTestId("login-email").fill("demo@promptqa.test");
    await page.getByTestId("login-password").fill("Demo@1234");

    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/playground/);

    await page.context().storageState({
        path: 'playwright/.auth/user.json',
    });
});