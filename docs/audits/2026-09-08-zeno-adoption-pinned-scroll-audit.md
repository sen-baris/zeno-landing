# Adoption pinned-scroll feature audit

## 1. Scope and acceptance criteria

- Audited the homepage “Adoption is built together” chart after adding the wide-screen pinned
  scroll treatment, progressive curve reveal, milestone/action states, marker alignment fix, and
  composed heading/chart/action scene.
- Required the heading, intro, complete chart, and action band to remain visible together while the
  scene pins below the 76px header; scroll-down and scroll-up state to remain reversible; and static
  output to remain complete under reduced motion, without JavaScript, and below the enhancement
  breakpoints.
- Public copy and claims were unchanged. Pre-existing working-tree changes to the vision section
  were preserved and were outside this feature audit except where the homepage regression suite
  exercised them.

## 2. Revision and files reviewed

- `src/components/AdoptionPartnership.astro`
- `src/pages/index.astro`
- `src/styles/global.css`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts` and the affected homepage/adoption visual baselines

## 3. Commands and environments

- Targeted Chromium behavior, reduced-motion, and no-JavaScript tests: 3 passed.
- Targeted adoption behavior after the cross-browser correction: Chromium, Firefox, and WebKit;
  3 passed.
- `pnpm check`: formatting, lint, strict type checking, 85 unit/component tests, coverage, preview
  build, and client budgets passed. Coverage was 91.77% statements, 88.17% branches, 90.52%
  functions, and 94.15% lines.
- `pnpm test:e2e` on a clean development server: 94 passed across Chromium, Firefox, and WebKit.
- Manually reviewed the 1440px launch, return, and habit scene captures and the reduced-motion
  1440px, 768px, and 390px full-page captures. Also inspected the composed return-stage scene at
  1440×720 and 1101×720.

## 4. Findings

### ADOPTION-01 — P2 — Resolved

- **Affected surface:** Homepage adoption chart at 768px and narrower.
- **User and impact:** Tablet and mobile readers could receive horizontal overflow after the new
  absolute desktop milestone coordinates were introduced.
- **Preconditions:** Load the homepage at or below the 900px static-layout breakpoint.
- **Reproduction:** Resize from the enhanced desktop layout to 768px and compare document scroll
  width with viewport width.
- **Expected:** Milestones form one vertical reading sequence with no horizontal scrolling.
- **Actual:** The items became relatively positioned but retained the desktop `top` and `left`
  offsets, widening the document.
- **Evidence:** The targeted Playwright assertion “the adoption partnership must not overflow at
  tablet width” failed before the correction.
- **Cause:** The mobile rule reset `position` and `transform` but not the inset properties.
- **Correction:** Reset `top` and `left` to `auto` in the static narrow-layout rule.
- **Regression verification:** The targeted adoption test now passes at 768px and 390px; the full
  cross-browser suite passes.
- **Status:** Resolved.

### ADOPTION-02 — P3 — Resolved

- **Affected surface:** Final frame of the desktop curve reveal.
- **User and impact:** Some browser engines could leave a sub-pixel sliver of the final curve
  clipped after scrolling to the exact end of the track.
- **Preconditions:** Enhanced desktop layout at the maximum scroll-track progress.
- **Reproduction:** Drive the track to progress 1 and inspect the SVG clip width in Chromium,
  Firefox, and WebKit.
- **Expected:** The completed clip width is exactly the 1200-unit SVG width.
- **Actual:** Scroll quantization produced widths from 1199.41 to 1199.94 units.
- **Evidence:** The first cross-browser run passed 91 tests and failed the completion assertion in
  each engine.
- **Cause:** Each engine rounds scroll positions differently before the geometry calculation.
- **Correction:** Snap only the final 0.1% of measured progress to the exact completed state.
- **Regression verification:** The targeted test passes in all three engines and the subsequent
  full suite passes 94/94.
- **Status:** Resolved.

### ADOPTION-03 — P2 — Resolved

- **Affected surface:** Homepage adoption story during the enhanced desktop scroll sequence.
- **User and impact:** Visitors could watch the adoption progression without its “Adoption is built
  together” premise or supporting explanation, weakening comprehension of the chart and actions.
- **Preconditions:** Use a motion-enabled viewport at least 1101px wide and 720px tall, then scroll
  until the adoption scene pins.
- **Reproduction:** Start at the adoption heading and continue scrolling through the chart stages.
- **Expected:** The heading, explanation, chart, and partnership actions remain visible as one
  section while the curve progresses.
- **Actual:** The heading and explanation were outside the sticky scene and scrolled above the
  viewport once the chart pinned.
- **Evidence:** User-provided before/after-scroll screenshots and the pre-correction DOM placed the
  heading as a sibling before `.adoption-partnership-story`.
- **Cause:** Only the chart and partnership band were owned by the sticky scene.
- **Correction:** Moved the single semantic heading and intro into the sticky scene, then reduced
  only its enhanced-state bottom margin to keep the complete composition inside the viewport.
- **Regression verification:** Behavioral checks keep the heading geometry stable at launch,
  return, and habit stages and verify the complete composition at 1440×900, 1440×720, and the exact
  1101×720 enhancement boundary. Stage-specific visual snapshots were reviewed.
- **Status:** Resolved.

### ADOPTION-04 — P3 — Resolved

- **Affected surface:** Completed static chart on desktop, including reduced-motion and no-JavaScript
  rendering.
- **User and impact:** Moving the heading into the scene initially removed 40px of established
  trailing breathing room and shifted all following homepage content upward.
- **Preconditions:** Load the desktop homepage with the animation disabled or unavailable.
- **Reproduction:** Compare the reduced-motion 1440px full-page baseline after the DOM move.
- **Expected:** The static composition and downstream page rhythm remain unchanged.
- **Actual:** The visual regression check reported an 8772px expected page and an 8732px actual
  page because the chart-only minimum-height reservation no longer contributed its spare 40px.
- **Evidence:** The first targeted Chromium visual run failed only the 1440px homepage baseline.
- **Cause:** The heading made the scene taller than its former 450px minimum, removing the chart's
  implicit trailing space.
- **Correction:** Preserved that 40px space only in the static desktop scene and explicitly removed
  it in the pinned and narrow layouts.
- **Regression verification:** Existing 1440px, 768px, and 390px reduced-motion baselines now pass
  unchanged; the enhanced composition still fits at both minimum dimensions.
- **Status:** Resolved.

## 5. Fixes and regression coverage

- Curve points, marker centres, and stage thresholds now derive from one component-owned geometry.
- The SVG line and area reveal continuously, a visible endpoint follows the curve, and milestone
  plus partner-action states advance cumulatively and reverse with scrolling.
- Tests cover exact marker-to-path alignment, sticky position, monotonic progress, final completion,
  reverse scrolling, keyboard paging, a continuously visible composed heading/chart/action scene,
  viewport boundaries, reduced motion, no JavaScript, narrow reflow, overflow, and stage-specific
  visuals.

## 6. Unverified surfaces and risk

- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed; semantic ordered-list output,
  reduced-motion behavior, keyboard scrolling, and automated WCAG A/AA checks passed.

## 7. Final decision

**PASS** — no unresolved P0, P1, or P2 findings.
