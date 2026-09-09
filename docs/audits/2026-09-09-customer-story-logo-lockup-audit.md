# Customer story logo lockup feature audit

## 1. Scope and acceptance criteria

- Audited the replacement of the small standalone customer logo in each case study hero with one
  standardized, frameless logo lockup.
- Required the atares, b2venture, MAHLE, and KBC marks to use the same alignment area while
  preserving each logo's natural proportions.
- Required no visible card, fill, border, decorative treatment, new customer claim, dependency, or
  client-side behavior.
- Required the logo and article title to form a balanced editorial header without horizontal
  overflow at mobile, tablet, or desktop widths.

## 2. Revision and files reviewed

- `src/pages/customers/[slug].astro`
- `src/styles/global.css`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts`
- Customer story desktop, mobile, and focused hero visual baselines

## 3. Findings

### STORY-LOCKUP-01: P2, resolved

- **Affected surface:** Customer story hero.
- **User and impact:** The first frameless implementation could decode the correct SVG while
  cropping its visible wordmark out of the alignment area.
- **Preconditions:** Render a square logo SVG in the wide invisible lockup using `object-fit: cover`.
- **Reproduction:** Load the atares article at either the desktop or mobile snapshot size.
- **Expected:** The complete customer wordmark remains visible.
- **Actual:** Only small fragments of the atares artwork remained at the edge of the lockup.
- **Evidence:** Focused desktop and full mobile visual inspection reproduced the clipping.
- **Supported cause:** Replaced-element cover behavior did not produce a reliable centered crop for
  the square SVG artwork.
- **Correction:** The square SVG is now sized from the lockup width, vertically centered, and
  clipped only through the lockup's overflow boundary. The artwork remains intact while the large
  empty top and bottom regions of the source canvas remain hidden.
- **Regression verification:** Updated focused desktop and mobile snapshots show the complete
  atares wordmark. All four assets use the same centered source geometry.
- **Status:** Resolved.

### STORY-LOCKUP-02: P2, resolved

- **Affected surface:** Customer story browser regression coverage.
- **User and impact:** A missing customer SVG could still occupy the expected CSS dimensions,
  allowing a visible-element assertion to pass while the brand mark failed to render.
- **Preconditions:** A customer logo request fails or returns invalid image content.
- **Reproduction:** Keep the lockup CSS intact while replacing a logo source with a missing file.
- **Expected:** Automated coverage fails when the image resource does not decode.
- **Actual:** The initial geometry test checked visibility without checking resource completion.
- **Evidence:** Review of the browser assertion showed no `naturalWidth` validation.
- **Supported cause:** CSS gives the image a measurable box independently of resource success.
- **Correction:** Added image completion and positive natural-width assertions for every customer
  article.
- **Regression verification:** The focused customer story check passed in Chromium, Firefox, and
  WebKit for all four routes.
- **Status:** Resolved.

### STORY-LOCKUP-03: P2, resolved

- **Affected surface:** Customer story visual regression evidence.
- **User and impact:** The full-page desktop baseline could miss a meaningful header change because
  the changed pixels represented a small part of the long article screenshot.
- **Preconditions:** A focused hero change on a long customer article.
- **Reproduction:** Update the lockup and run changed-only snapshot updates with the existing
  full-page diff tolerance.
- **Expected:** Visual coverage clearly records the customer hero composition.
- **Actual:** The original full-page baseline could remain within tolerance.
- **Evidence:** The first desktop baseline did not update until an all-snapshot refresh was forced.
- **Supported cause:** The header occupies a small percentage of the complete article image.
- **Correction:** Added focused desktop and mobile hero snapshots alongside the full-page views.
- **Regression verification:** Both focused snapshots were generated, inspected at original
  resolution, and passed on rerun.
- **Status:** Resolved.

## 4. Functional, accessibility, claims, and responsive review

- Every customer article renders one local approved logo asset inside the same invisible 3:1
  alignment area.
- Logo images retain useful customer names as alternative text and preserve their natural aspect
  ratios.
- The customer proof return link and article eyebrow share the first alignment line. The logo and
  title begin on the second line, producing a clear editorial relationship.
- The lockup adds no visible box, color, script, animation, interaction, dependency, or network
  request.
- Automated checks confirm identical lockup dimensions across all four desktop routes, positive
  decoded image widths, and no horizontal overflow at 390px, 768px, 1101px, or 1440px.
- The styling change creates no public factual statement and does not alter the approved logo claim
  surfaces.

## 5. Verification evidence

- Formatting, ESLint, Astro diagnostics, and strict TypeScript passed.
- Unit and component coverage passed with 94 tests and remained above every repository floor.
- Preview and production builds generated all 16 routes successfully.
- Client bundle budgets passed, with no client code added.
- The complete Playwright suite passed with 111 tests across Chromium, Firefox, and WebKit.
- The strengthened customer logo resource and geometry check passed in all three browsers.
- Desktop and mobile full-page visual baselines were updated. Focused desktop and mobile hero
  baselines were added and inspected.

## 6. Not verified and remaining risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. The change adds no interactive behavior,
  and existing semantic and automated accessibility coverage remains passing.

## 7. Final decision

**PASS**. No unresolved P0, P1, or P2 findings remain for the customer story logo lockup.
