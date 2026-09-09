# Product page narrative feature audit

## 1. Scope and acceptance criteria

- Audited the revision of `/product` into an ordered Chat, Knowledge, and Workflows narrative.
- Required native section navigation, static semantic product visuals, a compact prebuilt or custom
  agent band, one governance close, and the existing two-destination conversion path.
- Required the Chat, connected knowledge and MCP connector, workflow builder, agent example, and
  governance capability statements to resolve from current approved claim records at the page
  boundary.
- Required the old adoption timeline and chart to leave the product page.
- Required complete no-JavaScript and reduced-motion rendering, keyboard-visible anchor navigation,
  node stacking through 1100px, and no horizontal overflow at 390px, 768px, 1101px, or 1440px.
- Required no dependency, copied screenshot, new client interaction, public research attribution,
  or em dash in the new public content.

## 2. Revision and files reviewed

- `src/pages/product.astro`
- `src/lib/content/product.ts`
- `src/lib/content/site-content.ts`
- `src/lib/claims/registry.ts`
- `src/components/PlatformOverview.astro`
- `src/components/ProductWorkspace.astro`
- `src/components/KnowledgeWorkspace.astro`
- `src/components/WorkflowBuilder.astro`
- `src/components/GovernanceConsole.astro`
- `src/styles/global.css`
- `tests/unit/product-content.test.ts`
- `tests/unit/claims.test.ts`
- `tests/e2e/funnel.spec.ts`
- `tests/e2e/visual.spec.ts` and the four product visual baselines

## 3. Claims and research review

- The user's 2026-09-09 direction is recorded as approval for the three core product capabilities,
  the representative prebuilt agent examples, and the concise governance treatment.
- Each product capability and illustrative figure caption has an independent exact claim record,
  current approval metadata, a revalidation date, and one product-only surface. The earlier
  prebuilt or custom statement is now also allowed on `product.agents`.
- TextCortex help articles were used only as internal research. Their names, screenshots, detailed
  connector actions, flow features, and promotional wording do not appear on the page.
- The rendered production page contains no internal approval, review, evidence, or research URLs.
- New visitor-facing product strings contain no em dashes.

## 4. Findings

### PRODUCT-01: P2, resolved

- **Affected surface:** Product section anchor navigation.
- **User and impact:** Keyboard and pointer users landed farther below the intended section start,
  weakening orientation after selecting Chat, Knowledge, or Workflows.
- **Preconditions:** Use the page-level scroll padding together with a second local section offset.
- **Reproduction:** Select the Chat anchor at 1440px and measure the section top against the fixed
  header offset.
- **Expected:** The section begins 96px below the viewport top.
- **Actual:** Both offsets were applied and created excess spacing above the destination.
- **Evidence:** The first focused Playwright anchor assertion reproduced the doubled offset.
- **Supported cause:** Product sections added `scroll-margin-top` even though the document already
  owns anchor clearance through `scroll-padding-top`.
- **Correction:** Removed the local offset and retained the document-level 96px anchor clearance.
- **Regression verification:** Keyboard Enter navigation now lands within 2px of the expected
  position in the responsive product test.
- **Status:** Resolved.

### PRODUCT-02: P2, resolved

- **Affected surface:** Product claim governance and accessible figure descriptions.
- **User and impact:** Illustrative captions could drift from approved capability language without
  a dedicated approval check.
- **Preconditions:** Store figure captions only beside page content and pass them directly to the
  visual.
- **Reproduction:** Compare the initial surface model with the claim resolver inputs.
- **Expected:** Every factual caption resolves independently on its exact product surface.
- **Actual:** Only each section description had an independent claim record.
- **Evidence:** Review of the first content model showed no figure claim identifiers.
- **Supported cause:** The first vertical slice treated captions as descriptive UI text rather than
  product statements.
- **Correction:** Added `figureClaimId` to the typed surface record, added independent caption
  claims, and resolved both statements at the page boundary before rendering.
- **Regression verification:** Unit tests compare every rendered description and caption with its
  approved record and allowed surface.
- **Status:** Resolved.

### PRODUCT-03: P2, resolved

- **Affected surface:** Hidden descriptions for the Chat, Knowledge, and Workflows figures.
- **User and impact:** Assistive technology could announce the final word of the capability
  statement and the first word of the caption as one run-on phrase.
- **Preconditions:** Render adjacent Astro expression nodes without an explicit text separator.
- **Reproduction:** Inspect the generated `figcaption` text content in the production HTML.
- **Expected:** Each approved sentence has a clear boundary.
- **Actual:** The static compiler emitted the two strings without whitespace.
- **Evidence:** Production HTML showed `attached.A` and equivalent sentence joins.
- **Supported cause:** Source formatting whitespace between expression nodes is not preserved as a
  text node by the compiled template.
- **Correction:** Added an explicit space between the statement and caption in all three figures.
- **Regression verification:** The focused cross-browser product test asserts each complete caption
  exactly and passes in Chromium, Firefox, and WebKit.
- **Status:** Resolved.

### PRODUCT-04: P3, documented follow-up

- **Affected surface:** Shared stylesheet maintenance and transfer size.
- **User and impact:** No visible regression exists, but unused selectors for the removed product
  adoption and workflow-run components remain in the shared stylesheet.
- **Preconditions:** Remove page components while retaining historically interleaved global rules.
- **Reproduction:** Search `src/styles/global.css` for `.adoption-gap` and `.workflow-run` after
  confirming no source component references remain.
- **Expected:** A future isolated stylesheet cleanup removes rules that no longer have consumers.
- **Actual:** The selectors remain to avoid broad edits to shared responsive blocks during this
  user-facing revision.
- **Evidence:** Repository search finds the selectors only in `src/styles/global.css`.
- **Supported cause:** Legacy product rules are mixed with unrelated global and responsive styles.
- **Correction:** Deferred to a scoped stylesheet-maintenance change after this page revision.
- **Regression verification:** Not applicable until that cleanup is performed.
- **Owner and follow-up:** Website engineering should remove the dead selectors with a dedicated
  CSS-size comparison and full visual suite.
- **Status:** Open P3 with a safe workaround. The selectors do not render without matching markup.

## 5. Functional, accessibility, responsive, and performance review

- The page renders one H1 and three ordered H2 product sections. Native anchors preserve focus
  visibility and fixed-header clearance.
- The Chat mockup, connector flow, workflow builder, and governance visual use semantic HTML and
  repository-native SVG or CSS. Decorative connector lines remain hidden from assistive technology.
- The monthly workflow has an equivalent semantic ordered list and changes from a horizontal node
  map to a vertical sequence at 1100px and below.
- The prebuilt and custom items have no links, buttons, inputs, or focus stops.
- The complete page remains readable without JavaScript. Reduced motion renders all content in its
  final state.
- Automated checks found no horizontal overflow at all required widths and at 200 percent text size
  on the 390px viewport.
- Automated WCAG A and AA checks reported no detectable violations on the product route.
- Four product visual baselines cover mobile, tablet, desktop, and the focused desktop workflow
  builder. All were visually inspected and passed on rerun.
- No dependency or new hydrated component was added. The product route ships 1.3KB of JavaScript
  gzip against a 75KB budget, all from the existing shared shell.

## 6. Verification evidence

- Targeted formatting and ESLint checks passed for every changed product source and test file.
- Astro diagnostics passed for 79 files with no errors, warnings, or hints. Strict TypeScript also
  passed.
- Unit and component coverage passed with 97 tests. Coverage was 92.64 percent statements, 88.85
  percent branches, 92.03 percent functions, and 94.76 percent lines.
- The complete Playwright suite passed with 115 tests across Chromium, Firefox, and WebKit,
  including behavior, accessibility, responsive, no-JavaScript, reduced-motion, and visual checks.
- The final caption regression test then passed independently in Chromium, Firefox, and WebKit.
- Preview and direct production builds generated all 16 routes successfully.
- Client bundle budgets passed for all measured routes.
- `git diff --check` passed.

## 7. Repository-level checks and remaining release gates

- Full-repository formatting remains blocked by unrelated untracked chart-data and wallet artifact
  files that are outside this feature and were preserved.
- Full-repository ESLint remains blocked by two unrelated untracked wallet artifact scripts. The
  changed product files pass ESLint independently.
- The production release-readiness command remains blocked by existing site-wide prerequisites:
  approved hero, capability, trust, privacy, and Zeno proof records; lead endpoint configuration;
  and the production domain redirect. The direct production build itself passes.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session was performed. Semantic markup, keyboard coverage,
  automated accessibility, text reflow, and reduced-motion checks passed.

## 8. Final decision

**PASS WITH DOCUMENTED P3 FOLLOW-UP**. No unresolved P0, P1, or P2 findings remain for the product
page narrative revision.
