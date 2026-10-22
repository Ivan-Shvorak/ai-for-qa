---
name: qa-checklist
description: Turn feature requirements (a requirements .md file, pasted acceptance criteria, or a user story) into a lean manual QA checklist of user-role-phrased test cases ("User can...", "User can NOT...") grouped by area (Functional / UI / API / Compatibility, only the groups that apply), optionally grounded by exploring the live page with Playwright MCP, then run a mandatory smart-dedup pass before writing the file. Use when the user says "create a checklist", "make test cases from these requirements", "write a QA checklist for <feature>", or points at a requirements file such as manual-testing/checklist-task-requirements.md. Does not write automated tests — that is playwright-write-tests-for-new-feature.
tools: Bash, Read, Write, Grep, Glob, mcp__playwright__browser_navigate, mcp__playwright__browser_snapshot, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_close
---

# Requirements → QA Checklist

Turn feature requirements into a lean, user-facing manual QA checklist, grounded in how the page actually behaves (not just what the requirements say).

## Step 1 — Read the requirements

Take the source from the user's message, in this order:

1. A path to a requirements file (e.g. `manual-testing/checklist-task-requirements.md`) — read it.
2. Requirements pasted into the message — use them as is.
3. Neither — ask the user for the requirements. Do not invent them.

Extract:

- **Feature name and URL** of the page under test, if given.
- **Every requirement as a separate item.** Keep the original IDs (e.g. `JS-REQ-003`). If requirements have no IDs, number them `REQ-1`, `REQ-2`, ... in the order they appear.
- **Ambiguities** — anything vague, untestable, or contradictory ("should be fast", "valid email" with no definition). These become Open Questions in Step 6, not test cases.

## Step 2 — (Optional) Explore the live page

If a URL is available, look at the real page with Playwright MCP before designing cases. Do this read-only: navigate, take a snapshot, open dropdowns and toggles. **Never submit forms or create accounts** during exploration — that is the tester's job when running the checklist.

Note what the requirements don't say but the page shows:

- **Entry points** — how the user reaches the feature, which links/buttons lead in and out.
- **Field states** — required markers, placeholders, default values, disabled/enabled states, hints and error messages.
- **Hidden behavior** — toggles that reveal content, dropdown options, client-side validation that fires on blur vs. on submit.
- **Gaps** — a requirement with no visible counterpart on the page, or page behavior that no requirement mentions. Flag them for Open Questions; don't silently drop or invent.

If there is no URL or the page is unreachable, skip this step and say in the file header that the checklist is based on requirements only.

## Step 3 — Design test cases with test design techniques

**Focus on the places that need checking and the checks each place needs.**

Apply equivalence partitioning, boundary value analysis, decision tables, state transition analysis, happy-path scenarios, and error guessing — see `references/test-design-techniques.md`. These techniques shape *which cases you write*, silently: never name the technique in the output (no "Boundary —", "Equivalence Partitioning —" headings).

Group cases under area headings, and only include a heading if it has cases under it:

- **Functional** — validation rules, business logic, data correctness, navigation between screens, state transitions.
- **UI** — what renders and how: empty/loading/error/disabled states, toggles, dropdown contents, error message placement, responsive behavior, keyboard/focus where relevant.
- **API** — only if the requirements mention a backend contract (request shape, status codes, error mapping). Requirements for a form alone don't make an API section.
- **Compatibility** — only if the requirements mention browsers, devices, or versions.

Never write an empty or placeholder heading ("No API changes") — omit it.

**Output shape:** one line per test case, one sentence, from the acting user's point of view. No steps, no expected-result field, no Given/When/Then. End each line with the requirement ID(s) it covers.

```
- [ ] User can register with a password of exactly **8** characters that meets all complexity rules (JS-REQ-003)
- [ ] User can NOT register with a password of **7** characters (JS-REQ-003)
- [ ] User can NOT register with an email that is **already registered** (JS-REQ-002)
```

Use "User can" / "User can NOT" (or the real role: "Admin can...", "Guest can...") consistently. Bold the varying parameter in each equivalence-class row so the partition is easy to scan.

## Step 4 — Check coverage

Every requirement from Step 1 must be covered by at least one case. If one isn't, either add a case or move it to Open Questions with the reason it can't be tested as written.

## Step 5 — Mandatory smart-dedup pass

This is part of producing the checklist, not optional cleanup. Before writing the file, re-read every drafted case and apply, in order:

1. **Remove impossible states.** If Step 2 showed a combination can't happen on the real page, delete the case.
2. **Remove exact duplicates.** If a case is just the baseline of another, more specific case, keep only the specific one.
3. **Merge same-assertion pairs.** Two cases checking the same outcome via a trivially equivalent trigger (two fields verified in one glance, the same error from two identical paths) become one case that mentions both.
4. **Consolidate low-value negatives.** When several inputs produce an identical, indistinguishable outcome (e.g. five different malformed emails all showing the same message), keep one representative per real equivalence class, not one per example.

Never cut a case that is the *only* coverage for a requirement, a distinct user-visible outcome, or a distinct boundary class. When unsure whether two cases are duplicates, keep both.

The dedup pass is silent: don't add a "Consolidation Notes" or before/after section to the output.

## Step 6 — Write the file

```
manual-testing/checklists/<feature-slug>.md
```

Use template from ./manual-testing/checklist.xslx 

If user asks not to use it use the following structure:

Kebab-case the feature name. If the file already exists, ask before overwriting, or suffix with the date.

```markdown
# <Feature Name> — QA Checklist

**Requirements:** <path to requirements file, or "pasted in chat">
**Page:** <URL, or "not explored — requirements only">
**Generated:** <date>

<1–2 sentences of context: what the feature is and what area it covers. No mention of test design techniques.>

---

## Functional

- [ ] User can ... (REQ-ID)
- [ ] User can NOT ... (REQ-ID)

## UI

- [ ] User can ... (REQ-ID)

## Open Questions

- <ambiguous / untestable / contradictory requirement and why>
```

Only include the area headings that have cases. Only include Open Questions if there are any — don't hide them inside a test case as a "needs clarification" checkbox.

## Rules

- Write the checklist in the language of the requirements (English by default).
- Every test case is a single line, one behavior, phrased as a user action and outcome — no run-on cases.
- Every case ends with the requirement ID(s) it covers; every requirement is covered or listed in Open Questions.
- Never name a test design technique in a heading or a case.
- The dedup pass always runs and is never reported.
- Never submit forms, register users, or change data on the site while exploring.
- This skill only produces the checklist. Writing Playwright tests belongs to `playwright-write-tests-for-new-feature`.
