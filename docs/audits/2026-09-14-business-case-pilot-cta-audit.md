# Business case pilot CTA feature audit

## 1. Scope and acceptance criteria

- Audited the completed business-case estimate, the derived pilot recommendation, the annual
  capacity calculations, the conversion CTA, and the no-JavaScript explanation.
- Required a small pilot cohort that responds to the visitor's entered team size without adding a
  fourth calculator question.
- Required the pilot value to use only the visitor's weekly hours, hourly value, and working-year
  inputs.
- Required the result to remain an estimate to validate, not a promised return, savings result,
  price, or implementation commitment.
- Required a clear next action to scope the suggested pilot with Zeno.

## 2. Files and boundaries reviewed

- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/lib/pricing/business-case.ts`
- `src/lib/content/pricing.ts`
- `src/lib/claims/registry.ts`
- `src/pages/pricing.astro`
- `src/styles/global.css`
- Pricing unit, component, browser, accessibility, responsive, no-JavaScript, and visual tests

The supplied business-case prompt and shared TextCortex conversation were used only as research
material. No external copy, customer figures, customer identities, product claims, code, or assets
were added.

## 3. Ownership, feedback, failure radius, and timing

- Pilot cohort and value logic live in the framework-independent business-case module.
- The typed rule starts from 20 percent of the entered team, rounds to the nearest person, applies a
  five-person floor and 20-person cap, and never exceeds the entered team size.
- The component receives the approved pilot statement from the pricing page boundary. It does not
  resolve or own claim records.
- The pilot appears only after all three visitor inputs validate. It updates whenever an answer,
  currency, or working-year setting changes.
- The CTA links to the existing demo route and does not serialize assumptions into the URL.
- Calculator values remain local browser state and are not submitted, stored, tracked, or
  persisted.
- The manual fallback explains the pilot rule without pretending that disabled controls work
  without JavaScript.

## 4. Claims and calculation review

- Full-team annual hours equal people multiplied by weekly hours returned and working weeks.
- Full-team annual capacity value equals annual hours multiplied by hourly value.
- Pilot annual hours replace total people with the derived pilot cohort and otherwise use the same
  visitor inputs.
- Pilot annual capacity value equals pilot annual hours multiplied by the visitor's hourly value.
- The public result says the value is estimated and intended for validation. It does not describe
  the annualized figure as value delivered during a shorter pilot period.
- The existing planning disclaimer remains adjacent to all results.
- The recommendation publishes no Zeno price, seat price, rollout timeline, customer benchmark, or
  universal performance assumption.
- New public strings contain no em dash.

## 5. Findings

### PILOT-VISUAL-01: P3, resolved

- **Affected surface:** Completed business-case calculator.
- **User impact:** If the result content was shorter than the calculator wrapper during a state or
  screenshot transition, the wrapper's paper background could appear as a light strip beneath the
  dark result.
- **Preconditions:** Complete the estimate while the calculator changes from its question state to
  its result state.
- **Reproduction:** Inspect the calculator element background at the bottom edge after the result
  height changes.
- **Expected:** The completed calculator has one uninterrupted dark result surface.
- **Actual:** The wrapper retained the question state's paper background.
- **Evidence:** Focused desktop result snapshot review.
- **Root cause:** The wrapper background did not follow the rendered calculator state.
- **Correction:** Apply the dark background to the wrapper whenever it contains the result state.
- **Regression verification:** Updated focused result snapshot and the complete Chromium visual
  suite pass.
- **Status:** Resolved.

## 6. Accessibility, responsive behavior, and trust boundaries

- Pilot values use a semantic description list and the recommendation uses a labeled section.
- The pilot CTA has a descriptive accessible name and a visible keyboard-focus treatment inherited
  from the established button system.
- The result announcement includes pilot seats, annual hours, and annual capacity value.
- Desktop presents the two pilot figures side by side. Mobile stacks them and keeps the CTA in the
  reading flow.
- The completed result was inspected at 1440 pixels and 390 pixels. Automated reflow checks cover
  supported widths and 200 percent text size.
- Automated WCAG A and AA scans report no violations on the business-case page.
- The calculator retains no-JavaScript, invalid-input, custom-value, Back, Edit answers, and
  currency-formatting behavior.

## 7. Verification evidence

- Focused pricing unit and component tests: 20 passed.
- Focused Chromium pricing tests: 11 passed.
- Formatting, ESLint, Astro diagnostics, and strict TypeScript: passed.
- Unit and component coverage: 130 tests passed; 94.45 percent statements, 90.37 percent branches,
  93.63 percent functions, and 96 percent lines.
- Full Playwright suite: 176 tests passed across Chromium, Firefox, and WebKit.
- Chromium visual coverage, including the updated completed calculator snapshot: passed.
- Preview and production Astro builds: 17 routes generated in each mode.
- Client budget: `/pricing` passed at 63.9 KB gzip against a 150 KB budget.
- Governance validation: 6 repository skills and all 14 governance tests passed.

## 8. Anything not verified and risk

- The recommended cohort is a transparent planning heuristic, not a validated customer-specific
  implementation plan. The demo conversation remains the place to confirm the actual cohort and
  success measures.
- No real visitor data was entered or submitted.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session or production field-performance measurement was
  performed. Native semantics, keyboard behavior, automated accessibility, no-JavaScript output,
  responsive reflow, client budgets, and three browser engines provide proportionate evidence.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the pilot recommendation and CTA.
