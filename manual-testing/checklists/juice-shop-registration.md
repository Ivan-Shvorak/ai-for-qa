# Juice Shop Registration — QA Checklist

**Requirements:** manual-testing/checklist-task-requirements.md
**Page:** https://jshop.mate.academy/#/register
**Generated:** 2026-10-10

Covers the Juice Shop User Registration form: field validation (email, password, repeat password, security question, answer), the "Show password advice" toggle, and navigation to Login.

---

## Functional

- [ ] User can register after filling in all required fields with valid data and clicking [Register] (JS-REQ-001, JS-REQ-002, JS-REQ-003, JS-REQ-004, JS-REQ-005, JS-REQ-009)
- [ ] User can NOT register with an email **without "@"** (e.g. `qa.user.example.com`) (JS-REQ-001)
- [ ] User can NOT register with an email **missing the local or domain part** (e.g. `@example.com`, `qa.user@`) (JS-REQ-001)
- [ ] User can NOT register with an email **containing spaces** (e.g. `qa user@example.com`) (JS-REQ-001)
- [ ] User can NOT register with an email that is **already registered** (JS-REQ-002)
- [ ] User can NOT register with an already registered email typed in **different letter case** (JS-REQ-002)
- [ ] User can register with a password of exactly **8** characters that meets all complexity rules (JS-REQ-003)
- [ ] User can NOT register with a password of **7** characters that meets all complexity rules (JS-REQ-003)
- [ ] User can NOT register with a password **without a lowercase letter** (JS-REQ-004)
- [ ] User can NOT register with a password **without an uppercase letter** (JS-REQ-004)
- [ ] User can NOT register with a password **without a digit** (JS-REQ-004)
- [ ] User can NOT register with a password **without a special symbol** (JS-REQ-004)
- [ ] User can NOT register when **Repeat Password differs** from Password and sees a "passwords do not match" error (JS-REQ-005)
- [ ] User can NOT register when **Password is changed after** Repeat Password was already entered to match it (JS-REQ-005)
- [ ] User can NOT register with the **Email** field empty (JS-REQ-009)
- [ ] User can NOT register with the **Password** field empty (JS-REQ-009)
- [ ] User can NOT register with the **Repeat Password** field empty (JS-REQ-009)
- [ ] User can NOT register **without selecting a Security Question** (JS-REQ-009)
- [ ] User can NOT register with the **Answer** field empty (JS-REQ-009)
- [ ] User can open the Login screen by clicking the "Already a customer?" link (JS-REQ-010)

## UI

- [ ] User can see the "Show password advice" toggle switched off by default with no password requirements shown (JS-REQ-006)
- [ ] User can see all five password requirements (lowercase, uppercase, digit, special character, at least 8 characters) after switching the toggle on (JS-REQ-007)
- [ ] User can see each password requirement marked as met while typing a password that satisfies it (JS-REQ-007)
- [ ] User can hide the password requirements by switching the toggle off again (JS-REQ-006, JS-REQ-007)
- [ ] User can see the list of security questions when opening the Security Question drop-down (JS-REQ-008)
- [ ] User can see the selected security question displayed in the field after choosing it (JS-REQ-008)
- [ ] User can see a "required" error under a required field after leaving it empty and moving focus away (JS-REQ-009)
- [ ] User can see the [Register] button disabled until all required fields are filled with valid values (JS-REQ-009)

## Open Questions

- **JS-REQ-003 vs. the page:** the Password field hint says "Password must be 5-40 characters long" and its counter shows `0/20`, while Repeat Password shows `0/40`. The requirement sets only a minimum of 8 and no maximum. Which minimum and maximum are correct?
- **JS-REQ-001:** "valid email address" isn't defined. Is a TLD required (`user@localhost`)? Is there a maximum length? Are `+` aliases allowed?
- **JS-REQ-002:** should the uniqueness check ignore letter case and leading or trailing spaces?
- **JS-REQ-004:** which characters count as "special symbols" (only ASCII punctuation, or also spaces and Unicode)?
- **JS-REQ-008:** the requirement doesn't list the expected options. The page shows 14 questions. Is there a reference list to check them against?
- **Answer field:** no requirement covers its format. Are whitespace-only answers or a minimum and maximum length allowed?
