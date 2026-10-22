# Juice Shop Registration — QA Checklist

**Requirements:** manual-testing/checklist-task-requirements.md
**Page:** https://jshop.mate.academy/#/register (not explored — requirements only)
**Generated:** 2026-10-10
**Spreadsheet:** manual-testing/checklists/juice-shop-registration-2026-10-10.xlsx (built from the manual-testing/checklist.xlsx template)

Covers the Juice Shop User Registration form: validation of Email, Password, Repeat Password, Security Question and Answer, the "Show password advice" toggle, and the link to the Login screen.

---

## Functional

- [ ] User can register after filling in all required fields with valid data and clicking [Register] (JS-REQ-001, JS-REQ-002, JS-REQ-003, JS-REQ-004, JS-REQ-005, JS-REQ-009)
- [ ] User can NOT register with an email **without "@"** (JS-REQ-001)
- [ ] User can NOT register with an email **missing the local part or the domain** (JS-REQ-001)
- [ ] User can NOT register with an email **containing a space** (JS-REQ-001)
- [ ] User can NOT register with an email that is **already registered** (JS-REQ-002)
- [ ] User can NOT register with an already registered email typed in **different letter case** (JS-REQ-002)
- [ ] User can register with a password of exactly **8** characters that meets all complexity rules (JS-REQ-003)
- [ ] User can NOT register with a password of **7** characters that meets all complexity rules (JS-REQ-003)
- [ ] User can NOT register with a password **without a lowercase letter** (JS-REQ-004)
- [ ] User can NOT register with a password **without an uppercase letter** (JS-REQ-004)
- [ ] User can NOT register with a password **without a digit** (JS-REQ-004)
- [ ] User can NOT register with a password **without a special symbol** (JS-REQ-004)
- [ ] User can NOT register when **Repeat Password differs** from Password and sees a mismatch error (JS-REQ-005)
- [ ] User can NOT register when **Password is edited after** Repeat Password already matched it (JS-REQ-005)
- [ ] User can NOT register with the **Email** field empty (JS-REQ-009)
- [ ] User can NOT register with the **Password** field empty (JS-REQ-009)
- [ ] User can NOT register with the **Repeat Password** field empty (JS-REQ-009)
- [ ] User can NOT register **without selecting a Security Question** (JS-REQ-009)
- [ ] User can NOT register with the **Answer** field empty (JS-REQ-009)
- [ ] User can open the Login screen by clicking the "Already a customer?" link (JS-REQ-010)

## UI

- [ ] User can see the "Show password advice" toggle switched off by default, with no password requirements shown (JS-REQ-006)
- [ ] User can see all password requirements (lowercase, uppercase, digit, special symbol, at least 8 characters) after switching the toggle on (JS-REQ-007)
- [ ] User can see each password requirement marked as met while typing a password that satisfies it (JS-REQ-007)
- [ ] User can see the list of security questions after opening the Security Question drop-down (JS-REQ-008)

## Open Questions

- JS-REQ-001: "valid email" is not defined — are plus-addressing (`a+b@x.com`), subdomains, and non-Latin domains valid?
- JS-REQ-002: it isn't stated whether uniqueness is case-insensitive (`User@x.com` vs `user@x.com`).
- JS-REQ-003: no maximum password length is specified.
- JS-REQ-004: the set of allowed "special symbols" is not defined.
- JS-REQ-008: the expected list of security questions is not given, so only "the list opens and has options" can be checked.
