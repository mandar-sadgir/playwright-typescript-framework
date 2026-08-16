import { test, expect } from '@playwright/test';
import * as path from 'path';

test('Alerts test', async ({ page }) => {
    await page.goto("/widgets");
    await expect(page).toHaveURL(/widgets/);
    await page.getByTestId("widgets-toc-alerts").click();
    await page.waitForLoadState('load');
    page.on('dialog', async (dialog) => {
        console.log(dialog.type());
        console.log(dialog.message());
        await dialog.accept();
    });
    await page.getByText('window.alert').click();
});

test('File upload and download test', async ({ page }) => {
    await page.goto("/widgets");
    await expect(page).toHaveURL(/widgets/);
    await page.getByTestId("widgets-toc-upload").click();
    await page.waitForLoadState('load');
    await page.locator('input[type="file"]').setInputFiles(path.join(process.cwd(),
        'test_data',
        'Software Testing Interview Questions.pdf'
    ));
    await page.getByTestId("widgets-toc-download").click();
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByTestId('download-csv').click(),
    ]);
    const fileName = download.suggestedFilename();
    await download.saveAs(`./downloads/${fileName}`);
});
