# Business case result cleanup feature audit

## 1. Scope and acceptance criteria

- The completed full-team estimate remains the only visitor-facing monetary result.
- The pilot keeps its recommended people, qualified annual hours, and demo CTA without a second monetary figure.
- The repeated planning-example sentence is absent from guided steps, Calculation settings, no-JavaScript output, and production client assets.
- One divider separates the full-team estimate from the pilot.
- Existing formulas, pilot sizing, editable assumptions, local-only state, and the planning disclaimer remain intact.

## 2. Boundaries reviewed

- `src/components/islands/BusinessCaseCalculator.tsx`: guided state, completed markup, and live announcement.
- `src/pages/pricing.astro` and `src/lib/content/pricing.ts`: approved claim resolution and no-JavaScript guidance.
- `src/lib/claims/registry.ts`: retired method claim and approved pilot and disclaimer boundaries.
- `src/styles/global.css`: result borders, pilot layout, and responsive spacing.
- Pricing content, component, browser, accessibility, and visual-regression tests.

Content and assumptions remain owned by the page boundary and claim registry. Visitor choices and result state remain inside the hydrated calculator. The change adds no network request, persistence, URL state, dependency, or new interaction. Invalid settings still hide stale results, and zero recovery still suppresses the pilot CTA. Hydration and no-JavaScript timing are unchanged.

## 3. Findings

### RESULT-01: P2, resolved

- **Affected surface:** Completed pilot result and assistive-technology announcement.
- **User impact:** A second euro amount competed with the full-team estimate and made annualized pilot value look like a separate promised return.
- **Preconditions:** Complete the three guided questions with a positive recovery scenario.
- **Reproduction:** Inspect the pilot section and the polite live result after the main euro figure.
- **Expected:** One monetary estimate for the full team, followed by a quiet pilot size, qualified hours, and demo CTA.
- **Actual before correction:** The pilot rendered another large euro figure and the live announcement repeated it.
- **Evidence:** Supplied result screenshot and unit/component tests that failed before the correction.
- **Root cause:** Pilot monetary calculation was also rendered as a second figure and appended to the announcement.
- **Correction:** Keep the pilot calculation internal, remove its monetary markup and announcement text, and retain the qualified hours.
- **Regression verification:** Component and browser tests assert the absent second euro, unchanged full-team amount, pilot hours, and `/demo` destination.
- **Status:** Resolved.

### RESULT-02: P3, resolved

- **Affected surface:** Divider between full-team and pilot results.
- **User impact:** Two closely spaced rules made the completed result look cluttered.
- **Preconditions:** Complete any positive estimate.
- **Reproduction:** Inspect the bottom border of the full-team section and the top border of the pilot.
- **Expected:** A single rule between those sections.
- **Actual before correction:** Each section supplied one border, producing a double line.
- **Evidence:** Supplied screenshot, inspected CSS, and desktop and mobile focused result snapshots.
- **Root cause:** `border-bottom` on the full-team section combined with `border-top` on the pilot.
- **Correction:** Retain the full-team bottom border, remove the pilot top border, and tighten pilot spacing.
- **Regression verification:** Updated focused desktop and mobile snapshots were visually inspected and passed.
- **Status:** Resolved.

### RESULT-03: P3, resolved

- **Affected surface:** Guided questions, Calculation settings, and no-JavaScript fallback.
- **User impact:** The same long planning sentence distracted from each question and repeated information already shown with the completed estimate.
- **Preconditions:** Open `/pricing`, advance the questions, expand settings, or disable JavaScript.
- **Reproduction:** Read the planning-example paragraph on those surfaces.
- **Expected:** Concise questions, with assumptions adjacent to the result and editable inside settings. Manual fallback still explains the formula and caveat.
- **Actual before correction:** The same sentence appeared in every step, inside settings, and in the fallback.
- **Evidence:** Supplied feedback, source inspection, and component/content tests that failed before correction.
- **Root cause:** One approved method claim was passed into the island and rendered in several places.
- **Correction:** Supersede the claim without deleting its internal history, remove its active references and component prop, and retain the result assumptions, settings values, manual fallback method, and disclaimer.
- **Regression verification:** Component, unit, Chromium, and production-artifact checks found no visitor-facing sentence.
- **Status:** Resolved.

## 4. Accessibility, responsive, privacy, and claims review

- The live announcement contains the full-team monetary estimate, team hours, and pilot people and hours, but no second monetary amount.
- The pilot still has a semantic heading and descriptive demo link. Native controls, visible focus, Back and Edit behavior, and error association remain unchanged.
- No-JavaScript output still gives a manual formula, pilot-sizing rule, disclaimer, and demo link.
- Completed-result snapshots at 1440px and 390px show one section divider and a quieter pilot. First-step snapshots at 390px, 768px, and 1440px show less clutter.
- The former method claim is marked superseded and is no longer resolved for public output. The approved disclaimer and full-team result assumptions remain visible. No em dash or public price was added.
- Calculator values remain in current-page browser state only, with no submission, tracking, or storage.

## 5. Verification and limits

- Test-first pricing content and component checks failed on the three reported issues, then 21 focused tests passed.
- Targeted Chromium pricing journeys: 13 passed with retries disabled.
- Focused Chromium pricing visual checks: 8 passed; changed desktop and mobile references were inspected.
- Unit and component coverage: 106 tests passed; global coverage was 92.96 percent statements, 87.13 percent branches, 91.2 percent functions, and 94.02 percent lines.
- Formatting, ESLint, strict types, preview and production-mode static builds, client budgets, and governance validation passed.
- Production `/pricing` HTML and client assets contain neither the retired sentence nor the removed pilot value sentence.
- Full Chromium, Firefox, and WebKit suite: 193 passed with retries disabled.
- No production deployment, release audit, real visitor-data exercise, physical assistive-technology session, or field-performance measurement was requested or performed.

## 6. Final decision

**PASS.** No unresolved P0, P1, or P2 finding remains in the audited implementation.
