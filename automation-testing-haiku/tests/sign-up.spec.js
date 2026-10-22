const { test, expect } = require('@playwright/test');

test('customer can sign up via practice form and sees confirmation', async ({ page }) => {
  const customer = {
    firstName: 'Ivan',
    lastName: 'Shvorak',
    email: 'ivan.shvorak.qa@example.com',
    gender: 'Male',
    mobile: '0671234567',
    address: '10 Test Street, Kyiv',
  };

  await page.goto('/automation-practice-form');
  // Remove third-party ad banners that can overlap form controls on demoqa
  await page.evaluate(() => document.querySelectorAll('#fixedban, footer').forEach((el) => el.remove()));

  await page.fill('#firstName', customer.firstName);
  await page.fill('#lastName', customer.lastName);
  await page.fill('#userEmail', customer.email);
  await page.click(`label[for="gender-radio-1"]:has-text("${customer.gender}")`);
  await page.fill('#userNumber', customer.mobile);
  await page.fill('#currentAddress', customer.address);

  await page.click('#submit');

  const modal = page.locator('.modal-content');
  await expect(modal).toBeVisible();
  await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');

  const row = (label) => modal.locator('tr', { has: page.locator('td', { hasText: label }) }).locator('td').nth(1);
  await expect(row('Student Name')).toHaveText(`${customer.firstName} ${customer.lastName}`);
  await expect(row('Student Email')).toHaveText(customer.email);
  await expect(row('Gender')).toHaveText(customer.gender);
  await expect(row('Mobile')).toHaveText(customer.mobile);
  await expect(row('Address')).toHaveText(customer.address);
});
