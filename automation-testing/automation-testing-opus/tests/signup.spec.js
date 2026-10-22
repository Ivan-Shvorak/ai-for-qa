const { test, expect } = require('@playwright/test');

const customer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  gender: 'Male',
  mobile: '0123456789',
  dateOfBirth: { day: '15', month: 'May', year: '1990' },
  subject: 'Maths',
  hobby: 'Sports',
  address: '221B Baker Street, London',
  state: 'NCR',
  city: 'Delhi',
};

test('customer can sign up via the practice form', async ({ page }) => {
  // demoqa shows third-party ads that can overlap the Submit button — block them
  await page.route(
    /googlesyndication|doubleclick|adplus|googletagservices/,
    (route) => route.abort(),
  );

  await page.goto('/automation-practice-form');

  await page.locator('#firstName').fill(customer.firstName);
  await page.locator('#lastName').fill(customer.lastName);
  await page.locator('#userEmail').fill(customer.email);
  await page
    .locator('label', { hasText: new RegExp(`^${customer.gender}$`) })
    .click();
  await page.locator('#userNumber').fill(customer.mobile);

  await page.locator('#dateOfBirthInput').click();
  await page
    .locator('.react-datepicker__month-select')
    .selectOption(customer.dateOfBirth.month);
  await page
    .locator('.react-datepicker__year-select')
    .selectOption(customer.dateOfBirth.year);
  await page
    .locator(
      `.react-datepicker__day--0${customer.dateOfBirth.day}:not(.react-datepicker__day--outside-month)`,
    )
    .click();

  // Pick autocomplete options by click: pressing Enter before the menu renders submits the form
  const selectOption = async (input, value) => {
    await page.locator(input).click();
    await page.locator(input).pressSequentially(value);
    await page.getByRole('option', { name: value, exact: true }).click();
  };

  await selectOption('#subjectsInput', customer.subject);
  await page.locator('label', { hasText: customer.hobby }).click();
  await page.locator('#currentAddress').fill(customer.address);

  await selectOption('#react-select-3-input', customer.state);
  await selectOption('#react-select-4-input', customer.city);

  await page.locator('#submit').click();

  // Verify the customer is signed up: confirmation modal with submitted data
  const modal = page.locator('.modal-content');
  await expect(modal).toBeVisible();
  await expect(page.locator('#example-modal-sizes-title-lg')).toHaveText(
    'Thanks for submitting the form',
  );

  const valueOf = (label) =>
    modal
      .locator('tr', { has: page.locator('td', { hasText: label }) })
      .locator('td')
      .nth(1);

  await expect(valueOf('Student Name')).toHaveText(
    `${customer.firstName} ${customer.lastName}`,
  );
  await expect(valueOf('Student Email')).toHaveText(customer.email);
  await expect(valueOf('Gender')).toHaveText(customer.gender);
  await expect(valueOf('Mobile')).toHaveText(customer.mobile);
  await expect(valueOf('Date of Birth')).toHaveText(
    `${customer.dateOfBirth.day} ${customer.dateOfBirth.month},${customer.dateOfBirth.year}`,
  );
  await expect(valueOf('Subjects')).toHaveText(customer.subject);
  await expect(valueOf('Hobbies')).toHaveText(customer.hobby);
  await expect(valueOf('Address')).toHaveText(customer.address);
  await expect(valueOf('State and City')).toHaveText(
    `${customer.state} ${customer.city}`,
  );
});
