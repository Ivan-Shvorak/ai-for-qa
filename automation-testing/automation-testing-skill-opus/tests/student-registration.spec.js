const { test } = require('@playwright/test');
const { HttpClient } = require('../http/http-client');
const { StudentRegistrationPage } = require('../pages/student-registration.page');
const { buildStudent } = require('../test-data/student-registration.test-data');

test.describe('Student Registration form', () => {
  test.beforeEach(async ({ page }) => {
    await new HttpClient(page).blockAds();
  });

  test('should register a student with valid data and show submitted details', async ({ page }) => {
    const registrationPage = new StudentRegistrationPage(page);
    const student = buildStudent();

    await registrationPage.openAndAssert();
    await registrationPage.fillFirstName(student.firstName);
    await registrationPage.fillLastName(student.lastName);
    await registrationPage.fillEmail(student.email);
    await registrationPage.selectGender(student.gender);
    await registrationPage.fillMobile(student.mobile);
    await registrationPage.pickDateOfBirth(student.dateOfBirth);
    await registrationPage.selectSubject(student.subject);
    await registrationPage.selectHobby(student.hobby);
    await registrationPage.fillCurrentAddress(student.currentAddress);
    await registrationPage.selectState(student.state);
    await registrationPage.selectCity(student.city);
    await registrationPage.submit();

    await registrationPage.assertConfirmationShows(student);
  });
});
