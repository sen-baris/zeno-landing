# ROI quick choices and navigation feature audit

## 1. Scope and acceptance criteria

- Audited the first business-case calculator question, its range and custom amount behavior, and
  the shared desktop and mobile header.
- Required seven native single-choice options in the approved order, no initial selection, exact
  visible midpoint disclosure for presets, explicit Continue behavior, and retained custom input.
- Required the selected representative value to continue through the unchanged framework-neutral
  business-case calculation.
- Required removal of Why Zeno from both header navigation modes while preserving the homepage
  wordmark, footer, Book a demo, and all Solutions disclosure behavior.
- Required Assess readiness inside the primary navigation with a restrained accent treatment and
  Sign in in the prior action position, linking to the approved TextCortex application URL in the
  current tab.
- Required disabled server-rendered choices, no-JavaScript fallback content, keyboard and pointer
  parity, responsive reflow, local-only calculator state, and no public em dash.

## 2. Files and boundaries reviewed

- `src/components/Header.astro`
- `src/components/islands/BusinessCaseCalculator.tsx`
- `src/lib/content/pricing.ts`
- `src/lib/claims/registry.ts`
- `src/styles/global.css`
- Calculator content, claim, component, navigation, funnel, responsive, accessibility, and visual
  tests

No external component, script, asset, or dependency was introduced.

## 3. Ownership, feedback, failure radius, and timing

- The ordered range records and representative people values live in typed pricing content.
- Preset selection writes the disclosed representative value into the existing `people` field, so
  calculation ownership and formulas remain unchanged.
- Custom input value is held separately inside the calculator instance, then restored when the
  visitor returns to Custom amount. No value reaches storage, analytics, the URL, or a request.
- Visitors receive native radio semantics, checked and focus states, the exact value used, inline
  validation, retained Back and Edit answers, and explicit Continue control.
- The approved application destination is resolved at the header boundary. Sign in has no target
  attribute, so it follows the requested current-tab behavior.
- Header changes affect every route. Breakpoint coverage, dropdown behavior, anchor behavior, and
  outbound-link policy were therefore included in the regression radius.

## 4. Claims and content review

- The calculator method claim states that each range uses its displayed rounded midpoint and that
  Custom amount accepts an exact value.
- The Sign in label and exact HTTPS application destination resolve from an approved navigation
  claim limited to `navigation.sign-in`.
- Calculator result formulas, currency formatting, disclaimer, local-data statement, and optional
  budget behavior remain unchanged.
- Footer navigation remains unchanged. Why Zeno is absent only from desktop and mobile headers.
- New public strings contain no em dash.

## 5. Findings

### NAVIGATION-01: P2, resolved

- **Affected surface:** Shared header from 821px through 1100px wide.
- **User impact:** Visitors in this range could lose both desktop and mobile navigation, including
  the route to the business case and readiness assessment.
- **Preconditions:** Use a viewport wider than 820px and no wider than 1100px.
- **Reproduction:** Inspect the header before correction at 900px or 1100px.
- **Expected:** One complete navigation mode is always available.
- **Actual:** Desktop navigation was hidden at 1100px while the mobile menu was not enabled until
  820px.
- **Supported cause:** The desktop and mobile visibility breakpoints did not meet at the same
  boundary.
- **Correction:** Enabled the mobile menu and its complete layout through 1100px while retaining
  compact desktop actions until the narrower mobile breakpoint.
- **Regression verification:** Browser checks assert mobile navigation at 900px and 1100px,
  desktop navigation at 1101px, and no horizontal overflow at each boundary.
- **Status:** Resolved.

### NAVIGATION-02: P3, resolved

- **Affected surface:** Cross-browser outbound-link regression test.
- **User impact:** The application correctly opened Sign in in the same tab, but the full suite
  rejected the approved behavior and could no longer distinguish an application destination from
  a supporting evidence link.
- **Preconditions:** Run the shared homepage link-contract test after adding Sign in.
- **Reproduction:** The previous contract required every external link to have `_blank` and
  `noopener`.
- **Expected:** The approved application login stays in the current tab. Supporting evidence links
  retain their separate-tab safety attributes.
- **Actual:** The implementation was correct, while the generic assertion failed.
- **Supported cause:** The test represented only the older evidence-link policy.
- **Correction:** Added one exact exception for the approved application login and retained the
  existing HTTPS, target, and relationship checks for every other external destination.
- **Regression verification:** The corrected navigation tests pass in Chromium, Firefox, and
  WebKit.
- **Status:** Resolved.

### VISUAL-01: P3, resolved

- **Affected surface:** Desktop and mobile header visual-regression captures.
- **User impact:** No production defect. The test runner could inject screenshot styling into
  disabled radio controls before React hydration and produce a hydration warning.
- **Preconditions:** Capture the pricing header immediately after route navigation.
- **Reproduction:** Run either focused header snapshot without waiting for the calculator's
  hydrated state.
- **Expected:** Visual evidence is captured only after the client-rendered tree matches the page.
- **Actual:** Screenshot preparation could race calculator hydration.
- **Supported cause:** The new visual test opened the menu and captured before the existing
  hydration marker was ready.
- **Correction:** Wait for `data-hydrated="true"` before focusing or opening and capturing either
  header mode.
- **Regression verification:** Both focused Chromium snapshots pass without the hydration warning.
- **Status:** Resolved.

## 6. Responsive, accessibility, and interaction review

- At 1101px and above, the primary navigation contains Product, Solutions, Business case, Trust,
  and Assess readiness in logical order. Sign in and Book a demo remain separate header actions.
- At 1100px and below, the mobile disclosure contains the same navigation and action order. Its
  native details behavior remains usable without JavaScript.
- Range choices use native radios with visible selected and keyboard-focus states. Selecting
  Custom amount focuses the exact input without a timer, and switching away and back retains it.
- Invalid continuation focuses the first range choice. Back and Edit answers preserve the selected
  option and disclosed people value.
- Updated first-step and desktop and mobile header screenshots were inspected at 390px, 768px, and
  1440px. Browser reflow checks also cover 900px, 1100px, 1101px, and 1280px.

## 7. Verification evidence

- Targeted unit and component tests: 12 passed.
- Targeted Chromium pricing behavior tests: 11 passed.
- Corrected shared navigation tests: 9 passed across Chromium, Firefox, and WebKit.
- Updated desktop and mobile header visual tests: passed in Chromium.
- Formatting, ESLint, Astro diagnostics, and strict TypeScript: passed.
- Unit and component coverage: 121 tests passed; 94.08 percent statements, 89.35 percent branches,
  93.33 percent functions, and 95.76 percent lines.
- Full Playwright suite: 176 tests passed across Chromium, Firefox, and WebKit.
- Preview and production Astro builds: 17 routes generated in each mode.
- Client budgets: `/pricing` passed at 63.2 KB gzip against 150 KB.
- Governance validation: 6 repository skills and all 14 governance tests passed.
- `git diff --check`: passed.

## 8. Unverified release surfaces and risk

- The external login was not opened during automated testing because it would leave the local site.
  The exact approved HTTPS destination and current-tab semantics are verified in the rendered DOM.
- No production deployment or release audit was requested or performed.
- No physical assistive-technology session or production field-performance measurement was
  performed. Native semantics, keyboard behavior, automated accessibility, responsive reflow,
  no-JavaScript content, and three browser engines provide proportionate feature evidence.

## 9. Final decision

**PASS.** No unresolved P0, P1, or P2 findings remain for the ROI quick choices and navigation
revision.
