# Prebuilt agent hero feature audit

## 1. Scope and acceptance criteria

- Audited the homepage hero after adding a subtle choice between a prebuilt agent and a custom
  build to the existing build step.
- Required the approved product statement to resolve only at the `home.hero` boundary and reach
  the component through a required prop.
- Required the visual cue to remain decorative and non-interactive, replace the redundant
  top-right approval badge, and avoid adding another card to the build panel body.
- Required `Prebuilt agent` to reuse the rounded status treatment from the other stages, followed
  by quiet `or Custom built` text with no explanatory label.
- Required the finance example, connected systems, remaining owner-review card, governance bar,
  existing panel footprint, and three-stage scroll behavior to remain unchanged.
- Required complete static, reduced-motion, and no-JavaScript fallbacks, responsive layouts without
  horizontal overflow, keyboard parity, and visitor-facing copy without em dashes.
- Confirmed that `/product` remains unchanged by this feature.

## 2. Revision and files reviewed

- `src/lib/claims/registry.ts`
- `src/pages/index.astro`
- `src/components/GovernedWorkspace.astro`
- `src/styles/global.css`
- `tests/unit/claims.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts-snapshots/home-desktop-1440-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-hero-build-1440-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-hero-find-1440-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-mobile-390-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-tablet-768-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-customer-proof-open-390-chromium-darwin.png`
- `tests/e2e/visual.spec.ts-snapshots/home-vision-1440-chromium-darwin.png`

## 3. Commands and environments

- The focused claim unit test file passed: 11 tests.
- Astro diagnostics passed for 77 files with no errors, warnings, or hints.
- Formatting, linting, and strict TypeScript checks passed.
- Coverage passed with 93 tests: 92.41% statements, 88.77% branches, 91.5% functions, and
  94.59% lines.
- Preview and production builds each passed with 16 generated pages.
- Client budgets passed. The homepage used 3.8 KB of its 75 KB compressed JavaScript budget.
- Generated output contained the exact approved statement and both starting-point labels only on
  the homepage. The product page contained none of the new content.
- Focused pinned, static, reduced-motion, and no-JavaScript hero tests passed in Chromium, Firefox,
  and WebKit.
- Full Playwright coverage passed serially: 111 tests across Chromium, Firefox, and WebKit. An
  earlier parallel run completed 110 tests and encountered one unrelated WebKit assessment timeout;
  that journey passed in isolation before the clean serial run.
- Manually reviewed the build panel at 390px, 768px, and 1440px plus the two downstream 1 px
  screenshot diffs.

## 4. Findings

### HERO-PREBUILT-01: P2, resolved

- **Affected surface:** Homepage hero build-stage visual.
- **User and impact:** The first implementation added a separate starting-point card while retaining
  a redundant top-right approval badge. This made a supporting capability feel more prominent than
  the primary task and systems story.
- **Preconditions:** Scroll to the build stage or view the complete static hero.
- **Reproduction:** Compare the right side of the build panel with the requested restrained visual
  hierarchy.
- **Expected:** A rounded `Prebuilt agent` status followed by plain `or Custom built` text appears in
  the available header space without an extra label.
- **Actual:** The first version occupied a separate body card. Its first header revision removed the
  card but retained a low-value `Starting point` label and did not reuse the rounded status style.
- **Evidence:** The initial visual showed three stacked side cards beneath the connected-systems
  area and repeated approval language in the header, owner-review card, and governance rail.
- **Supported cause:** The first implementation preserved the status badge instead of treating its
  header position as available information space.
- **Correction:** Replaced the header approval badge with a compact `Prebuilt agent` status pill,
  followed it with plain `or Custom built` text, removed the `Starting point` label, and removed the
  separate body card. The owner-review card and governance control remain intact.
- **Regression verification:** The browser test asserts header placement, exact compact labels, the
  shared status treatment, absence of the explanatory label, absence from the side column, and
  absence of the old badge. Manual review covered 390px, 768px, and 1440px layouts.
- **Status:** Resolved.

### HERO-PREBUILT-02: P3, resolved

- **Affected surface:** Hero keyboard paging regression coverage.
- **User and impact:** The product behavior was correct, but the test assumed native PageUp scrolling
  settled within two animation frames. Chromium could still be moving, producing an intermittent
  false failure and weakening confidence in the keyboard check.
- **Preconditions:** Run the long pinned-hero test while Chromium applies animated native paging.
- **Reproduction:** Page down through the scene, issue two PageUp inputs, and assert the stage
  immediately after two animation frames.
- **Expected:** The test observes the settled scroll position before checking geometry-driven stage
  changes.
- **Actual:** The assertion could run while the second PageUp movement was still in progress.
- **Evidence:** The old assertion intermittently received `build` instead of `find`, then passed on
  immediate isolated reruns.
- **Supported cause:** Test synchronization depended on a fixed frame count rather than observable
  browser state.
- **Correction:** Wait for scroll movement and four stable animation frames after each paging key,
  then page upward until the first stage is reached within a bounded number of inputs.
- **Regression verification:** All nine focused pinned, static, reduced-motion, and no-JavaScript
  hero cases passed across Chromium, Firefox, and WebKit. The full serial suite also passed.
- **Status:** Resolved.

### HERO-PREBUILT-03: P3, resolved

- **Affected surface:** Two existing homepage visual baselines below the hero.
- **User and impact:** Locator screenshots of the mobile customer-proof and desktop Vision sections
  alternated by 1 px even when their content was unchanged. This produced false failures and could
  hide a meaningful regression among repeated baseline updates.
- **Preconditions:** Capture either section when its fractional document position rounds in the
  opposite direction from the saved locator screenshot.
- **Reproduction:** Compare the existing customer-proof mobile and Vision desktop baselines with
  the newly rendered screenshots.
- **Expected:** Meaningful visual changes are reviewed and accepted while unrelated regressions
  remain detectable.
- **Actual:** The expected and actual images alternated between 2016 and 2017 px for customer proof
  and between 944 and 945 px for Vision. Diff inspection showed uniform displacement rather than a
  component-level visual change.
- **Evidence:** Repeated source-stable runs reproduced both opposite height pairs after earlier
  baseline refreshes.
- **Supported cause:** Locator clipping rounded fractional section coordinates differently according
  to the section's document position.
- **Correction:** Capture each section in a viewport whose height is the explicit integer ceiling of
  its measured height, align the section to the viewport top, and compare the stable page image.
- **Regression verification:** Both captures passed six repeated runs with two parallel workers,
  followed by the full cross-browser Playwright run.
- **Status:** Resolved.

## 5. Regression coverage

- The claim test verifies approval, freshness, exact wording, the single allowed surface, and the
  absence of em dashes.
- The hero behavior test verifies the exact narrative copy and visible `Prebuilt agent`, `or`, and
  `Custom built` labels.
- The same test verifies that the rounded prebuilt status sits in the panel header without the
  `Starting point` label, no longer appears in the body side column, contributes no focusable or
  interactive element, and does not alter keyboard navigation.
- Existing geometry checks cover 390px, 768px, 1100px, 1101px, and 1440px widths plus the 719px
  and 720px height boundary, pinned progression, reverse scrolling, and panel-height stability.
- Reduced-motion and no-JavaScript tests verify that both starting paths remain visible and
  understandable in the complete static hero.
- Updated snapshots cover the desktop build stage and affected full-page mobile, tablet, and
  desktop views.

## 6. Unverified surfaces and risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. Semantic captioning, hidden descriptive
  text, keyboard behavior, automated accessibility checks, and no-JavaScript behavior passed.

## 7. Final decision

**PASS**. No unresolved P0, P1, or P2 findings.
