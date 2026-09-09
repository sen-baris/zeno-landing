# Product enterprise hero feature audit

## 1. Scope and acceptance criteria

- Audited the revised `/product` opening, which restores the earlier platform-overview pattern and
  merges it with the current Chat, Knowledge, and Workflows narrative.
- Required a concise enterprise platform message centered on company context, agents that perform
  work, prebuilt or custom starting points, major model access with EU hosting, and a governed
  workspace that supports usage at scale.
- Required the detailed product sections and native Chat, Knowledge, and Workflows navigation to
  remain available without turning the hero into a feature catalog.
- Required every factual statement to resolve from an approved, current claim at the page boundary.
- Required static semantic rendering, no new client interaction or dependency, no em dash in public
  copy, and no horizontal overflow at 390px, 768px, 1101px, or 1440px.

## 2. Revision and files reviewed

- `src/pages/product.astro`
- `src/lib/content/product.ts`
- `src/lib/claims/registry.ts`
- `src/components/PlatformOverview.astro`
- `src/components/ProductSectionNavigation.astro`
- `src/styles/global.css`
- `tests/unit/product-content.test.ts`
- `tests/unit/claims.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts`
- Product mobile, tablet, desktop, overview, and workflow visual baselines

## 3. Commands and environments used

- Formatting and ESLint checks scoped to all changed product source and test files
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm test:coverage`
- Targeted product behavior checks in Chromium, Firefox, and WebKit
- Targeted product visual checks in Chromium
- `pnpm build:preview`
- `pnpm build`
- `pnpm check:client-budgets`
- `pnpm test:e2e`
- `git diff --check`
- Manual inspection of the product page at 390px, 768px, 1101px, and 1440px

## 4. Findings

### HERO-01: P2, resolved

- **Affected surface:** Product claims registry and `/product` hero.
- **User and impact:** Visitors could have received an approved statement on an unapproved surface,
  weakening the repository's public-claim governance.
- **Preconditions:** Move the prebuilt or custom statement and agent examples from the former
  product agent band into the restored hero without updating their surface permissions.
- **Reproduction:** Resolve the existing starting-point and agent-example records on
  `product.hero` before the correction.
- **Expected behavior:** Both records explicitly allow the hero surface and resolve at the page
  boundary before rendering.
- **Actual behavior:** Their earlier records allowed only `home.hero` and `product.agents`.
- **Evidence:** The initial claim-surface comparison showed no `product.hero` permission.
- **Root cause:** The visual placement changed while the internal allowed-surface metadata still
  described the previous page structure.
- **Required correction:** Extend both approved records to the new surface and resolve their exact
  statements at the product page boundary.
- **Regression verification:** Unit tests now assert the complete allowed-surface sets and resolve
  both statements on `product.hero`.
- **Status:** Resolved.

### HERO-02: P2, resolved

- **Affected surface:** Product section navigation at mobile widths.
- **User and impact:** Mobile visitors could have seen a navigation row whose visible separators no
  longer matched its horizontal layout, weakening scanability and visual hierarchy.
- **Preconditions:** Apply the first mobile rule set to a three-column navigation that remains
  horizontal.
- **Reproduction:** Inspect the first mobile layout at 390px.
- **Expected behavior:** Chat, Knowledge, and Workflows remain compact, evenly divided, and easy to
  scan.
- **Actual behavior:** The initial rules removed the column dividers while retaining the horizontal
  row.
- **Evidence:** Responsive inspection at 390px reproduced the ambiguous grouping.
- **Root cause:** The mobile styles were adapted from a stacked navigation treatment, but this
  component intentionally retained a horizontal layout.
- **Required correction:** Preserve the horizontal separators and hide only secondary descriptions
  and arrows at the narrow breakpoint.
- **Regression verification:** Updated mobile and tablet snapshots pass, and automated responsive
  checks report no horizontal overflow.
- **Status:** Resolved.

### HERO-03: P2, resolved

- **Affected surface:** Accessible description of the enterprise platform overview.
- **User and impact:** Screen-reader users would not receive the governed-workspace statement shown
  visually in the figure.
- **Preconditions:** Read the initial hidden figure caption after the new governance strip was added.
- **Reproduction:** Compare the visible governed-workspace statement with the generated
  `figcaption` text.
- **Expected behavior:** The caption includes every essential statement conveyed by the decorative
  visual.
- **Actual behavior:** The initial caption covered platform context, starting paths, examples, and
  model hosting, but omitted governance.
- **Evidence:** The first semantic review found the missing final statement.
- **Root cause:** The restored figure caption was assembled before the governance band was added.
- **Required correction:** Pass the exact governance statement into the component and append it to
  the hidden caption with an explicit text boundary.
- **Regression verification:** The focused cross-browser product test asserts the complete exact
  caption, including governance, and passes in Chromium, Firefox, and WebKit.
- **Status:** Resolved.

## 5. Fixes applied

- Restored a three-stage platform overview for company context, agents, and completed work.
- Kept the copy short while showing prebuilt agents and a custom build as two valid starting paths.
- Added concise model-hosting and governed-workspace statements from approved claim records.
- Kept the detailed Chat, Knowledge, and Workflows sections behind a separate slim native anchor
  navigation.
- Removed the duplicated agent starting-point band below Chat.
- Added semantic stage lists and a complete hidden figure caption without adding client JavaScript.
- Added responsive layouts that stack the platform stages and agent choices cleanly on narrower
  screens.

## 6. Regression coverage added

- Unit coverage for every new hero claim, exact statement, approval state, currency, and allowed
  surface.
- Cross-browser assertions for the new heading, concise narrative, platform stages, prebuilt and
  custom paths, model hosting, governance, semantic caption, and absence of hero controls.
- Responsive assertions at the overview layout boundary and overflow checks at all required widths.
- Updated product snapshots at 390px, 768px, and 1440px, plus a focused 1440px enterprise platform
  overview snapshot.

## 7. Rerun results

- Targeted formatting and ESLint checks passed for all changed product files.
- Astro diagnostics and strict TypeScript passed with no errors, warnings, or hints.
- Unit tests passed with 97 tests.
- Coverage passed at 92.64 percent statements, 88.85 percent branches, 92.03 percent functions, and
  94.76 percent lines.
- Targeted product behavior passed in Chromium, Firefox, and WebKit.
- Product visual tests and all updated visual baselines passed in Chromium after inspection.
- Preview and production builds generated all 16 routes successfully.
- Client budgets passed. `/product` ships 1.3KB of JavaScript gzip against a 75KB budget.
- The complete Playwright suite passed with 116 tests across Chromium, Firefox, and WebKit.
- `git diff --check` passed.

## 8. Anything not verified and its risk

- Full-repository formatting remains blocked by unrelated untracked chart-data and wallet artifact
  files outside this feature. Every changed product file passed the scoped formatter check.
- Full-repository ESLint remains blocked by two unrelated untracked wallet artifact scripts. Every
  changed product file passed the scoped ESLint check.
- The production release-readiness command remains blocked by existing site-wide approval,
  endpoint, and domain prerequisites. The direct production build passes, but this audit is not a
  release approval.
- No physical assistive-technology session was performed. Semantic markup, keyboard coverage,
  automated accessibility, reflow, no-JavaScript, and reduced-motion checks passed.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the product enterprise hero revision.
