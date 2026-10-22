const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function buildStudent() {
  const uniqueSuffix = Date.now();

  return {
    firstName: 'Pw',
    lastName: `Student${uniqueSuffix}`,
    email: `pw-${uniqueSuffix}@example.com`,
    gender: 'Female',
    mobile: '0501234567',
    dateOfBirth: { day: 15, month: 4, year: 1990 },
    subject: 'Maths',
    hobby: 'Reading',
    currentAddress: '1 Test Street, Testville',
    state: 'NCR',
    city: 'Delhi',
  };
}

function formatDateForConfirmation({ day, month, year }) {
  return `${String(day).padStart(2, '0')} ${MONTH_NAMES[month]},${year}`;
}

module.exports = { buildStudent, formatDateForConfirmation };
