# Customer stories label feature audit

## 1. Scope and acceptance criteria

- Audited the visitor-facing label for the homepage customer section and customer-article return
  links.
- Required every public use of “Customer proof” to become “Customer stories.”
- Required internal evidence, claim, component, and test identifiers to remain stable.
- Required no layout, navigation, interaction, or responsive regression.

## 2. Revision and files reviewed

- `src/components/CustomerLogoRail.astro`
- `src/pages/customers/[slug].astro`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts`
- Homepage customer-section and atares customer-story visual baselines

## 3. Commands and environments used

- Repository search across `src` and `public`
- Targeted Prettier and ESLint checks
- `pnpm typecheck`
- Targeted Chromium homepage and customer-story behavior tests
- Targeted Chromium visual checks at 390px, 768px, and 1440px
- `pnpm test:coverage`
- Direct production Astro build with `CONTENT_MODE=production`
- `pnpm check:budgets`
- `pnpm test:e2e`
- `git diff --check`
- Manual inspection of the desktop customer section and customer-story hero

## 4. Findings

No P0, P1, P2, or P3 findings remain. The requested wording is used consistently on public pages,
and internal identifiers retain their existing meaning and stability.

## 5. Fixes applied

- Changed the homepage eyebrow to “Customer stories.”
- Changed customer-page return links to “Customer stories.”
- Left internal proof-governance identifiers unchanged.

## 6. Regression coverage added or revised

- Homepage behavior coverage asserts the new label and the absence of the previous public label.
- Customer-story coverage asserts the return-link name, destination, and absence of the previous
  public label on every route.
- Updated homepage, customer-section, and customer-story visual references after inspection.

## 7. Rerun results

- Scoped formatting and ESLint checks passed.
- Astro diagnostics and strict TypeScript passed with no errors, warnings, or hints.
- Coverage passed with 97 tests at 92.64 percent statements, 88.85 percent branches, 92.03 percent
  functions, and 94.76 percent lines.
- The production build generated all 16 routes successfully.
- Client budgets passed.
- The complete Playwright suite passed with 117 tests across Chromium, Firefox, and WebKit.
- `git diff --check` passed.

## 8. Anything not verified and its risk

- Full-repository formatting and ESLint remain affected by unrelated untracked artifact folders.
  Every changed source and test file passed the applicable scoped checks.
- No physical assistive-technology session was performed. The change uses ordinary heading and link
  text, and automated semantic and cross-browser checks passed.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the customer-stories label change.
