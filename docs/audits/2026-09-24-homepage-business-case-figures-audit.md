# Feature audit: clearer homepage business-case figures

## Scope and acceptance

- Date: 2026-09-24.
- Base revision: `e518fb7ad5b70f6de4917c99af2683d089ad2482` on `main`; reviewed local changes, not a release.
- Routes: `/` and `/de/`, specifically the four-card business-case section and its shared counter.
- Approved replacement: approximately 92 annual hours per person, explicitly annualized from 20 weekly team hours / 10 people × 46 working weeks; 2,000+ agents created across hundreds of enterprises.
- Exact English and German labels and qualifiers are preserved. Neither figure implies measured individual averages, active agents, completed tasks, or guaranteed savings.
- The remaining two metrics, calculator, customer stories, routes, and release gates are unchanged.
- Reviewed scope: business-case assets and claim records; active and archived German approvals; page-copy lookup; counter helper and motion integration; text-size reflow CSS; unit, browser, and visual tests; maintainer guidance.

## Four invariants

| Invariant      | Ownership or behavior reviewed                                                                                                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | Exact English claims remain in the registry; German statements require matching source-specific approval. Superseded approvals stay internal. Assets reference the new claim IDs only.               |
| Feedback       | Static values and full qualifiers render before enhancement. Animated spans are decorative; the existing screen-reader values remain complete. No forms or new interaction are introduced.           |
| Failure radius | Numeric localization and the motion runtime are shared. Existing range/percentage formatting, last two metrics, both page compositions, and neighboring conversion paths are regression-tested.      |
| Timing         | Build-time claim resolution stays fail-closed. Counters animate on arrival and replay after leaving/re-entering; reduced-motion changes restore approved values. Text-size changes reflow the cards. |

## Evidence

Environment: macOS, Node 24.19.0, pnpm 10.32.1, repository Playwright 1.62.1 Chromium, Firefox, and WebKit projects. Browser checks use the isolated development gateway fixture at port 4322. Tests use synthetic data and do not send live leads.

| Check                          | Command or procedure                                                                                                                                          | Result                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claims and counter regressions | Unit tests in `business-case.test.ts`, `figure-counter.test.ts`, `page-localization.test.ts`, and `localization.test.ts`                                      | Formula, exact bilingual wording, approximation, qualifiers, scope, retired records, approval dates, grouped numbers, ranges, and final strings covered.                      |
| Standard gates                 | `pnpm check`                                                                                                                                                  | Formatting, ESLint, Astro/strict TypeScript, 156 tests across 27 files, preview build, and client budgets passed after the last application edit.                             |
| Coverage                       | `pnpm test:coverage`, included above                                                                                                                          | 94.36% statements, 95.77% lines, 94.63% functions, 88.62% branches.                                                                                                           |
| Governance                     | `pnpm check:governance`                                                                                                                                       | Nine skills validated; 18 Python tests passed. No skill contract changed.                                                                                                     |
| Production-mode compilation    | `CONTENT_MODE=production pnpm exec astro build` then `pnpm check:budgets`                                                                                     | 36 pages generated; budgets passed. This is not release-gate approval or deployment.                                                                                          |
| Project-path preview           | `PUBLIC_SITE_BASE=/zeno-landing PUBLIC_SITE_ORIGIN=https://sen-baris.github.io PUBLIC_PREVIEW_DEPLOY=true pnpm build` then `pnpm check:budgets`               | 36 pages generated; budgets passed. Built English/German HTML retains noindex and the four approved figures without the old values.                                           |
| Client impact                  | Budget report after both builds                                                                                                                               | Homepages 4.4 KB gzip against 75 KB; product 1.7 KB; pricing 63.5 KB; demo 62.6 KB. Homepage change is approximately 0.2 KB gzip. No dependency added.                        |
| Focused browser behavior       | `E2E_PORT=4322 pnpm exec playwright test tests/e2e/business-case-figures.spec.ts --project=chromium --workers=4 --reporter=line`                              | All 12 cases passed after the text-size reflow correction.                                                                                                                    |
| Cross-browser replay stability | `E2E_PORT=4322 pnpm exec playwright test tests/e2e/business-case-figures.spec.ts --grep "animates one quantity" --repeat-each=10 --workers=4 --reporter=line` | 60/60 passed in the final repeated run, covering ten runs per language/browser pair.                                                                                          |
| Full cross-browser suite       | `E2E_PORT=4322 pnpm exec playwright test --workers=4 --reporter=line`                                                                                         | 582/583 passed on the final full invocation. All changed-feature cases passed. One intermittent unchanged Resources-menu case failed; its ten isolated reruns passed. See F4. |
| Navigation failure rerun       | `E2E_PORT=4322 pnpm exec playwright test tests/e2e/resources.spec.ts --project=webkit --grep "en dropdowns" --repeat-each=10 --workers=2 --reporter=line`     | 10/10 passed without changing navigation source or tests.                                                                                                                     |
| Visual baselines               | Focused figures in both languages at 390, 768, 1101, and 1440px; affected full homepage snapshots                                                             | Eight new focused snapshots and five updated homepage snapshots reviewed visually. Normal-size layout stays 1/2/4/4 columns.                                                  |
| Enlarged text                  | Both homepages at the same four widths with 200% root text size; screenshot inspection and text-bound assertions                                              | All eight language/width combinations reviewed. Layout becomes 1/1/2/2 columns; qualifiers remain readable without clipped text or overlap.                                   |
| Fallback and accessibility     | Exact visible/static accessible values, reduced-motion initial state and change, JavaScript disabled                                                          | Full approved numbers and qualifiers remain present; grouping is preserved; no new focus target or live announcement is added.                                                |
| Scope integrity                | Git diff and generated-page inspection                                                                                                                        | Calculator/customer sources and release-gate implementation unchanged. Local-only LinkedIn exports remain ignored and untouched.                                              |

Full-page English desktop/tablet/mobile and German desktop/mobile images retain the same section order and surrounding design. The focused German 1101px card can place the existing projected-savings unit on a second line; it remains readable. Enlarged text deliberately uses wider rows rather than compressing four columns. Existing conversion-placement, keyboard, accessibility, and paired-page coverage is included in the full suite; this change does not reposition either form.

## Findings and corrections

### F1: German grouped number bypassed the translation catalog

- Severity: P2. Surface: `page-copy.ts`, German homepage figure.
- User impact: the approved `2.000+` would render with the English separator.
- Preconditions: a numeric-only public string with an explicit localized catalog entry.
- Reproduction: (1) map `2,000+` to `2.000+`; (2) call `translatePageText('de', '2,000+')` before the correction.
- Expected: the approved localized value. Actual: the numeric passthrough returned `2,000+` before consulting the catalog.
- Evidence/cause: lookup order and failing exact-copy regression.
- Correction: consult an explicit catalog entry before applying the numeric-only passthrough. Missing textual translations still fail closed.
- Verification: exact German unit/browser expectations, approval resolution, full localized-page checks.
- Status: fixed.

### F2: Grouped agent count was treated as separate digit runs

- Severity: P3. Surface: shared counter runtime.
- User impact: transient values did not represent one steadily increasing quantity.
- Preconditions: a formatted count such as `2,000+` or `2.000+` entering the viewport.
- Reproduction: (1) apply the previous digit-only split to either value; (2) render progress halfway through the animation.
- Expected: `1,000+` or `1.000+`. Actual: the `2` and `000` groups were independently interpolated.
- Evidence/cause: the prior `/([0-9]+)/` tokenizer did not recognize grouping separators.
- Correction: a locale-aware pure counter helper parses grouped quantities, preserves surrounding markers/ranges/units, and restores the approved string exactly at completion.
- Verification: quarter/half/three-quarter progress unit cases in both locales; monotonic browser-frame sampling and replay; unchanged percentage/range results.
- Status: fixed, not deferred.

### F3: Four narrow desktop columns made enlarged qualifiers difficult to read

- Severity: P2. Surface: four-card business-case grid, especially 1101px at 200% text size.
- User impact: excessive word splitting despite no horizontal page overflow.
- Preconditions: desktop viewport with doubled root text size.
- Reproduction: (1) open either homepage at 1101px; (2) increase root text to 200%; (3) inspect the figures and qualifier wrapping.
- Expected: wide readable cards and complete qualifiers. Actual: fixed pixel breakpoints retained four cramped columns.
- Evidence/cause: screenshot review exposed the issue after the overflow test had passed; grid breakpoints depended only on viewport pixels.
- Correction: named text-relative container queries reflow only the four-card variant into two or one column. Dividers follow the new rows.
- Verification: explicit column-count and visible text-bound checks at 100% and 200%, plus visual review of both languages at all four widths. Normal-size snapshots retain the intended layout.
- Status: fixed.

### F4: Intermittent WebKit Resources-menu test failure

- Severity: P3. Surface: unchanged `resources.spec.ts` keyboard-toggle case and header dropdown.
- Impact: the full-suite invocation is not an unqualified green run. A possible brief hover/keyboard timing edge remains for investigation; no persistent navigation or conversion failure was reproduced.
- Preconditions: WebKit under the four-worker full suite, after hovering the menu, dismissing it with Escape, moving the pointer away, and rapidly toggling with Enter/Space.
- Reproduction: (1) run the full command above; (2) observe `en dropdowns are exclusive and support hover, click, focus exit and keyboard`; (3) at line 57, check closure after the second keypress. One failure occurred. Ten subsequent isolated repetitions did not reproduce it.
- Expected: the second keypress closes the menu. Actual: `open` remained present for the assertion timeout on that run.
- Evidence: Playwright's failure log and retained trace at the time of failure; ten subsequent successful reruns. Header source and this test are unchanged from the base revision.
- Supported hypothesis: the existing delayed hover-close timer may intersect rapid keyboard toggling. This is not confirmed as the cause and is not attributable to the new counter based on the available evidence.
- Correction/follow-up: instrument hover-close and keyboard event timing in a separate navigation task; add a deterministic reproducer before editing the shared header. Do not weaken or skip the test.
- Safe workaround: Escape or outside click closes the menu; both are covered by the repeated interaction checks.
- Status: documented P3 follow-up. Owner: website maintainer/product team. Investigate before the next navigation change or production release audit.

## Test-harness corrections and reruns

- A draft text-bound assertion counted the clipped screen-reader twin as visible text. It now measures only the visible number in the value paragraph and still verifies the static accessible twin separately.
- An existing approval-date assertion assumed every German record was approved on September 22. The two new IDs explicitly require the September 24 approver/date; all other IDs retain the original exact assertions.
- The first full browser attempt overlapped a production build. The shared Vite cache then supplied a mismatched React development runtime, producing `_jsxDEV` hydration failures in unchanged calculator/demo code. That run was stopped and is not a pass. All builds were completed before fresh `--force` development-server browser runs. The maintainer guide now documents this ordering constraint.
- The next full run passed 582/583 cases. One WebKit replay sampler captured the previous animation's exact-string restoration before the next arrival began. Rounded display text can reach its final integer just before that restoration. The sampler now waits for the new animation to leave the static target before recording progression, without a fixed delay or relaxed monotonic assertion. All 60 final repeated runs and all figure cases in the final full suite passed.
- An intermediate repeated run was interrupted in two Firefox cases by navigation while documentation was being edited under the development watcher (58/60 passed). No application edit was required; the repeated run with no concurrent file edits passed 60/60. Browser runs should use a stable working tree as well as a fresh dependency cache.

## Final verification and limitations

- Application, claims, and CSS changes were covered by the standard checks and both builds after the reflow fix. Later edits only adjusted test sampling and documentation.
- Final browser evidence is recorded above, including F4 rather than presenting the full run as wholly green. Formatting, lint, strict types, governance, and `git diff --check` passed after the replay-test correction. Final report formatting was checked separately.
- Screen-reader semantics are asserted automatically; a manual speech-output session was not performed.
- Owner-supplied metric evidence was not independently audited. The record retains the required measurement/population/export review before production release. This implementation does not convert an annualized estimate into an observed individual average.
- No live email, production hosting, GitHub push, or release authorization was exercised. Unrelated release constraints remain in force.

## Decision

PASS for the homepage figures change, with the documented P3 follow-up F4. All requested figure behavior is verified and no unresolved P0-P2 remains in this change. This is not approval for production release.
