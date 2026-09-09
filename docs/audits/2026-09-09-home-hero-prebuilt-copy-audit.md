# Homepage prebuilt-agent copy feature audit

## 1. Scope and acceptance criteria

- Audited the second homepage hero step for a clearer prebuilt-agent starting point and a shorter
  supporting sentence.
- Required the existing “We build the agent with you” title and build-stage visual to remain
  unchanged.
- Required the new copy to fit two lines at the representative mobile, tablet, enhancement
  boundary, and desktop widths.
- Required “prebuilt agent” to receive restrained emphasis without adding a control, interaction,
  animation stage, or unsupported setup-time promise.
- Required the `/product` starting-point copy and all neighboring hero behavior to remain unchanged.

## 2. Revision and files reviewed

- `src/components/GovernedWorkspace.astro`
- `src/lib/claims/registry.ts`
- `src/lib/content/product.ts`
- `src/styles/global.css`
- `tests/unit/claims.test.ts`
- `tests/unit/product-content.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts`
- Homepage mobile, tablet, desktop, and build-stage visual baselines

## 3. Commands and environments used

- Targeted Prettier and ESLint checks
- Targeted claim and product-content unit tests
- `pnpm typecheck`
- Targeted Chromium hero, product, no-JavaScript, responsive, and visual checks
- Browser geometry inspection at 390px, 768px, 1100px, 1101px, and 1440px
- `pnpm test:coverage`
- Direct production Astro build with `CONTENT_MODE=production`
- `pnpm check:budgets`
- `pnpm test:e2e`
- `git diff --check`
- Manual inspection of the 1440px build-stage visual

## 4. Findings

### HERO-COPY-01: P2, resolved

- **Affected surface:** Shared prebuilt-agent claim across the homepage and `/product`.
- **User and impact:** Replacing the shared statement would have shortened copy on `/product`, even
  though the request applied only to the homepage hero.
- **Preconditions:** Update `product-agent-starting-point` directly and rebuild both pages.
- **Reproduction:** The product mobile visual became 23px shorter and failed its established visual
  reference.
- **Expected behavior:** The homepage receives concise copy while `/product` remains unchanged.
- **Actual behavior:** The first implementation changed both surfaces because they resolved the same
  claim record.
- **Evidence:** The focused product test showed the new statement, and the product mobile visual
  comparison reported the height change.
- **Root cause:** One claim record owned wording for two page contexts with different copy needs.
- **Required correction:** Restore the product claim and add a separately approved
  `home-agent-starting-point` record limited to `home.hero`.
- **Regression verification:** Unit tests enforce each record's exact allowed surface. The product
  behavior and mobile visual tests pass unchanged.
- **Status:** Resolved.

## 5. Fixes applied

- Changed the homepage build-step copy to “Start with a prebuilt agent or build your own. Connect
  your systems, review, and approve.”
- Added restrained color and moderate weight to “prebuilt agent” within the narrative.
- Preserved the existing prebuilt badge and custom-built alternative in the product visual.
- Added a homepage-only approved claim while restoring the product-specific statement.
- Kept the longer operational detail available in the existing assistive description.

## 6. Regression coverage added or revised

- Unit coverage verifies the concise statement is approved only for `home.hero` and contains no em
  dash.
- Hero behavior coverage verifies the exact two-sentence copy and semantic emphasis.
- Browser geometry coverage verifies the active build narrative occupies no more than two lines.
- Existing tests continue to verify pinned progression, static fallbacks, keyboard paging,
  no-JavaScript rendering, responsive boundaries, and the unchanged `/product` statement.
- Updated the affected homepage and build-stage visual references after inspection.

## 7. Rerun results

- Scoped formatting and ESLint checks passed.
- Astro diagnostics and strict TypeScript passed with no errors, warnings, or hints.
- Targeted claim and product-content tests passed with 14 tests.
- Coverage passed with 97 tests at 92.64 percent statements, 88.85 percent branches, 92.03 percent
  functions, and 94.76 percent lines.
- The production build generated all 16 routes successfully.
- Client budgets passed. The homepage remains at 3.8KB JavaScript gzip against a 75KB budget.
- The complete Playwright suite passed with 117 tests across Chromium, Firefox, and WebKit.
- `git diff --check` passed.

## 8. Anything not verified and its risk

- Full-repository formatting and ESLint remain affected by unrelated untracked artifact folders.
  Every changed source and test file passed the applicable scoped checks.
- No physical assistive-technology session was performed. The content remains ordinary semantic
  text, and automated accessibility, no-JavaScript, keyboard, and reflow coverage passed.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the homepage prebuilt-agent copy change.
