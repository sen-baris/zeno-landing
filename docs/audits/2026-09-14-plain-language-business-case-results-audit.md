# Plain-language business-case results feature audit

## Scope and acceptance criteria

- Audited the completed business-case hierarchy, the pilot recommendation, the optional annual
  budget comparison, and the homepage and pricing readiness destinations.
- Required the estimated yearly value of recovered time to be the dominant result, with annual
  hours and the visitor's assumptions immediately adjacent.
- Required the pilot to remain an annualized planning estimate to validate, not a promised cash
  return, saving, price, or implementation outcome.
- Required the pilot sizing rule to remain transparent without competing with the main result.

## Boundaries reviewed

- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/lib/pricing/business-case.ts`
- `src/lib/content/pricing.ts`
- `src/lib/claims/registry.ts`
- `src/pages/pricing.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- Pricing unit, component, browser, accessibility, responsive, no-JavaScript, and visual tests

## Ownership, feedback, failure radius, and timing

- Framework-independent calculation logic continues to own full-team and pilot arithmetic.
- The calculator presents approved statements resolved at the pricing page boundary.
- The result receives keyboard focus through its heading after the final answer and announces the
  yearly value, hours, and pilot recommendation through a polite live region.
- Back and Edit answers preserve visitor choices. Calculation settings and the annual budget remain
  secondary native disclosures.
- Calculator inputs remain local browser state. No request, storage write, analytics event, or URL
  serialization was added.
- The no-JavaScript fallback retains the formulas, pilot sizing rule, disclaimer, and demo path.

## Calculation and claims review

- Full-team annual hours remain people multiplied by hours returned per person each week and working
  weeks.
- The yearly value remains annual hours multiplied by the visitor's hourly value.
- The 18-person example produces 1,656 hours and €82,800. Its five-person pilot produces 460 hours
  and €23,000.
- The public result uses “estimated value of recovered time” and “yearly time value.” Internal type
  names do not appear in the visitor-facing result.
- The optional ROI remains yearly value minus the visitor's annual budget, divided by that budget.
- The planning disclaimer stays adjacent to the result, and the pilot copy explicitly frames the
  figure as a value to validate.
- New public strings contain no em dash.

## Findings

### BUSINESS-CASE-FORMAT-01: P3, resolved

- **Affected surface:** Completed business-case assumptions.
- **User impact:** Whole-number hourly inputs appeared with unnecessary decimal zeros, making the
  summary less consistent with the option the visitor selected.
- **Preconditions:** Select a whole-number hourly-value preset and complete the estimate.
- **Reproduction:** Complete the 18-person example with €50 per hour.
- **Expected:** The assumptions sentence says €50 per hour.
- **Actual:** The first implementation said €50.00 per hour.
- **Evidence:** Component-test output for the exact 18-person assumptions sentence.
- **Supported cause:** Currency formatting allowed decimal precision but retained the formatter's
  default two-decimal minimum.
- **Correction:** Set the minimum fraction digits to zero while retaining up to two digits for
  custom decimal values.
- **Regression verification:** The exact assumptions sentence now passes in component and browser
  coverage.
- **Status:** Resolved.

## Accessibility, responsive behavior, and trust boundaries

- Money is presented first visually, while the semantic reading order remains heading, label,
  value, time explanation, and assumptions.
- The result and pilot have semantic section labels and descriptive links with established visible
  focus treatment.
- Automated reflow coverage completes the result at 390, 768, 1280, and 1440 pixels and repeats the
  check at 200 percent text size.
- Focused desktop and mobile snapshots were reviewed after updating the result hierarchy.
- Automated WCAG A and AA scans report no violations on the business-case page.
- Homepage and pricing readiness actions both resolve to `/ai-readiness`; the pilot action resolves
  to `/demo`.

## Verification evidence

- Focused pricing unit and component tests: 22 passed.
- Focused Chromium pricing tests: 13 passed.
- Formatting, ESLint, Astro diagnostics, and strict TypeScript: passed.
- Unit and component coverage: 132 tests passed; 94.46 percent statements, 90.34 percent branches,
  93.63 percent functions, and 96.01 percent lines.
- Preview and production Astro builds: 17 routes generated in each mode.
- Client budget: `/pricing` passed at 64.1 KB gzip against a 150 KB budget.
- Governance validation: 6 repository skills and all 14 governance tests passed.
- Full cross-browser Playwright rerun: 183 passed across Chromium, Firefox, and WebKit. An initial
  WebKit assessment timeout passed in isolation before the successful full rerun.

## Remaining risk

- All figures depend entirely on visitor inputs and remain planning estimates. The disclaimer makes
  this boundary explicit.
- No real visitor data was entered or submitted.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session or production field-performance measurement was
  performed. Native semantics, keyboard tests, automated accessibility checks, no-JavaScript
  output, responsive reflow, client budgets, and three browser engines provide proportionate
  evidence.

## Decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the plain-language business-case result
and readiness CTA revision.
