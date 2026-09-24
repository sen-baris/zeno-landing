# Feature audit: concise homepage savings qualifier

## Scope and acceptance

Date: 2026-09-24. This follow-up reviews the local wording change on top of the uncommitted
[homepage figures revision](2026-09-24-homepage-business-case-figures-audit.md), based on commit
`e518fb7ad5b70f6de4917c99af2683d089ad2482`.

The user requested a short, ideally single-line qualifier without visible methodology. English
now reads **Annualized team estimate**; German reads **Hochrechnung auf Teambasis**. The approximate
92-hour value and annual per-person label are unchanged. The calculation remains in internal
evidence. The suggested 150-enterprise measurement is not added because no such measurement was
supplied. Scope remains `home.business-case` only.

Changes are limited to the qualifier, corresponding German catalog/approval note, maintainer
guidance, exact-copy tests, and affected snapshots. No markup, CSS, formula, motion, route,
calculator, customer article, or other metric changed in this follow-up.

## Four invariants

| Invariant      | Review                                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | The claim registry owns the visible qualifier and internal calculation. German copy uses the same claim and limited approval. |
| Feedback       | Visitors see a short estimate qualifier, not a new measured-average claim. Static accessible figures remain unchanged.        |
| Failure radius | English and German homepages only. Shared numeric formatting and counter code are unchanged from the preceding revision.      |
| Timing         | Static copy renders before JavaScript. No new listener, request, storage, or hydration behavior.                              |

## Verification

- Red/green: the revised `business-case.test.ts` first failed two exact-copy assertions against
  the long qualifier. All ten targeted tests passed after the content update.
- Added browser coverage checks the qualifier occupies one line at normal text size at 390,
  768, 1101, and 1440px in both languages. Enlarged text is allowed to wrap naturally.
- Rendered-content assertions reject the removed public methodology and the unsupported
  150-enterprise suggestion. Unit coverage retains the 20 / 10 × 46 = 92 calculation internally.
- `pnpm check`: formatting, lint, strict types, all 156 unit/component tests, coverage, preview
  build, and budgets passed. Coverage is 94.36% statements, 95.77% lines, 94.63% functions,
  and 88.62% branches.
- `CONTENT_MODE=production pnpm exec astro build` and `pnpm check:budgets`: passed, 36 pages.
  This verifies compilation, not authorization for production release.
- `E2E_PORT=4322 pnpm exec playwright test tests/e2e/business-case-figures.spec.ts --workers=4 --reporter=line`:
  all 36 Chromium, Firefox, and WebKit cases passed, including exact copy, single-line qualifier,
  200% text reflow, grouped animation/replay, reduced motion, and no JavaScript.
- `E2E_PORT=4322 pnpm exec playwright test tests/e2e/funnel.spec.ts --grep "business case publishes|business case figures count" --workers=4 --reporter=line`:
  all six existing figure regressions passed across the three browsers.
- `E2E_PORT=4322 pnpm exec playwright test tests/e2e/business-case-figures-visual.spec.ts tests/e2e/visual.spec.ts tests/e2e/localization-visual.spec.ts --project=chromium --grep "homepage business-case figures|homepage product narrative|German home complete composition" --update-snapshots=all --workers=4 --reporter=line`:
  13 selected snapshots refreshed. All eight focused English/German cards were visually reviewed
  at 390, 768, 1101, and 1440px, along with five complete-homepage compositions. The new qualifier
  stays on one line at normal text size, the card rhythm stays intact, and no overlap or clipping
  was observed. The existing German savings unit still wraps at 1101px, unchanged from the prior
  revision. Baselines were accepted after review.

Environment: macOS, Node 24.19.0, pnpm 10.32.1, Playwright 1.62.1. Local preview was stopped
before builds to avoid the shared development/production cache conflict, then restarted after QA.

## Audit findings and limitations

No additional application defect was identified in this narrow copy change. The initial new
single-line assertion measured paragraph height, including its existing 9px top padding, and
therefore failed 24 layout cases despite one-line text. The assertion was corrected to measure
the visible text range against line height, without changing production styles. All 36 cases
then passed. This was a test-measurement correction, not a relaxed wrapping threshold.

The prior report's intermittent Resources-menu P3 follow-up remains outside this wording change.
No navigation implementation is altered. This report does not present prior full-suite evidence
as a new run. The full 583-case suite was not repeated for this static qualifier-only edit;
the affected cross-browser, fallback, and visual tests were rerun. No production deployment,
GitHub push, or independent audit of owner-supplied
metric data is included. Production evidence requirements and release gates remain unchanged.

## Decision

PASS. No unresolved P0-P2 in this change. The estimate remains qualified, its internal basis
is retained, and both language variants meet the requested concise presentation.
