# Homepage starting path and alignment feature audit

## Scope and acceptance criteria

Reviewed the homepage change that:

- adds the approved `Start your way` message without making Zeno sound optional;
- gives the label a quiet secondary color treatment that does not compete with the primary CTA;
- keeps the supporting statement concise while preserving prebuilt, custom, grounding, and adoption;
- preserves the existing hero headline and shorter build-stage narrative;
- keeps the moving adoption-chart cursor circular and centered on its curve;
- optically aligns and proportionally sizes all eight customer logos;
- preserves static, reduced-motion, no-JavaScript, keyboard, and responsive behavior.

The existing uncommitted customer-story naming and homepage build-copy work was preserved. Its own
audit records remain separate.

## Revision and changed files reviewed

- `src/components/AdoptionPartnership.astro`
- `src/components/CustomerLogoRail.astro`
- `src/lib/claims/registry.ts`
- `src/lib/content/site-content.ts`
- `src/pages/index.astro`
- `src/styles/global.css`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts`
- affected Chromium visual baselines

## Behavior and boundary review

- Ownership: factual hero wording is resolved from approved `home.hero` claim records. The content
  record owns only the editorial label and claim identifier.
- Feedback: the starting-path label and statement are ordinary readable content. The adoption
  animation remains decorative, reversible, and paired with complete semantic ordered lists.
- Failure radius: the new claim is limited to `home.hero`; the product-page starting-point claim and
  solution-page logo rails remain unchanged.
- Timing: the adoption cursor continues to use the existing requestAnimationFrame scroll update and
  cleanup. Static and reduced-motion modes hide the decorative cursor and show the complete chart.

## Commands and environments used

- Scoped Prettier and ESLint checks on changed source and tests
- `pnpm typecheck`
- `pnpm test:coverage`
- `CONTENT_MODE=production pnpm exec astro build`
- `pnpm check:budgets`
- focused Chromium hero, adoption, customer-logo, no-JavaScript, and responsive tests
- focused WebKit customer-logo interaction regression test
- targeted Chromium visual updates and inspection at 390px, 768px, and 1440px
- `pnpm test:e2e` across Chromium, Firefox, and WebKit

## Findings

### HPAA-01, P2, resolved

- Affected surface: homepage customer logo grid at the 1101px desktop boundary.
- User impact: the long preview control and existing tile padding could shrink a logo frame, making
  the first desktop layout less aligned than wider layouts.
- Preconditions: viewport width of 1101px with the four-column grid active.
- Reproduction: inspect `.customer-proof-logo` widths in the first desktop layout.
- Expected behavior: every logo retains its 112px optical frame without horizontal overflow.
- Actual behavior: frames could shrink to between 75.7px and 102.6px.
- Evidence: browser geometry inspection before the correction.
- Cause: the combined logo frame, control width, gap, and padding exceeded a 258px tile.
- Correction: reduced the control copy to `Quote`, tightened the horizontal gap and padding, and
  retained the full optical frame.
- Regression verification: the responsive Playwright test asserts every desktop logo frame remains
  112px at 1101px and 1440px, with no horizontal overflow.
- Status: resolved.

### HPAA-02, P2, resolved

- Affected surface: cross-browser customer-logo regression coverage.
- User impact: WebKit could report a false alignment failure even though the rendered layout was
  correct, blocking reliable verification.
- Preconditions: copying an SVG image into a test canvas and reading transparent pixel bounds in
  WebKit.
- Reproduction: run the optical artwork canvas assertion in WebKit.
- Expected behavior: browser-independent evidence or a clearly bounded rendering-engine check.
- Actual behavior: WebKit returned different SVG-to-canvas raster bounds from the Chromium visual
  baseline engine.
- Evidence: the first clean cross-browser run passed 116 tests and failed only this canvas reading.
- Cause: engine-specific SVG rasterization in canvas, not the page layout.
- Correction: kept transparent-pixel optical measurement with the Chromium visual baselines and
  retained interaction, frame sizing, overflow, and responsive checks across all three engines.
- Regression verification: the focused WebKit test and the final full cross-browser suite pass.
- Status: resolved.

### HPAA-03, P3, resolved

- Affected surface: collapsed homepage customer-story visual baseline.
- User impact: none in the rendered interface, but the stored image was one pixel shorter than the
  stable current section geometry and caused the visual suite to fail.
- Preconditions: Chromium element screenshot of the collapsed customer-story section at 1440px.
- Reproduction: run the focused customer-story visual test twice against the previous baseline.
- Expected behavior: the approved rendering and stored baseline have matching dimensions.
- Actual behavior: the section rendered at 922px while the stored baseline was 921px.
- Evidence: the full suite and an isolated rerun reproduced the same one-pixel height difference;
  visual inspection found no unintended content or spacing change.
- Cause: the affected baseline had not captured the final stable section geometry.
- Correction: regenerated the collapsed, hovered, and pinned baselines from the inspected render.
- Regression verification: the isolated visual test passes on a clean rerun.
- Status: resolved.

## Fixes and regression coverage

- Replaced the non-uniformly scaled SVG cursor circle with a CSS-positioned circular element whose
  center still follows the same SVG path coordinates.
- Added cursor shape and curve-center assertions during scroll progression.
- Added browser-rendered optical artwork measurements for the Chromium visual baseline.
- Added exact 1101px desktop frame-retention coverage and existing mobile, tablet, no-JavaScript,
  hover, focus, click, Escape, and outside-click coverage continues to pass.
- Added a focused desktop snapshot for the hero starting-path message and updated affected homepage,
  logo-grid, and adoption-stage baselines.

## Verification status

- No unresolved P0, P1, or P2 findings.
- No dependency, client-side feature, public attribution, or metadata change was introduced.
- The new public statement is approved, current, limited to `home.hero`, and contains no em dash.
- The starting-path badge uses the existing wash and action tokens rather than the primary CTA fill.

## Final decision

PASS
