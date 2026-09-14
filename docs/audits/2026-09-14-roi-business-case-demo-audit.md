# ROI-led business case and demo feature audit

## 1. Scope and acceptance criteria

- Audited the revised `/pricing` business-case experience, guided calculator, navigation label,
  compact enterprise close, and above-the-fold `/demo` conversion form.
- Required the first calculator question, page headline, and demo CTA inside the initial desktop
  viewport, with the calculator beginning inside the initial mobile viewport.
- Required three visitor-owned calculator inputs, a 46-week adjustable planning year, EUR, USD, and
  GBP formatting without conversion, capacity results, and optional ROI and payback results.
- Required calculator answers to stay in component memory with no request, analytics event,
  storage, URL state, persistence, or submission.
- Required one compact demo form with four required details, optional planning context, assessment
  prefill, explicit data-use acknowledgement, `marketing: false`, omission of empty optional
  fields, resilient submission, retry, duplicate-submit protection, and abort cleanup.
- Required disabled server-rendered controls, understandable no-JavaScript states, visible focus,
  accessible validation, responsive reflow, and no public em dash.

## 2. Files and boundaries reviewed

- `src/pages/pricing.astro`
- `src/pages/demo.astro`
- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/components/islands/DemoForm.tsx`
- `src/lib/pricing/business-case.ts`
- `src/lib/content/pricing.ts`
- `src/lib/leads/validation.ts`
- `src/lib/leads/adapter.ts`
- `src/lib/claims/registry.ts`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/styles/global.css`
- `package.json`
- `playwright.config.ts`
- Pricing, lead validation, component, funnel, accessibility, responsive, and visual tests

Harvey and Legora informed only the high-level flow and above-the-fold composition. No external
wording, code, assumption, price, component, script, image, or dependency was copied.

## 3. Ownership, feedback, failure radius, and timing

- Calculator content is owned by typed pricing records and approved claims. Pure validation and
  calculation live outside React. Temporary answers live only in the calculator instance.
- Visitors see one question at a time, explicit progress, inline errors, focus movement, retained
  Back navigation, an announced result summary, and optional budget and planning disclosures.
- Demo requirements are owned by one validator. The existing lead adapter remains the submission
  boundary, with assessment context loaded locally and optional payload properties added only when
  completed.
- The pricing island hydrates on load because it is above the fold. Both islands render disabled
  controls before hydration. The demo abort controller is cleaned up on page exit, pending submits
  cannot be duplicated, and retry reuses retained values.
- Shared-header risk was limited to the visitor-facing label and link target. Existing Solutions
  dropdown behavior and homepage Business case content remain unchanged.

## 4. Claims, privacy, and calculation review

- The business-case metadata, hero, method, disclaimer, local-data statement, enterprise close, and
  demo data-use acknowledgement resolve from current approved records on their exact surfaces.
- The calculator starts with no performance assumption. Only the 46-week working year is
  prefilled, and it can be adjusted from 1 to 52 weeks.
- Annual hours returned use people multiplied by weekly hours returned and working weeks. Annual
  capacity value multiplies those hours by the visitor's hourly value.
- ROI and payback appear only after the visitor supplies an annual investment. Negative ROI is
  represented rather than hidden. No net-value or return-multiple result is published.
- Currency selection formats the visitor's values and explicitly performs no conversion.
- The demo sends `marketing: false`, presents no marketing opt-in, omits empty planning fields, and
  uses the approved acknowledgement exactly.
- New public strings contain no em dash and the page introduces no Zeno price or guaranteed result.

## 5. Findings

### BUSINESS-CASE-01: P2, resolved

- **Affected surface:** Completed calculator result.
- **User impact:** A visitor could see the estimate disclaimer after calculation but lose the
  adjacent assurance that entered values are neither sent nor saved.
- **Preconditions:** Complete all three guided questions and view the result state.
- **Reproduction:** Inspect the first completed-result render before correction.
- **Expected:** The planning disclaimer and local-data statement remain beside the result.
- **Actual:** The local-data statement was present in the question header only.
- **Supported cause:** The result branch replaced the form header and did not repeat the privacy
  statement.
- **Correction:** Rendered the approved local-data statement directly below the estimate
  disclaimer in the result state.
- **Regression verification:** Component and browser tests verify the exact statement with the
  completed estimate. The local-only browser test confirms no request, storage, or URL mutation.
- **Status:** Resolved.

### BUSINESS-CASE-02: P2, resolved

- **Affected surface:** Optional annual investment input.
- **User impact:** Its accessible name could include the appended visual word “Optional,” making
  voice and assistive-technology targeting less predictable than the visible field name.
- **Preconditions:** Expand “Compare an annual budget” after completing an estimate.
- **Reproduction:** Inspect the accessible name created by the original wrapping label.
- **Expected:** The input has the concise accessible name “Expected annual platform investment,”
  while “Optional” remains a visible status.
- **Actual:** The wrapping label combined the field name and status into one accessible name.
- **Supported cause:** The optional marker was a descendant of the native label.
- **Correction:** Added the concise field label as the input's explicit accessible name while
  preserving the visible optional marker and description association.
- **Regression verification:** Component and browser tests locate and operate the field by its
  concise label in the expanded result state. Automated accessibility checks pass.
- **Status:** Resolved.

### BUSINESS-CASE-03: P2, resolved

- **Affected surface:** Guided calculator step progression under browser contention.
- **User impact:** A visitor entering a value and immediately pressing Continue could remain on the
  same question in a delayed React render.
- **Preconditions:** Firefox under heavy parallel load, with the Continue action arriving before
  the rendered input snapshot updated.
- **Reproduction:** Run the complete cross-browser suite in parallel and progress through all three
  questions without a pause.
- **Expected:** Continue validates the value currently visible in the input.
- **Actual:** The handler could validate the previous render once under suite contention.
- **Supported cause:** Progression used a render-derived validation object between consecutive
  input and submit events.
- **Correction:** Mirrored the latest calculator draft into a synchronously updated ref and
  validated that source during progression while preserving rendered state.
- **Regression verification:** Component tests pass, and repeated affected Firefox journeys pass
  under parallel execution.
- **Status:** Resolved.

### BUSINESS-CASE-04: P2, resolved

- **Affected surface:** Business-case calculator hydration in the local development server.
- **User impact:** The calculator appeared in server-rendered markup, then disappeared as soon as
  hydration failed, blocking the complete estimate journey for local reviewers.
- **Preconditions:** Start the development server with a stale optimized dependency cache that
  contains React's production JSX development runtime.
- **Reproduction:** Open `/pricing` and inspect the browser error emitted while
  `BusinessCaseCalculator.tsx` hydrates.
- **Expected:** React hydrates the server-rendered calculator and leaves the first question visible
  and enabled.
- **Actual:** The development transform called `jsxDEV`, but the cached runtime exported it as
  undefined, producing `TypeError: _jsxDEV is not a function` and unmounting the island.
- **Evidence:** The served calculator imported `react_jsx-dev-runtime.js`, while the cached module
  resolved to `react-jsx-dev-runtime.production.js` with `exports.jsxDEV = void 0`.
- **Supported cause:** The long-running local server and cached optimizer state mixed a development
  component transform with React's production JSX runtime.
- **Correction:** Local and Playwright development startup now explicitly select development mode
  and force a clean optimization pass. The affected server was restarted with the corrected
  command.
- **Regression verification:** A browser test captures page errors, waits for hydration, advances
  two animation frames, and verifies that the first question remains visible. It passes in
  Chromium, Firefox, and WebKit.
- **Status:** Resolved.

### DEMO-01: P2, resolved

- **Affected surface:** Demo island initialization.
- **User impact:** Synchronous state changes inside the mount effect violated the enforced React
  lifecycle contract and blocked the repository lint gate.
- **Preconditions:** Load the demo route with or without stored assessment context.
- **Reproduction:** Run `pnpm lint` against the first implementation.
- **Expected:** Browser storage is read after hydration without a cascading synchronous render,
  and cleanup prevents post-unmount updates.
- **Actual:** Assessment and prefill state were assigned synchronously inside the effect body.
- **Supported cause:** Storage synchronization and component state initialization occurred in the
  same effect frame.
- **Correction:** Deferred the state synchronization to a microtask guarded by a cancellation flag,
  while retaining event timing and abort cleanup.
- **Regression verification:** ESLint passes. Assessment prefill passes in component tests and all
  three browser engines, with no personal data added to the URL.
- **Status:** Resolved.

### DEMO-02: P2, resolved

- **Affected surface:** Local preview demo submission.
- **User impact:** A local reviewer could complete the form but receive a generic failure instead
  of the synthetic preview confirmation.
- **Preconditions:** Run the ordinary development server without a configured lead gateway and
  submit the compact demo form.
- **Reproduction:** Complete the form against the default synthetic adapter before correction.
- **Expected:** Preview mode returns a local synthetic receipt without a network request.
- **Actual:** The browser UUID method could throw an illegal invocation error.
- **Supported cause:** `crypto.randomUUID` was extracted and invoked without its `Crypto` owner.
- **Correction:** Wrapped the UUID call so it executes through `crypto.randomUUID()` with its owner
  intact.
- **Regression verification:** The adapter unit test now enforces owner-bound UUID invocation, and
  a real local preview submission returns the synthetic confirmation.
- **Status:** Resolved.

## 6. Responsive and interaction review

- At 1280 by 720 and 1440 desktop widths, the pricing headline, CTA, first calculator question, and
  complete required demo form are in the first viewport.
- At 390 by 844 and 768 widths, the calculator and demo form begin in the first viewport and retain
  a logical single-column order.
- The three calculator steps retain values through Back navigation, move focus to the next heading,
  focus invalid fields, and announce completed results.
- Native details provide optional working-year, budget, and demo-planning disclosures. No motion is
  required to understand or complete either journey.
- Pricing and demo pages reflow without horizontal overflow at 200 percent text size in Chromium,
  Firefox, and WebKit.
- Desktop, tablet, mobile, completed-result, optional-ROI, navigation, and demo screenshots were
  inspected after update.

## 7. Verification evidence

- Formatting check, ESLint, Astro diagnostics, strict TypeScript, and `git diff --check`: passed.
- Unit and component coverage: 118 tests passed; 93.80 percent statements, 89.72 percent branches,
  93.05 percent functions, and 95.54 percent lines.
- Full Playwright suite: 169 tests passed across Chromium, Firefox, and WebKit, including the 200
  percent pricing and demo reflow checks and all updated visual baselines.
- Preview Astro build: 17 routes generated.
- Production-mode Astro build: 17 routes generated, including `/pricing`, `/demo`, and the sitemap.
- Client budgets: `/pricing` passed at 62.6 KB gzip against 150 KB and `/demo` passed at 61.7 KB
  gzip against 150 KB.
- Governance validation: 6 repository skills and all 14 governance unit tests passed.
- Automated WCAG A and AA scans report no violations on the pricing and demo routes.

## 8. Unverified release surfaces and risk

- No production deployment or release audit was requested or performed.
- No public or self-serve price, billing cadence, tax treatment, entitlement, or checkout is
  introduced.
- No physical assistive-technology session or production field-performance measurement was
  performed. Semantic controls, keyboard flows, automated accessibility, three browser engines,
  client budgets, no-JavaScript states, and responsive reflow were verified.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the ROI-led business-case and demo
revision.
