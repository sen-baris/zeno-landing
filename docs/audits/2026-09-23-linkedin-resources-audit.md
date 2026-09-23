# LinkedIn banner kit and Resources navigation audit

## Scope and acceptance

- Date: 2026-09-23. Base revision: `293a095f962ae124a301f1f60f295ee45cb89765`.
- Scope: six repository-owned LinkedIn banners, native editable sources and exporter, marketing
  skill and approval records, shared EN/DE Resources navigation, responsive header/footer styles,
  regression tests, snapshots, and maintainer documentation.
- Acceptance: three paired banner concepts with exact approved copy; correct dimensions, fonts,
  byte limits, and reviewed crops; exact safe external links in both languages; independent native
  dropdowns with single-menu expansion; four/two/one footer columns; no desktop label collisions.
- Routes, SEO, locale publication, calculator formulas, lead delivery, and release gates are
  unchanged. The shared shell affects all pages. No GitHub push, deployment, or account upload is
  authorized by this task.
- Unrelated existing untracked scratch directories were left untouched.

## Four invariants

| Invariant      | Reviewed ownership and behavior                                                                                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ownership      | `resources.ts` owns the three bilingual destinations. Exact claims independently authorize labels and URLs. The banner manifest owns placements and copy, checked against two narrow LinkedIn claims. HTML/CSS and local licensed fonts own the artwork.                                |
| Feedback       | Native summaries expose expansion state. Links include localized new-tab announcements. Hover and visible focus remain available. Mobile Resources is a visible labeled group. Export errors stop invalid deliverables.                                                                 |
| Failure radius | Shared shell changes require EN/DE and whole-site snapshots. External links use `noopener noreferrer`; no embeds, tracking, persistence, or additional requests are introduced before a click. Marketing files are outside the public build.                                            |
| Timing         | Static markup works before hydration and without JavaScript. Named details provide native exclusivity. The enhancement clears hover timers on close/page exit and retains listeners for back/forward-cache restoration. The exporter waits for fonts and image decoding before capture. |

## Verification environment

macOS, Node 24.19.0, pnpm 10.32.1, locked Playwright 1.62.1. Browser projects are Chromium,
Firefox, and WebKit. The exported PNG report records Chromium 151.0.7922.34. Browser tests use
an isolated local Astro server on port 4322, synthetic lead fixtures, and mocked external resource
navigation. They do not contact customer accounts or send real leads.

## Findings and corrections

### R1: P2, enlarged header labels collided with actions

- Surface and impact: both localized desktop headers, especially German at intermediate widths.
  At 200% root text size, navigation could overlap Sign in and Book a demo.
- Reproduction: open `/de/business-case` at 1101px, set the root text size to 200%, and compare
  the primary links and header-action rectangles.
- Expected: every label remains readable and every action independently reachable. Actual:
  the fixed single-row layout allowed intersecting text/action rectangles.
- Supported cause: the enlarged navigation had no wrap opportunity inside the grid.
- Correction: allow additional navigation rows at enlarged text sizes, preserve label sizes,
  and use content-aware grid sizing and tighter intermediate gaps. Default desktop height remains
  76px plus the existing 1px border; the original mobile breakpoint remains 1100px.
- Verification: `resources.spec.ts` checks EN/DE at 390, 768, 1101, 1280, and 1440px, including
  no-JavaScript enlarged text, pairwise header collisions, footer overflow, and reachable actions.
- Status: fixed.

### R2: P2, personal banner wordmark was too close to the crop edge

- Surface and impact: the first profile compositions risked losing part of the wordmark in
  a narrow center crop even though the full PNG was valid.
- Reproduction: render the first artwork through the 88% center-crop review with photo overlay.
- Expected: all essential text survives the documented crop simulation. Actual: the wordmark
  sat outside the conservative edge allowance.
- Cause: its initial horizontal coordinate did not include sufficient crop margin.
- Correction: move the profile wordmark inward, enforce conservative text bounds, and enlarge
  the small product-motif labels for realistic display size.
- Verification: inspected all six final PNGs, the comparison, and every full/cropped pair in
  `marketing/linkedin/exports/crop-review.png`. Export checks now reject out-of-bounds text.
- Status: fixed. Actual LinkedIn upload previews remain a separate account-owner check.

### R3: P2, exporter failed after a browser-evaluation helper was added

- Surface and impact: `pnpm marketing:linkedin` could not regenerate the required kit.
- Reproduction: execute the exporter after the first contrast-check implementation.
- Expected: a reproducible export or an actionable asset validation error. Actual: the browser
  reported an undefined `__name` helper from the TypeScript transform.
- Cause: a named local function was serialized into browser evaluation without its transform
  helper.
- Correction: calculate luminance inside anonymous map callbacks with no external runtime helper.
- Verification: two consecutive exports completed and all six PNG SHA-256 hashes matched.
  Minimum measured text contrast is 9.92:1, above the enforced 4.5:1 threshold.
- Status: fixed.

### R4: P3, certification sentences could run together

- Surface and impact: homepage certification attribution. Before/after baseline review revealed
  `Zeno.The certificates` in English. The source predated this task, but accepting new shell
  baselines would have hidden the readability regression.
- Reproduction: read `.certification-attribution` after rendering the two adjacent Astro
  expressions; compare the homepage snapshots around the security teaser.
- Expected: a space separates the two approved sentences. Actual: implicit source whitespace
  was not reliably preserved between expressions.
- Correction: add an explicit separator without rewriting either approved sentence.
- Verification: targeted EN/DE rendered-text assertions and reviewed homepage baselines.
- Status: fixed. EN/DE text assertions pass in all three browsers. The five full homepage
  baselines were regenerated explicitly after the fix so even this sub-threshold whitespace
  change is represented accurately.

## Evidence and review

| Check                         | Command or procedure                                                                                                                           | Observed result                                                                                                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Governance                    | `pnpm check:governance`                                                                                                                        | Nine registered skills validated; 18 Python tests passed.                                                                                                                          |
| Unit/component and core gates | `pnpm check`                                                                                                                                   | Formatting, ESLint, strict Astro/TypeScript, 148 tests, preview build, and all client budgets passed. Coverage: 94.23% statements, 95.68% lines, 94.52% functions, 88.3% branches. |
| Production-mode generation    | `CONTENT_MODE=production pnpm exec astro build`                                                                                                | 36 static pages generated. This is not the gated production-release command or a release authorization.                                                                            |
| Project-path preview          | `PUBLIC_SITE_BASE=/zeno-landing PUBLIC_SITE_ORIGIN=https://sen-baris.github.io PUBLIC_PREVIEW_DEPLOY=true pnpm build`                          | 36 pages generated; client budgets passed with the project base path.                                                                                                              |
| Banner export                 | `pnpm marketing:linkedin`                                                                                                                      | Six exact-size PNGs, 40.6 to 108.4 kB. All used fonts loaded, exact headline matched, text bounds and contrast passed. Repeated export produced identical hashes.                  |
| Focused visuals               | `E2E_PORT=4322 pnpm exec playwright test tests/e2e/resources-visual.spec.ts --project=chromium --workers=4 --update-snapshots --reporter=line` | 10 tests passed. All 20 focused EN/DE header/footer images inspected at the five requested widths.                                                                                 |
| Full cross-browser regression | `E2E_PORT=4322 pnpm exec playwright test --workers=4 --reporter=line`                                                                          | Final result recorded below.                                                                                                                                                       |

The first full snapshot run passed 525 of 530 tests. Three tests still expected the old three-group
footer and were corrected to assert the new four-group structure. Two axe checks encountered a
destroyed execution context while a concurrent Astro type/build check restarted the development
runtime. The final browser run is isolated from type checks and builds rather than suppressing
those failures or relaxing assertions. An intermediate run passed 535 of 536 tests: a Firefox
calculator test observed two page navigations while marketing export/document files were being
written in the watched workspace. Its focused rerun passed. The final untouched-workspace run
passed all 536 tests without retrying or weakening any assertion.

Visual review covered EN/DE expanded Resources headers and footers at 390, 768, 1101, 1280, and
1440px, visible keyboard focus, and enlarged text. Mobile navigation can scroll internally so the
new links do not hide the demo action. Generated mobile footer captures initially included the
sticky header; the capture now sizes the viewport to show the entire footer below the header.
All changed existing page baselines were reviewed in header/footer contact sheets. Body pixels
were compared separately: the only unexpected differences were the certification whitespace
described in R4. Existing page content and conversion placement otherwise remain intact.

The browser coverage also checks exact bilingual accessible link names and destinations, safe
isolated popup behavior, hover, repeated click, Enter, Space, Escape, outside click, focus exit,
native no-JavaScript behavior, and single-menu expansion. The broader suite covers reduced-motion
journeys, first-screen conversion, calculator privacy, and demo failure/retry behavior.

## Limitations and retained boundaries

- LinkedIn's current official company guide recommends 1512 × 256. The accepted plan explicitly
  requested 4200 × 700, so that high-resolution deliverable is retained and its slight crop to the
  current display ratio is simulated. The README cites the official source and checked date;
  it does not describe 4200 × 700 as LinkedIn's current recommendation.
- Crop and photo overlays are conservative simulations, not guarantees for every LinkedIn UI.
  No account upload was performed. Confirm the actual desktop/mobile preview before publishing.
- The system skill-creator quick-validation helper needs PyYAML, which is not installed. No
  dependency was added. The repository's required standard-library validator and governance
  tests validate the new skill's metadata, registration, structure, and references instead.
- No live email delivery, production deployment, or release audit was requested. Existing legal,
  operating-entity, delivery, and deployment release gates remain unchanged.

## Final verification and decision

After the last source edit, `pnpm check`, `pnpm check:governance`, the production-mode build,
project-path preview build, and both build-budget checks passed. The final full browser run then
passed **536 tests** across Chromium, Firefox, and WebKit in 3.6 minutes.

The focused caption and localized interaction rerun also passed 11 tests:

```sh
E2E_PORT=4322 pnpm exec playwright test --grep 'homepage product narrative|German home complete composition|the trust section publishes|German calculator and demo form expose' --workers=4 --update-snapshots --reporter=line
```

The explicit final homepage refresh passed five Chromium tests and captures the small sentence
separator change instead of relying on the visual difference threshold:

```sh
E2E_PORT=4322 pnpm exec playwright test --project=chromium --grep 'homepage product narrative|German home complete composition' --workers=4 --update-snapshots=all --reporter=line
```

Only audit text and the explicitly refreshed five homepage PNG baselines changed after the full
browser run. All six marketing PNGs were visually inspected at final dimensions and in their crop
simulations. The exporter reproduced their exact hashes without any source change.

PASS. No unresolved P0, P1, or P2 findings. All recorded P3 findings were fixed rather than deferred.
This is a feature audit, not production-release approval. No push, deployment, or LinkedIn upload
was performed.
