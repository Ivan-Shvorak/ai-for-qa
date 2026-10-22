const { test, expect } = require('@playwright/test');

test('user can sign up via the registration form', async ({ page }) => {
  const user = {
    firstName: 'Ivan',
    lastName: 'Shvorak',
    email: 'ivan.shvorak.test@example.com',
    mobile: '0501234567',
    address: '123 Test Street, Kyiv',
  };

  await page.goto('/automation-practice-form');

  await page.locator('#firstName').fill(user.firstName);
  await page.locator('#lastName').fill(user.lastName);
  await page.locator('#userEmail').fill(user.email);
  await page.locator('label[for="gender-radio-1"]').click();
  await page.locator('#userNumber').fill(user.mobile);
  await page.locator('label[for="hobbies-checkbox-1"]').click();
  await page.locator('#currentAddress').fill(user.address);

  await page.locator('#submit').scrollIntoViewIfNeeded();
  await page.locator('#submit').click({ force: true });

  const modal = page.locator('.modal-content');
  await expect(modal).toBeVisible();
  await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText('Thanks for submitting the form');

  await expect(modal.getByRole('row', { name: 'Student Name' })).toContainText(`${user.firstName} ${user.lastName}`);
  await expect(modal.getByRole('row', { name: 'Student Email' })).toContainText(user.email);
  await expect(modal.getByRole('row', { name: 'Gender' })).toContainText('Male');
  await expect(modal.getByRole('row', { name: 'Mobile' })).toContainText(user.mobile);
});
