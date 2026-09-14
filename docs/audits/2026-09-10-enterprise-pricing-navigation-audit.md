# Enterprise pricing and navigation feature audit

## 1. Scope and acceptance criteria

- Audited the new enterprise-first `/pricing` route, business-case calculator, Pricing navigation
  change, and Solutions trigger alignment.
- Required one custom enterprise offer without a public Zeno price, approved product statements,
  four rollout scoping prompts, and a demo path.
- Required visitor-owned assumptions, deterministic capacity-value formulas, optional ROI and
  payback outputs, EUR, USD, and GBP formatting without conversion, and the exact estimate
  disclaimer.
- Required calculator values to remain in component memory with no submission, persistence,
  tracking, or URL serialization.
- Required disabled server-rendered controls, a complete no-JavaScript calculation method and demo
  fallback, inline validation, an announced result summary, and visible keyboard focus.
- Required no horizontal overflow at 390px, 768px, 1101px, and 1440px, complete metadata and
  sitemap coverage, no added dependency, and no em dash in new public copy.
- Required the existing homepage Business case section and Solutions dropdown behavior to remain
  intact.

## 2. Files and boundaries reviewed

- `src/pages/pricing.astro`
- `src/lib/content/pricing.ts`
- `src/lib/pricing/business-case.ts`
- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/lib/claims/registry.ts`
- `src/pages/sitemap.xml.ts`
- `src/styles/global.css`
- `tools/check_client_budgets.mjs`
- Pricing unit, component, browser, and visual tests
- Existing navigation, readiness assessment, motion, homepage, product, customer, and solution
  regressions affected by the shared header

The TextCortex and Harvey pages informed only the high-level structure. No wording, assumption,
price, component, asset, script, or dependency was copied.

## 3. Claims and privacy review

- The enterprise pricing title, summary, custom-proposal framing, calculation method, disclaimer,
  and local-data statement each have current approved records limited to their exact pricing
  surfaces.
- Existing approved statements for prebuilt or custom agents, connected company knowledge, major
  model access with EU hosting, and governed workspace controls were extended only to
  `pricing.enterprise`.
- All performance-related fields start empty. The 46-week planning year is the only numeric
  default and does not assert a performance outcome.
- The currency selector changes presentation only. It performs no conversion and is labeled as
  formatting only.
- Network, storage, session storage, and URL checks confirm that entering assumptions has no
  external effect.
- The visitor-facing page contains no public Zeno amount, checkout path, customer metric, source
  note, or em dash.

## 4. Findings

### PRICING-01: P2, resolved

- **Affected surface:** Small sequence labels in the enterprise offer and the empty calculator
  result state.
- **User impact:** Low-vision readers could encounter contrast below the WCAG 2 AA threshold.
- **Preconditions:** View the burgundy offer or dark result panel at the default color scheme.
- **Reproduction:** Run the pricing-page axe scan before the correction.
- **Expected:** Small text reaches at least 4.5:1 contrast against its background.
- **Actual:** Offer sequence numbers measured 4.17:1 and the empty-result sequence number measured
  3.57:1.
- **Supported cause:** Decorative label colors used opacity mixes tuned visually rather than to the
  small-text contrast threshold.
- **Correction:** Increased the paper mix for offer sequence labels and used a lighter evidence and
  paper mix in the result state.
- **Regression verification:** The focused pricing axe scan and the cross-route axe suite report no
  detectable WCAG A or AA violations.
- **Status:** Resolved.

### PRICING-02: P2, resolved

- **Affected surface:** Calculator validation feedback.
- **User impact:** A screen-reader user leaving an invalid numeric field might not hear the newly
  inserted error after focus had moved.
- **Preconditions:** Enter a fractional value in a whole-number field or another invalid value,
  then move focus away.
- **Reproduction:** Inspect the original field error markup after blur.
- **Expected:** The input is marked invalid, describes the exact error, and the new message is
  announced.
- **Actual:** The input used `aria-invalid` and `aria-describedby`, but the inserted error was not a
  live announcement.
- **Supported cause:** Error association was implemented without an announcement role.
- **Correction:** Added `role="alert"` to field errors while preserving exact description
  association.
- **Regression verification:** The component test verifies the alert role, invalid state, and error
  ID association. Browser accessibility checks pass.
- **Status:** Resolved.

### PRICING-03: P2, resolved

- **Affected surface:** Client JavaScript budget enforcement.
- **User impact:** The only newly hydrated route could grow without being measured by the standard
  budget command.
- **Preconditions:** Run `pnpm check:budgets` after adding `/pricing`.
- **Reproduction:** Inspect the original route inventory in `tools/check_client_budgets.mjs`.
- **Expected:** Every route with a React island has an explicit compressed JavaScript budget.
- **Actual:** The initial implementation measured the existing routes but omitted `/pricing`.
- **Supported cause:** The budget route list was not extended with the new page.
- **Correction:** Added `/pricing` with the same 150 KB interactive-route budget used for the other
  focused React forms.
- **Regression verification:** `/pricing` passes at 61.9 KB gzip against its 150 KB budget.
- **Status:** Resolved.

### PRICING-04: P2, resolved

- **Affected surface:** Readiness assessment regression exercised by the complete cross-browser
  suite.
- **User impact:** A very fast answer selection followed by Next could leave the reader on the same
  question even though the option appeared selected.
- **Preconditions:** WebKit under heavy parallel load, with the Next action arriving before React's
  rendered answer snapshot updated.
- **Reproduction:** Run the complete suite in parallel and drive all nine questions without a pause.
- **Expected:** The forward action reads the latest selected answer.
- **Actual:** The click handler could read its previous render closure once the radio change was
  visible but before the answer state committed.
- **Supported cause:** Progression depended on render timing between two consecutive input events.
- **Correction:** Mirrored selected answers into a synchronously updated ref and used that source
  for validation and final scoring while preserving rendered state.
- **Regression verification:** Readiness component tests pass, the affected WebKit journey passed
  three concurrent repeats, and the final serial suite passed in all three engines.
- **Status:** Resolved.

### PRICING-05: P3, resolved

- **Affected surface:** Existing WebKit reveal-motion regression helper.
- **User impact:** No production behavior changed, but a late-registered CSS transition could
  produce a false faded-panel failure under suite contention.
- **Preconditions:** WebKit registers the final hero transition one frame after the helper returns
  to the page top.
- **Reproduction:** Run the motion-settling test repeatedly under parallel load.
- **Expected:** The assertion samples the completed transition.
- **Actual:** Animation collection could run before the transition registered.
- **Supported cause:** The helper did not yield after its final scroll operation.
- **Correction:** Added two animation frames before collecting finite animations.
- **Regression verification:** Three concurrent WebKit repeats and the final serial cross-browser
  suite pass.
- **Status:** Resolved.

## 5. Navigation and responsive review

- Desktop top-level links and the Solutions summary share one 44px alignment box and the same line
  height.
- The Solutions word is centered between equal invisible and visible chevron tracks. Browser
  geometry verifies its horizontal center and matching vertical center against Product and Pricing.
- Native details behavior, hover, click, Enter, Escape, outside-click closing, focus retention, and
  no-JavaScript opening remain covered.
- Pricing replaces Business case in desktop, mobile, and footer navigation. The homepage Business
  case section remains unchanged.
- The enterprise offer uses two columns from 1101px upward and one below it. Scope prompts use four,
  two, and one columns across desktop, tablet, and mobile. The calculator uses two columns from
  1101px upward and stacks below it.
- Full-page pricing baselines at 390px, 768px, and 1440px, plus focused navigation and completed
  calculator baselines, were inspected. Shared-header baselines were refreshed only after diff
  inspection confirmed the intentional line-height shift.

## 6. Verification evidence

- `pnpm check`: passed formatting, ESLint, Astro diagnostics, strict TypeScript, coverage, preview
  build, and client budgets.
- Unit and component coverage: 115 tests passed; 94.22 percent statements, 90.22 percent branches,
  93.33 percent functions, and 95.92 percent lines.
- Production-mode Astro build: 17 routes generated, including `/pricing` and its sitemap entry.
- Pricing browser coverage: passed in Chromium, Firefox, and WebKit.
- Serial cross-browser behavior suite: 126 tests passed across Chromium, Firefox, and WebKit.
- Chromium visual suite: 28 tests passed, including all five new pricing baselines.
- Responsive and accessibility coverage: passed at 390px, 768px, 1101px, and 1440px with no
  horizontal overflow and no automated WCAG A or AA findings.
- JavaScript and resilience coverage: disabled pre-hydration controls, no-JavaScript fallback,
  local-only values, validation, live results, negative ROI, optional investment, and all three
  currency formats passed.
- `git diff --check`: passed.

## 7. Unverified release surfaces and risk

- No production deployment or release audit was requested or performed.
- Self-serve price, billing cadence, taxes, entitlements, and checkout remain intentionally absent
  until separately approved.
- No physical assistive-technology session or production field performance measurement was
  performed. Semantic controls, keyboard operation, automated accessibility, reflow, client
  budgets, no-JavaScript behavior, and three browser engines were verified.

## 8. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the enterprise pricing and navigation
revision.
