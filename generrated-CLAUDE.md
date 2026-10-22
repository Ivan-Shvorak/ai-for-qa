# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Playwright (JavaScript, CommonJS) end-to-end tests against the public demo site https://demoqa.com. Currently a single spec, `tests/signup.spec.js`, that fills the Student Registration form at `/automation-practice-form` and asserts the confirmation modal's table matches the submitted data.

This folder is one of several sibling projects in `../` (`automation-testing-haiku`, `automation-testing-sonnet`, `manual-testing`) that solve the same prompts (see `../prompts.md`) with different models. Keep this project self-contained; don't copy from or edit the siblings.

## Commands

```bash
npm install && npx playwright install chromium   # first-time setup
npm test                                         # run all tests (headless Chromium)
npx playwright test tests/signup.spec.js         # single file
npx playwright test -g "customer can sign up"    # single test by title
npx playwright test --headed                     # watch the browser
npx playwright test --repeat-each=5              # flakiness check
npx playwright show-report                       # open HTML report
npx playwright show-trace test-results/<dir>/trace.zip   # debug a failure
```

There is no lint or build step.

## Config notes (`playwright.config.js`)

- `baseURL` is `https://demoqa.com`, so use relative paths in `page.goto`.
- `actionTimeout: 10_000` makes a stuck action fail fast with a useful call log instead of hitting the 60s test timeout.
- Screenshots and traces are kept only on failure, in `test-results/`.

## demoqa quirks (learned the hard way)

- **Ads overlap elements** (for example the Submit button). Block them with `page.route(/googlesyndication|doubleclick|adplus|googletagservices/, r => r.abort())` before `goto`.
- **react-select fields** (`#subjectsInput`, `#react-select-3-input` for State, `#react-select-4-input` for City):
  - `fill()` does not open the menu. Click the input, then `pressSequentially()`.
  - Choose with `getByRole('option', { name, exact: true }).click()`.
  - Do **not** press `Enter` to select: if the menu hasn't rendered yet, Enter submits the whole form.
- **The date picker** (`#dateOfBirthInput`) keeps focus after a day is picked. Click the next field explicitly before typing into it.
  - Select days with `.react-datepicker__day--0DD:not(.react-datepicker__day--outside-month)`.
  - The confirmation modal formats the date as `15 May,1990`.
- **Gender and hobby inputs** are hidden behind their labels. Click the `<label>`, not the `<input>`.
