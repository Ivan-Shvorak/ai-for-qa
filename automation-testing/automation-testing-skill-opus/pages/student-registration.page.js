const { test, expect } = require('@playwright/test');
const { formatDateForConfirmation } = require('../test-data/student-registration.test-data');

class StudentRegistrationPage {
  constructor(page) {
    this.page = page;
    this.path = '/automation-practice-form';
    this.formHeading = page.getByRole('heading', { name: 'Practice Form' });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('name@example.com');
    this.mobileInput = page.getByPlaceholder('Mobile Number');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.monthSelect = page.locator('.react-datepicker__month-select');
    this.yearSelect = page.locator('.react-datepicker__year-select');
    this.subjectsInput = page.locator('#subjectsInput');
    this.currentAddressInput = page.getByPlaceholder('Current Address');
    this.stateInput = page.locator('#react-select-3-input');
    this.cityInput = page.locator('#react-select-4-input');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.confirmationModal = page.getByRole('dialog');
    this.confirmationTitle = this.confirmationModal.getByText('Thanks for submitting the form');
  }

  async openAndAssert() {
    await test.step('open student registration form', async () => {
      await this.page.goto(this.path);
      await expect(this.formHeading).toBeVisible();
      await expect(this.submitButton).toBeVisible();
    });
  }

  async chooseLabel(text) {
    await this.page.locator('#userForm label').getByText(text, { exact: true }).click();
  }

  async chooseFromReactSelect(input, value) {
    await input.click();
    await input.pressSequentially(value);
    await this.page.getByRole('option', { name: value, exact: true }).click();
  }

  async pickDateOfBirth({ day, month, year }) {
    await test.step(`pick date of birth ${day}.${month + 1}.${year}`, async () => {
      await this.dateOfBirthInput.click();
      await this.yearSelect.selectOption(String(year));
      await this.monthSelect.selectOption(String(month));
      const dayCell = this.page.locator(
        `.react-datepicker__day--0${String(day).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`,
      );
      await dayCell.click();
    });
  }

  async fillFirstName(firstName) {
    await test.step(`fill first name "${firstName}"`, async () => {
      await this.firstNameInput.fill(firstName);
    });
  }

  async fillLastName(lastName) {
    await test.step(`fill last name "${lastName}"`, async () => {
      await this.lastNameInput.fill(lastName);
    });
  }

  async fillEmail(email) {
    await test.step(`fill email "${email}"`, async () => {
      await this.emailInput.fill(email);
    });
  }

  async selectGender(gender) {
    await test.step(`select gender "${gender}"`, async () => {
      await this.chooseLabel(gender);
    });
  }

  async fillMobile(mobile) {
    await test.step(`fill mobile "${mobile}"`, async () => {
      await this.mobileInput.fill(mobile);
    });
  }

  async selectSubject(subject) {
    await test.step(`select subject "${subject}"`, async () => {
      await this.chooseFromReactSelect(this.subjectsInput, subject);
    });
  }

  async selectHobby(hobby) {
    await test.step(`select hobby "${hobby}"`, async () => {
      await this.chooseLabel(hobby);
    });
  }

  async fillCurrentAddress(currentAddress) {
    await test.step(`fill current address "${currentAddress}"`, async () => {
      await this.currentAddressInput.click();
      await this.currentAddressInput.fill(currentAddress);
    });
  }

  async selectState(state) {
    await test.step(`select state "${state}"`, async () => {
      await this.chooseFromReactSelect(this.stateInput, state);
    });
  }

  async selectCity(city) {
    await test.step(`select city "${city}"`, async () => {
      await this.chooseFromReactSelect(this.cityInput, city);
    });
  }

  async submit() {
    await test.step('submit the form', async () => {
      await this.submitButton.click();
    });
  }

  async assertConfirmationShows(student) {
    await test.step('confirmation shows submitted student data', async () => {
      await expect(this.confirmationTitle).toBeVisible();
      await expect(this.confirmationValue('Student Name')).toHaveText(`${student.firstName} ${student.lastName}`);
      await expect(this.confirmationValue('Student Email')).toHaveText(student.email);
      await expect(this.confirmationValue('Gender')).toHaveText(student.gender);
      await expect(this.confirmationValue('Mobile')).toHaveText(student.mobile);
      await expect(this.confirmationValue('Date of Birth')).toHaveText(formatDateForConfirmation(student.dateOfBirth));
      await expect(this.confirmationValue('Subjects')).toHaveText(student.subject);
      await expect(this.confirmationValue('Hobbies')).toHaveText(student.hobby);
      await expect(this.confirmationValue('Address')).toHaveText(student.currentAddress);
      await expect(this.confirmationValue('State and City')).toHaveText(`${student.state} ${student.city}`);
    });
  }

  confirmationValue(label) {
    return this.confirmationModal.getByRole('row').filter({ hasText: label }).getByRole('cell').nth(1);
  }
}

module.exports = { StudentRegistrationPage };
