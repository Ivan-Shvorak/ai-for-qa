---
name: playwright-write-tests-for-new-feature
description: Write Playwright E2E tests (JavaScript) for a feature on a web page. Use when the user asks to "write tests for a feature", "add Playwright tests", "create E2E tests", "automate this checklist", "cover a feature with tests", or points at a feature brief in .claude/new-feature-to-test/ or a checklist in manual-testing/checklists/.
tools: Bash, Read, Edit, Write, Glob, Grep, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_evaluate, mcp__playwright__browser_close
---

# Write Playwright Tests for a New Feature

The user describes a feature to cover. Follow these steps strictly.

## Input

Take the source from the user's message, in this order:

1. **A feature brief** — look in `.claude/new-feature-to-test/` for a `.md` file matching the feature name.
2. **A QA checklist** — e.g. `manual-testing/checklists/<feature>.md` produced by the `qa-checklist` skill. Each `- [ ]` line is a candidate test.
3. **A URL plus a description in the message.**

```bash
ls .claude/new-feature-to-test/ manual-testing/checklists/ 2>/dev/null
```

If none of these exist, ask the user to create a brief in `.claude/new-feature-to-test/<feature-name>.md` using this template:

```markdown
# Feature: <Feature Name>

## URL

<!-- e.g. https://demoqa.com/automation-practice-form -->

## Description

<!-- Short description of what the feature does -->

## Test scenarios

- should ...
- should NOT ...

## Test data

<!-- valid / invalid values, test accounts if login is needed -->

## Target folder

<!-- e.g. automation-testing-opus — where playwright.config.js lives -->

## Special notes

<!-- ads, popups, cookie banners, known flakiness -->
```

**Target folder:** write tests into the folder the user or brief names. If none is named, ask — never write into a sibling folder that belongs to another model's experiment (`automation-testing-haiku`, `-sonnet`, `-opus`).

If the checklist has many cases, pick the ones worth automating (critical paths, validation rules, regressions) and tell the user which you left for manual testing and why. Visual/UX judgment stays manual.

## Step 1 — Explore the UI with Playwright MCP

Before writing any code, open the real page and learn the actual DOM:

```
mcp__playwright__browser_navigate  → go to the page
mcp__playwright__browser_snapshot  → get the accessibility tree (roles, names, labels)
mcp__playwright__browser_evaluate  → check ids/attributes that the snapshot doesn't show
```

```javascript
() => ({
  submit: document.querySelector('#submit')?.tagName,
  emailInput: document.querySelector('input[type="email"]')?.id,
})
```

Note overlays (ads, cookie banners, welcome dialogs) that can block clicks — they need handling in the test (see Step 4). Do not register real users or submit data while exploring unless the user asked for it.

## Step 2 — Choose locators: roles and text first

Decision order for every element:

1. **Buttons / links** → `page.getByRole('button', { name: 'Submit' })`.
2. **Inputs with a label** → `page.getByLabel('Email')`; without a label → `page.getByRole('textbox', { name: ... })` or `getByPlaceholder(...)`.
3. **Test ids** → `page.getByTestId(...)` if the site has `data-testid` attributes.
4. 3. **Visible text** (errors, hints, headings) → `page.getByText(...)` or `getByRole('heading', { name })`.
5. **Only if none of the above work** → a stable `#id` or CSS selector. Avoid long CSS chains, auto-generated classes, and `nth()` without a parent scope.

When the same element appears in several places (e.g. a modal and the page behind it), scope the locator to a parent container:

```javascript
const modal = page.getByRole('dialog');
await expect(modal.getByText('Thanks for submitting the form')).toBeVisible();
```

We test someone else's site, so we can't add attributes to it — pick the most stable locator the page offers and record the reason in the page object's name, not in a comment.

## Step 3 — Create the page object

File: `<target-folder>/pages/<feature>.page.js`

```javascript
const { test, expect } = require('@playwright/test');

class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.path = '/register';
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.registerButton = page.getByRole('button', { name: 'Register' });
  }

  async openAndAssert() {
    await test.step('open registration page', async () => {
      await this.page.goto(this.path);
      await expect(this.registerButton).toBeVisible();
    });
  }

  async fillEmail({ email, password }) {
    await test.step(`register ${email}`, async () => {
      await this.emailInput.fill(email);
    });
  }
}

module.exports = { RegistrationPage };
```

Rules:

- Every method is `async` and wrapped in `test.step()`.
- The method that opens a page and asserts it is ready is always named **`openAndAssert`**.
- Locators are defined once in the constructor; specs never use raw selectors.
- Only add methods the current tests need — no speculative helpers.

Test data (valid/invalid values, generators) goes in `<target-folder>/test-data/<feature>.test-data.js`, never in a spec file — Playwright forbids importing from `.spec.js` files.

## Step 4 — Write the spec file

File: `<target-folder>/tests/<feature>.spec.js`

```javascript
const { test, expect } = require('@playwright/test');
const { RegistrationPage } = require('../pages/registration.page');
const { buildUser } = require('../test-data/registration.test-data');

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/googlesyndication|doubleclick|adplus|googletagservices/, (route) => route.abort());
  });

  test('should register a user with valid data', async ({ page }) => {
    const registrationPage = new RegistrationPage(page);
    const user = buildUser();

    await registrationPage.openAndAssert();
    await registrationPage.fillEmail(user);
    ...
  });
});
```

- One test = one behavior; the title starts with `should` / `should NOT`, matching the checklist line it automates.
- Unique data: prefix generated values with `pw-` and a timestamp (`pw-${Date.now()}@example.com`) so reruns don't collide.
- Handle overlays (ads, cookie banners, welcome dialogs) in `beforeEach`, not inside each test.
- Use `test.beforeAll` only for things that don't need `page` (e.g. reading a file); `page`-based setup goes in `beforeEach`.

## Step 5 — Run the tests

From the target folder:

```bash
npx playwright test tests/<feature>.spec.js --retries=0
npx playwright test tests/<feature>.spec.js --repeat-each=3 --retries=0
```

All runs must pass. If a test is flaky, find the cause (overlay, missing wait for a visible element or response, wrong locator) and fix it — don't add retries or sleeps to hide it. Use `npx playwright show-trace test-results/<dir>/trace.zip` to debug a failure.

If a test fails because the **site** doesn't meet the requirement, that's a bug, not a broken test: keep the assertion, mark the test with `test.fail()` and a title that names the bug, and report it to the user.

## Step 6 — Record what you learned

If you hit a site quirk that cost time (ads covering buttons, a dropdown that needs typing, a date picker that keeps focus), add it to the target folder's `CLAUDE.md` under "Site quirks" so the next session doesn't rediscover it.

## Rules

- **No comments in code** — specs, page objects and test data express intent through names and `test.step()` descriptions.
- **Roles and text first**, CSS selectors last (Step 2).
- The page-load-and-assert method is always **`openAndAssert`**.
- No magic numbers or hardcoded strings in tests — use named variables or test-data builders.
- **Never use `page.waitForTimeout`** — wait for visible elements, URLs, or responses instead.
- Validate behavior the user sees (click Register → error shown), not HTML attributes (`required`, `disabled`) alone.
- Never weaken or delete an assertion just to make a test pass.
- Never export constants from `.spec.js` files.
- Only touch the target folder; leave sibling experiment folders unchanged.
