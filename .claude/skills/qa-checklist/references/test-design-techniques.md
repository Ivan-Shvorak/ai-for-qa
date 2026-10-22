# Test Design Techniques — Cheat Sheet

Used in Step 3 of the main skill to turn a requirement into concrete test cases instead of just listing happy paths. Pick whichever technique fits — not every technique applies to every requirement.

| Technique | What it does | When to use it |
|---|---|---|
| **Equivalence partitioning** | Split inputs into classes that should behave the same way; test one representative per class. | Any field with valid and invalid inputs (e.g. email: valid format, missing @, empty). |
| **Boundary value analysis** | Test at and just past the edges of a valid range. | Length limits, numeric limits, date ranges (e.g. password of 7 / 8 characters). |
| **Decision table** | Enumerate combinations of conditions and their expected outcomes. | Rules with several independent conditions (e.g. password must have lower + upper + digit + special). |
| **State transition** | Model the states and which transitions are valid. | Toggles (off → on → off), multi-step forms, buttons that become enabled once the form is valid. |
| **Error guessing** | Use known failure classes to probe likely bugs. | Leading/trailing spaces, upper-case emails, copy-pasted values, double-click on submit, browser back after submit. |
| **Pairwise testing** | Cover all pairs of parameter values instead of the full matrix. | Many independent options where full combinatorics is impractical (e.g. browser × language × device). |

## Applying these to Functional / UI / API

- **Functional** — equivalence partitioning and decision tables cover validation rules; state transition covers flows and enabled/disabled logic.
- **UI** — boundary values for anything with visible limits (counters, hints); state transition for toggles and dropdowns; error guessing for message placement and focus.
- **API** — equivalence partitioning for request payloads (valid / invalid / missing fields); decision tables for status code × error body.

## Worked example: "Password must be at least 8 characters and contain lower, upper, digit and special"

- Boundary: 7 characters (rejected), 8 characters (accepted).
- Decision table: one case per missing character class (no lower, no upper, no digit, no special), plus one with all classes.
- Error guessing: password with only spaces, very long password (e.g. 100 characters).
