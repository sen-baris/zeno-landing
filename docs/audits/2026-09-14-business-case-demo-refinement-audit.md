# Business case and demo refinement feature audit

## 1. Scope and acceptance criteria

- Audited the shared header, all three guided business-case questions, the optional annual budget
  comparison, and the demo contact form.
- Required Business case to replace Assess readiness in the header while preserving the readiness
  route and footer link.
- Required compact native radio choices for team size, weekly hours returned, and hourly value,
  with no initial performance assumptions and retained custom entries.
- Required a transparent annual comparison that does not overstate capacity value as guaranteed
  savings or present a recurring annual budget as a one-time investment.
- Required the demo form to stop asking for a priority workflow, collect a full name, offer an
  optional phone number, preserve existing resilience, and retain known assessment context without
  asking for it again.

## 2. Files and boundaries reviewed

- `src/components/Header.astro`
- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/components/islands/DemoForm.tsx`
- `src/lib/content/pricing.ts`
- `src/lib/pricing/business-case.ts`
- `src/lib/leads/types.ts`
- `src/lib/leads/validation.ts`
- `src/lib/claims/registry.ts`
- `src/styles/global.css`
- Unit, component, funnel, pricing, accessibility, responsive, and visual tests

The supplied Harvey screenshot informed only the two-column contact-form rhythm. No external code,
copy, asset, script, or dependency was used.

## 3. Ownership, feedback, failure radius, and timing

- Preset options live in typed pricing content. Calculator formulas and validation remain
  framework-neutral, while temporary answers remain inside the React island.
- Every calculator step uses native radio semantics, visible selection and focus states, explicit
  Continue behavior, inline errors, and a focused custom field when selected.
- The team-size ranges disclose the rounded representative value. Weekly-hour and hourly-value
  presets use the exact value printed on the choice.
- Currency changes formatting only. Calculator values are not submitted, persisted, tracked, or
  placed in the URL.
- Demo validation owns the required full name, email, company, and acknowledgement. Phone number
  is optional and validated only when entered.
- Existing assessment context remains local until submission and can supply the known workflow to
  the lead payload without displaying or requesting that question again.
- Shared-header changes were checked across its exact desktop and mobile breakpoints. Form changes
  retained disabled pre-hydration output, no-JavaScript messaging, abort cleanup, duplicate-submit
  protection, failure recovery, and retry.

## 4. Claims, privacy, and calculation review

- The approved calculator method now describes all selectable inputs, the team-size midpoint, and
  the optional annual budget comparison.
- Annual hours returned equal people multiplied by weekly hours returned and working weeks.
- Annual capacity value equals annual hours returned multiplied by hourly value.
- ROI against the entered annual budget equals annual capacity value minus annual budget, divided
  by annual budget. This standard equation is printed beside the result.
- The annual budget field explicitly states that it is a visitor-owned planning input and not Zeno
  pricing.
- The existing planning disclaimer and local-data statement remain next to the results.
- The demo data-use acknowledgement remains required and applies to the added contact details.
  Marketing remains false and an empty phone number is omitted from the lead payload.
- New public strings contain no em dash.

## 5. Findings

### BUSINESS-CASE-01: P2, resolved

- **Affected surface:** Optional budget comparison result.
- **User impact:** Estimated payback could appear more certain than the inputs supported because an
  annual recurring budget was treated like a one-time investment.
- **Preconditions:** Complete the calculator and enter an annual comparison amount.
- **Reproduction:** Inspect the previous result, which divided annual budget by annual capacity
  value and expressed the quotient as months to payback.
- **Expected:** The comparison uses a standard equation whose meaning follows directly from two
  annual values.
- **Actual:** ROI was standard, but the adjacent payback output introduced a different investment
  interpretation.
- **Evidence:** Both public inputs are annual figures and no one-time implementation cost is
  collected.
- **Correction:** Removed payback from the type, calculation, live announcement, and result UI.
  Renamed the internal and public input to annual budget and printed the ROI equation beside it.
- **Regression verification:** Unit, component, and browser tests assert the standard ROI result,
  its explanation, and the absence of payback.
- **Status:** Resolved.

### DEMO-01: P2, resolved

- **Affected surface:** Direct demo submission confirmation.
- **User impact:** The success message claimed that workflow context had been captured even after
  the workflow question was removed.
- **Preconditions:** Submit the demo form directly without stored assessment context.
- **Reproduction:** Follow the direct demo path with only contact details.
- **Expected:** Confirmation accurately reflects the data supplied.
- **Actual:** The earlier message referred to workflow context.
- **Evidence:** A direct request now submits an empty intent object unless optional planning context
  is supplied.
- **Correction:** Reworded the confirmation to state only that the details needed for the next step
  were received.
- **Regression verification:** Direct synthetic and gateway submission tests pass, including
  failure and retry.
- **Status:** Resolved.

### CONTROLS-01: P3, resolved

- **Affected surface:** Guided calculator choices.
- **User impact:** Each bordered choice repeated its selected affordance with an extra radio circle,
  making a compact decision feel visually heavy.
- **Preconditions:** View any calculator question.
- **Reproduction:** Inspect the earlier team-size choices.
- **Expected:** The card itself communicates selection while native radio semantics remain intact.
- **Actual:** Both the card border and a visible circular indicator competed for attention.
- **Evidence:** Desktop and mobile before-and-after visual inspection.
- **Correction:** Kept the native radio controls but made the flat card border, subtle fill, and
  left accent communicate selection. Reduced control height and removed the decorative circle.
- **Regression verification:** Keyboard, pointer, focus, validation, and updated visual tests pass.
- **Status:** Resolved.

### CONTENT-01: P3, resolved

- **Affected surface:** Typed calculator question content.
- **User impact:** No direct visitor defect. The old numeric input label remained in content after
  every guided question moved to choices, creating stale duplicate copy for future changes.
- **Preconditions:** Maintain or extend the calculator content.
- **Reproduction:** Inspect the question record after the choice migration.
- **Expected:** Typed content contains only fields consumed by the rendered interface.
- **Actual:** `inputLabel` was no longer used.
- **Correction:** Removed the obsolete property from the type and every question record.
- **Regression verification:** Strict TypeScript and the full test suite pass.
- **Status:** Resolved.

## 6. Responsive, accessibility, and interaction review

- Business case is the final primary navigation item and uses an evidence-colored underline rather
  than a filled or rounded pill. Assess readiness is absent from both header modes.
- The desktop header, mobile disclosure, Solutions behavior, Sign in, and Book a demo remain usable
  with keyboard and pointer input.
- Choice groups expose native radios with visible focus, a selected card state, no automatic step
  advance, retained Back and Edit answers, and focused custom inputs.
- The demo form presents a balanced two-by-two contact grid on desktop and one column on mobile.
  Phone number uses `type="tel"` and suitable autocomplete metadata.
- The pricing and demo pages have no horizontal overflow at supported widths or at 200 percent text
  size. Automated WCAG A and AA scans report no violations.
- Updated desktop, tablet, mobile, result, header, and demo snapshots were inspected.

## 7. Verification evidence

- Focused unit and component tests: 41 passed.
- Focused Chromium navigation, calculator, and demo tests: 9 passed.
- Formatting, ESLint, Astro diagnostics, and strict TypeScript: passed.
- Unit and component coverage: 129 tests passed; 94.38 percent statements, 90.40 percent branches,
  93.58 percent functions, and 95.95 percent lines.
- Full Playwright suite: 176 tests passed across Chromium, Firefox, and WebKit.
- Updated Chromium visual suite: 32 tests passed.
- Preview and production Astro builds: 17 routes generated in each mode.
- Client budgets: `/pricing` passed at 63.5 KB gzip and `/demo` passed at 61.7 KB gzip, each against
  a 150 KB budget.
- Governance validation: 6 repository skills and all 14 governance tests passed.

## 8. Anything not verified and risk

- No real visitor information was submitted. Adapter behavior was verified with synthetic data and
  deterministic test responses.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session or production field-performance measurement was
  performed. Native semantics, keyboard flows, automated accessibility, no-JavaScript output,
  responsive reflow, client budgets, and all three browser engines provide proportionate evidence.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the business-case, navigation, and demo
refinement.
