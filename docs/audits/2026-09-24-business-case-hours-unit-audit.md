# Feature audit: visible hours unit

## Scope and acceptance

Date: 2026-09-24. Base revision: `3387b47f81046ba0f20b266033a05fcef0ca6f00`.
Routes: `/` and `/de/`, first homepage business-case card only.

The owner requested the hours unit alongside the prominent 92 figure, with the per-person
savings information underneath, in both languages. The revised presentation is:

- English: `~92 hrs`, then `saved per person each year`.
- German: `~92 Std.`, then `Zeitersparnis pro Person und Jahr`.

The approximation, short annualized-team qualifier, internal 20 / 10 × 46 calculation, approval
surfaces, and release requirements stay unchanged. The other three figures, calculator, customer
articles, routes, shared components, CSS, and animation implementation are unchanged.

Reviewed files: display assets, exact English claim statement, German translation and approval
snapshot, maintainer guide, related unit/browser assertions, and selected homepage snapshots.

## Four invariants

| Invariant      | Review                                                                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | Claim records and display assets agree on the new unit placement. German has an explicit approved value translation, not a fallback.                  |
| Feedback       | Hours are understandable from the large figure alone. The separate static accessible value also contains the localized unit.                          |
| Failure radius | This is a display-text change. No calculation, customer metric, form, request, or route changes.                                                      |
| Timing         | Server output includes the unit. The existing counter preserves it during animation and replay, including reduced-motion and no-JavaScript fallbacks. |

## Verification

- Red/green: three exact-copy tests failed against the old unitless value before implementation.
- Updated tests cover the value/label split, identical 92-hour calculation, exact German approval,
  unit preservation at halfway/final count-up progress, and static accessible values.
- Browser coverage checks the number and its unit form one visible line at normal text size
  across 390, 768, 1101, and 1440px, plus 200% text reflow without clipping.
- `pnpm check`: formatting, lint, strict Astro/TypeScript checks (134 files, no diagnostics),
  156 unit/component tests, coverage, preview build, and client budgets passed.
- Coverage: 94.36% statements, 95.77% lines, 94.63% functions, 88.62% branches.
- `pnpm check:governance`: nine skills validated and 18 validator tests passed.
- `CONTENT_MODE=production pnpm exec astro build` and `pnpm check:budgets`: passed with
  36 pages. This is compilation verification, not production-release approval.
- Affected cross-browser checks: 36 bilingual business-case tests and six existing figure
  content/count-up/replay tests passed across Chromium, Firefox, and WebKit.
- Thirteen affected Chromium visual snapshots updated and visually reviewed: both figure
  grids at 390, 768, 1101, and 1440px; English complete homepages at 390, 768, and 1440px;
  German complete homepages at 390 and 1440px. The localized hours units remain beside 92
  at normal text size, with no clipping or unintended changes to the other cards.
- Post-review reruns: all 13 visual comparisons passed without updating snapshots. All eight
  Chromium reflow cases passed again; the 390px and 1440px 200%-text captures were inspected
  in both languages. Final formatting and whitespace-diff checks passed.
- Environment: macOS, Node 24.19.0, pnpm 10.32.1, repository Playwright browsers, local
  test server on port 4322. Development and production checks ran sequentially to avoid
  sharing incompatible Vite cache state.

## Findings and limitations

The requested issue was a P3 presentation problem: the large standalone `~92` did not communicate
its unit until the visitor read the smaller label. It is reproduced by viewing the first card at
the base revision. The correction moves the unit into the display value and removes it from the
supporting label; the meaning is not broadened. Regression tests and reviewed paired screenshots
verify the correction. Status: fixed. No new P0-P2 findings remain in this scope.

The previously documented intermittent Resources-menu P3 follow-up remains outside this change;
neither its source nor its tests are edited. Underlying owner-supplied metric data is not
independently audited here. The entire site-wide browser suite was not rerun for this isolated
display-text revision; affected cross-browser behavior and visual checks were run instead.
The requested GitHub push updates the temporary noindex preview,
not the production release gates or legal/evidence readiness.

## Decision

PASS for the scoped bilingual display change. Production release gates remain unchanged.
